/**
 * Admin Header Web Component
 *
 * A Tabler-based admin header with logo, theme switcher, and user profile dropdown.
 *
 * Usage:
 *   <admin-header></admin-header>                    // Full header with all features
 *   <admin-header type="simple"></admin-header>      // Simple header (logo + theme toggle only)
 *
 * Features:
 *   - Three-state theme toggle: Light → Dark → System
 *   - User profile dropdown with keyboard accessibility
 *   - localStorage theme persistence
 *   - Fully responsive design
 *   - Tabler icons and styling
 *
 * Attributes:
 *   - type: 'default' or 'simple'
 *   - user-name: Optional user name (default: "John Doe")
 */
class AdminHeader extends HTMLElement {
    constructor() {
        super();
        this.theme = this.getStoredTheme();
        this.userName = this.getAttribute('user-name') || 'John Doe';
    }

    connectedCallback() {
        const type = this.getAttribute('type') || 'default';

        // Apply theme before rendering
        this.applyTheme(this.theme);

        if (type === 'simple') {
            this.renderSimpleHeader();
        } else {
            this.renderFullHeader();
        }

        // Initialize interactive elements
        this.initThemeToggle();
        if (type !== 'simple') {
            this.initProfileDropdown();
        }
    }

    /**
     * Get stored theme preference
     * Returns: 'light', 'dark', or 'system'
     */
    getStoredTheme() {
        const stored = localStorage.getItem('admin-theme');
        if (['light', 'dark', 'system'].includes(stored)) {
            return stored;
        }
        return 'system'; // Default to system preference
    }

