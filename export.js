// Framework Export Hub JavaScript
class FrameworkExporter {
  constructor() {
    this.selectedFramework = null;
    this.sourceCode = {
      html: '',
      css: '',
      js: ''
    };
    this.exportHistory = JSON.parse(localStorage.getItem('exportHistory')) || [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadLibraryAnimations();
    this.loadExportHistory();
    this.setupFileDropZone();
  }

  setupEventListeners() {
    // Input tabs
    document.querySelectorAll('.input-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchInputTab(e.target.dataset.tab));
    });

    // Framework selection
    document.querySelectorAll('.framework-card').forEach(card => {
      card.addEventListener('click', (e) => this.selectFramework(e.currentTarget.dataset.framework));
    });

    // Source code inputs
    document.getElementById('source-html').addEventListener('input', (e) => {
      this.sourceCode.html = e.target.value;
      this.updatePreview();
    });

    document.getElementById('source-css').addEventListener('input', (e) => {
      this.sourceCode.css = e.target.value;
      this.updatePreview();
    });

    document.getElementById('source-js').addEventListener('input', (e) => {
      this.sourceCode.js = e.target.value;
      this.updatePreview();
    });

    // Export generation
    document.getElementById('generate-export').addEventListener('click', () => this.generateExport());

    // Result actions
    document.getElementById('download-zip').addEventListener('click', () => this.downloadZip());
    document.getElementById('copy-all').addEventListener('click', () => this.copyAllCode());
    document.getElementById('save-to-library').addEventListener('click', () => this.saveToLibrary());

    // File import
    document.getElementById('file-import').addEventListener('change', (e) => this.handleFileImport(e));
  }

