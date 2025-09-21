// Enhanced Playground JavaScript
class AnimationPlayground {
  constructor() {
    this.editors = {};
    this.currentProject = {
      id: null,
      title: 'Untitled Animation',
      html: '<div class="animated-element">Hello World!</div>',
      css: `.animated-element {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}`,
      js: '// Add your JavaScript here\nconsole.log("Animation playground ready!");'
    };
    this.autoRun = true;
    this.init();
  }

  init() {
    this.initializeEditors();
    this.setupEventListeners();
    this.loadCommunityProjects();
    this.runCode();
  }

  initializeEditors() {
    // Initialize CodeMirror editors
    this.editors.html = CodeMirror.fromTextArea(document.getElementById('html-code'), {
      mode: 'htmlmixed',
      theme: 'dracula',
      lineNumbers: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true
    });

    this.editors.css = CodeMirror.fromTextArea(document.getElementById('css-code'), {
      mode: 'css',
      theme: 'dracula',
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true
    });

    this.editors.js = CodeMirror.fromTextArea(document.getElementById('js-code'), {
      mode: 'javascript',
      theme: 'dracula',
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true
    });

    // Set initial values
    this.editors.html.setValue(this.currentProject.html);
    this.editors.css.setValue(this.currentProject.css);
    this.editors.js.setValue(this.currentProject.js);

    // Auto-run on changes
    Object.values(this.editors).forEach(editor => {
      editor.on('change', () => {
        if (this.autoRun) {
          clearTimeout(this.runTimeout);
          this.runTimeout = setTimeout(() => this.runCode(), 500);
        }
      });
    });
  }

