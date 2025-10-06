// Component Documentation System JavaScript

/**
 * Main class for managing component documentation
 * Handles loading, filtering, and displaying UI components
 */
class ComponentDocumentation {
    /**
     * Initialize the component documentation system
     */
    constructor() {
        this.components = [];
        this.filteredComponents = [];
        this.currentView = 'grid';
        this.activeFilters = {
            category: 'all',
            complexity: 'all',
            search: ''
        };

        this.init();
    }

    /**
     * Initialize the system
     * Sets up components, event listeners, and renders initial view
     */
    init() {
        this.loadComponents();
        this.setupEventListeners();
        this.renderComponents();
    }

    /**
     * Load all available components into the system
     * Each component includes metadata, preview, and implementation details
     */
    loadComponents() {
        this.components = [
            {
                id: 'animated-button',
                title: 'Animated Button',
                description: 'Interactive button with hover effects and smooth animations',
                category: 'buttons',
                complexity: 'beginner',
                tags: ['hover', 'animation', 'interactive'],
                preview: this.createButtonPreview(),
                html: `<button class="animated-btn">
  <span class="btn-text">Click Me</span>
  <span class="btn-icon">→</span>
</button>`,
                css: `.animated-btn {
  position: relative;
  padding: 12px 24px;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.animated-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon {
  transform: translateX(4px);
}`,
                js: '',
                usage: `
<h3>Basic Usage</h3>
<p>Simply add the animated-btn class to any button element:</p>
<pre><code>&lt;button class="animated-btn"&gt;Your Text&lt;/button&gt;</code></pre>

<h3>Best Practices</h3>
<ul>
  <li>Use for primary call-to-action buttons</li>
  <li>Ensure sufficient color contrast for accessibility</li>
  <li>Test hover states on touch devices</li>
  <li>Consider reduced motion preferences</li>
</ul>

<h3>Accessibility</h3>
<ul>
  <li>Always include descriptive button text</li>
  <li>Add aria-label for icon-only buttons</li>
  <li>Ensure keyboard navigation works properly</li>
</ul>`,
                customization: `
<h3>Color Customization</h3>
<p>Modify the gradient colors by changing the background property:</p>
<pre><code>background: linear-gradient(45deg, #your-color-1, #your-color-2);</code></pre>

<h3>Size Variations</h3>
<p>Adjust padding and font-size for different button sizes:</p>
<ul>
  <li>Small: padding: 8px 16px; font-size: 0.875rem;</li>
  <li>Medium: padding: 12px 24px; font-size: 1rem;</li>
  <li>Large: padding: 16px 32px; font-size: 1.125rem;</li>
</ul>

<h3>Animation Speed</h3>
<p>Control animation duration with the transition property:</p>
<pre><code>transition: all 0.2s ease; /* Faster */
transition: all 0.5s ease; /* Slower */</code></pre>`
            },
            {
                id: 'card-hover',
                title: 'Card Hover Effect',
                description: 'Elegant card component with smooth hover animations and shadow effects',
                category: 'cards',
                complexity: 'intermediate',
                tags: ['hover', 'shadow', 'transform'],
                preview: this.createCardPreview(),
                html: `<div class="hover-card">
  <div class="card-image">
    <img src="https://via.placeholder.com/300x200" alt="Card image">
  </div>
  <div class="card-content">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">This is a beautiful card with hover effects.</p>
    <button class="card-button">Learn More</button>
  </div>
</div>`,
                css: `.hover-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  max-width: 300px;
}

.hover-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-image {
  overflow: hidden;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hover-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.card-description {
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.card-button:hover {
  background: #e55555;
}`,
                js: '',
                usage: `
<h3>Basic Usage</h3>
<p>Create a card with image, content, and interactive elements:</p>
<pre><code>&lt;div class="hover-card"&gt;
  &lt;div class="card-image"&gt;...&lt;/div&gt;
  &lt;div class="card-content"&gt;...&lt;/div&gt;
&lt;/div&gt;</code></pre>

<h3>Layout Considerations</h3>
<ul>
  <li>Works well in grid layouts</li>
  <li>Responsive by default</li>
  <li>Maintains aspect ratio</li>
</ul>

<h3>Content Guidelines</h3>
<ul>
  <li>Keep titles concise (1-2 lines)</li>
  <li>Limit descriptions to 2-3 lines</li>
  <li>Use high-quality images</li>
</ul>`,
                customization: `
<h3>Card Dimensions</h3>
<p>Adjust max-width and height for different card sizes:</p>
<pre><code>max-width: 250px; /* Smaller cards */
max-width: 400px; /* Larger cards */</code></pre>

<h3>Hover Effects</h3>
<p>Customize the hover transform and shadow:</p>
<pre><code>transform: translateY(-12px); /* More lift */
transform: scale(1.02); /* Scale effect */</code></pre>

<h3>Color Schemes</h3>
<p>Adapt colors to match your brand:</p>
<ul>
  <li>Background: Change the card background color</li>
  <li>Text: Modify title and description colors</li>
  <li>Button: Update button background and hover states</li>
</ul>`
            },
            {
                id: 'glassmorphism-form',
                title: 'Glassmorphism Form',
                description: 'Modern form with glassmorphism design and smooth animations',
                category: 'forms',
                complexity: 'advanced',
                tags: ['glassmorphism', 'form', 'modern'],
                preview: this.createFormPreview(),
                html: `<form class="glass-form">
  <h2 class="form-title">Sign In</h2>
  <div class="form-group">
    <input type="email" id="email" required>
    <label for="email">Email</label>
  </div>
  <div class="form-group">
    <input type="password" id="password" required>
    <label for="password">Password</label>
  </div>
  <button type="submit" class="glass-button">Sign In</button>
</form>`,
                css: `.glass-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.form-group label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  pointer-events: none;
}

.form-group input:focus + label,
.form-group input:valid + label {
  top: -0.5rem;
  left: 0.5rem;
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 0 0.5rem;
  border-radius: 4px;
}

.glass-button {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.8);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 107, 107, 1);
  transform: translateY(-2px);
}`,
                js: '',
                usage: `
<h3>Implementation</h3>
<p>Best used with a background image or gradient for the glass effect:</p>
<pre><code>body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}</code></pre>

<h3>Form Validation</h3>
<ul>
  <li>Use HTML5 validation attributes</li>
  <li>Add JavaScript for custom validation</li>
  <li>Provide clear error messages</li>
</ul>

<h3>Accessibility</h3>
<ul>
  <li>Ensure sufficient contrast ratios</li>
  <li>Use proper label associations</li>
  <li>Support keyboard navigation</li>
</ul>`,
                customization: `
<h3>Glass Effect Intensity</h3>
<p>Adjust the backdrop-filter blur value:</p>
<pre><code>backdrop-filter: blur(5px);  /* Subtle */
backdrop-filter: blur(15px); /* Strong */</code></pre>

<h3>Transparency Levels</h3>
<p>Modify the alpha values in rgba colors:</p>
<pre><code>background: rgba(255, 255, 255, 0.05); /* More transparent */
background: rgba(255, 255, 255, 0.2);  /* Less transparent */</code></pre>

<h3>Color Themes</h3>
<p>Change the accent color for buttons and focus states:</p>
<ul>
  <li>Blue theme: rgba(66, 153, 225, 0.8)</li>
  <li>Green theme: rgba(72, 187, 120, 0.8)</li>
  <li>Purple theme: rgba(159, 122, 234, 0.8)</li>
</ul>`
            },
            {
                id: 'navigation-menu',
                title: 'Responsive Navigation',
                description: 'Mobile-friendly navigation menu with smooth animations',
                category: 'navigation',
                complexity: 'intermediate',
                tags: ['responsive', 'mobile', 'hamburger'],
                preview: this.createNavPreview(),
                html: `<nav class="responsive-nav">
  <div class="nav-brand">
    <img src="logo.png" alt="Logo" class="nav-logo">
    <span class="brand-text">Brand</span>
  </div>
  <button class="nav-toggle" aria-label="Toggle navigation">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <ul class="nav-menu">
    <li><a href="#" class="nav-link">Home</a></li>
    <li><a href="#" class="nav-link">About</a></li>
    <li><a href="#" class="nav-link">Services</a></li>
    <li><a href="#" class="nav-link">Contact</a></li>
  </ul>
</nav>`,
                css: `.responsive-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-logo {
  width: 40px;
  height: 40px;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: #1a202c;
  margin: 3px 0;
  transition: 0.3s;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #ff6b6b;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #ff6b6b;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-toggle.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }

  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }

  .nav-toggle.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
}`,
                js: `// Navigation toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});`,
                usage: `
<h3>Basic Implementation</h3>
<p>Include the HTML structure and add the JavaScript for mobile functionality:</p>
<pre><code>&lt;script src="navigation.js"&gt;&lt;/script&gt;</code></pre>

<h3>Responsive Behavior</h3>
<ul>
  <li>Desktop: Horizontal menu layout</li>
  <li>Mobile: Collapsible hamburger menu</li>
  <li>Smooth transitions between states</li>
</ul>

<h3>Accessibility Features</h3>
<ul>
  <li>Keyboard navigation support</li>
  <li>ARIA labels for screen readers</li>
  <li>Focus management</li>
</ul>`,
                customization: `
<h3>Breakpoint Customization</h3>
<p>Change the mobile breakpoint in the media query:</p>
<pre><code>@media (max-width: 992px) { /* Tablet breakpoint */
@media (max-width: 576px) { /* Small mobile */</code></pre>

<h3>Animation Timing</h3>
<p>Adjust transition durations:</p>
<pre><code>transition: all 0.2s ease; /* Faster */
transition: all 0.5s ease; /* Slower */</code></pre>

<h3>Color Customization</h3>
<ul>
  <li>Background: Change nav background color</li>
  <li>Links: Modify text and hover colors</li>
  <li>Hamburger: Update hamburger icon color</li>
</ul>`
            },
            {
                id: 'loading-spinner',
                title: 'Loading Spinner',
                description: 'Smooth CSS-only loading spinner with multiple variations',
                category: 'animations',
                complexity: 'beginner',
                tags: ['loading', 'spinner', 'css-only'],
                preview: this.createSpinnerPreview(),
                html: `<div class="spinner-container">
  <div class="spinner"></div>
  <p class="loading-text">Loading...</p>
</div>`,
                css: `.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #4a5568;
  font-size: 0.875rem;
  margin: 0;
}

/* Alternative spinner styles */
.spinner-dots {
  display: flex;
  gap: 0.25rem;
}

.spinner-dots div {
  width: 8px;
  height: 8px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.spinner-dots div:nth-child(1) { animation-delay: -0.32s; }
.spinner-dots div:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.spinner-pulse {
  width: 40px;
  height: 40px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}`,
                js: '',
                usage: `
<h3>Basic Usage</h3>
<p>Show during loading states:</p>
<pre><code>&lt;div class="spinner-container"&gt;
  &lt;div class="spinner"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>

<h3>JavaScript Integration</h3>
<pre><code>// Show spinner
document.querySelector('.spinner-container').style.display = 'flex';

// Hide spinner
document.querySelector('.spinner-container').style.display = 'none';</code></pre>

<h3>Best Practices</h3>
<ul>
  <li>Use during async operations</li>
  <li>Provide loading text for context</li>
  <li>Consider reduced motion preferences</li>
</ul>`,
                customization: `
<h3>Size Variations</h3>
<p>Adjust spinner dimensions:</p>
<pre><code>/* Small */
width: 20px; height: 20px; border-width: 2px;

/* Large */
width: 60px; height: 60px; border-width: 6px;</code></pre>

<h3>Color Themes</h3>
<p>Change spinner colors:</p>
<pre><code>border-top-color: #3182ce; /* Blue */
border-top-color: #38a169; /* Green */
border-top-color: #9f7aea; /* Purple */</code></pre>

<h3>Animation Speed</h3>
<p>Control rotation speed:</p>
<pre><code>animation: spin 0.5s linear infinite; /* Faster */
animation: spin 2s linear infinite;   /* Slower */</code></pre>`
            }
        ];

        this.filteredComponents = [...this.components];
    }

