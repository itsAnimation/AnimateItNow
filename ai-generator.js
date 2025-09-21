// AI Animation Generator JavaScript
class AIAnimationGenerator {
  constructor() {
    this.currentAnimation = null;
    this.generationHistory = JSON.parse(localStorage.getItem('aiGenerationHistory')) || [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadHistory();
  }

  setupEventListeners() {
    // Generate button
    document.getElementById('generate-btn').addEventListener('click', () => this.generateAnimation());
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Preview controls
    document.getElementById('play-pause').addEventListener('click', () => this.togglePlayPause());
    document.getElementById('restart').addEventListener('click', () => this.restartAnimation());
    document.getElementById('edit-code').addEventListener('click', () => this.editCode());

    // Code actions
    document.getElementById('copy-code').addEventListener('click', () => this.copyCode());
    document.getElementById('download-code').addEventListener('click', () => this.downloadCode());
    document.getElementById('save-to-library').addEventListener('click', () => this.saveToLibrary());

    // Enter key in textarea
    document.getElementById('ai-prompt').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.generateAnimation();
      }
    });
  }

  async generateAnimation() {
    const prompt = document.getElementById('ai-prompt').value.trim();
    if (!prompt) {
      alert('Please enter a description for your animation');
      return;
    }

    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const spinner = generateBtn.querySelector('.loading-spinner');

    // Show loading state
    generateBtn.disabled = true;
    btnText.textContent = 'Generating...';
    spinner.style.display = 'inline-block';

    try {
      // Simulate AI generation (replace with actual AI API call)
      await this.simulateAIGeneration(prompt);
      
      // Generate animation based on prompt
      const animation = this.parsePromptAndGenerate(prompt);
      this.displayAnimation(animation);
      this.saveToHistory(prompt, animation);
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate animation. Please try again.');
    } finally {
      // Reset button state
      generateBtn.disabled = false;
      btnText.textContent = '✨ Generate Animation';
      spinner.style.display = 'none';
    }
  }

  async simulateAIGeneration(prompt) {
    // Simulate API delay
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  parsePromptAndGenerate(prompt) {
    const style = document.getElementById('animation-style').value;
    const duration = this.getDurationValue();
    
    // Simple AI logic - analyze keywords in prompt
    const keywords = prompt.toLowerCase();
    let animationType = 'bounce';
    let element = 'button';
    let colors = ['#667eea', '#764ba2'];

    // Determine animation type
    if (keywords.includes('bounce') || keywords.includes('jump')) animationType = 'bounce';
    else if (keywords.includes('fade') || keywords.includes('appear')) animationType = 'fade';
    else if (keywords.includes('slide') || keywords.includes('move')) animationType = 'slide';
    else if (keywords.includes('rotate') || keywords.includes('spin')) animationType = 'rotate';
    else if (keywords.includes('scale') || keywords.includes('grow')) animationType = 'scale';
    else if (keywords.includes('pulse') || keywords.includes('heartbeat')) animationType = 'pulse';
    else if (keywords.includes('shake') || keywords.includes('vibrate')) animationType = 'shake';
    else if (keywords.includes('flip')) animationType = 'flip';

    // Determine element type
    if (keywords.includes('button')) element = 'button';
    else if (keywords.includes('card')) element = 'card';
    else if (keywords.includes('text')) element = 'text';
    else if (keywords.includes('icon')) element = 'icon';
    else if (keywords.includes('box')) element = 'box';

    // Determine colors based on style and keywords
    if (keywords.includes('blue')) colors = ['#4facfe', '#00f2fe'];
    else if (keywords.includes('red')) colors = ['#fa709a', '#fee140'];
    else if (keywords.includes('green')) colors = ['#a8edea', '#fed6e3'];
    else if (keywords.includes('purple')) colors = ['#667eea', '#764ba2'];
    else if (keywords.includes('rainbow')) colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];

    return this.generateAnimationCode(animationType, element, colors, duration, style);
  }

  generateAnimationCode(animationType, element, colors, duration, style) {
    const animations = {
      bounce: {
        keyframes: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}`,
        animation: `bounce ${duration} ease-in-out infinite`
      },
      fade: {
        keyframes: `@keyframes fadeInOut {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}`,
        animation: `fadeInOut ${duration} ease-in-out infinite`
      },
      slide: {
        keyframes: `@keyframes slideLeftRight {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30px); }
}`,
        animation: `slideLeftRight ${duration} ease-in-out infinite`
      },
      rotate: {
        keyframes: `@keyframes rotate360 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
        animation: `rotate360 ${duration} linear infinite`
      },
      scale: {
        keyframes: `@keyframes scaleUpDown {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}`,
        animation: `scaleUpDown ${duration} ease-in-out infinite`
      },
      pulse: {
        keyframes: `@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
}`,
        animation: `pulse ${duration} ease-in-out infinite`
      },
      shake: {
        keyframes: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}`,
        animation: `shake ${duration} ease-in-out infinite`
      },
      flip: {
        keyframes: `@keyframes flip {
  0% { transform: rotateY(0); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}`,
        animation: `flip ${duration} ease-in-out infinite`
      }
    };

    const elementStyles = {
      button: {
        base: `padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; color: white;`,
        content: 'Click Me!'
      },
      card: {
        base: `width: 200px; height: 120px; border-radius: 12px; padding: 20px; color: white; display: flex; align-items: center; justify-content: center;`,
        content: 'Card Content'
      },
      text: {
        base: `font-size: 1.5rem; font-weight: bold; padding: 10px;`,
        content: 'Animated Text'
      },
      icon: {
        base: `width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;`,
        content: '⭐'
      },
      box: {
        base: `width: 100px; height: 100px; border-radius: 8px;`,
        content: ''
      }
    };

    const selectedAnimation = animations[animationType];
    const selectedElement = elementStyles[element];
    const gradient = colors.length > 2 
      ? `linear-gradient(45deg, ${colors.join(', ')})`
      : `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;

    const css = `/* AI Generated Animation */
${selectedAnimation.keyframes}

.ai-generated-element {
  ${selectedElement.base}
  background: ${gradient};
  animation: ${selectedAnimation.animation};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.ai-generated-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}`;

    const html = `<div class="ai-generated-element">
  ${selectedElement.content}
</div>`;

    const js = `// Optional JavaScript for enhanced interactivity
document.querySelector('.ai-generated-element').addEventListener('click', function() {
  this.style.animationPlayState = this.style.animationPlayState === 'paused' ? 'running' : 'paused';
});`;

    return { css, html, js, animationType, element };
  }

  getDurationValue() {
    const preset = document.getElementById('duration-preset').value;
    const durations = {
      fast: '0.3s',
      normal: '1s',
      slow: '2s',
      custom: '1s' // Could be expanded with custom input
    };
    return durations[preset];
  }

  displayAnimation(animation) {
    this.currentAnimation = animation;
    
    // Update preview
    const preview = document.getElementById('animation-preview');
    preview.innerHTML = `
      <style>${animation.css}</style>
      ${animation.html}
    `;

    // Update code panels
    document.querySelector('#css-code code').textContent = animation.css;
    document.querySelector('#html-code code').textContent = animation.html;
    document.querySelector('#js-code code').textContent = animation.js;

    // Enable controls
    document.getElementById('play-pause').disabled = false;
    document.getElementById('restart').disabled = false;
    document.getElementById('edit-code').disabled = false;
  }

  switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update panels
    document.querySelectorAll('.code-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${tab}-code`).classList.add('active');
  }

  togglePlayPause() {
    const element = document.querySelector('.ai-generated-element');
    if (!element) return;

    const btn = document.getElementById('play-pause');
    const isPlaying = element.style.animationPlayState !== 'paused';
    
    element.style.animationPlayState = isPlaying ? 'paused' : 'running';
    btn.textContent = isPlaying ? '▶️ Play' : '⏸️ Pause';
  }

  restartAnimation() {
    const element = document.querySelector('.ai-generated-element');
    if (!element) return;

    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = null;
  }

  editCode() {
    // Open code in a modal or redirect to playground
    alert('Edit functionality would open the code in the playground editor');
  }

  copyCode() {
    const activePanel = document.querySelector('.code-panel.active code');
    if (!activePanel) return;

    navigator.clipboard.writeText(activePanel.textContent).then(() => {
      const btn = document.getElementById('copy-code');
      const originalText = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = originalText, 2000);
    });
  }

  downloadCode() {
    if (!this.currentAnimation) return;

    const zip = {
      'animation.css': this.currentAnimation.css,
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Generated Animation</title>
  <link rel="stylesheet" href="animation.css">
</head>
<body>
  ${this.currentAnimation.html}
  <script src="animation.js"></script>
</body>
</html>`,
      'animation.js': this.currentAnimation.js
    };

    // Simple download (in real implementation, use JSZip)
    Object.entries(zip).forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  saveToLibrary() {
    if (!this.currentAnimation) return;
    
    // Save to local storage (in real implementation, save to database)
    const savedAnimations = JSON.parse(localStorage.getItem('savedAnimations')) || [];
    const newAnimation = {
      id: Date.now(),
      name: `AI Animation ${savedAnimations.length + 1}`,
      ...this.currentAnimation,
      createdAt: new Date().toISOString()
    };
    
    savedAnimations.push(newAnimation);
    localStorage.setItem('savedAnimations', JSON.stringify(savedAnimations));
    
    const btn = document.getElementById('save-to-library');
    const originalText = btn.textContent;
    btn.textContent = '💖 Saved!';
    setTimeout(() => btn.textContent = originalText, 2000);
  }

  saveToHistory(prompt, animation) {
    const historyItem = {
      id: Date.now(),
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      animation,
      timestamp: new Date().toISOString()
    };

    this.generationHistory.unshift(historyItem);
    this.generationHistory = this.generationHistory.slice(0, 10); // Keep last 10
    
    localStorage.setItem('aiGenerationHistory', JSON.stringify(this.generationHistory));
    this.loadHistory();
  }

  loadHistory() {
    const historyContainer = document.getElementById('generation-history');
    
    if (this.generationHistory.length === 0) {
      historyContainer.innerHTML = '<p style="text-align: center; color: #999;">No generations yet. Create your first AI animation!</p>';
      return;
    }

    historyContainer.innerHTML = this.generationHistory.map(item => `
      <div class="history-item" onclick="aiGenerator.loadFromHistory('${item.id}')">
        <h4>${item.animation.animationType} ${item.animation.element}</h4>
        <p>${item.prompt}</p>
        <small>${new Date(item.timestamp).toLocaleDateString()}</small>
      </div>
    `).join('');
  }

  loadFromHistory(id) {
    const item = this.generationHistory.find(h => h.id == id);
    if (!item) return;

    document.getElementById('ai-prompt').value = item.prompt;
    this.displayAnimation(item.animation);
  }
}

// Global functions
function setPrompt(text) {
  document.getElementById('ai-prompt').value = text;
}

// Initialize AI Generator
const aiGenerator = new AIAnimationGenerator();