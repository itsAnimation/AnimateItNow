#!/usr/bin/env node

/**
 * PWA Icon Generator
 * This script generates all required PWA icons from the source logo
 * Run with: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

const generateIconsReadme = () => {
  const readmeContent = `# PWA Icons Generation

This directory contains icons for the Progressive Web App (PWA) functionality.

## Required Icons
The following icon sizes are needed for optimal PWA support:

${iconSizes.map(size => `- ${size}x${size}px (icon-${size}x${size}.png)`).join('\n')}

## How to Generate Icons

### Method 1: Online Tools (Recommended)
1. Use https://www.pwabuilder.com/imageGenerator
2. Upload the source logo (/images/logo.png)
3. Generate all sizes
4. Download and place in this directory

### Method 2: Using ImageMagick (Command Line)
If you have ImageMagick installed:

\`\`\`bash
# Install ImageMagick (Ubuntu/Debian)
sudo apt-get install imagemagick

# Generate icons
${iconSizes.map(size => 
  `convert ../logo.png -resize ${size}x${size} icon-${size}x${size}.png`
).join('\n')}
\`\`\`

### Method 3: Using Sharp (Node.js)
Install sharp: \`npm install sharp\`

\`\`\`javascript
const sharp = require('sharp');
const sizes = [${iconSizes.join(', ')}];

sizes.forEach(size => {
  sharp('../logo.png')
    .resize(size, size)
    .png()
    .toFile(\`icon-\${size}x\${size}.png\`);
});
\`\`\`

## Icon Guidelines
- Use PNG format
- Ensure the logo works well at small sizes
- Consider making icons square with proper padding
- Test on different devices and backgrounds

## Screenshot Generation
For PWA screenshots, create:
- \`screenshot-wide.png\` (1280x720) - Desktop view
- \`screenshot-narrow.png\` (640x1136) - Mobile view

Place these in the \`../screenshots/\` directory.
`;

  fs.writeFileSync(path.join(__dirname, 'images', 'icons', 'README.md'), readmeContent);
  console.log('✅ Created README.md for icon generation');
};

const generatePlaceholderIcons = () => {
  // Create placeholder SVG icons that can be easily replaced
  const svgTemplate = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4ecdc4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
        font-family="Arial, sans-serif" font-weight="bold" 
        font-size="${size * 0.3}" fill="white">A</text>
</svg>`;

  iconSizes.forEach(size => {
    const svgContent = svgTemplate(size);
    const filePath = path.join(__dirname, 'images', 'icons', `icon-${size}x${size}.svg`);
    fs.writeFileSync(filePath, svgContent.trim());
  });

  console.log('✅ Created placeholder SVG icons');
};

const generateInstallationGuide = () => {
  const guideContent = `# PWA Setup Complete! 🎉

AnimateItNow now supports Progressive Web App (PWA) functionality!

## What's Been Added

### 1. Web App Manifest (\`manifest.json\`)
- Defines app metadata, icons, and display settings
- Enables "Add to Home Screen" functionality
- Configures app appearance and behavior

### 2. Service Worker (\`sw.js\`)
- Enables offline functionality
- Caches static assets for faster loading
- Provides background sync capabilities
- Handles app updates

### 3. PWA Installation Script (\`pwa.js\`)
- Smart install button that appears when installable
- Cross-platform installation instructions
- Update notifications
- Install status detection

### 4. Icon Structure
- Multiple icon sizes for different devices
- Optimized for various display densities
- Maskable icons for adaptive icon support

## Next Steps

### 1. Generate Proper Icons
Replace the placeholder icons with actual app icons:
\`\`\`bash
cd images/icons
# Follow the README.md in that directory
\`\`\`

### 2. Create Screenshots
Add app screenshots for app stores:
- Desktop screenshot (1280x720): \`images/screenshots/screenshot-wide.png\`
- Mobile screenshot (640x1136): \`images/screenshots/screenshot-narrow.png\`

### 3. Update HTML Files
The main HTML files need PWA meta tags. Run:
\`\`\`bash
node update-html-files.js
\`\`\`

### 4. Test PWA Functionality
1. Serve the site (use a local server)
2. Open Chrome DevTools → Application → Manifest
3. Check "Service Workers" tab
4. Test "Add to Home Screen" functionality

## Features Included

✅ **Installable**: Users can install the app like a native app
✅ **Offline Support**: Core functionality works without internet
✅ **Fast Loading**: Assets are cached for quick startup
✅ **Auto Updates**: App updates automatically in background
✅ **Cross Platform**: Works on desktop, mobile, and tablets
✅ **App Shortcuts**: Quick access to Templates and Contributors
✅ **Responsive**: Adapts to different screen sizes and orientations

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (good support)
- ✅ Safari (basic support)
- ✅ Samsung Internet (full support)

## Testing

### Lighthouse PWA Audit
Run a Lighthouse audit to verify PWA compliance:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Run audit

### Manual Testing
1. **Install Test**: Check if install prompt appears
2. **Offline Test**: Disconnect internet and test functionality
3. **Update Test**: Deploy changes and verify update mechanism
4. **Icon Test**: Check app icon on home screen

## Deployment Notes

When deploying to production:
1. Ensure HTTPS is enabled (required for PWA)
2. Update manifest start_url if deploying to subdirectory
3. Update service worker cache URLs if needed
4. Test on actual devices for best results

Great job adding PWA support! 🚀
`;

  fs.writeFileSync(path.join(__dirname, 'PWA_SETUP_GUIDE.md'), guideContent);
  console.log('✅ Created PWA setup guide');
};

// Main execution
console.log('🚀 Setting up PWA icons and documentation...\n');

try {
  generateIconsReadme();
  generatePlaceholderIcons();
  generateInstallationGuide();
  
  console.log('\n🎉 PWA setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Generate proper icons (see images/icons/README.md)');
  console.log('2. Add PWA meta tags to HTML files');
  console.log('3. Create app screenshots');
  console.log('4. Test PWA functionality');
  console.log('\nSee PWA_SETUP_GUIDE.md for detailed instructions.');
  
} catch (error) {
  console.error('❌ Error during setup:', error);
  process.exit(1);
}