    /**
     * Get effective theme (resolves 'system' to actual theme)
     */
    getEffectiveTheme() {
        if (this.theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.theme;
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        this.theme = theme;
        localStorage.setItem('admin-theme', theme);

        const effectiveTheme = this.getEffectiveTheme();
        document.documentElement.setAttribute('data-bs-theme', effectiveTheme);

        // Update icon if already rendered
        this.updateThemeIcon();

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme, effectiveTheme }
        }));
    }

    /**
     * Cycle through theme modes: light → dark → system → light
     */
    cycleTheme() {
        const themeOrder = ['light', 'dark', 'system'];
        const currentIndex = themeOrder.indexOf(this.theme);
        const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
        this.applyTheme(nextTheme);
    }

    /**
     * Get theme icon and label based on current theme
     */
    getThemeIconData() {
        const icons = {
            light: { icon: 'ti-sun', label: 'Light mode', title: 'Switch to dark mode' },
            dark: { icon: 'ti-moon', label: 'Dark mode', title: 'Switch to system mode' },
            system: { icon: 'ti-device-desktop', label: 'System mode', title: 'Switch to light mode' }
        };

        return icons[this.theme];
    }

    /**
     * Update theme toggle icon
     */
    updateThemeIcon() {
        const themeToggle = this.querySelector('#themeToggle');
        if (!themeToggle) return;

        const iconData = this.getThemeIconData();
        const icon = themeToggle.querySelector('i');

        if (icon) {
            icon.className = `ti ${iconData.icon}`;
        }

        themeToggle.setAttribute('title', iconData.title);
        themeToggle.setAttribute('aria-label', iconData.title);
    }

    /**
     * Initialize theme toggle button
     */
    initThemeToggle() {
        const themeToggle = this.querySelector('#themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.cycleTheme();
            });
            this.updateThemeIcon();
        }

        // Listen for system theme changes when in system mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (this.theme === 'system') {
                this.applyTheme('system');
            }
        });
    }

    /**
     * Get user initials from name
     */
    getUserInitials(name) {
        if (!name || typeof name !== 'string') return '?';

        const words = name.trim().split(/\s+/).filter(Boolean);

        if (words.length === 0) return '?';
        if (words.length === 1) return words[0][0].toUpperCase();

        // Take first letter of first and last word
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }

    /**
     * Initialize profile dropdown
     */
    initProfileDropdown() {
        const profileBtn = this.querySelector('#profileDropdownBtn');
        const dropdown = this.querySelector('#profileDropdown');

        if (!profileBtn || !dropdown) return;

        // Toggle dropdown
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = dropdown.classList.contains('show');
            this.closeDropdown();

            if (!isOpen) {
                dropdown.classList.add('show');
                profileBtn.classList.add('show');
                profileBtn.setAttribute('aria-expanded', 'true');
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
                profileBtn.focus();
            }
        });

        // Keyboard navigation within dropdown
        dropdown.addEventListener('keydown', (e) => {
            const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
            const currentIndex = items.indexOf(document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                items[nextIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                items[prevIndex]?.focus();
            }
        });
    }

    /**
     * Close profile dropdown
     */
    closeDropdown() {
        const profileBtn = this.querySelector('#profileDropdownBtn');
        const dropdown = this.querySelector('#profileDropdown');

        if (dropdown && profileBtn) {
            dropdown.classList.remove('show');
            profileBtn.classList.remove('show');
            profileBtn.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Render full header (logo + theme + profile)
     */
    renderFullHeader() {
        const initials = this.getUserInitials(this.userName);
        const iconData = this.getThemeIconData();

        this.innerHTML = `
            <header class="navbar navbar-expand-md d-print-none" data-bs-theme="">
                <div class="container-xl">
                    <!-- Logo -->
                    <a href="/admin" class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                        <img src="/admin/assets/logo_normal.png" alt="Admin Logo" height="32" class="navbar-brand-image">
                    </a>

                    <!-- Right side controls -->
                    <div class="navbar-nav flex-row order-md-last">
                        <!-- Theme Toggle -->
                        <div class="nav-item">
                            <a href="#"
                               id="themeToggle"
                               class="nav-link px-0 px-md-2"
                               title="${iconData.title}"
                               aria-label="${iconData.title}">
                                <i class="ti ${iconData.icon}"></i>
                            </a>
                        </div>

                        <!-- User Profile Dropdown -->
                        <div class="nav-item dropdown">
                            <a href="#"
                               id="profileDropdownBtn"
                               class="nav-link d-flex lh-1 text-reset p-0 ps-2"
                               role="button"
                               aria-haspopup="true"
                               aria-expanded="false">
                                <span class="avatar avatar-sm">${initials}</span>
                                <div class="d-none d-xl-block ps-2">
                                    <div>${this.userName}</div>
                                </div>
                            </a>

                            <div id="profileDropdown"
                                 class="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                                 aria-labelledby="profileDropdownBtn">
                                <a class="dropdown-item" href="/admin/profile">
                                    <i class="ti ti-user me-2"></i>
                                    Profile
                                </a>
                                <a class="dropdown-item" href="/admin/change-password">
                                    <i class="ti ti-lock me-2"></i>
                                    Change Password
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/admin/logout">
                                    <i class="ti ti-logout me-2"></i>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    /**
     * Render simple header (logo + theme toggle only)
     */
    renderSimpleHeader() {
        const iconData = this.getThemeIconData();

        this.innerHTML = `
            <header class="navbar navbar-expand-md d-print-none" data-bs-theme="">
                <div class="container-xl">
                    <!-- Logo on the left -->
                    <a href="/admin" class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                        <img src="/admin/assets/logo_normal.png" alt="Admin Logo" height="32" class="navbar-brand-image">
                    </a>

                    <!-- Theme Toggle on the right -->
                    <div class="navbar-nav flex-row order-md-last ms-auto">
                        <div class="nav-item">
                            <a href="#"
                               id="themeToggle"
                               class="nav-link px-0"
                               title="${iconData.title}"
                               aria-label="${iconData.title}">
                                <i class="ti ${iconData.icon}"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
}

// Register the custom element
customElements.define('admin-header', AdminHeader);
