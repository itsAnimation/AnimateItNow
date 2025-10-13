/**
 * Theme Manager - Unified theme management system for the entire application
 * Handles theme switching, persistence, and system preference detection
 */

class ThemeManager {
    constructor() {
        this.theme = 'light'; // default theme
        this.init();
    }

    /**
     * Initialize the theme manager
     */
    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        
        // Check for system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if user hasn't explicitly set a theme
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Set up theme toggle listeners
        this.setupThemeToggle();
    }

    /**
     * Set the theme for the entire application
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme(theme) {
        this.theme = theme;
        
        // Update CSS variables
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.remove('dark');
        }
        
        // Update theme toggle icons
        this.updateThemeToggleIcons();
        
        // Save preference
        localStorage.setItem('theme', theme);
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    }

    /**
     * Update all theme toggle icons in the application
     */
    updateThemeToggleIcons() {
        // Update all theme toggle buttons
        const themeToggles = document.querySelectorAll('#theme-toggle, .theme-toggle');
        
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                if (this.theme === 'dark') {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
        });
    }

    /**
     * Set up event listeners for theme toggle buttons
     */
    setupThemeToggle() {
        // Listen for clicks on theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle') || e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });
    }

    /**
     * Get the current theme
     * @returns {string} - 'light' or 'dark'
     */
    getTheme() {
        return this.theme;
    }

    /**
     * Check if dark theme is active
     * @returns {boolean}
     */
    isDark() {
        return this.theme === 'dark';
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}