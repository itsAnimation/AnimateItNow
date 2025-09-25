# Unified Card System Documentation

## Overview

The Unified Card System provides a consistent, reusable, and extensible card component system for all templates in the AnimateItNow project. This system ensures visual consistency, improves maintainability, and simplifies the creation of new card-based layouts.

## Core Components

### Base Card Structure

```html
<article class="card-system [variants] [effects]">
  <!-- Card content -->
</article>
```

### CSS Classes

#### Base Classes
- `.card-system` - The base card class that provides core styling and animations

#### Layout Variants
- `.card-vertical` - Vertical card layout (default)
- `.card-horizontal` - Horizontal card layout with image on left

#### Hover Effects
- `.card-tilt` - 3D tilt effect on hover
- `.card-float` - Floating animation effect
- `.card-glow` - Glow effect on hover
- `.card-morph` - Shape morphing effect
- `.card-flip` - Flip card effect

## Implementation Examples

### Basic Vertical Card

```html
<article class="card-system card-vertical">
  <img src="image.jpg" alt="Card image" class="card-img-top">
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p class="card-text">Card content goes here.</p>
    <a href="#" class="card-btn">Action</a>
  </div>
</article>
```

### Horizontal Card with Tilt Effect

```html
<article class="card-system card-horizontal card-tilt">
  <div class="card-img-container">
    <img src="image.jpg" alt="Card image" class="card-img-top">
  </div>
  <div class="card-content">
    <div class="card-body">
      <h2 class="card-title">Horizontal Card</h2>
      <p class="card-text">Card content goes here.</p>
      <a href="#" class="card-btn">Learn More</a>
    </div>
  </div>
</article>
```

### Flip Card

```html
<article class="card-system card-vertical card-flip" style="height: 400px;">
  <div class="card-flip-inner">
    <div class="card-flip-front">
      <div class="card-body">
        <h2 class="card-title">Front Side</h2>
        <p class="card-text">Front content.</p>
      </div>
    </div>
    <div class="card-flip-back">
      <div class="card-body">
        <h2 class="card-title">Back Side</h2>
        <p class="card-text">Back content.</p>
      </div>
    </div>
  </div>
</article>
```

## CSS Custom Properties

The card system uses CSS custom properties for easy theming:

```css
body.dark .card-system {
  --card-bg: #2c2c2c;
  --card-shadow: rgba(0, 0, 0, 0.3);
  --card-shadow-hover: rgba(0, 0, 0, 0.5);
  --text-primary: #f1f1f1;
  --text-secondary: #aaaaaa;
}
```

## Responsive Behavior

The card system is fully responsive:
- Cards automatically adjust to full width on mobile devices
- Horizontal cards convert to vertical layout on small screens
- Font sizes and padding adjust for better readability on all devices

## Accessibility

- All interactive elements have proper focus states
- Sufficient color contrast for readability
- Semantic HTML structure
- Proper ARIA attributes where needed

## Best Practices

1. Always use the `.card-system` base class
2. Combine layout variants with hover effects as needed
3. Use appropriate semantic HTML elements
4. Maintain consistent spacing and typography
5. Test cards in both light and dark modes
6. Ensure proper image aspect ratios

## Contributing New Effects

To add new hover effects:

1. Create a new CSS class in `styles.css`
2. Follow the naming convention `.card-[effect-name]`
3. Ensure the effect works well with existing variants
4. Test in both light and dark modes
5. Update this documentation with usage examples