  setupEventListeners() {
    // Toolbar buttons
    document.getElementById('new-project').addEventListener('click', () => this.newProject());
    document.getElementById('save-project').addEventListener('click', () => this.saveProject());
    document.getElementById('fork-project').addEventListener('click', () => this.forkProject());
    document.getElementById('share-project').addEventListener('click', () => this.shareProject());
    document.getElementById('run-code').addEventListener('click', () => this.runCode());
    document.getElementById('fullscreen').addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('settings').addEventListener('click', () => this.openSettings());

    // Project title
    document.getElementById('project-title').addEventListener('input', (e) => {
      this.currentProject.title = e.target.value;
    });

    // Editor tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchEditorTab(e.target.dataset.editor));
    });

    // Preview controls
    document.getElementById('refresh-preview').addEventListener('click', () => this.runCode());
    document.getElementById('toggle-console').addEventListener('click', () => this.toggleConsole());
    document.getElementById('responsive-toggle').addEventListener('click', () => this.toggleResponsive());

    // Console
    document.getElementById('clear-console').addEventListener('click', () => this.clearConsole());

    // Community filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.filterCommunity(e.target.dataset.filter));
    });

    // Modal handlers
    this.setupModalHandlers();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  setupModalHandlers() {
    // Settings modal
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.querySelector('.modal-close').addEventListener('click', () => {
      settingsModal.classList.remove('open');
    });

    // Settings controls
    document.getElementById('editor-theme').addEventListener('change', (e) => {
      this.changeEditorTheme(e.target.value);
    });

    document.getElementById('font-size').addEventListener('input', (e) => {
      this.changeFontSize(e.target.value);
      document.getElementById('font-size-value').textContent = e.target.value + 'px';
    });

    document.getElementById('auto-run').addEventListener('change', (e) => {
      this.autoRun = e.target.checked;
    });

    document.getElementById('line-numbers').addEventListener('change', (e) => {
      this.toggleLineNumbers(e.target.checked);
    });

    // Share modal
    const shareModal = document.getElementById('share-modal');
    shareModal.querySelector('.modal-close').addEventListener('click', () => {
      shareModal.classList.remove('open');
    });

    document.getElementById('copy-share-url').addEventListener('click', () => {
      this.copyToClipboard(document.getElementById('share-url').value);
    });

    document.getElementById('copy-embed-code').addEventListener('click', () => {
      this.copyToClipboard(document.getElementById('embed-code').value);
    });

    // Social sharing
    document.querySelectorAll('.social-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = e.target.classList.contains('twitter') ? 'twitter' :
                         e.target.classList.contains('facebook') ? 'facebook' : 'linkedin';
        this.shareOnSocial(platform);
      });
    });

    // Close modals on outside click
    [settingsModal, shareModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });
  }

  switchEditorTab(editor) {
    // Update tab buttons
    document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-editor="${editor}"]`).classList.add('active');

    // Update editor panes
    document.querySelectorAll('.editor-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(`${editor}-editor`).classList.add('active');

    // Refresh editor
    setTimeout(() => this.editors[editor].refresh(), 100);
  }

  runCode() {
    const html = this.editors.html.getValue();
    const css = this.editors.css.getValue();
    const js = this.editors.js.getValue();

    const previewFrame = document.getElementById('preview-frame');
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;

    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // Console override to capture logs
    const originalConsole = window.console;
    window.console = {
      log: (...args) => {
        originalConsole.log(...args);
        parent.postMessage({type: 'console', level: 'log', args: args.map(String)}, '*');
      },
      error: (...args) => {
        originalConsole.error(...args);
        parent.postMessage({type: 'console', level: 'error', args: args.map(String)}, '*');
      },
      warn: (...args) => {
        originalConsole.warn(...args);
        parent.postMessage({type: 'console', level: 'warn', args: args.map(String)}, '*');
      },
      info: (...args) => {
        originalConsole.info(...args);
        parent.postMessage({type: 'console', level: 'info', args: args.map(String)}, '*');
      }
    };

    // Error handling
    window.onerror = (msg, url, line, col, error) => {
      parent.postMessage({type: 'console', level: 'error', args: [msg + ' at line ' + line]}, '*');
    };

    try {
      ${js}
    } catch (error) {
      parent.postMessage({type: 'console', level: 'error', args: [error.toString()]}, '*');
    }
  </script>
</body>
</html>`;

    previewDoc.open();
    previewDoc.write(fullHTML);
    previewDoc.close();

    // Update current project
    this.currentProject.html = html;
    this.currentProject.css = css;
    this.currentProject.js = js;
  }

  newProject() {
    if (confirm('Create a new project? Unsaved changes will be lost.')) {
      this.currentProject = {
        id: null,
        title: 'Untitled Animation',
        html: '<div class="animated-element">Hello World!</div>',
        css: `.animated-element {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}`,
        js: '// Add your JavaScript here\nconsole.log("New animation project!");'
      };

      document.getElementById('project-title').value = this.currentProject.title;
      this.editors.html.setValue(this.currentProject.html);
      this.editors.css.setValue(this.currentProject.css);
      this.editors.js.setValue(this.currentProject.js);
      this.runCode();
    }
  }

  saveProject() {
    const projects = JSON.parse(localStorage.getItem('playgroundProjects')) || [];
    
    if (!this.currentProject.id) {
      this.currentProject.id = Date.now();
    }

    this.currentProject.title = document.getElementById('project-title').value;
    this.currentProject.html = this.editors.html.getValue();
    this.currentProject.css = this.editors.css.getValue();
    this.currentProject.js = this.editors.js.getValue();
    this.currentProject.updatedAt = new Date().toISOString();

    const existingIndex = projects.findIndex(p => p.id === this.currentProject.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = this.currentProject;
    } else {
      this.currentProject.createdAt = new Date().toISOString();
      projects.push(this.currentProject);
    }

    localStorage.setItem('playgroundProjects', JSON.stringify(projects));
    this.showToast('Project saved successfully!');
  }

  forkProject() {
    const forkedProject = {
      ...this.currentProject,
      id: Date.now(),
      title: this.currentProject.title + ' (Fork)',
      createdAt: new Date().toISOString()
    };

    this.currentProject = forkedProject;
    document.getElementById('project-title').value = forkedProject.title;
    this.showToast('Project forked successfully!');
  }

  shareProject() {
    this.saveProject(); // Save before sharing
    
    const shareUrl = `${window.location.origin}/playground?id=${this.currentProject.id}`;
    const embedCode = `<iframe src="${shareUrl}" width="100%" height="400" frameborder="0"></iframe>`;

    document.getElementById('share-url').value = shareUrl;
    document.getElementById('embed-code').value = embedCode;
    document.getElementById('share-modal').classList.add('open');
  }

  toggleFullscreen() {
    const previewPanel = document.querySelector('.preview-panel');
    previewPanel.classList.toggle('fullscreen');
    
    if (previewPanel.classList.contains('fullscreen')) {
      previewPanel.style.position = 'fixed';
      previewPanel.style.top = '0';
      previewPanel.style.left = '0';
      previewPanel.style.width = '100vw';
      previewPanel.style.height = '100vh';
      previewPanel.style.zIndex = '9999';
      previewPanel.style.background = 'white';
    } else {
      previewPanel.style = '';
    }
  }

  openSettings() {
    document.getElementById('settings-modal').classList.add('open');
  }

  toggleConsole() {
    const consolePanel = document.getElementById('console-panel');
    consolePanel.classList.toggle('open');
  }

  toggleResponsive() {
    const previewFrame = document.getElementById('preview-frame');
    const isResponsive = previewFrame.style.width === '375px';
    
    if (isResponsive) {
      previewFrame.style.width = '100%';
      previewFrame.style.height = '100%';
    } else {
      previewFrame.style.width = '375px';
      previewFrame.style.height = '667px';
      previewFrame.style.margin = '20px auto';
      previewFrame.style.border = '1px solid #ddd';
      previewFrame.style.borderRadius = '20px';
    }
  }

  clearConsole() {
    document.getElementById('console-output').innerHTML = '';
  }

  changeEditorTheme(theme) {
    Object.values(this.editors).forEach(editor => {
      editor.setOption('theme', theme);
    });
  }

  changeFontSize(size) {
    const style = document.createElement('style');
    style.textContent = `.CodeMirror { font-size: ${size}px !important; }`;
    document.head.appendChild(style);
  }

  toggleLineNumbers(show) {
    Object.values(this.editors).forEach(editor => {
      editor.setOption('lineNumbers', show);
    });
  }

  filterCommunity(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    this.loadCommunityProjects(filter);
  }

  loadCommunityProjects(filter = 'recent') {
    // Mock community projects
    const mockProjects = [
      {
        id: 1,
        title: 'Floating Cards Animation',
        description: 'Beautiful floating cards with hover effects',
        author: 'John Doe',
        likes: 42,
        views: 156,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'Neon Button Collection',
        description: 'Glowing neon buttons with various effects',
        author: 'Jane Smith',
        likes: 38,
        views: 203,
        createdAt: '2024-01-14'
      },
      {
        id: 3,
        title: 'Loading Spinner Pack',
        description: 'Modern loading spinners and indicators',
        author: 'Mike Johnson',
        likes: 55,
        views: 289,
        createdAt: '2024-01-13'
      }
    ];

    const communityGrid = document.getElementById('community-grid');
    communityGrid.innerHTML = mockProjects.map(project => `
      <div class="community-item" onclick="playground.loadCommunityProject(${project.id})">
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <div class="meta">
          <span>by ${project.author}</span>
          <span>❤️ ${project.likes}</span>
        </div>
      </div>
    `).join('');
  }

  loadCommunityProject(id) {
    // Mock loading community project
    this.showToast('Loading community project...');
    // In real implementation, fetch project data and load into editors
  }

  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 's':
          e.preventDefault();
          this.saveProject();
          break;
        case 'Enter':
          e.preventDefault();
          this.runCode();
          break;
        case 'n':
          e.preventDefault();
          this.newProject();
          break;
      }
    }
  }

  shareOnSocial(platform) {
    const url = document.getElementById('share-url').value;
    const text = `Check out my animation: ${this.currentProject.title}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Copied to clipboard!');
    });
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
}

// Handle console messages from iframe
window.addEventListener('message', (e) => {
  if (e.data.type === 'console') {
    const consoleOutput = document.getElementById('console-output');
    const logElement = document.createElement('div');
    logElement.className = `console-log console-${e.data.level}`;
    logElement.textContent = e.data.args.join(' ');
    consoleOutput.appendChild(logElement);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }
});

// Initialize playground
const playground = new AnimationPlayground();