  setupFileDropZone() {
    const dropZone = document.querySelector('.file-import-zone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'));
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'));
    });

    dropZone.addEventListener('drop', (e) => this.handleFileDrop(e));
    dropZone.addEventListener('click', () => document.getElementById('file-import').click());
  }

  switchInputTab(tab) {
    document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    document.querySelectorAll('.input-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${tab}-input`).classList.add('active');
  }

  selectFramework(framework) {
    document.querySelectorAll('.framework-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-framework="${framework}"]`).classList.add('selected');
    this.selectedFramework = framework;
  }

  loadLibraryAnimations() {
    // Mock library animations
    const libraryAnimations = [
      {
        id: 1,
        name: 'Bounce Button',
        description: 'Animated button with bounce effect',
        html: '<button class="bounce-btn">Click Me!</button>',
        css: `.bounce-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`,
        js: ''
      },
      {
        id: 2,
        name: 'Fade Card',
        description: 'Card with fade in animation',
        html: '<div class="fade-card"><h3>Animated Card</h3><p>This card fades in smoothly</p></div>',
        css: `.fade-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`,
        js: ''
      },
      {
        id: 3,
        name: 'Pulse Icon',
        description: 'Pulsing icon animation',
        html: '<div class="pulse-icon">💖</div>',
        css: `.pulse-icon {
  font-size: 3rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}`,
        js: ''
      }
    ];

    const libraryGrid = document.getElementById('library-animations');
    libraryGrid.innerHTML = libraryAnimations.map(animation => `
      <div class="library-item" onclick="exporter.loadLibraryAnimation(${animation.id})">
        <h4>${animation.name}</h4>
        <p>${animation.description}</p>
      </div>
    `).join('');
  }

  loadLibraryAnimation(id) {
    // Mock loading animation by id
    const animations = {
      1: {
        html: '<button class="bounce-btn">Click Me!</button>',
        css: `.bounce-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`,
        js: ''
      },
      2: {
        html: '<div class="fade-card"><h3>Animated Card</h3><p>This card fades in smoothly</p></div>',
        css: `.fade-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`,
        js: ''
      },
      3: {
        html: '<div class="pulse-icon">💖</div>',
        css: `.pulse-icon {
  font-size: 3rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}`,
        js: ''
      }
    };

    const animation = animations[id];
    if (animation) {
      document.getElementById('source-html').value = animation.html;
      document.getElementById('source-css').value = animation.css;
      document.getElementById('source-js').value = animation.js;
      
      this.sourceCode = { ...animation };
      this.updatePreview();
      this.switchInputTab('paste');

      // Highlight selected item
      document.querySelectorAll('.library-item').forEach(item => item.classList.remove('selected'));
      event.target.closest('.library-item').classList.add('selected');
    }
  }

  updatePreview() {
    const preview = document.getElementById('animation-preview');
    
    if (!this.sourceCode.html && !this.sourceCode.css) {
      preview.innerHTML = `
        <div class="preview-placeholder">
          <div class="placeholder-icon">🎬</div>
          <p>Your animation preview will appear here</p>
        </div>
      `;
      return;
    }

    preview.innerHTML = `
      <style>${this.sourceCode.css}</style>
      ${this.sourceCode.html}
      <script>${this.sourceCode.js}</script>
    `;
  }

  async generateExport() {
    if (!this.selectedFramework) {
      alert('Please select a framework first');
      return;
    }

    if (!this.sourceCode.html && !this.sourceCode.css) {
      alert('Please provide some code to export');
      return;
    }

    const exportBtn = document.getElementById('generate-export');
    const btnText = exportBtn.querySelector('.btn-text');
    const spinner = exportBtn.querySelector('.loading-spinner');

    // Show loading state
    exportBtn.disabled = true;
    btnText.textContent = 'Generating...';
    spinner.style.display = 'inline-block';

    try {
      // Get configuration
      const config = this.getExportConfig();
      
      // Generate code for selected framework
      const exportedCode = await this.generateFrameworkCode(this.selectedFramework, config);
      
      // Display results
      this.displayExportResults(exportedCode);
      
      // Save to history
      this.saveToHistory(exportedCode, config);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      // Reset button state
      exportBtn.disabled = false;
      btnText.textContent = '✨ Generate Export';
      spinner.style.display = 'none';
    }
  }

  getExportConfig() {
    return {
      componentName: document.getElementById('component-name').value || 'AnimatedComponent',
      duration: document.getElementById('duration-config').value,
      cssPrefix: document.getElementById('css-prefix').value || '',
      includeTypeScript: document.getElementById('include-typescript').checked,
      includeTests: document.getElementById('include-tests').checked,
      includeDocs: document.getElementById('include-docs').checked
    };
  }

  async generateFrameworkCode(framework, config) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const generators = {
      react: () => this.generateReactCode(config),
      vue: () => this.generateVueCode(config),
      angular: () => this.generateAngularCode(config),
      svelte: () => this.generateSvelteCode(config),
      tailwind: () => this.generateTailwindCode(config),
      scss: () => this.generateScssCode(config),
      vanilla: () => this.generateVanillaCode(config),
      css: () => this.generatePureCssCode(config)
    };

    return generators[framework]();
  }

  generateReactCode(config) {
    const componentName = config.componentName;
    const cssPrefix = config.cssPrefix || 'animated';

    const jsxCode = `import React from 'react';
import './${componentName}.css';

const ${componentName} = () => {
  return (
    <div className="${cssPrefix}-container">
      ${this.sourceCode.html.replace(/class=/g, 'className=')}
    </div>
  );
};

export default ${componentName};`;

    const cssCode = this.processCssForFramework(this.sourceCode.css, config);

    const files = {
      [`${componentName}.jsx`]: jsxCode,
      [`${componentName}.css`]: cssCode
    };

    if (config.includeTypeScript) {
      files[`${componentName}.tsx`] = jsxCode.replace('.jsx', '.tsx').replace('import React', 'import React, { FC }').replace(`const ${componentName} = () => {`, `const ${componentName}: FC = () => {`);
    }

    if (config.includeTests) {
      files[`${componentName}.test.jsx`] = this.generateReactTest(componentName);
    }

    if (config.includeDocs) {
      files['README.md'] = this.generateReactDocs(componentName);
    }

    return {
      framework: 'React',
      files,
      installationSteps: this.getReactInstallationSteps(componentName)
    };
  }

  generateVueCode(config) {
    const componentName = config.componentName;
    const cssPrefix = config.cssPrefix || 'animated';

    const vueCode = `<template>
  <div class="${cssPrefix}-container">
    ${this.sourceCode.html}
  </div>
</template>

<script>
export default {
  name: '${componentName}',
  mounted() {
    ${this.sourceCode.js}
  }
}
</script>

<style scoped>
${this.processCssForFramework(this.sourceCode.css, config)}
</style>`;

    const files = {
      [`${componentName}.vue`]: vueCode
    };

    if (config.includeTests) {
      files[`${componentName}.spec.js`] = this.generateVueTest(componentName);
    }

    if (config.includeDocs) {
      files['README.md'] = this.generateVueDocs(componentName);
    }

    return {
      framework: 'Vue.js',
      files,
      installationSteps: this.getVueInstallationSteps(componentName)
    };
  }

  generateAngularCode(config) {
    const componentName = config.componentName;
    const selector = componentName.toLowerCase().replace(/([A-Z])/g, '-$1').substring(1);

    const tsCode = `import { Component } from '@angular/core';

@Component({
  selector: 'app-${selector}',
  templateUrl: './${selector}.component.html',
  styleUrls: ['./${selector}.component.css']
})
export class ${componentName}Component {
  ngOnInit() {
    ${this.sourceCode.js}
  }
}`;

    const htmlCode = `<div class="animated-container">
  ${this.sourceCode.html}
</div>`;

    const cssCode = this.processCssForFramework(this.sourceCode.css, config);

    const files = {
      [`${selector}.component.ts`]: tsCode,
      [`${selector}.component.html`]: htmlCode,
      [`${selector}.component.css`]: cssCode
    };

    if (config.includeTests) {
      files[`${selector}.component.spec.ts`] = this.generateAngularTest(componentName, selector);
    }

    if (config.includeDocs) {
      files['README.md'] = this.generateAngularDocs(componentName);
    }

    return {
      framework: 'Angular',
      files,
      installationSteps: this.getAngularInstallationSteps(componentName)
    };
  }

  generateSvelteCode(config) {
    const componentName = config.componentName;

    const svelteCode = `<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    ${this.sourceCode.js}
  });
</script>

<div class="animated-container">
  ${this.sourceCode.html}
</div>

<style>
${this.processCssForFramework(this.sourceCode.css, config)}
</style>`;

    const files = {
      [`${componentName}.svelte`]: svelteCode
    };

    if (config.includeDocs) {
      files['README.md'] = this.generateSvelteDocs(componentName);
    }

    return {
      framework: 'Svelte',
      files,
      installationSteps: this.getSvelteInstallationSteps(componentName)
    };
  }

  generateTailwindCode(config) {
    // Convert CSS animations to Tailwind utilities
    const tailwindClasses = this.convertCssToTailwind(this.sourceCode.css);
    const htmlWithTailwind = this.sourceCode.html.replace(/class="([^"]*)"/, `class="$1 ${tailwindClasses}"`);

    const files = {
      'index.html': htmlWithTailwind,
      'tailwind.config.js': this.generateTailwindConfig(),
      'custom-animations.css': this.generateTailwindCustomCss()
    };

    if (config.includeDocs) {
      files['README.md'] = this.generateTailwindDocs();
    }

    return {
      framework: 'Tailwind CSS',
      files,
      installationSteps: this.getTailwindInstallationSteps()
    };
  }

  generateScssCode(config) {
    const scssCode = this.convertCssToScss(this.sourceCode.css);
    const mixinsCode = this.generateScssMixins();

    const files = {
      'animations.scss': scssCode,
      '_mixins.scss': mixinsCode,
      'index.html': this.sourceCode.html
    };

    if (config.includeDocs) {
      files['README.md'] = this.generateScssDocs();
    }

    return {
      framework: 'SCSS/Sass',
      files,
      installationSteps: this.getScssInstallationSteps()
    };
  }

  generateVanillaCode(config) {
    const jsCode = `// Vanilla JavaScript Animation
class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    ${this.sourceCode.js}
    this.setupAnimations();
  }

  setupAnimations() {
    // Add any additional JavaScript logic here
    const elements = document.querySelectorAll('.animated-element');
    elements.forEach(element => {
      element.addEventListener('click', () => {
        element.style.animationPlayState = 
          element.style.animationPlayState === 'paused' ? 'running' : 'paused';
      });
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AnimationController();
});`;

    const files = {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animated Component</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${this.sourceCode.html}
  <script src="script.js"></script>
</body>
</html>`,
      'styles.css': this.processCssForFramework(this.sourceCode.css, config),
      'script.js': jsCode
    };

    if (config.includeDocs) {
      files['README.md'] = this.generateVanillaDocs();
    }

    return {
      framework: 'Vanilla JavaScript',
      files,
      installationSteps: this.getVanillaInstallationSteps()
    };
  }

  generatePureCssCode(config) {
    const files = {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Animation</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${this.sourceCode.html}
</body>
</html>`,
      'styles.css': this.processCssForFramework(this.sourceCode.css, config)
    };

    if (config.includeDocs) {
      files['README.md'] = this.generateCssDocs();
    }

    return {
      framework: 'Pure CSS',
      files,
      installationSteps: this.getCssInstallationSteps()
    };
  }

  processCssForFramework(css, config) {
    let processedCss = css;

    // Apply duration changes
    if (config.duration !== 'keep') {
      const durations = {
        fast: '0.3s',
        normal: '1s',
        slow: '2s'
      };
      
      if (durations[config.duration]) {
        processedCss = processedCss.replace(/animation-duration:\s*[\d.]+s/g, `animation-duration: ${durations[config.duration]}`);
        processedCss = processedCss.replace(/animation:\s*([^\s]+)\s+[\d.]+s/g, `animation: $1 ${durations[config.duration]}`);
      }
    }

    // Apply CSS prefix
    if (config.cssPrefix) {
      processedCss = processedCss.replace(/\.([\w-]+)/g, `.${config.cssPrefix}-$1`);
    }

    return processedCss;
  }

  displayExportResults(exportedCode) {
    const resultsSection = document.getElementById('export-results');
    const tabsContainer = document.getElementById('export-tabs');
    const contentContainer = document.getElementById('export-code-content');

    // Show results section
    resultsSection.style.display = 'block';

    // Generate tabs and content
    const fileNames = Object.keys(exportedCode.files);
    
    tabsContainer.innerHTML = fileNames.map((fileName, index) => `
      <button class="code-tab ${index === 0 ? 'active' : ''}" data-file="${fileName}">
        ${fileName}
      </button>
    `).join('');

    contentContainer.innerHTML = fileNames.map((fileName, index) => `
      <div class="code-panel ${index === 0 ? 'active' : ''}" data-file="${fileName}">
        <pre><code>${this.escapeHtml(exportedCode.files[fileName])}</code></pre>
      </div>
    `).join('');

    // Setup tab switching
    document.querySelectorAll('.code-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const fileName = e.target.dataset.file;
        
        document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
        
        e.target.classList.add('active');
        document.querySelector(`[data-file="${fileName}"]`).classList.add('active');
      });
    });

    // Display installation guide
    this.displayInstallationGuide(exportedCode.installationSteps);

    // Store current export for actions
    this.currentExport = exportedCode;
  }

  displayInstallationGuide(steps) {
    const stepsContainer = document.getElementById('installation-steps');
    stepsContainer.innerHTML = steps.map((step, index) => `
      <div class="installation-step">
        <h4>Step ${index + 1}: ${step.title}</h4>
        <p>${step.description}</p>
        ${step.code ? `<div class="code-block"><code>${step.code}</code></div>` : ''}
      </div>
    `).join('');
  }

  // Installation steps generators
  getReactInstallationSteps(componentName) {
    return [
      {
        title: 'Install Dependencies',
        description: 'Make sure you have React installed in your project.',
        code: 'npm install react react-dom'
      },
      {
        title: 'Add Component Files',
        description: 'Copy the generated component files to your src/components directory.'
      },
      {
        title: 'Import and Use',
        description: 'Import the component in your React application.',
        code: `import ${componentName} from './components/${componentName}';

function App() {
  return (
    <div>
      <${componentName} />
    </div>
  );
}`
      }
    ];
  }

  getVueInstallationSteps(componentName) {
    return [
      {
        title: 'Add Component File',
        description: 'Copy the generated .vue file to your components directory.'
      },
      {
        title: 'Register Component',
        description: 'Import and register the component in your Vue application.',
        code: `import ${componentName} from './components/${componentName}.vue';

export default {
  components: {
    ${componentName}
  }
}`
      },
      {
        title: 'Use in Template',
        description: 'Use the component in your template.',
        code: `<template>
  <${componentName} />
</template>`
      }
    ];
  }

  // Utility methods
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  convertCssToTailwind(css) {
    // Simplified CSS to Tailwind conversion
    let tailwindClasses = '';
    
    if (css.includes('animation: bounce')) tailwindClasses += 'animate-bounce ';
    if (css.includes('animation: pulse')) tailwindClasses += 'animate-pulse ';
    if (css.includes('animation: spin')) tailwindClasses += 'animate-spin ';
    if (css.includes('transform: scale')) tailwindClasses += 'transform hover:scale-110 ';
    
    return tailwindClasses.trim();
  }

  convertCssToScss(css) {
    // Convert CSS to SCSS with variables and nesting
    return css.replace(/\/\* ([^*]+) \*\//, '// $1')
              .replace(/(\w+): ([^;]+);/g, '  $1: $2')
              .replace(/([.#][\w-]+) {/g, '$1 {\n')
              .replace(/}/g, '}\n');
  }

  generateScssMixins() {
    return `// Animation Mixins
@mixin animate($name, $duration: 1s, $timing: ease-in-out, $iteration: infinite) {
  animation: $name $duration $timing $iteration;
}

@mixin transform-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@mixin hover-lift($distance: 5px) {
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-$distance);
  }
}`;
  }

  // File handling methods
  handleFileImport(event) {
    const files = Array.from(event.target.files);
    this.processImportedFiles(files);
  }

  handleFileDrop(event) {
    const files = Array.from(event.dataTransfer.files);
    this.processImportedFiles(files);
  }

  processImportedFiles(files) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const extension = file.name.split('.').pop().toLowerCase();
        
        switch(extension) {
          case 'html':
            document.getElementById('source-html').value = content;
            this.sourceCode.html = content;
            break;
          case 'css':
            document.getElementById('source-css').value = content;
            this.sourceCode.css = content;
            break;
          case 'js':
            document.getElementById('source-js').value = content;
            this.sourceCode.js = content;
            break;
          case 'json':
            try {
              const data = JSON.parse(content);
              if (data.html) {
                document.getElementById('source-html').value = data.html;
                this.sourceCode.html = data.html;
              }
              if (data.css) {
                document.getElementById('source-css').value = data.css;
                this.sourceCode.css = data.css;
              }
              if (data.js) {
                document.getElementById('source-js').value = data.js;
                this.sourceCode.js = data.js;
              }
            } catch (error) {
              console.error('Invalid JSON file:', error);
            }
            break;
        }
      };
      reader.readAsText(file);
    });

    this.updatePreview();
    this.switchInputTab('paste');
  }

  // Export actions
  downloadZip() {
    if (!this.currentExport) return;

    // In a real implementation, use JSZip library
    alert('ZIP download functionality would be implemented with JSZip library');
  }

  copyAllCode() {
    if (!this.currentExport) return;

    const allCode = Object.entries(this.currentExport.files)
      .map(([fileName, content]) => `// ${fileName}\n${content}`)
      .join('\n\n' + '='.repeat(50) + '\n\n');

    navigator.clipboard.writeText(allCode).then(() => {
      this.showToast('All code copied to clipboard!');
    });
  }

  saveToLibrary() {
    if (!this.currentExport) return;

    const savedExports = JSON.parse(localStorage.getItem('savedExports')) || [];
    const newExport = {
      id: Date.now(),
      name: `${this.currentExport.framework} Export`,
      framework: this.currentExport.framework,
      files: this.currentExport.files,
      createdAt: new Date().toISOString()
    };

    savedExports.push(newExport);
    localStorage.setItem('savedExports', JSON.stringify(savedExports));
    
    this.showToast('Export saved to library!');
  }

  saveToHistory(exportedCode, config) {
    const historyItem = {
      id: Date.now(),
      framework: exportedCode.framework,
      componentName: config.componentName,
      timestamp: new Date().toISOString(),
      fileCount: Object.keys(exportedCode.files).length
    };

    this.exportHistory.unshift(historyItem);
    this.exportHistory = this.exportHistory.slice(0, 10); // Keep last 10
    
    localStorage.setItem('exportHistory', JSON.stringify(this.exportHistory));
    this.loadExportHistory();
  }

  loadExportHistory() {
    const historyContainer = document.getElementById('export-history');
    
    if (this.exportHistory.length === 0) {
      historyContainer.innerHTML = '<p style="text-align: center; color: #999;">No exports yet. Generate your first export!</p>';
      return;
    }

    historyContainer.innerHTML = this.exportHistory.map(item => `
      <div class="history-item">
        <h4>${item.componentName}</h4>
        <p>Exported to ${item.framework}</p>
        <div class="meta">
          <span class="framework-badge">${item.framework}</span>
          <span>${new Date(item.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Documentation generators (simplified)
  generateReactDocs(componentName) {
    return `# ${componentName}

A React component with smooth animations.

## Installation

\`\`\`bash
npm install react react-dom
\`\`\`

## Usage

\`\`\`jsx
import ${componentName} from './${componentName}';

function App() {
  return <${componentName} />;
}
\`\`\`

## Props

This component currently doesn't accept any props.

## Customization

You can customize the animation by modifying the CSS file.`;
  }

  generateVueDocs(componentName) {
    return `# ${componentName}

A Vue.js component with smooth animations.

## Usage

\`\`\`vue
<template>
  <${componentName} />
</template>

<script>
import ${componentName} from './${componentName}.vue';

export default {
  components: {
    ${componentName}
  }
}
</script>
\`\`\``;
  }

  // Additional framework-specific generators would be implemented here...
  generateAngularTest(componentName, selector) {
    return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${componentName}Component } from './${selector}.component';

describe('${componentName}Component', () => {
  let component: ${componentName}Component;
  let fixture: ComponentFixture<${componentName}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ${componentName}Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(${componentName}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});`;
  }

  generateReactTest(componentName) {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

test('renders ${componentName} component', () => {
  render(<${componentName} />);
  // Add your test assertions here
});`;
  }

  generateVueTest(componentName) {
    return `import { mount } from '@vue/test-utils';
import ${componentName} from './${componentName}.vue';

describe('${componentName}', () => {
  it('renders properly', () => {
    const wrapper = mount(${componentName});
    expect(wrapper.exists()).toBe(true);
  });
});`;
  }

  // More installation steps generators...
  getAngularInstallationSteps(componentName) {
    return [
      {
        title: 'Add Component Files',
        description: 'Copy the generated component files to your Angular project.'
      },
      {
        title: 'Update Module',
        description: 'Add the component to your module declarations.',
        code: `import { ${componentName}Component } from './path/to/component';

@NgModule({
  declarations: [
    ${componentName}Component
  ]
})`
      },
      {
        title: 'Use in Template',
        description: 'Use the component in your templates.',
        code: `<app-${componentName.toLowerCase()}></app-${componentName.toLowerCase()}>`
      }
    ];
  }

  getSvelteInstallationSteps(componentName) {
    return [
      {
        title: 'Add Component File',
        description: 'Copy the .svelte file to your components directory.'
      },
      {
        title: 'Import and Use',
        description: 'Import the component in your Svelte application.',
        code: `<script>
  import ${componentName} from './components/${componentName}.svelte';
</script>

<${componentName} />`
      }
    ];
  }

  getTailwindInstallationSteps() {
    return [
      {
        title: 'Install Tailwind CSS',
        description: 'Install Tailwind CSS in your project.',
        code: 'npm install -D tailwindcss postcss autoprefixer'
      },
      {
        title: 'Configure Tailwind',
        description: 'Use the generated tailwind.config.js file.'
      },
      {
        title: 'Add Custom CSS',
        description: 'Include the custom animation CSS in your project.'
      }
    ];
  }

  getScssInstallationSteps() {
    return [
      {
        title: 'Install Sass',
        description: 'Install Sass in your project.',
        code: 'npm install -D sass'
      },
      {
        title: 'Import Files',
        description: 'Import the SCSS files in your main stylesheet.',
        code: '@import "mixins";\n@import "animations";'
      }
    ];
  }

  getVanillaInstallationSteps() {
    return [
      {
        title: 'Add Files',
        description: 'Copy the HTML, CSS, and JavaScript files to your project.'
      },
      {
        title: 'Link Files',
        description: 'Make sure the CSS and JS files are properly linked in your HTML.'
      },
      {
        title: 'Customize',
        description: 'Modify the code as needed for your specific use case.'
      }
    ];
  }

  getCssInstallationSteps() {
    return [
      {
        title: 'Add Files',
        description: 'Copy the HTML and CSS files to your project.'
      },
      {
        title: 'Link Stylesheet',
        description: 'Link the CSS file in your HTML head section.',
        code: '<link rel="stylesheet" href="styles.css">'
      },
      {
        title: 'Customize',
        description: 'Modify the CSS as needed for your design.'
      }
    ];
  }

  // Additional utility methods for Tailwind and SCSS
  generateTailwindConfig() {
    return `module.exports = {
  content: [
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      animation: {
        'custom-bounce': 'bounce 1s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}`;
  }

  generateTailwindCustomCss() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-custom-bounce {
    animation: bounce 1s ease-in-out infinite;
  }
  
  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }
}`;
  }

  generateTailwindDocs() {
    return `# Tailwind CSS Animation

