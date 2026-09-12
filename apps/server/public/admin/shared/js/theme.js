/**
 * Theme Management Utility
 */

export function getStoredTheme() {
    const stored = localStorage.getItem('admin-theme');
    return ['light', 'dark', 'system'].includes(stored) ? stored : 'system';
}

export function getEffectiveTheme(theme = getStoredTheme()) {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
}

export function applyTheme(theme) {
    localStorage.setItem('admin-theme', theme);
    const effectiveTheme = getEffectiveTheme(theme);
    
    // Set Bootstrap / Tabler CSS theme attribute on root <html> element
    document.documentElement.setAttribute('data-bs-theme', effectiveTheme);

    // Update Theme Toggle Button Icon visually
    updateToggleIcon(theme, effectiveTheme);

    // Dispatch global event for optional dynamic charts or components
    window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme, effectiveTheme }
    }));
}

export function cycleTheme() {
    const current = getStoredTheme();
    const themeOrder = ['light', 'dark', 'system'];
    const nextTheme = themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length];
    applyTheme(nextTheme);
    return nextTheme;
}

/**
 * Updates icon on #themeToggle button
 */
function updateToggleIcon(theme, effectiveTheme) {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    if (!icon) return;

    // Set icon based on current mode setting
    if (theme === 'system') {
        icon.className = 'ti ti-device-desktop';
        toggleBtn.title = 'Theme: System (Auto)';
    } else if (effectiveTheme === 'dark') {
        icon.className = 'ti ti-moon';
        toggleBtn.title = 'Theme: Dark';
    } else {
        icon.className = 'ti ti-sun';
        toggleBtn.title = 'Theme: Light';
    }
}

/**
 * Initialize theme listeners on DOM Load
 */
export function initTheme() {
    // 1. Apply saved theme on boot
    applyTheme(getStoredTheme());

    // 2. Attach click listener to theme button
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#themeToggle');
        if (toggleBtn) {
            e.preventDefault();
            cycleTheme();
        }
    });

    // 3. Listen for System Theme OS changes dynamically
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getStoredTheme() === 'system') {
            applyTheme('system');
        }
    });
}

// Auto-run initialization if script loaded directly
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initTheme);
}