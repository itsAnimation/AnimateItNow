#!/usr/bin/env node

/**
 * 🔄 Update HTML Files with PWA Meta Tags
 * This script enhances HTML files by adding Progressive Web App meta tags
 * and improves overall PWA compatibility across the project
 */

const fs = require('fs');
const path = require('path');

// Enhanced PWA Meta Tags Configuration
const pwaMetaConfiguration = `  <meta name="description" content="A comprehensive collection of CSS animation templates and effects for web developers" />
  
  <!-- 🔧 PWA Meta Tags Configuration -->
  <meta name="theme-color" content="#ff6b6b" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="AnimateItNow" />
  <meta name="msapplication-TileImage" content="images/icons/icon-144x144.png" />
  <meta name="msapplication-TileColor" content="#ff6b6b" />
  
  <!-- 📱 PWA Manifest Reference -->
  <link rel="manifest" href="manifest.json" />
  
  <!-- 🖼️ PWA Icons Collection -->
  <link rel="icon" type="image/png" sizes="72x72" href="images/icons/icon-72x72.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="images/icons/icon-96x96.png" />
  <link rel="icon" type="image/png" sizes="128x128" href="images/icons/icon-128x128.png" />
  <link rel="icon" type="image/png" sizes="144x144" href="images/icons/icon-144x144.png" />
  <link rel="icon" type="image/png" sizes="152x152" href="images/icons/icon-152x152.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="images/icons/icon-192x192.png" />
  <link rel="icon" type="image/png" sizes="384x384" href="images/icons/icon-384x384.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="images/icons/icon-512x512.png" />
  
  <!-- 📱 Apple Touch Icons -->
  <link rel="apple-touch-icon" sizes="152x152" href="images/icons/icon-152x152.png" />
  <link rel="apple-touch-icon" sizes="192x192" href="images/icons/icon-192x192.png" />
  
  <!-- 🎯 Fallback icon reference -->
  <link rel="icon" type="image/png" href="images/logo.png" />`;

const pwaScriptReference = `  <!-- 🔄 PWA Support Script -->
  <script src="pwa.js"></script>`;

// Locate HTML files in directory structure
function locateHtmlFiles(directory, fileCollection = []) {
  const directoryContents = fs.readdirSync(directory);
  
  directoryContents.forEach(item => {
    const fullPath = path.join(directory, item);
    const fileStats = fs.statSync(fullPath);
    
    if (fileStats.isDirectory()) {
      locateHtmlFiles(fullPath, fileCollection);
    } else if (item.endsWith('.html')) {
      fileCollection.push(fullPath);
    }
  });
  
  return fileCollection;
}

// Enhance HTML file with PWA meta tags
function enhanceHtmlFile(filePath) {
  try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let wasModified = false;
    
    // Skip files already containing PWA configuration
    if (fileContent.includes('PWA Meta Tags')) {
      console.log(`⏭️  Skipped ${path.relative(__dirname, filePath)} (PWA tags already present)`);
      return false;
    }
    
    // Insert PWA configuration after title element
    const titlePattern = /(<title>.*?<\/title>)/i;
    if (titlePattern.test(fileContent)) {
      fileContent = fileContent.replace(titlePattern, `$1\n${pwaMetaConfiguration}`);
      wasModified = true;
    }
    
    // Add PWA script reference before body closure
    const bodyClosurePattern = /(<\/body>)/i;
    if (bodyClosurePattern.test(fileContent)) {
      fileContent = fileContent.replace(bodyClosurePattern, `${pwaScriptReference}\n$1`);
      wasModified = true;
    }
    
    if (wasModified) {
      fs.writeFileSync(filePath, fileContent);
      console.log(`✅ Enhanced ${path.relative(__dirname, filePath)}`);
      return true;
    } else {
      console.log(`⚠️  Could not enhance ${path.relative(__dirname, filePath)} (missing title/body elements)`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error enhancing ${filePath}:`, err.message);
    return false;
  }
}

// Update file paths for template directories
function updateTemplatePaths(filePath) {
  if (!filePath.includes('/templates/')) {
    return;
  }
  
  try {
    let templateContent = fs.readFileSync(filePath, 'utf8');
    
    // Adjust resource paths for template structure
    const pathUpdates = [
      ['href="manifest.json"', 'href="../manifest.json"'],
      ['href="images/icons/', 'href="../images/icons/'],
      ['href="images/logo.png"', 'href="../images/logo.png"'],
      ['src="pwa.js"', 'src="../pwa.js"']
    ];
    
    let pathsAdjusted = false;
    pathUpdates.forEach(([originalPath, updatedPath]) => {
      if (templateContent.includes(originalPath)) {
        templateContent = templateContent.replace(new RegExp(originalPath, 'g'), updatedPath);
        pathsAdjusted = true;
      }
    });
    
    if (pathsAdjusted) {
      fs.writeFileSync(filePath, templateContent);
      console.log(`🔧 Updated paths in ${path.relative(__dirname, filePath)}`);
    }
  } catch (err) {
    console.error(`❌ Error updating paths for ${filePath}:`, err.message);
  }
}

// Main execution flow
console.log('🚀 Enhancing HTML files with PWA support...\n');

try {
  const htmlFileList = locateHtmlFiles(__dirname);
  
  // Filter out main index file
  const filesForEnhancement = htmlFileList.filter(file => !file.endsWith('index.html'));
  
  console.log(`Located ${filesForEnhancement.length} HTML files for enhancement:\n`);
  
  let enhancedCount = 0;
  filesForEnhancement.forEach(file => {
    if (enhanceHtmlFile(file)) {
      enhancedCount++;
      updateTemplatePaths(file);
    }
  });
  
  console.log(`\n🎉 Successfully enhanced ${enhancedCount} files!`);
  console.log('\n📋 Recommended next actions:');
  console.log('1. Generate optimized PWA icons (refer to images/icons/README.md)');
  console.log('2. Create application screenshots');
  console.log('3. Validate PWA functionality on local server');
  console.log('4. Execute Lighthouse audit for PWA compliance verification');
  
} catch (err) {
  console.error('❌ Error during HTML enhancement process:', err);
  process.exit(1);
}

// Additional placeholder function for future enhancements
function futureEnhancementCheck() {
  // Placeholder for future PWA validation features
  console.log('🔮 Future enhancement: PWA validation system');
}