Custom animation utilities for Tailwind CSS.

## Installation

1. Install Tailwind CSS
2. Add the custom configuration
3. Include the custom CSS file

## Usage

Use the custom animation classes in your HTML:

\`\`\`html
<div class="animate-custom-bounce">Bouncing element</div>
<div class="animate-fade-in">Fading element</div>
\`\`\``;
  }

  generateScssDocs() {
    return `# SCSS Animation Mixins

Reusable SCSS mixins for animations.

## Usage

Import the mixins and use them in your SCSS:

\`\`\`scss
@import 'mixins';

.my-element {
  @include animate(bounce, 2s, ease-in-out);
  @include hover-lift(10px);
}
\`\`\``;
  }

  generateVanillaDocs() {
    return `# Vanilla JavaScript Animation

Pure JavaScript animation without any frameworks.

## Usage

1. Include the HTML, CSS, and JS files
2. The animation will start automatically
3. Click elements to pause/resume animations

## Customization

Modify the JavaScript file to add your own animation logic.`;
  }

  generateCssDocs() {
    return `# Pure CSS Animation

CSS-only animations without JavaScript.

## Usage

1. Include the HTML and CSS files
2. Animations will run automatically
3. Customize the CSS for different effects

## Browser Support

These animations work in all modern browsers that support CSS animations.`;
  }

  generateAngularDocs(componentName) {
    return `# ${componentName}Component

An Angular component with smooth animations.

## Usage

\`\`\`typescript
import { ${componentName}Component } from './path/to/component';

@NgModule({
  declarations: [${componentName}Component]
})
\`\`\`

\`\`\`html
<app-${componentName.toLowerCase()}></app-${componentName.toLowerCase()}>
\`\`\``;
  }

  generateSvelteDocs(componentName) {
    return `# ${componentName}

A Svelte component with smooth animations.

## Usage

\`\`\`svelte
<script>
  import ${componentName} from './${componentName}.svelte';
</script>

<${componentName} />
\`\`\``;
  }
}

// Initialize Framework Exporter
const exporter = new FrameworkExporter();