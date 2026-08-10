# 🎨 Artist Portfolio Platform

A responsive React and TypeScript portfolio site for showcasing artwork, artist services, and inquiry flows. The frontend is now structured as a multi-section single-page experience with dedicated routes for gallery and inquiry pages.

## ✅ Current Status

The frontend is largely implemented and organized into feature-based sections. The main experience includes:

- a polished home page with hero, gallery preview, about, programs, work-with-me, and contact sections
- a gallery page with category filtering and artwork detail modal views
- dedicated inquiry routes for purchase and custom artwork requests
- responsive navigation, footer, and shared UI components

### What is completed

- Project setup with Vite + React + TypeScript
- Tailwind-based styling and shared component structure
- Route-based navigation for home, gallery, programs, and inquiry pages
- Responsive layout and section-based page composition

### What is still pending

- backend/API integration for live artwork and category data
- CMS or admin management flow
- production deployment setup
- automated tests

## 🛠 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form + Zod

### Project Structure

```text
apps/
└── web/
    ├── src/
    │   ├── core/              # layout, router, shared UI, types, data
    │   ├── features/          # page-level feature modules
    │   └── main.tsx           # app entry point
```

## 🚀 Getting Started

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
cd apps/web
pnpm dev
```

### Build for production

```bash
cd apps/web
pnpm build
```

## 📋 Frontend Review Summary

The project is in a solid state structurally, with a clear separation between shared app infrastructure and feature modules. The main frontend work is mostly complete, but it still needs backend connectivity and a few production-readiness improvements before it can be considered fully finished.

## 📝 Commit Convention

Use the following commit types:

| Type | Use when... | Example |
|------|-------------|---------|
| `feat` | Adding a new feature | `feat: add artwork gallery` |
| `fix` | Fixing a bug | `fix: resolve navbar overlap` |
| `refactor` | Improving structure without changing behavior | `refactor: split gallery logic` |
| `chore` | Maintenance and tooling | `chore: update Vite config` |
| `docs` | Updating documentation | `docs: update README` |

## 📄 License

No license has been set for this project yet.