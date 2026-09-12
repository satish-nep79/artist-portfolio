# Static Admin HTML → Server-Rendered Nunjucks Migration Guide

> **Purpose:** This is an educational, evidence-based migration guide for this repository as inspected on **2026-09-10**. It describes how to convert the Fastify server's existing static **admin** pages to server-rendered Nunjucks templates without unnecessarily changing authentication or browser-side behavior.
>
> **Important scope correction:** this repository does **not** contain a `public/html` directory. The static views referred to in the request are currently under [`apps/server/public/admin/pages/`](apps/server/public/admin/pages/), with static error pages in [`apps/server/public/error/`](apps/server/public/error/). This guide uses the paths that actually exist.
>
> **This document is a plan, not an implementation.** Code snippets are illustrative only. Do not copy them blindly without applying the relevant migration phase and testing it. The existing application has not been changed by this guide.

---

## Contents

1. [How to read this guide](#1-how-to-read-this-guide)
2. [Current architecture](#2-current-architecture)
3. [Current request-to-response flows](#3-current-request-to-response-flows)
4. [What currently exists—and what does not](#4-what-currently-existsand-what-does-not)
5. [Problems and limits observed in the current architecture](#5-problems-and-limits-observed-in-the-current-architecture)
6. [What Nunjucks changes](#6-what-nunjucks-changes)
7. [Nunjucks fundamentals](#7-nunjucks-fundamentals)
8. [Recommended target architecture](#8-recommended-target-architecture)
9. [Base layout design](#9-base-layout-design)
10. [Authentication layout and login page](#10-authentication-layout-and-login-page)
11. [Admin layout, navigation, and Web Components](#11-admin-layout-navigation-and-web-components)
12. [Reusable partials versus client-side components](#12-reusable-partials-versus-client-side-components)
13. [CSS architecture](#13-css-architecture)
14. [JavaScript architecture](#14-javascript-architecture)
15. [Login functionality: preserve the contract](#15-login-functionality-preserve-the-contract)
16. [Fastify → Nunjucks rendering](#16-fastify--nunjucks-rendering)
17. [Server-side template data](#17-server-side-template-data)
18. [Navigation state](#18-navigation-state)
19. [Static assets versus views](#19-static-assets-versus-views)
20. [Incremental migration strategy](#20-incremental-migration-strategy)
21. [Before/after structure and file mapping](#21-beforeafter-structure-and-file-mapping)
22. [Focused documentation examples](#22-focused-documentation-examples)
23. [Common mistakes and project-specific risks](#23-common-mistakes-and-project-specific-risks)
24. [Testing strategy and stage gates](#24-testing-strategy-and-stage-gates)
25. [Final reference architecture](#25-final-reference-architecture)

---

## 1. How to read this guide

This guide deliberately distinguishes four kinds of statements:

| Label | Meaning |
| --- | --- |
| **Current implementation** | Verified from a file that exists in this repository. |
| **Recommendation** | A proposed target for the migration. It is not present yet. |
| **Documentation example** | Small illustrative code; it is not a patch and may omit unrelated production concerns. |
| **Not currently determinable / not implemented** | The source does not establish the behavior, or the feature does not yet exist. |

That distinction matters here because the server is already in an **incomplete hybrid state**: Nunjucks is registered, but almost all meaningful admin UI is still raw static HTML.

### The two frontend systems in this repository

There are two separate applications with different rendering models:

1. **`apps/server`** — Fastify 5 application. It owns the static admin pages discussed in this guide, Fastify routes, Prisma, JWT authentication, Tabler assets, and the existing Nunjucks configuration.
2. **`apps/web`** — separate React 19 + Vite + Tailwind portfolio site. Its layout is [`apps/web/src/core/layouts/AppLayout.tsx`](apps/web/src/core/layouts/AppLayout.tsx), and its routes are in [`apps/web/src/core/router/routes.ts`](apps/web/src/core/router/routes.ts). It is not currently served by the Fastify routes examined below.

This guide addresses migration of `apps/server/public/admin/pages` into `apps/server/views`. It does **not** propose converting the separate React/Vite site to Nunjucks. Combining those is a separate product and deployment decision.

---

## 2. Current architecture

### 2.1 Repository and server structure

The repository is a pnpm workspace:

```text
artist-portfolio/
├── apps/
│   ├── server/                 # Fastify + Prisma + static admin + Nunjucks
│   └── web/                    # separate React/Vite public portfolio app
├── package.json                # package-manager declaration only
└── pnpm-workspace.yaml
```

The relevant Fastify server structure currently is:

```text
apps/server/
├── src/
│   ├── app.ts
│   ├── plugins/
│   │   ├── cookie.ts
│   │   ├── error-handler.ts
│   │   ├── jwt.ts
│   │   ├── prisma.ts
│   │   ├── sensible.ts
│   │   ├── tabler.ts
│   │   └── views.ts
│   ├── routes/
│   │   ├── root.ts
│   │   ├── admin/
│   │   │   ├── index.ts
│   │   │   ├── dashboard/index.ts
│   │   │   └── content/index.ts
│   │   └── api/v1/auth.ts
│   ├── constants/
│   │   ├── public-routes.ts
│   │   └── error_page.ts
│   ├── services/auth.service.ts
│   └── util/password.util.ts
├── public/
│   ├── admin/
│   │   ├── assets/
│   │   ├── pages/
│   │   └── shared/
│   └── error/
├── views/
│   ├── auth/login.njk
│   └── layouts/base.njk
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

### 2.2 Fastify bootstrapping and plugins

[`apps/server/src/app.ts`](apps/server/src/app.ts) is the application entry plugin. It uses `@fastify/autoload` twice:

```text
Fastify application
  ├── autoload src/plugins/
  └── autoload src/routes/
```

That means plugins are the shared server capabilities, while the route directory determines request endpoints.

Relevant plugins are:

| File | Current responsibility |
| --- | --- |
| [`plugins/tabler.ts`](apps/server/src/plugins/tabler.ts) | Registers two static roots: Tabler distribution at `/assets/tabler/`, and `public/` at `/`. |
| [`plugins/views.ts`](apps/server/src/plugins/views.ts) | Registers `@fastify/view` using the Nunjucks engine and a views root at `apps/server/views` when compiled. |
| [`plugins/cookie.ts`](apps/server/src/plugins/cookie.ts) | Parses cookies on `onRequest`. |
| [`plugins/jwt.ts`](apps/server/src/plugins/jwt.ts) | Registers JWT and decorates Fastify with `fastify.authenticate`. |
| [`plugins/prisma.ts`](apps/server/src/plugins/prisma.ts) | Decorates Fastify with a connected Prisma client and disconnects on close. |
| [`plugins/error-handler.ts`](apps/server/src/plugins/error-handler.ts) | Serializes unhandled Fastify errors as the project’s JSON response shape. |
| [`plugins/sensible.ts`](apps/server/src/plugins/sensible.ts) | Registers `@fastify/sensible`. |

### 2.3 Existing static asset configuration

[`plugins/tabler.ts`](apps/server/src/plugins/tabler.ts) has two distinct mappings:

```text
Filesystem source                                      Public URL prefix
─────────────────────────────────────────────────────  ───────────────────────
node_modules/@tabler/core/dist                         /assets/tabler/
apps/server/public                                     /
```

So, for example:

- `node_modules/@tabler/core/dist/css/tabler.min.css` is loaded as `/assets/tabler/css/tabler.min.css`.
- `apps/server/public/admin/shared/css/admin.css` is loaded as `/admin/shared/css/admin.css`.
- `apps/server/public/admin/assets/logo_normal.png` is loaded as `/admin/assets/logo_normal.png`.

This is important: **Nunjucks files should not be placed below `public/`**. The public directory is browser-accessible; views are server-only source files.

### 2.4 Existing view-engine configuration

Nunjucks is already installed and registered in [`plugins/views.ts`](apps/server/src/plugins/views.ts):

```ts
await fastify.register(fastifyView, {
  engine: { nunjucks },
  root: path.join(__dirname, '../../views'),
})
```

At runtime after TypeScript compilation, `__dirname` is inside `dist/plugins`; `../../views` resolves to the compiled server’s `views` directory. The existing TypeScript configuration in [`apps/server/tsconfig.json`](apps/server/tsconfig.json) has `rootDir: "./src"` and includes only `src/**/*.ts`. Consequently, the migration should explicitly verify how non-TypeScript `views/**/*.njk` files are made available next to `dist` in development and production. The present source configuration does **not** itself document a template-copy step.

Two Nunjucks files already exist:

- [`views/layouts/base.njk`](apps/server/views/layouts/base.njk): a partial base layout with title/meta/style/head/body/script blocks, but it includes **admin-specific** assets.
- [`views/auth/login.njk`](apps/server/views/auth/login.njk): a minimal placeholder document that does not extend `base.njk` and does not reproduce the working static login UI.

The only route already using Nunjucks is `/admin/login`, which calls:

```ts
return reply.view('auth/login.njk')
```

in [`routes/admin/index.ts`](apps/server/src/routes/admin/index.ts).

### 2.5 Existing static HTML pages

The existing server-side admin pages are:

| Page | File | Current render mechanism |
| --- | --- | --- |
| Login | [`public/admin/pages/login/login.html`](apps/server/public/admin/pages/login/login.html) | No current route uses this file; the visible `/admin/login` route currently renders the placeholder `auth/login.njk` instead. |
| Dashboard | [`public/admin/pages/dashboard/index.html`](apps/server/public/admin/pages/dashboard/index.html) | Raw HTML read from disk and sent by both `/admin` and `/admin/dashboard`. |
| Site content | [`public/admin/pages/site_content/index.html`](apps/server/public/admin/pages/site_content/index.html) | Raw HTML read from disk and sent by `/admin/content`. It is an incomplete skeleton. |
| 404 | [`public/error/no_page_found.html`](apps/server/public/error/no_page_found.html) | Raw HTML read and sent by the root not-found handler. |
| Unavailable fallback | [`public/error/unavailable_page.html`](apps/server/public/error/unavailable_page.html) | Returned by the static HTML reader when a requested file cannot be read. |

Raw file delivery is centralized in [`src/constants/public-routes.ts`](apps/server/src/constants/public-routes.ts). `PublicHtmlFiles.getHtml()` uses `readFile()` and an in-memory cache, falling back to the unavailable page or an inline `errorHtml` string from [`constants/error_page.ts`](apps/server/src/constants/error_page.ts).

### 2.6 Existing route surface

The routes relevant to this migration are:

| Request | Current route behavior | Auth |
| --- | --- | --- |
| `GET /` | Redirects to `/admin`. | Public |
| `GET /admin` | Reads and sends dashboard HTML. | `fastify.authenticate` |
| `GET /admin/login` | Calls `reply.view('auth/login.njk')`. | Public |
| `GET /admin/dashboard` | Reads and sends dashboard HTML. | `fastify.authenticate` |
| `GET /admin/content` | Reads and sends static site-content HTML. | `fastify.authenticate` |
| `POST /api/v1/login` | Validates credentials, sets JWT cookie, returns JSON. | Public |
| unmatched route | Reads and sends static 404 HTML with status 404. | N/A |

A useful migration observation: the header/sidebar link to a number of routes such as `/admin/users`, `/admin/artworks`, `/admin/orders`, `/admin/analytics`, and `/admin/settings`; the dashboard also links to inquiries and programs. Those routes and corresponding Fastify handlers do **not** currently exist in `apps/server/src/routes`. They are visual placeholders, not pages to migrate yet.

---

## 3. Current request-to-response flows

### 3.1 Protected dashboard: current raw-HTML path

The dashboard has two protected entry points, `/admin` and `/admin/dashboard`, handled by [`routes/admin/index.ts`](apps/server/src/routes/admin/index.ts) and [`routes/admin/dashboard/index.ts`](apps/server/src/routes/admin/dashboard/index.ts).

```text
Browser requests GET /admin (or /admin/dashboard)
        ↓
Fastify route’s onRequest hook calls fastify.authenticate
        ↓
JWT plugin verifies bearer token or auth_token cookie
        ↓
JWT plugin checks User.tokenId in Prisma
        ↓
If unauthenticated: redirect to /admin/login
If authenticated: route calls PublicHtmlFiles.getHtml(...)
        ↓
Node reads public/admin/pages/dashboard/index.html
        ↓
Fastify sends text/html
        ↓
Browser parses dashboard HTML
        ↓
Browser fetches Tabler CSS/JS, admin.css, header/sidebar Web Component scripts
        ↓
Custom elements render header/sidebar; inline dashboard filter script binds clicks
```

Why it works: the HTML already contains a complete document, direct CSS/script URLs, and custom-element tags. The browser independently loads the public assets after Fastify sends the file contents.

Its limitation is that Fastify has no structured opportunity to supply page data, share outer markup through templates, or distinguish static shell from changing data. It only reads a string.

### 3.2 Login: current hybrid path

There is an intentional but incomplete transition at login:

```text
Browser requests GET /admin/login
        ↓
Fastify route calls reply.view('auth/login.njk')
        ↓
@fastify/view asks Nunjucks to render apps/server/views/auth/login.njk
        ↓
Browser currently receives placeholder “Hello from Nunjucks!” HTML
```

The working static login design and behavior still live separately at:

- markup: [`public/admin/pages/login/login.html`](apps/server/public/admin/pages/login/login.html)
- page module: [`public/admin/pages/login/auth.js`](apps/server/public/admin/pages/login/auth.js)

The route no longer reads `login.html`, so this route demonstrates the core migration issue: merely registering Nunjucks changes **how the browser document is sourced**; it does not automatically transfer the old HTML, CSS, scripts, or IDs into the new template.

### 3.3 Login form/API/authentication flow

The intended UI behavior in the existing static login assets is:

```text
GET /admin/login
        ↓
Rendered login form with #loginForm, #email, #password and #togglePassword
        ↓
User toggles password visibility
        ↓
auth.js changes input type, icon classes, title, and aria-label
        ↓
User submits #loginForm
        ↓
auth.js prevents ordinary form submission
        ↓
setButtonLoading(button, true, 'Signing in...')
        ↓
apiRequest POSTs JSON to /api/v1/login with same-origin credentials
        ↓
Fastify finds User by email, verifies Argon2 password
        ↓
Fastify rotates tokenId, signs one-hour JWT, sets HttpOnly auth_token cookie
        ↓
JSON { success, status, message, data } response
        ↓
Client restores button, shows toast
        ↓
Success: window.location.href = '/admin'
Failure: shows error toast
```

The primary files are:

| Concern | Current file |
| --- | --- |
| Page-side submit/toggle/redirect | [`public/admin/pages/login/auth.js`](apps/server/public/admin/pages/login/auth.js) |
| Generic HTTP helper | [`public/admin/shared/js/api_request.js`](apps/server/public/admin/shared/js/api_request.js) |
| Button loading state | [`public/admin/shared/js/loading-indicator.js`](apps/server/public/admin/shared/js/loading-indicator.js) |
| Toast rendering | [`public/admin/shared/js/toast.js`](apps/server/public/admin/shared/js/toast.js) |
| API login endpoint | [`src/routes/api/v1/auth.ts`](apps/server/src/routes/api/v1/auth.ts) |
| JWT creation | [`src/services/auth.service.ts`](apps/server/src/services/auth.service.ts) |
| Password verification | [`src/util/password.util.ts`](apps/server/src/util/password.util.ts) |
| Route protection | [`src/plugins/jwt.ts`](apps/server/src/plugins/jwt.ts) |

The cookie is `httpOnly`, `sameSite: 'strict'`, path `/`, and `secure` in production. Because it is HttpOnly, client-side JavaScript should not expect to read it. `api_request.js` tries to add a bearer token from `document.cookie`, but for this particular cookie that value should not be readable; the request still succeeds because `credentials: 'same-origin'` sends the cookie and `fastify.authenticate` falls back to it.

### 3.4 Static assets and browser initialization

The static login and dashboard pages load assets differently:

| Resource | Login HTML | Dashboard HTML |
| --- | --- | --- |
| Tabler CSS/JS | `tabler-config.js` dynamically injects both | direct `<link>` in head and script near end of body |
| `admin.css` | direct stylesheet, version `?v=20260906-5` | direct stylesheet, version `?v=20260906-11` |
| Header component | deferred script | deferred script |
| Sidebar component | not loaded | deferred script |
| Login page JS | module `auth.js` | not applicable |
| Dashboard behavior | not applicable | inline click handlers for `.inquiry-filters button` |

The page is therefore not “static” in the sense of being inert. It contains client-side modules and Web Components that must continue receiving the HTML structure and scripts they expect.

---

## 4. What currently exists—and what does not

### 4.1 Existing client-side reusable components

Two reusable browser components already exist:

- [`public/admin/shared/components/admin-header.js`](apps/server/public/admin/shared/components/admin-header.js) registers `<admin-header>`.
  - `type="simple"` renders a login-oriented header with logo and theme toggle.
  - Default mode renders theme controls, notification dropdown markup, a profile dropdown, and a user label from `user-name` (default `John Doe`).
  - It stores theme preference in `localStorage`, changes `data-bs-theme`, changes the logo, and manages dropdown keyboard/outside-click behavior.
- [`public/admin/shared/components/admin-sidebar.js`](apps/server/public/admin/shared/components/admin-sidebar.js) registers `<admin-sidebar>`.
  - Its `active` attribute chooses the highlighted sidebar item.
  - It contains the navigation link structure and sidebar collapse behavior.

These are **Web Components**, not Nunjucks partials. They run only after HTML reaches the browser. That distinction drives the recommended staged approach later in this guide.

### 4.2 Existing data model and services

[`apps/server/prisma/schema.prisma`](apps/server/prisma/schema.prisma) currently defines only:

- `User`: email, password hash, two-factor fields, token ID, and timestamps.
- `SiteConfigs`: artist profile/contact/social content seeded from [`prisma/data/profile-seed.json`](apps/server/prisma/data/profile-seed.json).

There are no Prisma models, services, or API routes currently present for artworks, categories, inquiries, programs, dashboard statistics, orders, or analytics.

The standalone React app has dummy in-memory artwork/category APIs in [`apps/web/src/core/data/artwork_api.ts`](apps/web/src/core/data/artwork_api.ts) and [`apps/web/src/core/data/categories_api.ts`](apps/web/src/core/data/categories_api.ts). They are not server-side services and should not be represented as existing Fastify dashboard data.

### 4.3 Current gaps and inconsistencies to document, not silently “fix”

These facts affect migration sequencing:

1. **The login route and static login page are disconnected.** `/admin/login` renders a placeholder `.njk` page; the designed HTML is still in `public/`.
2. **`base.njk` is not yet a true base layout.** It puts the admin-only Tabler configuration and `admin.css` in a layout that its name suggests should apply to all views.
3. **`login.njk` does not extend the base.** It repeats a full document and has no current login UI.
4. **The dashboard is duplicated at `/admin` and `/admin/dashboard`.** Both serve the same source. The sidebar’s Dashboard link targets `/admin/dashboard`, while the login success redirect targets `/admin`.
5. **The site-content page is only a skeleton.** It has no real content area and has a `dashboadr-layout` spelling that does not match the CSS selector `.dashboard-layout`.
6. **`admin.css` imports Tabler Icons twice** from two URLs. Do not assume both imports are necessary; audit before removing one in a future CSS task.
7. **`headers.css` exists but no current static HTML page references it.** Whether it is dead, intended for a future page, or loaded elsewhere cannot be determined from the inspected server paths.
8. **Server tests are stale/scaffolded.** For example, [`test/routes/root.test.ts`](apps/server/test/routes/root.test.ts) expects a JSON `{ root: true }` payload although the current root route redirects. [`test/routes/example.test.ts`](apps/server/test/routes/example.test.ts) and the support test reference absent example/support paths. Do not treat the current test suite as an accurate rendering safety net until it is updated in a separately scoped test task.

---

## 5. Problems and limits observed in the current architecture

Nunjucks is not automatically “better”; it solves specific problems when applied to the actual markup and routes. The following are observable now.

### 5.1 Duplicated document shell and resource declarations

```text
Current approach
  Static login, dashboard, and content HTML each declare <!DOCTYPE>, <html>, <head>,
  viewport/title, styles, and scripts.
        ↓
Problem
  Resource changes, metadata fixes, or common attributes must be repeated. The login
  and dashboard already use divergent Tabler-loading approaches and admin.css versions.
        ↓
Nunjucks response
  A minimal base layout owns the universal document shell. Auth/admin layouts own the
  resources appropriate to those classes of pages; page templates contribute only what
  is unique through blocks.
```

The relevant duplicate page files are:

- [`login/login.html`](apps/server/public/admin/pages/login/login.html)
- [`dashboard/index.html`](apps/server/public/admin/pages/dashboard/index.html)
- [`site_content/index.html`](apps/server/public/admin/pages/site_content/index.html)

### 5.2 Repeated admin page shell

Dashboard and the site-content skeleton both contain an admin shell concept: body classes, a layout wrapper, a sidebar, a page wrapper, header, and Tabler/admin resources.

```text
Current approach
  Each page must remember the exact layout nesting and assets.
        ↓
Problem
  A new protected admin page can easily omit an element, use inconsistent classes, or
  duplicate the shell differently. The site-content skeleton already differs from the
  dashboard’s class name and lacks the page body/header/footer structure.
        ↓
Nunjucks response
  An admin layout owns the outer shell once; each page supplies its main content and
  small page-specific blocks.
```

### 5.3 Reusability exists in JavaScript, not server templates

The header and sidebar are reused as browser Web Components. This prevents static HTML duplication in an important sense, but the page still must include the tags and component scripts, and the navigation markup remains hidden inside JavaScript strings.

```text
Current approach
  <admin-header> and <admin-sidebar> are browser-rendered custom elements.
        ↓
Problem
  Fastify/Nunjucks cannot render a complete shared navigation shell without running
  browser JavaScript. Server-side page data such as authenticated-user context or
  active navigation has to be pushed through attributes, and navigation content is not
  naturally visible to server templates.
        ↓
Nunjucks response
  Initially, retain custom tags for behavior preservation. Later, turn stable semantic
  markup into Nunjucks partials only after deciding where their interaction code lives.
  Never render both a Nunjucks sidebar and the current <admin-sidebar> on one page.
```

### 5.4 Static hard-coded UI values cannot become real server data incrementally

The dashboard’s statistics, rows, notifications, username (`Sarah Johnson`), artwork, programs, and activity values are hard-coded in static HTML or the header component. There is no matching server model for most of them.

```text
Current approach
  Values live directly in static HTML/JS strings.
        ↓
Problem
  Changing values means editing markup; it cannot reflect database values without
  client-side replacement or wholesale page rewrites.
        ↓
Nunjucks response
  Route handlers can later pass simple data objects to templates. Loops and conditions
  render those objects into HTML. Business logic stays in routes/services—not templates.
```

Do **not** make the dashboard dynamic during the layout migration unless the required models/services are created and tested. The first migration should preserve static values while only changing their source from `.html` to `.njk`.

### 5.5 Raw HTML reader adds a separate rendering path

[`PublicHtmlFiles`](apps/server/src/constants/public-routes.ts) implements path constants, I/O, caching, and an error fallback just to return static page strings.

```text
Current approach
  Route → file path constant → readFile/cache → reply.send(html)
        ↓
Problem
  Page rendering is separate from the registered view engine. HTML source is exposed
  through the static public root and cannot use template inheritance or route data.
        ↓
Nunjucks response
  Page route → reply.view(template, data) → Nunjucks → complete HTML response.
```

Do not remove the reader until every route that needs it has been migrated and tested. It still has a role for existing error files during the transition.

---

## 6. What Nunjucks changes

Nunjucks is a server-side template language. A browser never interprets `{% ... %}` or `{{ ... }}` directly.

```text
.njk template source
        ↓  (Fastify route calls reply.view)
Nunjucks runs on the server
        ↓
ordinary HTML response
        ↓
Browser parses HTML, CSS, and JavaScript as usual
```

A Nunjucks migration changes **page assembly**. It does not require replacing:

- Fastify route protection,
- the JWT cookie/API contract,
- the login form’s DOM IDs,
- public CSS/JS URLs,
- Tabler itself,
- `fetch`-based browser interactions, or
- the existing Web Components in the initial migration.

A useful division of responsibilities is:

| Layer | Should own |
| --- | --- |
| Fastify route | HTTP route, protection hook, response status/redirects, choosing view, collecting view data. |
| Service/data access | Prisma queries, authorization-related database checks, data shaping. |
| Nunjucks layout/page/partial | Semantic HTML structure, display of already-prepared values, simple conditionals/loops. |
| CSS | Presentation and responsive/theme styling. |
| Client JavaScript | Immediate interaction, fetch/API calls, loading indicators, client-only widgets, Web Components. |

---

## 7. Nunjucks fundamentals

The snippets in this section are **documentation examples only**.

### 7.1 Variables

```njk
<h1>{{ pageTitle }}</h1>
<p>Signed in as {{ currentUser.email }}</p>
```

**What:** `{{ expression }}` writes a value into the rendered HTML.

**Why here:** a dashboard title, authenticated user email, active navigation key, form value, or flash message should be supplied by a Fastify route rather than hard-coded into every page.

**How:** the route gives `reply.view()` an object such as `{ pageTitle: 'Dashboard', currentUser }`.

Avoid using `| safe` for values that can originate from users or external data. Treat template data as untrusted unless it was intentionally created as trusted HTML.

### 7.2 Conditional rendering

```njk
{% if errorMessage %}
  <div class="alert alert-danger" role="alert">{{ errorMessage }}</div>
{% endif %}
```

**What:** `{% if %}` includes markup only when a condition is truthy.

**Why here:** it is appropriate for an optional server-rendered form message, an optional subtitle, a permission-dependent button, or a conditional empty state.

**How:** keep the condition simple. Have a service/route decide permissions and pass a boolean rather than creating authorization policy inside Nunjucks.

### 7.3 Loops

```njk
<ul>
  {% for item in navigationItems %}
    <li><a href="{{ item.href }}">{{ item.label }}</a></li>
  {% endfor %}
</ul>
```

**What:** `{% for %}` repeats markup for an array.

**Why here:** it becomes valuable only when the server genuinely has a list: future artwork records, site-config paragraphs, navigation definitions, or dashboard rows.

**How:** make route/service code provide a display-ready list. In the present project, do not claim that artworks/inquiries/programs already exist in Prisma—they do not.

### 7.4 Template inheritance

```njk
{% extends "layouts/admin.njk" %}
```

**What:** a page inherits a parent template instead of duplicating the parent’s complete document and shell.

**Why here:** dashboard and content pages should have the same protected admin outer layout without copying it.

**How:** the child template fills named blocks defined by its parent.

### 7.5 Blocks

Parent layout:

```njk
<title>{% block title %}Artist Portfolio Admin{% endblock %}</title>
<main>{% block content %}{% endblock %}</main>
```

Child page:

```njk
{% block title %}Dashboard | Artist Portfolio Admin{% endblock %}
{% block content %}
  <h1>Dashboard</h1>
{% endblock %}
```

**What:** a block is a named replacement area.

**Why here:** use blocks for title, page body, optional styles, and optional scripts—not as an excuse to put each page’s entire document into one mega-layout.

### 7.6 Includes

```njk
{% include "partials/messages.njk" %}
```

**What:** an include inserts another template’s markup at that point.

**Why here:** it suits stable fragments used in multiple server-rendered templates, such as a flash-message region or future Nunjucks navbar/sidebar.

**How:** use includes for a meaningful shared boundary. Do not create a partial for every `<div>`.

### 7.7 Parent blocks with `super()`

A layout can set default assets:

```njk
{% block styles %}
  <link rel="stylesheet" href="/admin/shared/css/admin.css">
{% endblock %}
```

A dashboard page can retain them while adding its own stylesheet:

```njk
{% block styles %}
  {{ super() }}
  <link rel="stylesheet" href="/admin/pages/dashboard/dashboard.css">
{% endblock %}
```

**What:** `{{ super() }}` renders the parent block’s content.

**Why here:** without it, overriding `styles` or `scripts` replaces—not appends to—the parent contents. That can silently remove `admin.css` or a required component script.

**How:** use it only when the child truly extends an asset block. A page without extra assets should leave the block alone.

---

## 8. Recommended target architecture

### 8.1 Design principles for this project

The target must be shaped by the actual current server, not a generic tutorial:

1. Keep templates **outside** `public/` so static middleware cannot serve them.
2. Make `base.njk` genuinely minimal and shared across server-rendered documents.
3. Put admin-specific assets and shell markup in an admin layout, not in base.
4. Put login-specific shell and resources in an auth layout, not in admin.
5. Retain current public CSS, client modules, and custom elements during the first migration to preserve behavior.
6. Migrate only the pages/routes that actually exist: login, dashboard, and the content skeleton. Do not create templates for visual links that have no backend route.
7. Let Fastify routes supply simple display data; keep database/auth policy logic in TypeScript.

### 8.2 Recommended view tree

This is a proposed future structure under the existing Nunjucks root, not the current structure:

```text
apps/server/views/
├── layouts/
│   ├── base.njk                 # universal HTML document and neutral blocks
│   ├── auth.njk                 # login-family shell and auth-level assets
│   └── admin.njk                # protected admin shell and admin-level assets
├── partials/
│   ├── document-meta.njk         # optional: only if metadata becomes truly shared
│   ├── flash-messages.njk        # server-rendered messages, if introduced
│   ├── admin-footer.njk          # footer reused by multiple admin pages
│   └── admin/                    # later; only after deciding to replace Web Components
│       ├── header.njk
│       └── sidebar.njk
├── auth/
│   └── login.njk                 # form markup and login page-only module block
├── admin/
│   ├── dashboard.njk             # dashboard body/content only
│   └── content.njk               # current content skeleton/body only
└── errors/                       # optional later decision; see Phase 7
    ├── not-found.njk
    └── unavailable.njk
```

Why each directory exists:

| Directory | Purpose |
| --- | --- |
| `layouts/` | Parent templates that define document/shell composition. |
| `partials/` | Small server-rendered fragments reused by multiple templates. Keep only genuine shared markup here. |
| `auth/` | Authentication-facing pages with an auth layout. Currently only login exists. |
| `admin/` | Authenticated admin page content. Its pages inherit `layouts/admin.njk`. |
| `errors/` | Optional future server-rendered error documents. Keep them separate because not-found/error behavior has a different rendering/status contract. |

### 8.3 Recommended hierarchy

```text
layouts/base.njk
  ├── layouts/auth.njk
  │     └── auth/login.njk
  │
  └── layouts/admin.njk
        ├── admin/dashboard.njk
        └── admin/content.njk
```

In the **initial** version of `admin.njk`, retain:

```html
<admin-sidebar active="…"></admin-sidebar>
<admin-header user-name="…"></admin-header>
```

and load their existing public scripts. This preserves browser behavior. Do not add Nunjucks `partials/admin/header.njk` and `partials/admin/sidebar.njk` until a later decision replaces those tags.

---

## 9. Base layout design

### 9.1 What belongs in `base.njk`

A base layout should contain only material that truly applies to every server-rendered document using it:

- `<!DOCTYPE html>`
- `<html lang="…">`
- `<head>`
- charset and viewport tags
- a title block
- optional neutral metadata block
- a styles block
- `<body>` with a body-class block or attribute
- a body/content block
- a scripts block

Documentation example:

```njk
{# views/layouts/base.njk — documentation example #}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}Artist Portfolio{% endblock %}</title>
    {% block meta %}{% endblock %}
    {% block styles %}{% endblock %}
    {% block head %}{% endblock %}
  </head>
  <body class="{% block bodyClass %}{% endblock %}">
    {% block body %}{% endblock %}
    {% block scripts %}{% endblock %}
  </body>
</html>
```

### 9.2 What should not automatically belong in `base.njk`

Do **not** put the following into base simply because they are used today:

| Resource/markup | Better owner | Why |
| --- | --- | --- |
| Tabler CSS/JS | `auth.njk` and/or `admin.njk` | It is an admin UI dependency, not a proven dependency of every future server-rendered page. |
| `/admin/shared/css/admin.css` | `auth.njk` and `admin.njk` | Its selectors are explicitly admin-oriented. |
| `<admin-header>` | auth/admin layouts | Login uses simple header; dashboard uses full header. |
| `<admin-sidebar>` | `admin.njk` only | Login should not get a sidebar. |
| Dashboard filter script | `dashboard.njk` | It only targets dashboard controls. |
| Login `auth.js` | `auth/login.njk` | It requires login-specific elements. |

The existing [`views/layouts/base.njk`](apps/server/views/layouts/base.njk) currently violates this separation by including `tabler-config.js` and `admin.css`. During migration, move those responsibilities into the appropriate derived layouts rather than turning base into a universal admin bundle.

### 9.3 Resource loading order

For each layout, CSS should be available before its visual markup paints, and component scripts can be `defer`red:

```text
<head>
  Tabler CSS
  admin CSS
  page-specific CSS, if any
  deferred Web Component definitions
</head>
<body>
  rendered markup
  Tabler JS, if required
  shared/layout JS
  page module JS
</body>
```

The current `tabler-config.js` dynamically injects CSS and JS. A migration is a good opportunity to make the asset declarations explicit in the layouts—as dashboard already does—rather than retaining two loading mechanisms. Do that deliberately and test theme/component behavior; do not accidentally load Tabler twice.

---

## 10. Authentication layout and login page

### 10.1 Recommended hierarchy

```text
base.njk
   ↓ extends
layouts/auth.njk
   ↓ extends
pages/auth/login.njk
```

### 10.2 What `auth.njk` should own

The auth layout should own the elements shared by future authentication pages (login, password reset, two-factor challenge if such routes are later added):

- admin/auth CSS dependencies (Tabler and `admin.css`)
- optional simple header component script
- a simple `<admin-header type="simple">` if that remains the chosen UI
- a centered/body shell appropriate to authentication pages
- shared auth-level message region, only if server-rendered messages are introduced
- an inner content block

It should **not** own:

- login form IDs or submit button text,
- password-specific controls,
- `auth.js`,
- a dashboard sidebar,
- full-profile/notification header behavior.

### 10.3 What `login.njk` should own

The page should contain:

- heading and form markup,
- the exact currently required form IDs/names/classes,
- page-specific title,
- optional server-provided initial field/error values if later needed,
- the `auth.js` module in a page script block.

The following must initially stay identical in the output because `auth.js` selects them directly:

```text
#loginForm
#email and name="email"
#password and name="password"
#togglePassword
#togglePasswordIcon
button[type="submit"] inside #loginForm
```

### 10.4 Documentation example

```njk
{# views/layouts/auth.njk — documentation example #}
{% extends "layouts/base.njk" %}

{% block styles %}
  <link rel="stylesheet" href="/assets/tabler/css/tabler.min.css">
  <link rel="stylesheet" href="/admin/shared/css/admin.css?v={{ assetVersion }}">
{% endblock %}

{% block head %}
  <script src="/admin/shared/components/admin-header.js" defer></script>
{% endblock %}

{% block bodyClass %}admin-shell login-shell d-flex flex-column{% endblock %}

{% block body %}
  <admin-header type="simple"></admin-header>
  <div class="page page-center">
    <div class="container container-tight py-4">
      {% block authContent %}{% endblock %}
    </div>
  </div>
{% endblock %}

{% block scripts %}
  <script src="/assets/tabler/js/tabler.min.js"></script>
{% endblock %}
```

```njk
{# views/auth/login.njk — documentation example #}
{% extends "layouts/auth.njk" %}

{% block title %}Admin Login | Artist Portfolio{% endblock %}

{% block authContent %}
  <div class="card card-md">
    <div class="card-body">
      <h1 class="h2 text-center mb-4">Login to Admin Panel</h1>
      <form id="loginForm" autocomplete="off">
        <div class="mb-3">
          <label class="form-label" for="email">Email address</label>
          <input id="email" name="email" type="email" class="form-control"
                 placeholder="admin@example.com" required>
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <div class="input-group input-group-flat">
            <input id="password" name="password" type="password" class="form-control"
                   placeholder="Your password" required>
            <span class="input-group-text">
              <button id="togglePassword" type="button"
                      class="link-secondary border-0 bg-transparent p-0"
                      title="Show password" aria-label="Show password">
                <i id="togglePasswordIcon" class="ti ti-eye-off fs-2 stroke-1.5 icon-muted"></i>
              </button>
            </span>
          </div>
        </div>
        <div class="form-footer">
          <button type="submit" class="btn btn-primary w-100">Sign in</button>
        </div>
      </form>
    </div>
  </div>
{% endblock %}

{% block scripts %}
  {{ super() }}
  <script type="module" src="/admin/pages/login/auth.js"></script>
{% endblock %}
```

The example intentionally does not reproduce the current `value="admin@example.com"` and `value="adminpass"` defaults. Whether development credentials should be prefilled is a product/security decision—not a templating requirement. Preserve them only if required for current local development and remove them deliberately under a separately agreed security change.

---

## 11. Admin layout, navigation, and Web Components

### 11.1 What `admin.njk` should own

The protected admin layout should own everything structurally shared by current and future authenticated admin pages:

- Tabler/admin CSS resources;
- definitions for the current header/sidebar custom elements;
- the `dashboard-layout` wrapper that sidebar collapse code searches for;
- sidebar location;
- page wrapper, full header location, main page body/container boundary;
- shared footer;
- a content block;
- admin-wide scripts, if any;
- Tabler JS.

It should not own dashboard cards/tables/filters, page headings unique to individual pages, or page-only client scripts.

### 11.2 Initial migration choice: retain custom elements

**Recommended first choice:** use the existing elements inside `admin.njk`.

```njk
<admin-sidebar active="{{ activePage }}"></admin-sidebar>
<admin-header user-name="{{ currentUser.email }}"></admin-header>
```

Why this is appropriate initially:

- It preserves the current theme, dropdown, sidebar-collapse, and active-state behavior.
- It preserves `admin.css` selectors such as `.dashboard-layout > admin-sidebar`.
- It prevents an unnecessary rewrite of 390 lines of header JavaScript and 122 lines of sidebar JavaScript while moving markup source to Nunjucks.
- It makes the migration focused: first move **page composition** server-side; later decide whether navigation markup should become server-rendered.

`User` currently has no display-name field. The only reliable authenticated identity data from `request.user` is `id`, `email`, and `tokenId`. Use an explicit presentational value such as `currentUser.email` or a future `currentUserLabel`; do not keep claiming `Sarah Johnson` is real user data.

### 11.3 Later option: convert stable Web Component markup to partials

When and only when the team chooses to render header/sidebar markup on the server, create:

```text
views/partials/admin/sidebar.njk
views/partials/admin/header.njk
```

Then move the **static HTML structure** from JS template literals into Nunjucks and retain/replace only the browser behavior in dedicated modules. For example:

| Current custom element behavior | Future location after server-rendered markup |
| --- | --- |
| Theme persistence/cycle and media-query listener | `public/admin/shared/js/theme.js` or an equivalent module. |
| Sidebar collapse listener | `public/admin/shared/js/sidebar.js`. |
| Profile/notification dropdown keyboard/outside-click listeners | `public/admin/shared/js/admin-header.js` adapted to initialize existing DOM rather than call `innerHTML`. |
| Active item class | Nunjucks partial using `activePage`. |
| Navigation item definitions | a typed server-side navigation config, if routes/data later warrant it. |

Do not create both a partial and the old custom element at once. That produces duplicate nav landmarks, duplicate IDs such as `sidebarToggle`, conflicting event listeners, and two possible active states.

### 11.4 Documentation example

```njk
{# views/layouts/admin.njk — documentation example, retaining Web Components #}
{% extends "layouts/base.njk" %}

{% block styles %}
  <link rel="stylesheet" href="/assets/tabler/css/tabler.min.css">
  <link rel="stylesheet" href="/admin/shared/css/admin.css?v={{ assetVersion }}">
  {% block pageStyles %}{% endblock %}
{% endblock %}

{% block head %}
  <script src="/admin/shared/components/admin-sidebar.js" defer></script>
  <script src="/admin/shared/components/admin-header.js" defer></script>
{% endblock %}

{% block bodyClass %}admin-shell dashboard-page{% endblock %}

{% block body %}
  <div class="dashboard-layout">
    <admin-sidebar active="{{ activePage }}"></admin-sidebar>
    <div class="page-wrapper">
      <admin-header user-name="{{ currentUser.email }}"></admin-header>
      <div class="page-body">
        <div class="container-xl">
          {% block content %}{% endblock %}
        </div>
      </div>
      {% include "partials/admin-footer.njk" %}
    </div>
  </div>
{% endblock %}

{% block scripts %}
  <script src="/assets/tabler/js/tabler.min.js"></script>
  {% block pageScripts %}{% endblock %}
{% endblock %}
```

One refinement may be needed after actual migration: `.dashboard-page` is a dashboard-themed class in the current CSS, but it is also put on the incomplete content page. If future admin pages need a shared body class that is not dashboard-specific, introduce it in a considered CSS migration. Do not assume the present class naming has already solved that architecture.

---

## 12. Reusable partials versus client-side components

### 12.1 Decision rule

Use a Nunjucks partial when all of the following are true:

1. The fragment is primarily HTML structure;
2. it is used by multiple server-rendered pages;
3. its data is available at request time; and
4. it does not need to construct itself dynamically in the browser.

Use client-side JavaScript/Web Components when the element must manage immediate browser state, events, `localStorage`, media queries, fetching, or dynamically-created DOM.

### 12.2 Recommended candidates in this project

| Candidate | Initial recommendation | Why / data it may use |
| --- | --- | --- |
| Footer | Nunjucks partial | Dashboard already contains a footer. It is static/shared server markup and could receive `currentYear` or site name. |
| Server flash messages | Nunjucks partial **if introduced** | Useful for server redirects/form rendering. Current project instead uses client-created toasts; do not claim flash infrastructure already exists. |
| Page header/breadcrumb | Partial only after two or more pages share a stable form | Dashboard has a page heading; content page has no matching completed header. Avoid premature abstraction. |
| Navbar/sidebar | Retain Web Components initially; later optional Nunjucks partials | They currently have real client logic and embedded navigation. Convert only alongside a deliberate JS split. |
| Login form | Keep page-local | It is currently used only by login and has specific IDs/behavior. |
| Dashboard cards/tables | Keep page-local initially | The dashboard is one static page and data models do not exist. Extract only when actual repeated variants appear. |
| Toasts | Keep client-side | [`toast.js`](apps/server/public/admin/shared/js/toast.js) dynamically creates, animates, pauses, and removes DOM. |
| Loading button state | Keep client-side utility | [`loading-indicator.js`](apps/server/public/admin/shared/js/loading-indicator.js) responds to an in-flight browser request. |
| Password toggle | Keep page-level client JavaScript | It changes input state after initial render. |
| Modal/dialog/table widget | Decide per widget | No admin modal implementation was found. A future data-driven static structure may be templated; interaction stays client-side. |

### 12.3 Avoid “componentizing” every tag

A partial has a maintenance cost: it hides markup, adds indirection, and may require a data contract. Extract one only when it has a clear shared semantic purpose. For example, `partials/admin-footer.njk` is understandable; `partials/card-body.njk` is not useful unless multiple real variants force it.

---

## 13. CSS architecture

### 13.1 Current CSS/assets

Current admin CSS is primarily:

```text
public/admin/shared/css/admin.css
```

It contains:

- admin custom properties and light/dark theme values;
- login shell styles;
- dashboard layout/sidebar/header styles;
- dashboard card/table/list styles;
- toast styles;
- two Tabler icon webfont `@import` statements.

[`public/admin/shared/css/headers.css`](apps/server/public/admin/shared/css/headers.css) is a separate header stylesheet, but no inspected static admin page links to it. Its current role cannot be confirmed from the codebase.

Tabler core assets are served from `node_modules/@tabler/core/dist` by the server plugin, while Tabler **icon font CSS** is fetched from external CDN URLs inside `admin.css`. That is the current design; any offline/CSP/vendor consolidation should be a separate asset-policy decision.

### 13.2 Recommended CSS ownership

```text
apps/server/public/admin/
├── shared/
│   ├── css/
│   │   ├── admin.css             # retain as existing admin shared stylesheet initially
│   │   ├── auth.css              # add only when auth-specific rules materially grow
│   │   └── components/           # only for genuinely shared styling, if needed
│   └── js/
├── pages/
│   ├── login/
│   │   └── auth.js
│   └── dashboard/
│       └── dashboard.js          # future extraction of inline behavior, if used
└── assets/
```

This is deliberately conservative. Do **not** move or split the current `admin.css` merely because templates are introduced. First prove template parity. Then split CSS only if the existing file’s mixed login/dashboard/component responsibilities make changes difficult.

Suggested future loading policy:

| Scope | Load where | Current/future source |
| --- | --- | --- |
| Vendor Tabler CSS | `auth.njk`, `admin.njk` | `/assets/tabler/css/tabler.min.css` |
| Shared admin CSS | `auth.njk`, `admin.njk` | existing `/admin/shared/css/admin.css` |
| Auth-only CSS | `auth.njk`, only if it exists | proposed `/admin/shared/css/auth.css` |
| Admin-only CSS | `admin.njk`, only if split from existing shared CSS | proposed `/admin/shared/css/admin-shell.css` or retained `admin.css` |
| Component CSS | Layout/partial only if the component is actually reused | future, only when needed |
| Page CSS | child template’s `pageStyles` block | only for a real page-specific need |

### 13.3 CSS loading order and overrides

Load from broad to narrow:

```text
1. Tabler vendor CSS
2. shared admin/application CSS
3. layout-specific CSS
4. page-specific CSS
```

This keeps your own rules after Tabler’s defaults and lets a page make the smallest necessary override. Do not load dashboard-specific CSS on login, or login CSS on every future admin page, merely because it is convenient.

### 13.4 Cache busting

Current pages use literal version query strings such as `?v=20260906-5` and `?v=20260906-11`. A layout centralizes that string, which reduces accidental mismatch.

A simple later approach is to have a route/decorator supply a single safe `assetVersion` (for example, deployment revision), then write:

```njk
<link rel="stylesheet" href="/admin/shared/css/admin.css?v={{ assetVersion }}">
```

Do not use an arbitrary unvalidated user value for asset URLs. For production, a bundler/fingerprinted asset manifest is stronger, but no such pipeline is currently present in the Fastify app. Treat it as an optional production improvement, not a prerequisite for Nunjucks.

---

## 14. JavaScript architecture

Changing static `.html` source files to `.njk` source files must not change the HTML that existing JavaScript expects. Nunjucks executes on the server; its output must preserve the browser contract.

### 14.1 Classification of existing JavaScript

| Classification | Existing code | Why it belongs there | Initial migration treatment |
| --- | --- | --- | --- |
| **Shared browser utility** | [`api_request.js`](apps/server/public/admin/shared/js/api_request.js) | Central fetch configuration, response parsing, request error normalization. | Keep URL/import path and behavior. |
| **Shared browser utility** | [`loading-indicator.js`](apps/server/public/admin/shared/js/loading-indicator.js) | Applies/removes button busy state. | Keep unchanged. |
| **Shared browser utility** | [`toast.js`](apps/server/public/admin/shared/js/toast.js) | Builds and controls ephemeral UI notifications. | Keep unchanged. |
| **Layout/component JS** | [`admin-header.js`](apps/server/public/admin/shared/components/admin-header.js) | Theme/localStorage, dropdowns, full/simple header rendering. | Keep and load where header tag appears. |
| **Layout/component JS** | [`admin-sidebar.js`](apps/server/public/admin/shared/components/admin-sidebar.js) | Sidebar rendering and collapse interaction. | Keep and load in admin layout. |
| **Shared but currently unreferenced helper** | [`theme-utils.js`](apps/server/public/admin/shared/components/theme-utils.js) | Exports/theme helper intent, though it is not imported by inspected page assets. | Do not add it casually; assess later. |
| **Legacy/dynamic asset loader** | [`tabler-config.js`](apps/server/public/admin/shared/js/tabler-config.js) | Appends Tabler CSS/JS dynamically. | Prefer explicit layout links/scripts after parity testing; avoid loading both paths. |
| **Login page JS** | [`pages/login/auth.js`](apps/server/public/admin/pages/login/auth.js) | Uses login-only selectors and behavior. | Keep module reference in `login.njk`. |
| **Dashboard page JS** | inline `<script>` in dashboard HTML | Click handlers only for dashboard filter buttons. | Initially preserve output; later extract to a page module if desired. |

### 14.2 DOM selector parity

The central migration rule is:

```text
Static source HTML
       ↓ (replace source with Nunjucks template)
Equivalent rendered HTML
       ↓
Same IDs/classes/attributes
       ↓
Existing JavaScript selectors still work
```

For login, breaking any one of these causes functional regression:

```text
Old markup ID/name               JavaScript usage
───────────────────────────────  ───────────────────────────────────────────
loginForm                        getElementById, submit listener
email / name="email"             loginForm.email.value
password / name="password"       getElementById, loginForm.password.value
togglePassword                   click listener
togglePasswordIcon               class toggling
submit button inside form         querySelector('button[type="submit"]')
```

For dashboard, maintain `.inquiry-filters button` and an initially active button if the existing inline behavior remains unchanged.

For custom elements, preserve `admin-sidebar`, `admin-header`, `active`, `type`, `user-name`, and `.dashboard-layout` while their current implementations are active.

### 14.3 Loading and error handling

The existing login code has a good separation to retain:

- `auth.js` owns user-triggered submission, button loading state, and redirect behavior.
- `api_request.js` owns fetch setup and normalizes network/HTTP failures.
- `toast.js` owns dynamic message presentation.
- Fastify’s API owns credential validation, cookie writing, and response status/message.

A Nunjucks template can render an initial server-provided error message on a full server-side form flow in the future, but it should not replace the dynamic `fetch` error toast during this initial migration. Those are different delivery modes.

### 14.4 Page-specific script blocks

Use a page script block so a login module does not load on every admin page, and dashboard filter code does not load on login:

```njk
{% block pageScripts %}
  <script type="module" src="/admin/pages/login/auth.js"></script>
{% endblock %}
```

For a child of `base.njk` instead of `admin.njk`, use the parent’s named block and `{{ super() }}` only when the parent has scripts that must remain.

---

## 15. Login functionality: preserve the contract

### 15.1 Current API behavior in detail

[`routes/api/v1/auth.ts`](apps/server/src/routes/api/v1/auth.ts) accepts `POST /api/v1/login` with JSON `email` and `password` fields. It:

1. finds a `User` by email through Prisma;
2. returns `404` with `Invalid email or password` when absent;
3. uses Argon2 verification through `comparePassword()`;
4. returns `401` with the same generic credential message when verification fails;
5. creates a random `tokenId`;
6. signs a JWT with `id`, `email`, and `tokenId`, valid for one hour;
7. persists the current token ID to the user row;
8. sets an `auth_token` HTTP-only cookie; and
9. returns the standard JSON success response.

[`plugins/jwt.ts`](apps/server/src/plugins/jwt.ts) protects routes through `fastify.authenticate`:

```text
authenticate request
  → jwtVerify from Authorization header if available
  → otherwise verify auth_token cookie
  → look up User.tokenId in Prisma
  → reject revoked/missing user sessions
  → API request: JSON 401
  → page request: redirect /admin/login
```

### 15.2 After the template migration

The expected flow should remain:

```text
GET /admin/login
        ↓
Fastify renders auth/login.njk through reply.view()
        ↓
Browser receives same functional form markup
        ↓
auth.js attaches existing event listeners
        ↓
POST /api/v1/login
        ↓
Existing API validates and sets existing HTTP-only cookie
        ↓
Existing JS displays loading/success/error and redirects to /admin
        ↓
GET /admin is protected by existing fastify.authenticate
        ↓
Fastify renders admin/dashboard.njk
```

### 15.3 Responsibility boundary

| Nunjucks | Client-side JavaScript | Fastify/API |
| --- | --- | --- |
| Form structure, labels, IDs, fields, initial safe values, optional server-rendered message region. | Toggle password, intercept submit, fetch, loading state, toasts, client redirect. | Render GET page route; validate POST body; authenticate; query Prisma; set cookie; return JSON; protect pages. |

A migration should **not** turn the existing JSON login API into a normal form POST just to “make it server rendered.” That would alter the authentication interaction model, error delivery, and redirects. It can be a separately planned option later, but it is not required for page templating.

---

## 16. Fastify → Nunjucks rendering

### 16.1 Current versus target route behavior

```text
CURRENT STATIC PAGE
Fastify route
    ↓
PublicHtmlFiles.getHtml(path)
    ↓
readFile/cache
    ↓
reply.type('text/html').send(html)

TARGET NUNJUCKS PAGE
Fastify route
    ↓
authentication hook (when required)
    ↓
collect/delegate data
    ↓
reply.view('admin/dashboard.njk', templateData)
    ↓
Nunjucks inheritance/includes render complete HTML
    ↓
reply sends HTML
```

A conceptual route transformation is:

```ts
// Current dashboard shape — documentation only
const html = await PublicHtmlFiles.getHtml(PublicRoutes.DASHBOARD, { cache: false })
return reply.type('text/html').send(html)
```

```ts
// Target shape — documentation only
return reply.view('admin/dashboard.njk', {
  pageTitle: 'Dashboard',
  activePage: 'dashboard',
  currentUser: {
    id: request.user.id,
    email: request.user.email,
  },
  assetVersion: 'deployment-version',
})
```

### 16.2 How `@fastify/view` is used here

`@fastify/view` adds `reply.view()`. In this project, its Nunjucks engine/root are already configured by [`plugins/views.ts`](apps/server/src/plugins/views.ts).

Template paths are relative to the configured root:

```text
Configured root: apps/server/views/

reply.view('auth/login.njk')          → apps/server/views/auth/login.njk
reply.view('admin/dashboard.njk')     → apps/server/views/admin/dashboard.njk
{% extends "layouts/admin.njk" %}     → apps/server/views/layouts/admin.njk
{% include "partials/admin-footer.njk" %}
                                      → apps/server/views/partials/admin-footer.njk
```

Keep paths slash-separated and root-relative inside Nunjucks. Do not use filesystem paths or URL paths in `{% extends %}` / `{% include %}`.

### 16.3 Authentication with rendered pages

Template rendering does not weaken the current auth protection. Keep the existing route option:

```ts
{ onRequest: [fastify.authenticate] }
```

The hook runs **before** the handler tries to collect data/render. On an ordinary page request that fails authentication, it redirects to `/admin/login`; it should not render a dashboard template. On API requests, it returns JSON instead.

### 16.4 Practical template availability check

Because Nunjucks resolves templates from `views`, build/deploy steps must make `.njk` files available where the configured root expects them. Before migrating a route, verify both local dev and built server behavior:

```text
source tree views path exists
        ↓
server process resolves its configured root correctly
        ↓
requested template and parent/includes are present
        ↓
reply.view renders rather than “template not found”
```

The current `tsconfig.json` does not copy Nunjucks files itself. Determine the project’s actual deploy/copy convention before relying on compiled output. This cannot be fully determined from the inspected source alone.

---

## 17. Server-side template data

### 17.1 Data flow

```text
Fastify route
       ↓
service / Prisma query (when needed)
       ↓
small display-oriented template-data object
       ↓
reply.view(template, data)
       ↓
Nunjucks renders HTML
```

### 17.2 What can safely be supplied now

Current verified data includes:

| Data | Source | Appropriate use |
| --- | --- | --- |
| `request.user.id`, `request.user.email` | verified JWT payload after protected route hook | Header label, signed-in context, audit/display values. |
| Site config fields | `SiteConfigs` Prisma model, if a route queries it | Future public/admin site-content display/edit views. No current query route is present. |
| Page title | route constant | `<title>` and page heading. |
| Active page | route constant | sidebar active state. |
| Form values/messages | explicit route data if a future server-rendered form flow needs them | rendered form/alert state. |

### 17.3 Future-shaped examples, not current capabilities

The following can be template data **after** matching models/services are built, but are not currently supported by the server:

```ts
{
  dashboardStats: { totalArtworks: 128, availableArtworks: 74 },
  recentArtworks: [...],
  recentInquiries: [...],
  upcomingPrograms: [...],
  categories: [...],
}
```

Do not query non-existent Prisma models from templates or add hard-coded fake data merely to demonstrate loops. The existing static dashboard can be migrated structurally first, then made data-driven in a separate feature once database schema, services, authorization, and tests exist.

### 17.4 Keep business logic out of templates

Good route/service work:

```ts
const siteConfig = await fastify.prisma.siteConfigs.findFirst()
const displayName = siteConfig?.name ?? request.user.email
return reply.view('admin/content.njk', { siteConfig, displayName })
```

Poor template work:

```njk
{# Do not make the template decide authorization or compute application policy #}
{% if currentUser.email.endsWith('@company.example') and siteConfig.location != '' %}
  ...
{% endif %}
```

A template may make a simple display decision; it should not decide who is authorized, invent defaults with business meaning, query the database, hash data, sign tokens, or shape complex collections.

### 17.5 Shared template context: introduce carefully

Eventually a Fastify decorator or view-data helper may make values such as `assetVersion`, `currentYear`, or a common app name consistent. Do not introduce a global view context just to avoid passing two route constants. Keep route-specific state explicit until repetition demonstrates a real need.

---

## 18. Navigation state

### 18.1 Current approach

The sidebar Web Component reads an HTML attribute:

```html
<admin-sidebar active="dashboard"></admin-sidebar>
```

and compares that string to its internal navigation keys. The dashboard currently passes `dashboard`; the static content skeleton also incorrectly passes `dashboard` even though it represents content.

### 18.2 Initial template migration

Let the route provide one explicit value:

```ts
{ activePage: 'dashboard' }
```

then render:

```njk
<admin-sidebar active="{{ activePage }}"></admin-sidebar>
```

For `/admin/content`, use `activePage: 'content'` once the page is migrated. This corrects the navigation data at the template boundary without requiring the route itself to infer a page from a URL.

### 18.3 Future Nunjucks partial version

If navigation is later server-rendered, a partial can use the same data:

```njk
<li class="nav-item {% if activePage === 'dashboard' %}active{% endif %}">
  <a class="nav-link" href="/admin/dashboard">Dashboard</a>
</li>
```

Keep a single navigation source. If the sidebar stays a Web Component, its JS owns labels/links/active condition. If it becomes a partial, a server-side config/partial owns them. Do not leave two independently maintained route lists.

### 18.4 Canonical URL decision

The application currently offers both `/admin` and `/admin/dashboard`. Choose and document one canonical dashboard URL during route migration, then retain a redirect/alias if backward compatibility needs it. The correct choice cannot be determined from source alone because the UI uses `/admin/dashboard` but post-login JavaScript redirects to `/admin`.

Do not change this URL as an incidental template conversion without explicitly testing login redirect, sidebar links, bookmarks, and protection behavior.

---

## 19. Static assets versus views

### 19.1 What belongs in `views/`

`views/` should contain server-only template sources:

- layouts,
- page templates,
- partials,
- optional error templates.

They are consumed by `reply.view()` on the server. They normally should not be directly requested by a browser.

### 19.2 What belongs in `public/`

`public/` should contain browser-addressable files:

- CSS;
- JavaScript modules;
- images/logos;
- fonts and static vendor resources if owned locally;
- potentially manifest/favicon files.

Current examples:

```text
public/admin/assets/logo_normal.png
public/admin/assets/logo_white.png
public/admin/shared/css/admin.css
public/admin/shared/components/admin-header.js
public/admin/pages/login/auth.js
```

### 19.3 Explicit rule

```text
views/admin/dashboard.njk             → server input; not a static public file
public/admin/pages/dashboard/*.js     → browser input; served by static middleware
public/admin/assets/*.png             → browser input; served by static middleware
```

Do not put `.njk` files under `public/`, and do not put public browser modules below `views/`. Doing either exposes the wrong artifacts or causes requests to fail.

---

## 20. Incremental migration strategy

Do not migrate every page or replace every Web Component in one change. Each phase should leave a working application and have a small rollback boundary.

### Phase 0 — Establish a baseline and confirm runtime behavior

**Objective:** understand what the server actually serves before moving markup.

**Files to inspect/use:**

- [`src/plugins/views.ts`](apps/server/src/plugins/views.ts)
- [`src/plugins/tabler.ts`](apps/server/src/plugins/tabler.ts)
- [`src/routes/admin/index.ts`](apps/server/src/routes/admin/index.ts)
- [`src/routes/admin/dashboard/index.ts`](apps/server/src/routes/admin/dashboard/index.ts)
- [`src/routes/admin/content/index.ts`](apps/server/src/routes/admin/content/index.ts)
- current public pages/assets.

**What to do:**

1. Start the server using its documented server scripts in the appropriate `apps/server` context.
2. Request `/admin/login`, `/admin` unauthenticated, authenticated `/admin`, `/admin/dashboard`, and `/admin/content`.
3. In browser devtools, record DOM, loaded assets, response status, console output, and login behavior.
4. Verify where `.njk` files are resolved in a built/dev run before adding more templates.

**Why:** current source shows a placeholder Nunjucks login but static login assets. A migration needs a factual visual/functional baseline, not just a file comparison.

**Expected result:** a route/asset/DOM parity checklist for the specific environment.

**What could go wrong:** environment variables (`JWT_SECRET`, cookie secret, database URL, admin seed credentials) can prevent startup/login. Those configuration values are not committed in the inspected files.

**Proceed only when:** you can explain the existing page response and have verified which assets load.

---

### Phase 1 — Make the base layout truly neutral

**Objective:** establish template inheritance without forcing all pages to load admin resources.

**Future files involved:**

- modify `apps/server/views/layouts/base.njk`;
- later add `views/layouts/auth.njk` and `views/layouts/admin.njk`.

**What to do:**

1. Keep only universal document structure and named blocks in `base.njk`.
2. Define stable blocks such as `title`, `meta`, `styles`, `head`, `bodyClass`, `body`, and `scripts`.
3. Move the decision to load Tabler/admin resources into child layouts rather than base.

**Why:** base is the dependency root. If it loads admin resources, every future error/public template inherits them whether appropriate or not.

**Expected result:** no page has been migrated yet, but derived layouts can choose appropriate dependencies.

**How to test:** make a tiny temporary/non-production proof template only in a local branch if needed; verify block inheritance and no template-not-found errors. Do not change live routes until the next phase.

**What could go wrong:** a child overrides an asset block without `{{ super() }}`, losing required assets. A wrong `extends` path fails at render time.

**Proceed only when:** all expected blocks have unambiguous ownership and the views directory is available at runtime.

---

### Phase 2 — Create the authentication layout and migrate login markup

**Objective:** convert the designed login page to `auth/login.njk` while preserving its API/JS contract.

**Future files involved:**

- `apps/server/views/layouts/auth.njk` (new);
- `apps/server/views/auth/login.njk` (replace placeholder); 
- `apps/server/src/routes/admin/index.ts` (route already calls `reply.view`; add only required view data if needed);
- retain public login JavaScript and shared assets unchanged;
- retain the original static HTML during parity testing until retirement is separately approved.

**What to do:**

1. Put the full static login form structure into `auth/login.njk`, expressed through `auth.njk` and base blocks.
2. Preserve form IDs/names/classes and the page module URL.
3. Load Tabler/admin CSS and the simple header component at auth-layout scope.
4. Avoid putting credentials in the template unless intentionally retaining the current development-only behavior.
5. Keep `POST /api/v1/login`, response format, cookie behavior, and client redirect unchanged.

**Why:** login is already routed through `reply.view`, so it has the smallest route change and immediately validates inheritance plus page module loading.

**Expected result:** `/admin/login` visually/functionally matches `public/admin/pages/login/login.html` while being rendered by Nunjucks.

**How to test:**

- inspect response HTML for exact key IDs;
- test show/hide password, including accessible title/label;
- submit invalid and valid credentials;
- confirm loading button restoration on failures;
- verify toast output and redirect;
- confirm successful login creates cookie and `/admin` becomes accessible;
- inspect network to ensure `/api/v1/login` remains JSON, not a navigation form post.

**What could go wrong:** module script path changes, missing `admin-header.js`, different Tabler load timing, duplicated Tabler CSS/JS, changed IDs, or a child scripts block dropping parent Tabler JS.

**Proceed only when:** all login flows work exactly as before and authenticated redirect remains valid.

---

### Phase 3 — Establish an admin layout without rewriting components

**Objective:** create one protected admin shell that preserves current Web Component behavior.

**Future files involved:**

- `apps/server/views/layouts/admin.njk` (new);
- potentially `apps/server/views/partials/admin-footer.njk` (new);
- existing public header/sidebar scripts and `admin.css` remain unchanged.

**What to do:**

1. Move dashboard’s shared outer shell into `admin.njk`.
2. Keep `<admin-sidebar>` and `<admin-header>` custom-element tags initially.
3. Add `activePage` and minimal `currentUser` route data expectations.
4. Include a content block inside the same `.dashboard-layout` / `.page-wrapper` structure the existing CSS/JS expects.
5. Decide whether the existing dashboard footer becomes a small shared partial; use a partial only if content/content future pages will use it.

**Why:** it removes the largest shared shell duplication while avoiding a risky simultaneous Web Component rewrite.

**Expected result:** a child dashboard page needs only header/body cards/tables plus its page-specific script.

**How to test:** render an intentionally simple protected child first, then verify custom-element registration, theme cycle, dropdown behavior, sidebar active state, and sidebar collapse.

**What could go wrong:** if the wrapper class changes, sidebar collapse breaks; if header/sidebar script paths are omitted, custom tags render empty; if a real `currentUser` shape is not passed, display name becomes incorrect.

**Proceed only when:** the rendered layout produces a single header/sidebar and all component interactions work.

---

### Phase 4 — Migrate the dashboard route and page body

**Objective:** change existing protected dashboard route(s) from raw HTML read/send to `reply.view()`.

**Future files involved:**

- `apps/server/views/admin/dashboard.njk` (new);
- `apps/server/src/routes/admin/index.ts` and/or `apps/server/src/routes/admin/dashboard/index.ts` (change only those route handlers); 
- existing `PublicHtmlFiles` remains for unconverted pages/errors;
- optional future `public/admin/pages/dashboard/dashboard.js` only if deliberately extracting the current inline script.

**What to do:**

1. Move dashboard-specific markup from static `index.html` into a page content block.
2. Initially keep literal dashboard values; they are mock/static UI data today.
3. Preserve filter markup and its current click behavior. Either retain the script in a page script block or move it to a matching page module in a separate small change.
4. Pass `pageTitle`, `activePage: 'dashboard'`, current authenticated identity, and any shared asset version deliberately.
5. Decide and test canonical `/admin` versus `/admin/dashboard` behavior; retain an alias/redirect as needed.

**Why:** this is the central payoff: raw static read/send becomes composition through the admin layout.

**Expected result:** the page response no longer needs `PublicHtmlFiles.getHtml(PublicRoutes.DASHBOARD)`, but the browser still sees the same dashboard.

**How to test:**

- unauthenticated requests redirect to login;
- authenticated requests return 200 HTML;
- cards/table/images/footer appear;
- Tabler and admin CSS load;
- header/sidebar/theme/collapse work;
- filters update active class;
- linked placeholder destinations still behave exactly as current (usually 404—not magically implemented);
- no duplicate document/head/header/sidebar is present.

**What could go wrong:** accidental duplication of layout shell, page script runs before nodes exist, invalid image URLs/same static asset paths, assets loaded twice, or active navigation mismatch.

**Proceed only when:** visually/functionally matching output is verified under both auth states.

---

### Phase 5 — Migrate the site-content route only to its existing scope

**Objective:** render the existing content page skeleton through the admin layout without inventing a CMS UI.

**Future files involved:**

- `apps/server/views/admin/content.njk` (new);
- `apps/server/src/routes/admin/content/index.ts` (switch to `reply.view()`);
- possibly later Prisma service/route work for `SiteConfigs`—not part of the structural migration.

**What to do:**

1. Convert the existing skeleton’s intended body into a child template.
2. Use `activePage: 'content'`.
3. Let the admin layout provide the correct `.dashboard-layout`, header, sidebar, body, and footer rather than copying them.
4. Do not assume that `SiteConfigs` has to be displayed or editable merely because the model/seed exists. Add that only with concrete requirements and data-access code.

**Why:** it demonstrates page reuse but keeps structural migration independent from a missing content-management feature.

**Expected result:** `/admin/content` gets a correctly structured protected shell with only the content that actually exists today.

**How to test:** authenticated/unauthenticated route behavior, correct highlighted Content nav item, no `dashboadr-layout` typo in generated layout, and one—not zero or two—page wrappers.

**What could go wrong:** treating an incomplete static stub as a specification for a full CMS; accidentally pulling seeded config data without defining access/validation behavior.

**Proceed only when:** the page is structurally correct and no unimplemented content feature was implied.

---

### Phase 6 — Make pages data-driven only where services/models exist

**Objective:** use Nunjucks variables/loops for genuine data without turning templates into an application layer.

**Future files involved:** depends on explicitly approved feature work: Prisma models, service modules, route handlers, templates, tests.

**What to do:**

1. Define a server-side service/query for a real use case (for example, reading the single `SiteConfigs` record).
2. Shape a simple presentation object in TypeScript.
3. Pass it to a template; use variables/loops/conditionals only for display.
4. Add tests for missing data, authorization, and empty states.

**Why:** a template’s value is strongest when it renders real server data, but data architecture must exist first.

**Expected result:** limited, tested dynamic rendering without pretending the dashboard placeholders are live data.

**How to test:** database fixture/seed scenarios, empty state, escaping, unauthorized access, and response markup.

**What could go wrong:** database queries in templates, unbounded data selection, leaking fields such as `passwordHash`/`tokenId`, or using static mock UI as if it were production data.

**Proceed only when:** data contracts and authorization are independently sound.

---

### Phase 7 — Decide error-template treatment and retire legacy static HTML last

**Objective:** remove obsolete static-page dependencies only after each replacement is live and verified.

**Future files involved:**

- optionally `views/errors/*.njk`;
- `src/routes/root.ts`;
- `src/constants/public-routes.ts`;
- `public/error/*.html`; 
- any obsolete static admin `.html` pages.

**What to do:**

1. Decide whether 404/unavailable documents should remain static or become Nunjucks views. Both are valid; error rendering has special failure-mode concerns.
2. Keep static fallbacks until template error behavior is proven.
3. Remove route references, reader constants/cache logic, and public static HTML only once no route needs them.
4. Verify `PublicHtmlFiles` has no remaining callers before retiring it.

**Why:** deleting the static source too early makes rollback harder and can leave the not-found handler unable to render an error if view resolution fails.

**Expected result:** one clear rendering path for migrated page categories, with reliable error behavior.

**How to test:** request unknown paths, simulate or safely test missing template/static conditions in a non-production environment, and verify status codes/content types.

**What could go wrong:** error handler recursion, template resolution failure without a fallback, or stale paths being served by static middleware.

**Proceed only when:** route tests/browser tests prove no production path still depends on old HTML.

---

## 21. Before/after structure and file mapping

### 21.1 Current relevant structure

```text
apps/server/
├── public/
│   ├── admin/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── dashboard/index.html
│   │   │   ├── login/login.html
│   │   │   ├── login/auth.js
│   │   │   └── site_content/index.html
│   │   └── shared/
│   │       ├── components/admin-header.js
│   │       ├── components/admin-sidebar.js
│   │       ├── css/admin.css
│   │       └── js/{api_request,loading-indicator,toast,tabler-config}.js
│   └── error/
│       ├── no_page_found.html
│       └── unavailable_page.html
├── src/
│   ├── constants/public-routes.ts
│   ├── plugins/{tabler,views,jwt}.ts
│   └── routes/{root,admin,api}/...
└── views/
    ├── auth/login.njk              # placeholder
    └── layouts/base.njk             # admin-oriented base
```

### 21.2 Target relevant structure

```text
apps/server/
├── public/                          # remains browser-accessible assets only
│   └── admin/
│       ├── assets/
│       ├── pages/
│       │   ├── login/auth.js
│       │   └── dashboard/dashboard.js       # only if inline script is extracted
│       └── shared/
│           ├── components/
│           ├── css/
│           └── js/
├── src/
│   ├── plugins/views.ts             # remains Nunjucks registration
│   └── routes/                      # handlers call reply.view where migrated
└── views/                            # not public
    ├── layouts/{base,auth,admin}.njk
    ├── auth/login.njk
    ├── admin/{dashboard,content}.njk
    ├── partials/admin-footer.njk
    └── errors/*.njk                 # only if intentionally migrated
```

### 21.3 Mapping table

| Current file/concern | Target location/behavior | Reason |
| --- | --- | --- |
| `public/admin/pages/login/login.html` | `views/auth/login.njk` | Page document becomes server-rendered; the browser should no longer directly request HTML source. |
| `public/admin/pages/dashboard/index.html` | `views/admin/dashboard.njk` | Dashboard body becomes a child template; shell moves to `layouts/admin.njk`. |
| `public/admin/pages/site_content/index.html` | `views/admin/content.njk` | Existing content-page body becomes an admin-layout child. |
| duplicated `<html>/<head>` markup | `views/layouts/base.njk` | One universal document shell. |
| duplicated admin resources/shell | `views/layouts/auth.njk` and `views/layouts/admin.njk` | Correct resource scope and reusable page shell. |
| Dashboard footer markup | `views/partials/admin-footer.njk` if reused | A clear shared fragment; retain page-local if only one page uses it. |
| `public/admin/shared/components/admin-header.js` | initially unchanged/public | It contains active client behavior; template conversion need not rewrite it. |
| `public/admin/shared/components/admin-sidebar.js` | initially unchanged/public | Same reason; `activePage` can be passed as an attribute. |
| `public/admin/pages/login/auth.js` | unchanged/public, referenced from template | It must keep handling login interaction/API flow. |
| dashboard inline filter script | page scripts block or later public dashboard module | Page-specific behavior should not enter global/admin layout. |
| `constants/public-routes.ts` raw reader | retain until no callers; then retire in Phase 7 | Avoid deleting fallback/legacy logic while pages/errors still use it. |
| static error HTML | remain initially; optional `views/errors/` later | Error fallback deserves its own decision and testing. |

This mapping is not a command to reorganize every file. It moves only files whose role changes from raw page document to server view. Browser assets stay public.

---

## 22. Focused documentation examples

### 22.1 Fastify data passed to a protected template

```ts
// Documentation only: future protected route handler
fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
  return reply.view('admin/dashboard.njk', {
    pageTitle: 'Dashboard',
    activePage: 'dashboard',
    currentUser: {
      id: request.user.id,
      email: request.user.email,
    },
    assetVersion: '20260910',
  })
})
```

This uses actual JWT payload fields from [`plugins/jwt.ts`](apps/server/src/plugins/jwt.ts). It deliberately does not pass `tokenId` to the browser, even though it is present in the JWT type; templates should receive only display data they need.

### 22.2 Dashboard page with page-specific JavaScript

```njk
{# views/admin/dashboard.njk — documentation example #}
{% extends "layouts/admin.njk" %}

{% block title %}{{ pageTitle }} | Artist Portfolio Admin{% endblock %}

{% block content %}
  <header class="page-header d-print-none mb-4">
    <div class="row align-items-center g-3">
      <div class="col">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="text-secondary mt-1">
          A clear view of your collection, programs, and conversations.
        </div>
      </div>
    </div>
  </header>

  {# Preserve the existing dashboard cards/table markup here during structural migration. #}
  <div class="inquiry-filters" role="group" aria-label="Inquiry filters">
    <button class="active" type="button">All <span>12</span></button>
    <button type="button">Purchase</button>
    <button type="button">Commission</button>
  </div>
{% endblock %}

{% block pageScripts %}
  <script>
    document.querySelectorAll('.inquiry-filters button').forEach((filter) => {
      filter.addEventListener('click', () => {
        document.querySelector('.inquiry-filters button.active')?.classList.remove('active')
        filter.classList.add('active')
      })
    })
  </script>
{% endblock %}
```

This is deliberately not a data model for dashboard content. It illustrates that a page-level behavior belongs in a page-level block rather than base/admin layout.

### 22.3 Conditional error/success message

```njk
{# Documentation only; needs a route to provide these values. #}
{% if successMessage %}
  <div class="alert alert-success" role="status">{{ successMessage }}</div>
{% endif %}

{% if errorMessage %}
  <div class="alert alert-danger" role="alert">{{ errorMessage }}</div>
{% endif %}
```

Use this for a server-rendered redirect/form strategy. It does not replace the existing client-side toast behavior for the current JSON login flow.

### 22.4 Looping future real data

```njk
{# Documentation only; recentArtworks is not currently provided by server code. #}
{% if recentArtworks.length %}
  <div class="artwork-grid">
    {% for artwork in recentArtworks %}
      <a class="artwork-item" href="/admin/artworks/{{ artwork.id }}">
        <img src="{{ artwork.imageUrl }}" alt="{{ artwork.title }}">
        <strong>{{ artwork.title }}</strong>
        <span>{{ artwork.medium }} · {{ artwork.year }}</span>
      </a>
    {% endfor %}
  </div>
{% else %}
  <p class="text-secondary">No artwork has been added yet.</p>
{% endif %}
```

Before using this, build the artwork model/service/authorization and validate image URL/display data in TypeScript.

### 22.5 Active navigation using current Web Component

```njk
{# Initial migration: preserve the client component. #}
<admin-sidebar active="{{ activePage }}"></admin-sidebar>
```

Later, if replacing it with a Nunjucks partial:

```njk
{# Documentation only: views/partials/admin/sidebar.njk #}
<nav aria-label="Admin navigation">
  <a class="nav-link {% if activePage === 'dashboard' %}active{% endif %}"
     href="/admin/dashboard">Dashboard</a>
  <a class="nav-link {% if activePage === 'content' %}active{% endif %}"
     href="/admin/content">Content</a>
</nav>
```

### 22.6 Login loading state and errors

No Nunjucks code is needed for the current dynamic loading state. The existing module should remain responsible:

```js
// Existing behavior conceptually, not a replacement
setButtonLoading(submitButton, true, 'Signing in...')
const response = await apiRequest({ url: '/api/v1/login', method: 'POST', body: { email, password } })
setButtonLoading(submitButton, false)

if (response.success) {
  showToast('Login successful!', 'success', 'Success')
  window.location.href = '/admin'
} else {
  showToast(response.message || 'Invalid email or password.', 'danger', 'Login Failed')
}
```

The template’s job is to render compatible form HTML, not recreate this logic.

---

## 23. Common mistakes and project-specific risks

| Mistake/risk | Why it is harmful here | Prevention |
| --- | --- | --- |
| Duplicating layouts during migration | A page that keeps dashboard shell markup while extending `admin.njk` gets duplicate header/sidebar/wrappers. | Move page content only into child templates; shell lives in one layout. |
| Putting everything into `base.njk` | Current base already includes admin resources, which would force them on future non-admin/error pages. | Keep base universal; use auth/admin child layouts. |
| Duplicating navbar/sidebar in Nunjucks and Web Components | Produces two navigation landmarks/IDs/event handlers. | Retain custom tags initially **or** fully replace them later; never both. |
| Putting business logic in templates | Templates become untestable policy/database code and can leak sensitive fields. | Query/authorize/shape data in TypeScript services/routes. |
| Overusing partials | Makes a small UI harder to trace and changes require too many files. | Extract only stable, multi-page semantic fragments. |
| Loading every CSS/JS asset everywhere | Login would load dashboard behavior; future pages would carry unnecessary code and possible selector errors. | Use auth/admin/page blocks with narrow scopes. |
| Breaking JavaScript selectors | `auth.js` relies on exact IDs/names and the dashboard script relies on classes. | Snapshot/check rendered DOM and preserve key markup initially. |
| Breaking form IDs or button placement | `loginForm.email`, `loginForm.password`, and the submit query would fail. | Preserve `id`, `name`, and nested button structure. |
| Changing API endpoint/form semantics while templating | Turns a page-source migration into an authentication redesign. | Keep `/api/v1/login`, JSON contract, cookie setting, fetch, and redirect unchanged. |
| Assuming client JS can read `auth_token` | It is deliberately HTTP-only. | Rely on `credentials: 'same-origin'` and server cookie verification. |
| Removing `fastify.authenticate` from view routes | Server-rendered HTML would become publicly accessible. | Preserve `onRequest: [fastify.authenticate]` on protected pages. |
| Misclassifying a page request as API | JWT hook sends different failures based on `/api` or `Accept: application/json`. | Test real browser navigation and API fetch separately. |
| Incorrect `reply.view()` path | Nunjucks resolves relative to configured root, not a URL. | Use root-relative template paths like `admin/dashboard.njk`. |
| Incorrect `extends`/`include` path | Causes runtime template-not-found failures. | Use root-relative Nunjucks paths such as `layouts/admin.njk`. |
| Forgetting template deployment/copy | TypeScript compilation does not automatically prove `.njk` availability in `dist`. | Verify built runtime before route conversion. |
| Incorrect static asset path | Templates live outside `public`, but browser assets still need public URLs. | Use `/admin/...` and `/assets/tabler/...`, not relative filesystem paths. |
| Leaving `tabler-config.js` plus direct Tabler links | Can load the vendor stylesheet/script twice and create timing/FOUC differences. | Choose one loading strategy per layout; test after changing it. |
| Overriding a block without `super()` | Child can remove parent CSS/JS. | Use `{{ super() }}` when extending an additive parent block. |
| Assuming header/sidebar route links are implemented | Most linked routes have no Fastify handlers. | Migrate actual routes only; record placeholder links as future work. |
| Treating static dashboard values as production data | Existing schema lacks corresponding models. | Migrate structure first; add data services in a separate feature. |
| Accidentally exposing templates | Putting `.njk` under `public/` lets clients request source. | Keep views outside static root. |
| Deleting static pages/reader early | Existing routes/error fallback still depend on them during transition. | Retire legacy paths only after all callers and error paths are tested. |
| Treating existing tests as current behavior | Several tests reference obsolete/scaffolded routes/plugins. | Update/add tests as part of a separately scoped migration verification change. |

---

## 24. Testing strategy and stage gates

Test every phase before starting the next. The goal is **rendering parity plus preserved behavior**, not simply receiving a 200 response.

### 24.1 Route and rendering checks

For each migrated route, verify:

- [ ] authenticated page requests return correct `text/html` content and expected status;
- [ ] unauthenticated protected requests redirect to `/admin/login`;
- [ ] `/admin/login` remains public;
- [ ] templates resolve in both development and built/deployment modes;
- [ ] title, meta viewport, and document structure render once;
- [ ] there is exactly one expected header/sidebar/footer—not duplicate shell markup;
- [ ] page-specific title and active navigation values are correct;
- [ ] unknown routes still return a proper 404 page/status;
- [ ] no Nunjucks source (`{%`, `{{`) appears in browser HTML response.

### 24.2 Asset checks

Use browser Network tools (or automated HTTP checks) to verify:

- [ ] `/assets/tabler/css/tabler.min.css` loads once where needed;
- [ ] `/assets/tabler/js/tabler.min.js` loads once where needed;
- [ ] `/admin/shared/css/admin.css` loads with expected response;
- [ ] logos/images resolve at current `/admin/assets/...` paths;
- [ ] header/sidebar scripts load before their custom elements need them;
- [ ] login `auth.js` is loaded as a module only on login;
- [ ] dashboard filter script/module is only on dashboard;
- [ ] console has no custom-element registration, selector-null, module, MIME-type, or 404 asset errors;
- [ ] no accidental duplicate Tabler source (`tabler-config.js` plus direct resources) remains.

### 24.3 Login contract checks

- [ ] password toggle changes only the password input visibility and updates icon/title/ARIA label;
- [ ] form submit prevents a full browser form navigation;
- [ ] submit button disables and shows loading state while request is pending;
- [ ] invalid email/password produces an appropriate toast and restores the button;
- [ ] network failure path produces the existing generic error toast and restores the button;
- [ ] success returns the same JSON API shape and shows success handling;
- [ ] successful login sends/sets the HTTP-only cookie;
- [ ] redirect remains `/admin` unless an intentional canonical-route decision changes it;
- [ ] authenticated `/admin` accepts the cookie and renders the protected page;
- [ ] API unauthorized requests still return JSON 401 rather than HTML redirect;
- [ ] page unauthorized requests still redirect rather than return raw JSON.

### 24.4 Layout/component checks

- [ ] `admin-header` simple mode works on login;
- [ ] full `admin-header` works on protected page;
- [ ] theme preference cycles and persists as it did before;
- [ ] profile/notification dropdown keyboard/outside-click behavior remains if retained;
- [ ] sidebar collapse finds the expected `.dashboard-layout` and toggles correctly;
- [ ] `activePage` highlights Dashboard on dashboard and Content on content;
- [ ] mobile/responsive layout has no new overflow caused by changed wrapper nesting.

### 24.5 Automated testing direction

Once current stale/scaffold tests are corrected, use Fastify injection tests for route-level assertions:

```ts
// Documentation sketch only
const response = await app.inject({
  method: 'GET',
  url: '/admin/login',
})

assert.equal(response.statusCode, 200)
assert.match(response.headers['content-type'], /text\/html/)
assert.match(response.payload, /id="loginForm"/)
```

For protected views, create/obtain a valid test cookie and assert redirect vs rendered HTML. For browser-only behavior (custom elements, clicks, module handlers), use browser automation or manual stage checks; `app.inject()` cannot execute client JavaScript.

### 24.6 Final no-regression checklist

- [ ] Login works end to end.
- [ ] Protected dashboard works end to end.
- [ ] Content route remains protected and correctly laid out.
- [ ] Static assets load from the same intended public URLs.
- [ ] API endpoints and response shapes have not changed unintentionally.
- [ ] There is no unnecessary repeated document/shell markup.
- [ ] Server-side route/template data does not expose password hashes, JWT token IDs, or internal-only fields.
- [ ] Error/not-found behavior still works.
- [ ] Old static HTML has not been removed until all dependent callers are gone.

---

## 25. Final reference architecture

### 25.1 Directory tree

```text
apps/server/
├── src/
│   ├── app.ts
│   ├── plugins/
│   │   ├── views.ts                 # @fastify/view + Nunjucks registration
│   │   ├── tabler.ts                # public static assets
│   │   ├── jwt.ts                   # page/API authentication behavior
│   │   └── prisma.ts                # DB access decorator
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── index.ts             # login / root admin rendering
│   │   │   ├── dashboard/index.ts   # protected dashboard reply.view
│   │   │   └── content/index.ts     # protected content reply.view
│   │   └── api/v1/auth.ts           # unchanged JSON login API
│   └── services/                    # business/data logic, not templates
├── views/                           # server-only Nunjucks source
│   ├── layouts/
│   │   ├── base.njk
│   │   ├── auth.njk
│   │   └── admin.njk
│   ├── auth/login.njk
│   ├── admin/
│   │   ├── dashboard.njk
│   │   └── content.njk
│   ├── partials/
│   │   └── admin-footer.njk
│   └── errors/                      # optional, later
└── public/                          # browser assets only
    └── admin/
        ├── assets/
        ├── shared/{css,js,components}/
        └── pages/{login,dashboard}/
```

### 25.2 Template hierarchy

```text
base.njk
  ├── auth.njk
  │     └── login.njk
  │
  └── admin.njk
        ├── dashboard.njk
        └── content.njk
```

### 25.3 Responsibilities at a glance

| Location/layer | Responsibility |
| --- | --- |
| Base layout | Universal document skeleton and neutral extension points. |
| Auth layout | Authentication-page CSS/resources and simple auth shell. |
| Admin layout | Protected admin structure, admin assets, retained Web Component placement, shared footer/content block. |
| Page templates | Page-specific headings, forms, cards/tables, page-only asset blocks. |
| Partials | Meaningful reused server-rendered fragments only. |
| Browser components/modules | Interaction after rendering: Web Components, theme, dropdowns, sidebar collapse, fetch, toasts, loading. |
| CSS | Shared/admin/auth/page visual presentation, loaded at the narrowest sensible scope. |
| Fastify routes | HTTP methods/paths, auth hook, selecting template, preparing safe template-data object. |
| Services/Prisma | Queries, business rules, data shaping, authorization-adjacent database logic. |
| Nunjucks | HTML presentation of supplied data—not database access, token work, or business policy. |

### 25.4 Final request flow

```text
Browser
   ↓  GET /admin/dashboard
Fastify route
   ↓
fastify.authenticate
   ├─ invalid/missing session → redirect /admin/login
   └─ verified session → continue
   ↓
service / Prisma query when the page genuinely needs data
   ↓
route creates safe template-data object
   ↓
reply.view('admin/dashboard.njk', data)
   ↓
Nunjucks resolves base → admin layout → partials/page blocks
   ↓
Rendered HTML response
   ↓
Browser loads public CSS/JS/images/Tabler
   ↓
Client-side JavaScript initializes Web Components and page interaction
```

### 25.5 The core migration principle

> **Render shared structure and initial data on the server; preserve browser-side interaction where it belongs.**

For this repository, the safest path is not “replace every HTML/JS component with Nunjucks.” It is:

1. use Nunjucks to remove duplicated document and admin-page structure;
2. preserve working login/API/authentication behavior and existing client components;
3. introduce route-supplied data only where the server actually has models/services for it; and
4. refactor Web Components, static HTML reader paths, and CSS only after page-level parity is proven.

That sequence gives the project a clear server-rendered architecture while respecting the code and functionality that already exist.
