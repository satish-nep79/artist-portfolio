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
    }

    render(activePage) {
        this.innerHTML = `
            <aside class="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
                <div class="container-fluid">
                    <!-- Logo -->
                    <h1 class="navbar-brand navbar-brand-autodark">
                        <a href="/admin">
                            <img src="/admin/assets/logo_white.png" alt="Admin Panel" height="32">
                        </a>
                    </h1>

                    <!-- Mobile menu button -->
                    <button class="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#sidebar-menu"
                            aria-controls="sidebar-menu"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <!-- Sidebar navigation -->
                    <div class="collapse navbar-collapse" id="sidebar-menu">
                        <ul class="navbar-nav pt-lg-3">
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
                    </div>
                </div>
            </aside>
        `;
    }
}

// Register the custom element
customElements.define('admin-sidebar', AdminSidebar);
