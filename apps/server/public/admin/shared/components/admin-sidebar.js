/**
 * Admin Sidebar Component
 *
 * A reusable sidebar navigation component for the admin panel.
 *
 * Usage:
 *   <admin-sidebar active="dashboard"></admin-sidebar>
 *   <admin-sidebar active="users"></admin-sidebar>
 *
 * Attributes:
 *   - active: Current active page ('dashboard', 'users', 'content', 'settings')
 */
class AdminSidebar extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active') || 'dashboard';
        this.render(activePage);
        this.initSidebarToggle();
    }

    render(activePage) {
        this.innerHTML = `
            <button class="sidebar-toggle" type="button" id="sidebarToggle"
                    aria-expanded="true" aria-label="Hide sidebar" title="Hide sidebar">
                <i class="ti ti-layout-sidebar-left-collapse"></i>
            </button>
            <aside class="admin-sidebar-panel" aria-label="Admin sidebar">
                <div class="sidebar-brand">
                    <a href="/admin" aria-label="Artist Portfolio Admin home">
                        <img src="/admin/assets/logo_white.png" alt="Artist Portfolio Admin" height="32">
                    </a>
                </div>
                <nav class="navbar-collapse" id="sidebar-menu" aria-label="Admin navigation">
                    <ul class="navbar-nav">
                            <li class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
                                <a class="nav-link" href="/admin/dashboard">
                                    <span class="nav-link-icon">
                                        <i class="ti ti-layout-dashboard"></i>
                                    </span>
                                    <span class="nav-link-title">Dashboard</span>
                                </a>
                            </li>

                            <li class="nav-item ${activePage === 'users' ? 'active' : ''}">
                                <a class="nav-link" href="/admin/users">
                                    <span class="nav-link-icon">
                                        <i class="ti ti-users"></i>
                                    </span>
                                    <span class="nav-link-title">Users</span>
                                </a>
                            </li>

                            <li class="nav-item ${activePage === 'content' ? 'active' : ''}">
                                <a class="nav-link" href="/admin/content">
                                    <span class="nav-link-icon">
                                        <i class="ti ti-files"></i>
                                    </span>
                                    <span class="nav-link-title">Content</span>
                                </a>
                            </li>

                            <li class="nav-item ${activePage === 'artworks' ? 'active' : ''}">
                                <a class="nav-link" href="/admin/artworks">
                                    <span class="nav-link-icon">
                                        <i class="ti ti-photo"></i>
                                    </span>
                                    <span class="nav-link-title">Artworks</span>
                                </a>
                            </li>

                            <li class="nav-item ${activePage === 'orders' ? 'active' : ''}">
                                <a class="nav-link" href="/admin/orders">
                                    <span class="nav-link-icon">
                                        <i class="ti ti-shopping-cart"></i>
                                    </span>
                                    <span class="nav-link-title">Orders</span>
                                </a>
                            </li>

                            <li class="nav-item ${activePage === 'analytics' ? 'active' : ''}">
                                <a class="nav-link" href="/admin/analytics">
                                    <span class="nav-link-icon">
                                        <i class="ti ti-chart-bar"></i>
                                    </span>
                                    <span class="nav-link-title">Analytics</span>
                                </a>
                            </li>

                            <li class="nav-item-divider"></li>

                            <li class="nav-item ${activePage === 'settings' ? 'active' : ''}">
                                <a class="nav-link" href="/admin/settings">
                                    <span class="nav-link-icon">
                                        <i class="ti ti-settings"></i>
                                    </span>
                                    <span class="nav-link-title">Settings</span>
                                </a>
                            </li>
                    </ul>
                </nav>
            </aside>
        `;
    }

    initSidebarToggle() {
        const toggle = this.querySelector('#sidebarToggle');
        const layout = document.querySelector('.dashboard-layout');
        if (!toggle || !layout) return;

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            const isCollapsed = layout.classList.toggle('sidebar-collapsed');
            toggle.setAttribute('aria-expanded', String(!isCollapsed));
            toggle.setAttribute('aria-label', isCollapsed ? 'Show sidebar' : 'Hide sidebar');
            toggle.setAttribute('title', isCollapsed ? 'Show sidebar' : 'Hide sidebar');
            toggle.querySelector('i').className = `ti ti-layout-sidebar-left-${isCollapsed ? 'expand' : 'collapse'}`;
        });
    }

}

// Register the custom element
customElements.define('admin-sidebar', AdminSidebar);
