#!/usr/bin/env node

/**
 * Update HTML Files with PWA Meta Tags
 * This script adds PWA meta tags to all HTML files in the project
 */

const fs = require('fs');
const path = require('path');

// PWA Meta Tags Template
const pwaMetaTags = `  <meta name="description" content="A comprehensive collection of CSS animation templates and effects for web developers" />
  
  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="#ff6b6b" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="AnimateItNow" />
  <meta name="msapplication-TileImage" content="images/icons/icon-144x144.png" />
  <meta name="msapplication-TileColor" content="#ff6b6b" />
  
  <!-- PWA Manifest -->
  <link rel="manifest" href="manifest.json" />
  
  <!-- PWA Icons -->
  <link rel="icon" type="image/png" sizes="72x72" href="images/icons/icon-72x72.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="images/icons/icon-96x96.png" />
  <link rel="icon" type="image/png" sizes="128x128" href="images/icons/icon-128x128.png" />
  <link rel="icon" type="image/png" sizes="144x144" href="images/icons/icon-144x144.png" />
  <link rel="icon" type="image/png" sizes="152x152" href="images/icons/icon-152x152.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="images/icons/icon-192x192.png" />
  <link rel="icon" type="image/png" sizes="384x384" href="images/icons/icon-384x384.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="images/icons/icon-512x512.png" />
  
  <!-- Apple Touch Icons -->
  <link rel="apple-touch-icon" sizes="152x152" href="images/icons/icon-152x152.png" />
  <link rel="apple-touch-icon" sizes="192x192" href="images/icons/icon-192x192.png" />
  
  <!-- Fallback icon -->
  <link rel="icon" type="image/png" href="images/logo.png" />`;

const pwaScriptTag = `  <!-- PWA Support -->
  <script src="pwa.js"></script>`;

// Find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Update HTML file with PWA meta tags
function updateHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Skip if already has PWA meta tags
    if (content.includes('PWA Meta Tags')) {
      console.log(`⏭️  Skipped ${path.relative(__dirname, filePath)} (already has PWA tags)`);
      return false;
    }
    
    // Add PWA meta tags after <title> tag
    const titleRegex = /(<title>.*?<\/title>)/i;
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, `$1\n${pwaMetaTags}`);
      updated = true;
    }
    
    // Add PWA script before closing </body> tag
    const bodyEndRegex = /(<\/body>)/i;
    if (bodyEndRegex.test(content)) {
      content = content.replace(bodyEndRegex, `${pwaScriptTag}\n$1`);
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${path.relative(__dirname, filePath)}`);
      return true;
    } else {
      console.log(`⚠️  Could not update ${path.relative(__dirname, filePath)} (no title or body tag found)`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Adjust paths for template files
function adjustPathsForTemplates(filePath) {
  if (!filePath.includes('/templates/')) {
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Adjust paths to go up one directory
    const pathAdjustments = [
      ['href="manifest.json"', 'href="../manifest.json"'],
      ['href="images/icons/', 'href="../images/icons/'],
      ['href="images/logo.png"', 'href="../images/logo.png"'],
      ['src="pwa.js"', 'src="../pwa.js"']
    ];
    
    let adjusted = false;
    pathAdjustments.forEach(([oldPath, newPath]) => {
      if (content.includes(oldPath)) {
        content = content.replace(new RegExp(oldPath, 'g'), newPath);
        adjusted = true;
      }
    });
    
    if (adjusted) {
      fs.writeFileSync(filePath, content);
      console.log(`🔧 Adjusted paths for ${path.relative(__dirname, filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error adjusting paths for ${filePath}:`, error.message);
  }
}

// Main execution
console.log('🚀 Adding PWA support to HTML files...\n');

try {
  const htmlFiles = findHtmlFiles(__dirname);
  
  // Filter out index.html since we already updated it
  const filesToUpdate = htmlFiles.filter(file => !file.endsWith('index.html'));
  
  console.log(`Found ${filesToUpdate.length} HTML files to update:\n`);
  
  let successCount = 0;
  filesToUpdate.forEach(file => {
    if (updateHtmlFile(file)) {
      successCount++;
      adjustPathsForTemplates(file);
    }
  });
  
  console.log(`\n🎉 Successfully updated ${successCount} files!`);
  console.log('\n📋 Next steps:');
  console.log('1. Generate proper PWA icons (see images/icons/README.md)');
  console.log('2. Create app screenshots');
  console.log('3. Test PWA functionality on a local server');
  console.log('4. Run Lighthouse audit for PWA compliance');
  
} catch (error) {
  console.error('❌ Error during HTML update:', error);
  process.exit(1);
}