    // Create preview elements for each component
    createButtonPreview() {
        return `<button style="padding: 8px 16px; background: linear-gradient(45deg, #ff6b6b, #feca57); border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Preview Button</button>`;
    }

    createCardPreview() {
        return `<div style="background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 200px; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="width: 100%; height: 60px; background: linear-gradient(45deg, #ff6b6b, #feca57); border-radius: 4px; margin-bottom: 0.5rem;"></div>
            <h4 style="margin: 0 0 0.25rem 0; font-size: 0.875rem;">Card Title</h4>
            <p style="margin: 0; font-size: 0.75rem; color: #666;">Card description</p>
        </div>`;
    }

    createFormPreview() {
        return `<div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 1rem; max-width: 200px;">
            <h4 style="color: white; margin: 0 0 1rem 0; text-align: center; font-size: 0.875rem;">Sign In</h4>
            <input style="width: 100%; padding: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; margin-bottom: 0.5rem;" placeholder="Email">
            <input style="width: 100%; padding: 0.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; margin-bottom: 0.5rem;" placeholder="Password" type="password">
            <button style="width: 100%; padding: 0.5rem; background: rgba(255,107,107,0.8); border: none; border-radius: 4px; color: white; font-size: 0.75rem;">Sign In</button>
        </div>`;
    }

