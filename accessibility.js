/* ===================================
   ACCESSIBILITY CONTROLS FOR ANIMATIONS
   Reduce Motion Support for AnimateItNow
   =================================== */

/**
 * Reduced Motion Controller
 * Handles both system preferences and manual toggle for animation control
 */
(function() {
  'use strict';

  // Global utility function to check if reduced motion is active
  window.prefersReducedMotion = function() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const userPreference = localStorage.getItem('reduceMotion');
    const hasReducedMotionClass = document.body.classList.contains('reduced-motion');
    
    return mediaQuery.matches || userPreference === 'true' || hasReducedMotionClass;
  };

  /**
   * Initialize reduced motion controls
   */
  function initReducedMotion() {
    const toggle = document.getElementById('reduceMotionToggle');
    if (!toggle) return;

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Load saved user preference or use system preference
    const savedPreference = localStorage.getItem('reduceMotion');
    let isReducedMotion = savedPreference !== null 
      ? JSON.parse(savedPreference) 
      : mediaQuery.matches;

    // Set initial state
    toggle.checked = isReducedMotion;
    applyReducedMotion(isReducedMotion);

    // Handle toggle changes
    toggle.addEventListener('change', function() {
      const isChecked = this.checked;
      localStorage.setItem('reduceMotion', JSON.stringify(isChecked));
      applyReducedMotion(isChecked);
      showFeedback(isChecked);
    });

    // Listen for system preference changes
    mediaQuery.addEventListener('change', function(e) {
      // Only apply system preference if user hasn't manually set a preference
      if (localStorage.getItem('reduceMotion') === null) {
        toggle.checked = e.matches;
        applyReducedMotion(e.matches);
      }
    });
  }

  /**
   * Apply or remove reduced motion class and handle JS animations
   * @param {boolean} reduce - Whether to reduce motion
   */
  function applyReducedMotion(reduce) {
    const body = document.body;
    
    if (reduce) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }

    // Handle JavaScript-powered animations
    handleJSAnimations(reduce);
  }

  /**
   * Handle JavaScript-based animations and interactive elements
   * @param {boolean} reduce - Whether to reduce motion
   */
  function handleJSAnimations(reduce) {
    // Disable snake cursor if reduced motion is active
    const cursorToggle = document.getElementById('cursorToggle');
    if (cursorToggle) {
      if (reduce) {
        // Disable snake cursor
        if (cursorToggle.checked) {
          cursorToggle.click(); // Trigger existing logic to disable
        }
        cursorToggle.disabled = true;
        cursorToggle.parentElement.style.opacity = '0.5';
        cursorToggle.parentElement.title = 'Snake cursor disabled due to reduced motion setting';
      } else {
        // Re-enable snake cursor toggle
        cursorToggle.disabled = false;
        cursorToggle.parentElement.style.opacity = '1';
        cursorToggle.parentElement.title = 'Toggle Snake Cursor';
      }
    }

    // Handle Swiper carousel if present
    if (window.swiper) {
      if (reduce) {
        window.swiper.autoplay?.stop();
        window.swiper.disable();
      } else {
        window.swiper.enable();
        window.swiper.autoplay?.start();
      }
    }

    // Handle scroll behavior
    document.documentElement.style.scrollBehavior = reduce ? 'auto' : 'smooth';

    // Disable auto-scroll animations
    const progressBar = document.getElementById('progress-bar');
    if (progressBar && reduce) {
      progressBar.style.animation = 'none';
    }
  }

  /**
   * Show user feedback when toggle is changed
   * @param {boolean} isEnabled - Whether reduced motion is enabled
   */
  function showFeedback(isEnabled) {
    const message = isEnabled 
      ? 'Animations reduced for accessibility' 
      : 'Animations restored';
    
    // Use existing toast function if available
    if (typeof showToast === 'function') {
      showToast(message);
      return;
    }

    // Create simple feedback notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.style.opacity = '1', 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReducedMotion);
  } else {
    initReducedMotion();
  }

  // Apply initial state on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const savedPreference = localStorage.getItem('reduceMotion');
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const shouldReduce = savedPreference !== null 
        ? JSON.parse(savedPreference) 
        : mediaQuery.matches;
      
      if (shouldReduce) {
        document.body.classList.add('reduced-motion');
      }
    });
  } else {
    const savedPreference = localStorage.getItem('reduceMotion');
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldReduce = savedPreference !== null 
      ? JSON.parse(savedPreference) 
      : mediaQuery.matches;
    
    if (shouldReduce) {
      document.body.classList.add('reduced-motion');
    }
  }

})();