// Animation Builder JavaScript
class AnimationBuilder {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.selectedElement = null;
    this.elementCounter = 0;
    this.init();
  }

  init() {
    this.setupDragAndDrop();
    this.setupAnimationControls();
    this.setupExport();
  }

  setupDragAndDrop() {
    // Element palette drag
    document.querySelectorAll('.element-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
      });
    });

    // Canvas drop
    this.canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.canvas.classList.add('drag-over');
    });

    this.canvas.addEventListener('dragleave', () => {
      this.canvas.classList.remove('drag-over');
    });

    this.canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      this.canvas.classList.remove('drag-over');
      
      const elementType = e.dataTransfer.getData('text/plain');
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.createElement(elementType, x, y);
    });

    // Animation palette click
    document.querySelectorAll('.animation-item').forEach(item => {
      item.addEventListener('click', () => {
        if (this.selectedElement) {
          this.applyAnimation(item.dataset.animation);
        }
      });
    });
  }

  createElement(type, x, y) {
    const element = document.createElement('div');
    element.className = `canvas-element element-${type}`;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.dataset.id = ++this.elementCounter;

    // Add content based on type
    switch(type) {
      case 'text':
        element.textContent = 'Sample Text';
        element.contentEditable = true;
        break;
      case 'button':
        element.textContent = 'Click Me';
        break;
    }

    // Make draggable within canvas
    this.makeDraggable(element);
    
    // Add click handler for selection
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectElement(element);
    });

    this.canvas.appendChild(element);
    this.selectElement(element);

    // Hide placeholder
    const placeholder = this.canvas.querySelector('.canvas-placeholder');
    if (placeholder) placeholder.style.display = 'none';
  }

  makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener('mousedown', (e) => {
      if (e.target.contentEditable === 'true') return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = parseInt(element.style.left) || 0;
      initialY = parseInt(element.style.top) || 0;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      element.style.left = `${initialX + deltaX}px`;
      element.style.top = `${initialY + deltaY}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  selectElement(element) {
    // Remove previous selection
    document.querySelectorAll('.canvas-element.selected').forEach(el => {
      el.classList.remove('selected');
    });

    // Select new element
    element.classList.add('selected');
    this.selectedElement = element;
    this.updatePropertiesPanel();
  }

  updatePropertiesPanel() {
    const panel = document.getElementById('element-properties');
    if (!this.selectedElement) {
      panel.innerHTML = '<p>Select an element to edit properties</p>';
      return;
    }

    const type = this.selectedElement.className.split(' ').find(c => c.startsWith('element-')).replace('element-', '');
    panel.innerHTML = `
      <h4>Element: ${type}</h4>
      <label>Width: <input type="number" id="width" value="${this.selectedElement.offsetWidth}">px</label>
      <label>Height: <input type="number" id="height" value="${this.selectedElement.offsetHeight}">px</label>
      <label>Background: <input type="color" id="bg-color" value="#667eea"></label>
      <button onclick="builder.deleteElement()" class="btn" style="background: #ff4757; color: white; margin-top: 10px;">Delete</button>
    `;

    // Add event listeners for property changes
    panel.querySelector('#width').addEventListener('input', (e) => {
      this.selectedElement.style.width = e.target.value + 'px';
    });

    panel.querySelector('#height').addEventListener('input', (e) => {
      this.selectedElement.style.height = e.target.value + 'px';
    });

    panel.querySelector('#bg-color').addEventListener('input', (e) => {
      this.selectedElement.style.background = e.target.value;
    });
  }

  deleteElement() {
    if (this.selectedElement) {
      this.selectedElement.remove();
      this.selectedElement = null;
      this.updatePropertiesPanel();
    }
  }

  applyAnimation(animationType) {
    if (!this.selectedElement) return;

    // Remove existing animations
    this.selectedElement.classList.remove('animate-bounce', 'animate-fade', 'animate-slide', 'animate-rotate', 'animate-scale');
    
    // Apply new animation
    this.selectedElement.classList.add(`animate-${animationType}`);
    this.updateAnimationProperties();
  }

  setupAnimationControls() {
    const duration = document.getElementById('duration');
    const delay = document.getElementById('delay');
    const easing = document.getElementById('easing');
    const iterations = document.getElementById('iterations');

    [duration, delay, easing, iterations].forEach(control => {
      control.addEventListener('input', () => this.updateAnimationProperties());
    });

    // Update display values
    duration.addEventListener('input', () => {
      document.getElementById('duration-value').textContent = duration.value + 's';
    });

    delay.addEventListener('input', () => {
      document.getElementById('delay-value').textContent = delay.value + 's';
    });
  }

  updateAnimationProperties() {
    if (!this.selectedElement) return;

    const duration = document.getElementById('duration').value;
    const delay = document.getElementById('delay').value;
    const easing = document.getElementById('easing').value;
    const iterations = document.getElementById('iterations').value;

    this.selectedElement.style.setProperty('--duration', duration + 's');
    this.selectedElement.style.setProperty('--delay', delay + 's');
    this.selectedElement.style.setProperty('--easing', easing);
    this.selectedElement.style.setProperty('--iterations', iterations === '1' ? '1' : 'infinite');
  }

  setupExport() {
    document.getElementById('export-css').addEventListener('click', () => this.exportCSS());
    document.getElementById('export-react').addEventListener('click', () => this.exportReact());
    document.getElementById('preview').addEventListener('click', () => this.preview());
  }

  exportCSS() {
    const elements = Array.from(this.canvas.querySelectorAll('.canvas-element'));
    let css = '/* Generated CSS from AnimateItNow Builder */\n\n';

    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();
      
      css += `.element-${index + 1} {\n`;
      css += `  position: absolute;\n`;
      css += `  left: ${parseInt(el.style.left)}px;\n`;
      css += `  top: ${parseInt(el.style.top)}px;\n`;
      css += `  width: ${el.offsetWidth}px;\n`;
      css += `  height: ${el.offsetHeight}px;\n`;
      
      if (el.style.background) {
        css += `  background: ${el.style.background};\n`;
      }

      // Add animation if present
      const animationClass = Array.from(el.classList).find(c => c.startsWith('animate-'));
      if (animationClass) {
        const animationType = animationClass.replace('animate-', '');
        const duration = el.style.getPropertyValue('--duration') || '1s';
        const delay = el.style.getPropertyValue('--delay') || '0s';
        const easing = el.style.getPropertyValue('--easing') || 'ease';
        const iterations = el.style.getPropertyValue('--iterations') || 'infinite';
        
        css += `  animation: ${animationType} ${duration} ${easing} ${delay} ${iterations};\n`;
      }

      css += '}\n\n';
    });

    this.downloadFile('animation.css', css);
  }

  exportReact() {
    const elements = Array.from(this.canvas.querySelectorAll('.canvas-element'));
    let jsx = 'import React from "react";\nimport "./animation.css";\n\n';
    jsx += 'const AnimatedComponent = () => {\n  return (\n    <div className="animation-container">\n';

    elements.forEach((el, index) => {
      const type = el.className.split(' ').find(c => c.startsWith('element-')).replace('element-', '');
      const content = el.textContent || '';
      
      jsx += `      <div className="element-${index + 1}">\n`;
      if (content) {
        jsx += `        ${content}\n`;
      }
      jsx += '      </div>\n';
    });

    jsx += '    </div>\n  );\n};\n\nexport default AnimatedComponent;';

    this.downloadFile('AnimatedComponent.jsx', jsx);
  }

  preview() {
    // Toggle animations
    const elements = this.canvas.querySelectorAll('.canvas-element');
    elements.forEach(el => {
      el.style.animationPlayState = el.style.animationPlayState === 'paused' ? 'running' : 'paused';
    });
  }

  downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize builder
const builder = new AnimationBuilder();

// Canvas click to deselect
document.getElementById('canvas').addEventListener('click', (e) => {
  if (e.target.id === 'canvas') {
    document.querySelectorAll('.canvas-element.selected').forEach(el => {
      el.classList.remove('selected');
    });
    builder.selectedElement = null;
    builder.updatePropertiesPanel();
  }
});