    createNavPreview() {
        return `<nav style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-size: 0.75rem;">
            <div style="font-weight: 600;">Brand</div>
            <div style="display: flex; gap: 1rem;">
                <a href="#" style="text-decoration: none; color: #666;">Home</a>
                <a href="#" style="text-decoration: none; color: #666;">About</a>
                <a href="#" style="text-decoration: none; color: #666;">Contact</a>
            </div>
        </nav>`;
    }

    createSpinnerPreview() {
        return `<div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #ff6b6b; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span style="font-size: 0.75rem; color: #666;">Loading...</span>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>`;
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        searchInput.addEventListener('input', (e) => {
            this.activeFilters.search = e.target.value.toLowerCase();
            this.filterComponents();
            this.renderComponents();
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.activeFilters.search = '';
            this.filterComponents();
            this.renderComponents();
        });

        // Category filters
        document.getElementById('categoryFilters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Update active button
                document.querySelectorAll('#categoryFilters .filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Update filter
                this.activeFilters.category = e.target.dataset.category;
                this.filterComponents();
                this.renderComponents();
            }
        });

        // Complexity filters
        document.getElementById('complexityFilters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Update active button
                document.querySelectorAll('#complexityFilters .filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Update filter
                this.activeFilters.complexity = e.target.dataset.complexity;
                this.filterComponents();
                this.renderComponents();
            }
        });

        // View toggle
        document.getElementById('gridView').addEventListener('click', () => {
            this.currentView = 'grid';
            this.updateViewButtons();
            this.renderComponents();
        });

        document.getElementById('listView').addEventListener('click', () => {
            this.currentView = 'list';
            this.updateViewButtons();
            this.renderComponents();
        });

        // Modal functionality
        this.setupModalListeners();
    }

    // Filter components based on active filters
    filterComponents() {
        this.filteredComponents = this.components.filter(component => {
            const matchesSearch = this.activeFilters.search === '' || 
                component.title.toLowerCase().includes(this.activeFilters.search) ||
                component.description.toLowerCase().includes(this.activeFilters.search) ||
                component.tags.some(tag => tag.toLowerCase().includes(this.activeFilters.search));

            const matchesCategory = this.activeFilters.category === 'all' || 
                component.category === this.activeFilters.category;

            const matchesComplexity = this.activeFilters.complexity === 'all' || 
                component.complexity === this.activeFilters.complexity;

            return matchesSearch && matchesCategory && matchesComplexity;
        });
    }

    // Update view toggle buttons
    updateViewButtons() {
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(this.currentView + 'View').classList.add('active');
    }

    // Render components grid
    renderComponents() {
        const grid = document.getElementById('componentsGrid');
        const noResults = document.getElementById('noResults');

        // Update grid class for view type
        grid.className = `components-grid ${this.currentView === 'list' ? 'list-view' : ''}`;

        if (this.filteredComponents.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        grid.innerHTML = this.filteredComponents.map(component => `
            <div class="component-card fade-in" data-component-id="${component.id}">
                <div class="card-header">
                    <h3 class="component-title">${component.title}</h3>
                    <span class="component-category">${component.category}</span>
                </div>
                
                <p class="component-description">${component.description}</p>
                
                <div class="component-preview-mini">
                    ${component.preview}
                </div>
                
                <div class="card-footer">
                    <div class="component-tags">
                        ${component.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span class="complexity-badge complexity-${component.complexity}">
                        ${component.complexity}
                    </span>
                </div>
            </div>
        `).join('');

        // Add click listeners to cards
        grid.querySelectorAll('.component-card').forEach(card => {
            card.addEventListener('click', () => {
                const componentId = card.dataset.componentId;
                this.openComponentModal(componentId);
            });
        });
    }

    // Modal functionality
    setupModalListeners() {
        const modal = document.getElementById('componentModal');
        const closeBtn = document.getElementById('modalClose');

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Tab switching
        document.querySelector('.modal-tabs').addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            }
        });

        // Copy code functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-code-btn') || e.target.closest('.copy-code-btn')) {
                const btn = e.target.classList.contains('copy-code-btn') ? e.target : e.target.closest('.copy-code-btn');
                this.copyCode(btn);
            }
        });
    }

    // Open component modal
    openComponentModal(componentId) {
        const component = this.components.find(c => c.id === componentId);
        if (!component) return;

        const modal = document.getElementById('componentModal');
        const modalTitle = document.getElementById('modalTitle');

        // Set modal title
        modalTitle.textContent = component.title;

        // Populate content
        this.populateModalContent(component);

        // Show modal
        modal.classList.add('active');

        // Switch to preview tab by default
        this.switchTab('preview');
    }

    // Populate modal content
    populateModalContent(component) {
        // Preview tab
        document.getElementById('componentPreview').innerHTML = component.preview;

        // Code tab
        document.getElementById('htmlCode').textContent = component.html;
        document.getElementById('cssCode').textContent = component.css;
        
        const jsSection = document.getElementById('jsCodeSection');
        if (component.js) {
            document.getElementById('jsCode').textContent = component.js;
            jsSection.style.display = 'block';
        } else {
            jsSection.style.display = 'none';
        }

        // Usage tab
        document.getElementById('usageContent').innerHTML = component.usage;

        // Customization tab
        document.getElementById('customizationContent').innerHTML = component.customization;

        // Trigger Prism.js syntax highlighting
        if (window.Prism) {
            Prism.highlightAll();
        }
    }

    // Switch modal tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    // Copy code to clipboard
    async copyCode(button) {
        const codeType = button.dataset.codeType;
        let codeElement;

        switch (codeType) {
            case 'html':
                codeElement = document.getElementById('htmlCode');
                break;
            case 'css':
                codeElement = document.getElementById('cssCode');
                break;
            case 'js':
                codeElement = document.getElementById('jsCode');
                break;
            default:
                return;
        }

        try {
            await navigator.clipboard.writeText(codeElement.textContent);
            
            // Visual feedback
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);

        } catch (err) {
            console.error('Failed to copy code:', err);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = codeElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            // Visual feedback
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
        }
    }
}

// Initialize the component documentation system
document.addEventListener('DOMContentLoaded', () => {
    new ComponentDocumentation();
});

// Theme toggle functionality (if not already handled by main script.js)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            if (body.classList.contains('dark')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }

            // Save preference
            localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.remove('dark');
            themeToggle.querySelector('i').className = 'fas fa-moon';
        }
    }
});

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navRight = document.querySelector('.nav-right');
    
    if (menuToggle && navRight) {
        menuToggle.addEventListener('click', () => {
            navRight.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navRight.contains(e.target)) {
                navRight.classList.remove('active');
            }
        });

        // Close menu when clicking on a nav link
        const navLinks = navRight.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navRight.classList.remove('active');
            });
        });
    }
});