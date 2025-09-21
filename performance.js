// Performance Analyzer JavaScript
class PerformanceAnalyzer {
  constructor() {
    this.isAnalyzing = false;
    this.metrics = {
      fps: [],
      cpu: [],
      memory: [],
      battery: 100
    };
    this.charts = {};
    this.animationFrame = null;
    this.startTime = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeCharts();
    this.setupFileDropZone();
  }

  setupEventListeners() {
    // Input tabs
    document.querySelectorAll('.input-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchInputTab(e.target.dataset.tab));
    });

    // Report tabs
    document.querySelectorAll('.report-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchReportTab(e.target.dataset.tab));
    });

    // Analysis controls
    document.getElementById('start-analysis').addEventListener('click', () => this.startAnalysis());
    document.getElementById('load-url').addEventListener('click', () => this.loadFromURL());

    // Timeline controls
    document.getElementById('play-timeline').addEventListener('click', () => this.playTimeline());
    document.getElementById('pause-timeline').addEventListener('click', () => this.pauseTimeline());
    document.getElementById('reset-timeline').addEventListener('click', () => this.resetTimeline());

    // Export and share
    document.getElementById('export-report').addEventListener('click', () => this.exportReport());
    document.getElementById('share-results').addEventListener('click', () => this.shareResults());

    // File picker
    document.getElementById('file-picker').addEventListener('change', (e) => this.handleFileSelect(e));
  }

  setupFileDropZone() {
    const dropZone = document.getElementById('file-drop');
    
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
    dropZone.addEventListener('click', () => document.getElementById('file-picker').click());
  }

  switchInputTab(tab) {
    document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    document.querySelectorAll('.input-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${tab}-input`).classList.add('active');
  }

  switchReportTab(tab) {
    document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    document.querySelectorAll('.report-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${tab}-report`).classList.add('active');
  }

  async startAnalysis() {
    if (this.isAnalyzing) return;

    const analyzeBtn = document.getElementById('start-analysis');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const spinner = analyzeBtn.querySelector('.loading-spinner');

    // Show loading state
    this.isAnalyzing = true;
    analyzeBtn.disabled = true;
    btnText.textContent = 'Analyzing...';
    spinner.style.display = 'inline-block';

    try {
      // Get input code
      const html = document.getElementById('html-input').value;
      const css = document.getElementById('css-input').value;
      const js = document.getElementById('js-input').value;

      if (!html && !css && !js) {
        alert('Please provide some code to analyze');
        return;
      }

      // Reset metrics
      this.resetMetrics();

      // Start monitoring
      this.startMonitoring();

      // Create test environment
      await this.createTestEnvironment(html, css, js);

      // Run analysis for 10 seconds
      await this.runAnalysisLoop(10000);

      // Generate results
      this.generateResults();

    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check your code and try again.');
    } finally {
      // Reset button state
      this.isAnalyzing = false;
      analyzeBtn.disabled = false;
      btnText.textContent = '🔍 Start Analysis';
      spinner.style.display = 'none';
    }
  }

  resetMetrics() {
    this.metrics = {
      fps: [],
      cpu: [],
      memory: [],
      battery: 100
    };
    this.startTime = performance.now();
  }

  startMonitoring() {
    // Enable result actions
    document.getElementById('export-report').disabled = false;
    document.getElementById('share-results').disabled = false;

    // Start FPS monitoring
    this.monitorFPS();

    // Start resource monitoring
    this.monitorResources();
  }

  monitorFPS() {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.metrics.fps.push(fps);
        
        // Update UI
        document.getElementById('fps-value').textContent = fps;
        this.updateFPSStatus(fps);
        this.updateChart('fps', fps);
        
        frameCount = 0;
        lastTime = currentTime;
      }

      if (this.isAnalyzing) {
        this.animationFrame = requestAnimationFrame(measureFPS);
      }
    };

    this.animationFrame = requestAnimationFrame(measureFPS);
  }

  monitorResources() {
    const monitorInterval = setInterval(() => {
      if (!this.isAnalyzing) {
        clearInterval(monitorInterval);
        return;
      }

      // Simulate CPU usage (in real implementation, use Performance Observer)
      const cpuUsage = Math.random() * 60 + 20; // 20-80%
      this.metrics.cpu.push(cpuUsage);
      document.getElementById('cpu-value').textContent = Math.round(cpuUsage) + '%';
      this.updateCPUStatus(cpuUsage);
      this.updateChart('cpu', cpuUsage);

      // Simulate memory usage
      const memoryUsage = Math.random() * 200 + 50; // 50-250 MB
      this.metrics.memory.push(memoryUsage);
      document.getElementById('memory-value').textContent = Math.round(memoryUsage) + ' MB';
      this.updateMemoryStatus(memoryUsage);
      this.updateChart('memory', memoryUsage);

      // Simulate battery impact
      this.metrics.battery -= Math.random() * 0.5;
      this.updateBatteryIndicator();

    }, 1000);
  }

  async createTestEnvironment(html, css, js) {
    // Create hidden iframe for testing
    const testFrame = document.createElement('iframe');
    testFrame.style.position = 'absolute';
    testFrame.style.left = '-9999px';
    testFrame.style.width = '1000px';
    testFrame.style.height = '800px';
    document.body.appendChild(testFrame);

    const testDoc = testFrame.contentDocument;
    testDoc.open();
    testDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
    `);
    testDoc.close();

    // Store reference for cleanup
    this.testFrame = testFrame;
  }

  async runAnalysisLoop(duration) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
        }
        if (this.testFrame) {
          this.testFrame.remove();
        }
        resolve();
      }, duration);
    });
  }

  generateResults() {
    // Calculate overall scores
    const avgFPS = this.calculateAverage(this.metrics.fps);
    const avgCPU = this.calculateAverage(this.metrics.cpu);
    const avgMemory = this.calculateAverage(this.metrics.memory);

    // Calculate performance scores
    const smoothnessScore = Math.min(100, (avgFPS / 60) * 100);
    const efficiencyScore = Math.max(0, 100 - avgCPU);
    const compatibilityScore = 85; // Simulated based on CSS features used

    const overallScore = Math.round((smoothnessScore + efficiencyScore + compatibilityScore) / 3);

    // Update UI
    this.updateScoreCard(overallScore, smoothnessScore, efficiencyScore, compatibilityScore);
    this.generateRecommendations(avgFPS, avgCPU, avgMemory);
    this.generateDetailedReport(avgFPS, avgCPU, avgMemory);
  }

  updateScoreCard(overall, smoothness, efficiency, compatibility) {
    document.getElementById('overall-score').textContent = overall;
    document.getElementById('overall-score').className = `score-badge ${this.getScoreClass(overall)}`;

    // Update score bars
    document.getElementById('smoothness-score').textContent = Math.round(smoothness);
    document.querySelector('[data-metric="smoothness"]').style.width = smoothness + '%';

    document.getElementById('efficiency-score').textContent = Math.round(efficiency);
    document.querySelector('[data-metric="efficiency"]').style.width = efficiency + '%';

    document.getElementById('compatibility-score').textContent = Math.round(compatibility);
    document.querySelector('[data-metric="compatibility"]').style.width = compatibility + '%';
  }

  getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  updateFPSStatus(fps) {
    const status = document.getElementById('fps-status');
    if (fps >= 55) {
      status.textContent = 'Excellent';
      status.className = 'status-indicator good';
    } else if (fps >= 30) {
      status.textContent = 'Good';
      status.className = 'status-indicator warning';
    } else {
      status.textContent = 'Poor';
      status.className = 'status-indicator error';
    }
  }

  updateCPUStatus(cpu) {
    const status = document.getElementById('cpu-status');
    if (cpu <= 30) {
      status.textContent = 'Efficient';
      status.className = 'status-indicator good';
    } else if (cpu <= 60) {
      status.textContent = 'Moderate';
      status.className = 'status-indicator warning';
    } else {
      status.textContent = 'High Usage';
      status.className = 'status-indicator error';
    }
  }

  updateMemoryStatus(memory) {
    const status = document.getElementById('memory-status');
    document.getElementById('total-memory').textContent = '1024'; // Simulated total memory
    
    if (memory <= 100) {
      status.textContent = 'Efficient';
      status.className = 'status-indicator good';
    } else if (memory <= 200) {
      status.textContent = 'Moderate';
      status.className = 'status-indicator warning';
    } else {
      status.textContent = 'High Usage';
      status.className = 'status-indicator error';
    }
  }

  updateBatteryIndicator() {
    const batteryLevel = document.getElementById('battery-level');
    const batteryValue = document.getElementById('battery-value');
    const batteryStatus = document.getElementById('battery-status');

    const impactLevel = 100 - this.metrics.battery;
    batteryLevel.style.width = impactLevel + '%';
    
    if (impactLevel <= 20) {
      batteryValue.textContent = 'Low';
      batteryStatus.textContent = 'Battery Friendly';
      batteryStatus.className = 'status-indicator good';
    } else if (impactLevel <= 50) {
      batteryValue.textContent = 'Medium';
      batteryStatus.textContent = 'Moderate Impact';
      batteryStatus.className = 'status-indicator warning';
    } else {
      batteryValue.textContent = 'High';
      batteryStatus.textContent = 'High Impact';
      batteryStatus.className = 'status-indicator error';
    }
  }

  initializeCharts() {
    // Initialize canvas contexts for charts
    const chartIds = ['fps-chart', 'cpu-chart', 'memory-chart', 'timeline-chart'];
    
    chartIds.forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        this.charts[id] = canvas.getContext('2d');
        this.clearChart(id);
      }
    });
  }

  updateChart(type, value) {
    const chartId = `${type}-chart`;
    const ctx = this.charts[chartId];
    if (!ctx) return;

    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear and redraw chart
    ctx.clearRect(0, 0, width, height);
    
    const data = this.metrics[type];
    const maxValue = type === 'fps' ? 60 : (type === 'cpu' ? 100 : 300);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw data line
    if (data.length > 1) {
      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      data.forEach((point, index) => {
        const x = (width / Math.max(data.length - 1, 1)) * index;
        const y = height - (point / maxValue) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }
  }

  clearChart(chartId) {
    const ctx = this.charts[chartId];
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }

  generateRecommendations(avgFPS, avgCPU, avgMemory) {
    const recommendations = [];

    if (avgFPS < 30) {
      recommendations.push({
        title: 'Low Frame Rate Detected',
        description: 'Your animation is running below 30 FPS. Consider reducing complexity or using CSS transforms instead of changing layout properties.',
        severity: 'high'
      });
    }

    if (avgCPU > 70) {
      recommendations.push({
        title: 'High CPU Usage',
        description: 'Animation is consuming significant CPU resources. Try using hardware acceleration with transform3d() or will-change property.',
        severity: 'high'
      });
    }

    if (avgMemory > 200) {
      recommendations.push({
        title: 'Memory Usage Concern',
        description: 'High memory consumption detected. Check for memory leaks in JavaScript animations and consider using CSS animations instead.',
        severity: 'medium'
      });
    }

    // Add general recommendations
    recommendations.push({
      title: 'Use CSS Transforms',
      description: 'Prefer CSS transforms (translate, scale, rotate) over changing layout properties for better performance.',
      severity: 'low'
    });

    recommendations.push({
      title: 'Enable Hardware Acceleration',
      description: 'Add transform: translateZ(0) or will-change property to enable GPU acceleration.',
      severity: 'low'
    });

    this.displayRecommendations(recommendations);
  }

  displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-list');
    
    if (recommendations.length === 0) {
      container.innerHTML = '<div class="recommendation-placeholder"><div class="placeholder-icon">🎉</div><p>Great! No major performance issues detected.</p></div>';
      return;
    }

    container.innerHTML = recommendations.map(rec => `
      <div class="recommendation-item">
        <h4>${rec.title}</h4>
        <p>${rec.description}</p>
        <span class="severity ${rec.severity}">${rec.severity.toUpperCase()}</span>
      </div>
    `).join('');
  }

  generateDetailedReport(avgFPS, avgCPU, avgMemory) {
    // Summary report
    const summaryReport = `
      <div class="report-summary">
        <h4>Performance Summary</h4>
        <ul>
          <li>Average Frame Rate: ${Math.round(avgFPS)} FPS</li>
          <li>Average CPU Usage: ${Math.round(avgCPU)}%</li>
          <li>Average Memory Usage: ${Math.round(avgMemory)} MB</li>
          <li>Battery Impact: ${this.metrics.battery < 95 ? 'Moderate' : 'Low'}</li>
        </ul>
        <p>Analysis completed in ${Math.round((performance.now() - this.startTime) / 1000)} seconds.</p>
      </div>
    `;

    document.getElementById('summary-report').innerHTML = summaryReport;

    // Issues report
    const issues = [];
    if (avgFPS < 30) issues.push('Frame rate below optimal threshold');
    if (avgCPU > 70) issues.push('High CPU utilization detected');
    if (avgMemory > 200) issues.push('Excessive memory consumption');

    const issuesReport = issues.length > 0 
      ? `<ul>${issues.map(issue => `<li>${issue}</li>`).join('')}</ul>`
      : '<p>No critical performance issues detected.</p>';

    document.getElementById('issues-report').innerHTML = issuesReport;

    // Suggestions report
    const suggestionsReport = `
      <div class="suggestions-content">
        <h4>Optimization Suggestions</h4>
        <ol>
          <li>Use CSS transforms instead of changing layout properties</li>
          <li>Enable hardware acceleration with transform3d(0,0,0)</li>
          <li>Minimize DOM manipulations during animations</li>
          <li>Use requestAnimationFrame for JavaScript animations</li>
          <li>Consider using CSS animations for simple effects</li>
        </ol>
      </div>
    `;

    document.getElementById('suggestions-report').innerHTML = suggestionsReport;

    // Optimized code report
    const optimizedCode = this.generateOptimizedCode();
    document.getElementById('code-report').innerHTML = `<pre><code>${optimizedCode}</code></pre>`;
  }

  generateOptimizedCode() {
    return `/* Optimized CSS Animation */
.optimized-element {
  /* Enable hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
  
  /* Use transforms instead of layout properties */
  animation: optimizedBounce 2s ease-in-out infinite;
}

@keyframes optimizedBounce {
  0%, 100% { 
    transform: translateY(0) translateZ(0); 
  }
  50% { 
    transform: translateY(-20px) translateZ(0); 
  }
}

/* JavaScript optimization */
function optimizedAnimation() {
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    
    // Use transforms for better performance
    element.style.transform = \`translateY(\${Math.sin(progress * 0.01) * 20}px)\`;
    
    if (progress < 2000) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}`;
  }

  calculateAverage(array) {
    return array.length > 0 ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }

  loadFromURL() {
    const url = document.getElementById('test-url').value;
    if (!url) {
      alert('Please enter a valid URL');
      return;
    }

    // In a real implementation, this would load and analyze the URL
    alert('URL analysis feature would be implemented with a backend service');
  }

  handleFileSelect(event) {
    const files = Array.from(event.target.files);
    this.processFiles(files);
  }

  handleFileDrop(event) {
    const files = Array.from(event.dataTransfer.files);
    this.processFiles(files);
  }

  processFiles(files) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const extension = file.name.split('.').pop().toLowerCase();
        
        switch(extension) {
          case 'html':
            document.getElementById('html-input').value = content;
            break;
          case 'css':
            document.getElementById('css-input').value = content;
            break;
          case 'js':
            document.getElementById('js-input').value = content;
            break;
        }
      };
      reader.readAsText(file);
    });

    // Switch to code input tab
    this.switchInputTab('code');
  }

  playTimeline() {
    // Timeline playback functionality
    console.log('Playing timeline...');
  }

  pauseTimeline() {
    // Timeline pause functionality
    console.log('Pausing timeline...');
  }

  resetTimeline() {
    // Timeline reset functionality
    console.log('Resetting timeline...');
  }

  exportReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        avgFPS: this.calculateAverage(this.metrics.fps),
        avgCPU: this.calculateAverage(this.metrics.cpu),
        avgMemory: this.calculateAverage(this.metrics.memory),
        batteryImpact: 100 - this.metrics.battery
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animation-performance-report.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  shareResults() {
    const shareUrl = `${window.location.origin}/performance-report?id=${Date.now()}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Animation Performance Report',
        text: 'Check out my animation performance analysis',
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share URL copied to clipboard!');
      });
    }
  }
}

// Initialize Performance Analyzer
const performanceAnalyzer = new PerformanceAnalyzer();