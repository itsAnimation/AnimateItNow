# PWA Icons Generation

This directory contains icons for the Progressive Web App (PWA) functionality.

## Required Icons
The following icon sizes are needed for optimal PWA support:

- 72x72px (icon-72x72.png)
- 96x96px (icon-96x96.png)
- 128x128px (icon-128x128.png)
- 144x144px (icon-144x144.png)
- 152x152px (icon-152x152.png)
- 192x192px (icon-192x192.png)
- 384x384px (icon-384x384.png)
- 512x512px (icon-512x512.png)

## How to Generate Icons

### Method 1: Online Tools (Recommended)
1. Use https://www.pwabuilder.com/imageGenerator
2. Upload the source logo (/images/logo.png)
3. Generate all sizes
4. Download and place in this directory

### Method 2: Using ImageMagick (Command Line)
If you have ImageMagick installed:

```bash
# Install ImageMagick (Ubuntu/Debian)
sudo apt-get install imagemagick

# Generate icons
convert ../logo.png -resize 72x72 icon-72x72.png
convert ../logo.png -resize 96x96 icon-96x96.png
convert ../logo.png -resize 128x128 icon-128x128.png
convert ../logo.png -resize 144x144 icon-144x144.png
convert ../logo.png -resize 152x152 icon-152x152.png
convert ../logo.png -resize 192x192 icon-192x192.png
convert ../logo.png -resize 384x384 icon-384x384.png
convert ../logo.png -resize 512x512 icon-512x512.png
```

### Method 3: Using Sharp (Node.js)
Install sharp: `npm install sharp`

```javascript
const sharp = require('sharp');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp('../logo.png')
    .resize(size, size)
    .png()
    .toFile(`icon-${size}x${size}.png`);
});
```

## Icon Guidelines
- Use PNG format
- Ensure the logo works well at small sizes
- Consider making icons square with proper padding
- Test on different devices and backgrounds

## Screenshot Generation
For PWA screenshots, create:
- `screenshot-wide.png` (1280x720) - Desktop view
- `screenshot-narrow.png` (640x1136) - Mobile view

Place these in the `../screenshots/` directory.
