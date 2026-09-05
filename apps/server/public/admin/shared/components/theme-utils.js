/**
 * Theme Management Utility
 *
 * Provides reusable theme functions for admin panel.
 * This file can be imported independently for theme management outside the header component.
 */

/**
 * Get user initials from full name
 * @param {string} name - Full name (e.g., "John Doe")
 * @returns {string} Initials (e.g., "JD")
 *
 * Examples:
 *   getUserInitials("John Doe") => "JD"
 *   getUserInitials("John") => "J"
 *   getUserInitials("John Michael Doe") => "JD"
 *   getUserInitials("  John   Doe  ") => "JD"
 *   getUserInitials("") => "?"
 */
function getUserInitials(name) {
    if (!name || typeof name !== 'string') return '?';

    // Split by whitespace and filter empty strings
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return '?';
    if (words.length === 1) return words[0][0].toUpperCase();

    // Take first letter of first and last word
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Get stored theme preference
 * @returns {string} 'light', 'dark', or 'system'
 */
function getStoredTheme() {
    const stored = localStorage.getItem('admin-theme');
    if (['light', 'dark', 'system'].includes(stored)) {
        return stored;
    }
    return 'system'; // Default to system preference
}

/**
 * Get effective theme (resolves 'system' to actual theme)
 * @param {string} theme - Theme preference ('light', 'dark', or 'system')
 * @returns {string} 'light' or 'dark'
 */
function getEffectiveTheme(theme) {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
}

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply ('light', 'dark', or 'system')
 */
function applyTheme(theme) {
    localStorage.setItem('admin-theme', theme);
    const effectiveTheme = getEffectiveTheme(theme);
    document.documentElement.setAttribute('data-bs-theme', effectiveTheme);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme, effectiveTheme }
    }));
}

/**
 * Cycle through theme modes
 * @returns {string} New theme
 */
function cycleTheme() {
    const current = getStoredTheme();
    const themeOrder = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(current);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    applyTheme(nextTheme);
    return nextTheme;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUserInitials,
        getStoredTheme,
        getEffectiveTheme,
        applyTheme,
        cycleTheme
    };
}
