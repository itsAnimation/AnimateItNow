/**
 * Universal Navbar Theme Manager
 * Handles theme toggle functionality across all pages
 */

class NavbarThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupThemeToggle());
        } else {
            this.setupThemeToggle();
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        // Initialize theme from localStorage or system preference
        this.initializeTheme();

        // Add click event listener
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Setup mobile menu toggle
        this.setupMobileMenu();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
        
        this.setTheme(isDark);
    }

    setTheme(isDark) {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        // Toggle dark theme class
        body.classList.toggle('dark-theme', isDark);
        body.classList.toggle('dark', isDark); // For backward compatibility

        // Update theme toggle icon
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        // Save theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Dispatch custom event for other scripts that might need to react
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { isDark: isDark } 
        }));
    }

    toggleTheme() {
        const isCurrentlyDark = document.body.classList.contains('dark-theme') || 
                               document.body.classList.contains('dark');
        this.setTheme(!isCurrentlyDark);
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
                

                // Swap icon
            if (navLinks.classList.contains('active')) {
                hamburgerIcon.src = "svg/close.svg"; // menu open → show close
            } else {
                hamburgerIcon.src = "svg/hamburger.svg"; // menu closed → show hamburger
            }
        });

 

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburgerIcon.src = "svg/hamburger.svg";
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburgerIcon.src = "svg/hamburger.svg";
                }
            });
        }
    }

    // Public method to get current theme
    getCurrentTheme() {
        return document.body.classList.contains('dark-theme') || 
               document.body.classList.contains('dark') ? 'dark' : 'light';
    }

    // Public method to set theme programmatically
    setThemeProgrammatically(theme) {
        this.setTheme(theme === 'dark');
    }
}

// Initialize the theme manager
const navbarThemeManager = new NavbarThemeManager();

// Make it globally available
window.NavbarThemeManager = navbarThemeManager;
