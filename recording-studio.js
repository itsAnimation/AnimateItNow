// Animation Recording Studio JavaScript
class AnimationRecordingStudio {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;
    this.currentRecording = null;
    this.recordings = JSON.parse(localStorage.getItem('studioRecordings')) || [];
    this.timeline = {
      duration: 6000, // 6 seconds
      currentTime: 0,
      keyframes: [
        { time: 0, thumbnail: 'Start' },
        { time: 2000, thumbnail: 'Mid' },
        { time: 4000, thumbnail: 'End' }
      ]
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeTimeline();
    this.loadRecordings();
    this.setupMouseTracking();
  }

  setupEventListeners() {
    // Recording controls
    document.getElementById('start-recording').addEventListener('click', () => this.startRecording());
    document.getElementById('pause-recording').addEventListener('click', () => this.pauseRecording());
    document.getElementById('stop-recording').addEventListener('click', () => this.stopRecording());
    document.getElementById('start-voiceover').addEventListener('click', () => this.startVoiceover());

    // Preview controls
    document.getElementById('fullscreen-preview').addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('grid-overlay').addEventListener('click', () => this.toggleGrid());
    document.getElementById('mouse-highlight').addEventListener('click', () => this.toggleMouseHighlight());

    // Timeline controls
    document.getElementById('timeline-scrubber').addEventListener('input', (e) => this.scrubTimeline(e));
    document.getElementById('add-keyframe').addEventListener('click', () => this.addKeyframe());
    document.getElementById('delete-keyframe').addEventListener('click', () => this.deleteKeyframe());
    document.getElementById('timeline-zoom-in').addEventListener('click', () => this.zoomTimeline(1.2));
    document.getElementById('timeline-zoom-out').addEventListener('click', () => this.zoomTimeline(0.8));

    // Export controls
    document.querySelectorAll('.format-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectFormat(e.currentTarget.dataset.format));
    });
    document.getElementById('compression').addEventListener('input', (e) => {
      document.getElementById('compression-value').textContent = e.target.value * 10 + '%';
    });
    document.getElementById('preview-export').addEventListener('click', () => this.previewExport());
    document.getElementById('start-export').addEventListener('click', () => this.startExport());

    // Modal controls
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
    });
    document.getElementById('save-recording').addEventListener('click', () => this.saveRecording());
    document.getElementById('discard-recording').addEventListener('click', () => this.discardRecording());
    document.getElementById('export-now').addEventListener('click', () => this.exportFromModal());

    // History controls
    document.getElementById('clear-history').addEventListener('click', () => this.clearHistory());
  }

  async startRecording() {
    try {
      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: parseInt(document.getElementById('frame-rate').value) }
        },
        audio: this.shouldIncludeAudio()
      });

      // Add microphone audio if selected
      if (document.getElementById('audio-input').value === 'microphone' || 
          document.getElementById('audio-input').value === 'both') {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = audioStream.getAudioTracks()[0];
        stream.addTrack(audioTrack);
      }

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      this.recordedChunks = [];
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.handleRecordingStop();
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;
      this.startTime = Date.now();
      this.updateRecordingUI();
      this.startTimer();

    } catch (error) {
      console.error('Error starting recording:', error);
      this.showToast('Failed to start recording. Please check permissions.', 'error');
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.isRecording) {
      if (this.isPaused) {
        this.mediaRecorder.resume();
        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;
      } else {
        this.mediaRecorder.pause();
        this.isPaused = true;
        this.pausedTime = Date.now() - this.startTime;
      }
      this.updateRecordingUI();
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      this.isPaused = false;
      this.updateRecordingUI();
      this.stopTimer();
    }
  }

  async startVoiceover() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioRecorder = new MediaRecorder(stream);
      
      // Handle voiceover recording
      this.showToast('Voiceover recording started', 'success');
      
      // In a real implementation, this would sync with the timeline
      setTimeout(() => {
        audioRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        this.showToast('Voiceover recording completed', 'success');
      }, 5000);

    } catch (error) {
      console.error('Error starting voiceover:', error);
      this.showToast('Failed to start voiceover recording', 'error');
    }
  }

  shouldIncludeAudio() {
    const audioSetting = document.getElementById('audio-input').value;
    return audioSetting === 'system' || audioSetting === 'both';
  }

  handleRecordingStop() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    this.currentRecording = {
      id: Date.now(),
      blob: blob,
      url: URL.createObjectURL(blob),
      duration: this.getRecordingDuration(),
      timestamp: new Date().toISOString(),
      title: `Recording ${this.recordings.length + 1}`
    };

    this.showRecordingPreview();
  }

  showRecordingPreview() {
    const modal = document.getElementById('recording-modal');
    const video = document.getElementById('recording-preview');
    
    video.src = this.currentRecording.url;
    modal.classList.add('open');
  }

  saveRecording() {
    if (this.currentRecording) {
      this.recordings.unshift(this.currentRecording);
      localStorage.setItem('studioRecordings', JSON.stringify(this.recordings.slice(0, 10))); // Keep last 10
      this.loadRecordings();
      this.closeModal(document.getElementById('recording-modal'));
      this.showToast('Recording saved successfully!', 'success');
    }
  }

  discardRecording() {
    if (this.currentRecording) {
      URL.revokeObjectURL(this.currentRecording.url);
      this.currentRecording = null;
      this.closeModal(document.getElementById('recording-modal'));
      this.showToast('Recording discarded', 'info');
    }
  }

  exportFromModal() {
    this.closeModal(document.getElementById('recording-modal'));
    this.startExport();
  }

  updateRecordingUI() {
    const startBtn = document.getElementById('start-recording');
    const pauseBtn = document.getElementById('pause-recording');
    const stopBtn = document.getElementById('stop-recording');
    const status = document.getElementById('recording-status');
    const indicator = document.getElementById('recording-indicator');

    if (this.isRecording) {
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
      
      if (this.isPaused) {
        status.textContent = 'Paused';
        status.className = 'recording-status paused';
        pauseBtn.querySelector('.btn-text').textContent = 'Resume';
        indicator.classList.remove('active');
      } else {
        status.textContent = 'Recording';
        status.className = 'recording-status recording';
        pauseBtn.querySelector('.btn-text').textContent = 'Pause';
        indicator.classList.add('active');
      }
    } else {
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
      status.textContent = 'Ready to Record';
      status.className = 'recording-status';
      pauseBtn.querySelector('.btn-text').textContent = 'Pause';
      indicator.classList.remove('active');
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        const elapsed = Date.now() - this.startTime;
        this.updateTimerDisplay(elapsed);
      }
    }, 100);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay(elapsed) {
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = display;
  }

  getRecordingDuration() {
    const elapsed = this.pausedTime || (Date.now() - this.startTime);
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Timeline functions
  initializeTimeline() {
    this.updateTimelineRuler();
    this.setupTimelineDragging();
  }

  updateTimelineRuler() {
    const ruler = document.getElementById('timeline-ruler');
    ruler.innerHTML = '';
    
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const mark = document.createElement('div');
      mark.style.position = 'absolute';
      mark.style.left = `${(i / steps) * 100}%`;
      mark.style.width = '1px';
      mark.style.height = '100%';
      mark.style.background = '#ccc';
      ruler.appendChild(mark);
    }
  }

  scrubTimeline(event) {
    const value = parseInt(event.target.value);
    this.timeline.currentTime = (value / 100) * this.timeline.duration;
    this.updatePlayhead();
    this.updateCurrentTimeDisplay();
  }

  updatePlayhead() {
    const playhead = document.getElementById('playhead');
    const percentage = (this.timeline.currentTime / this.timeline.duration) * 100;
    playhead.style.left = `${percentage}%`;
  }

  updateCurrentTimeDisplay() {
    const currentTime = document.getElementById('current-time');
    const seconds = Math.floor(this.timeline.currentTime / 1000);
    const minutes = Math.floor(seconds / 60);
    currentTime.textContent = `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  addKeyframe() {
    const newKeyframe = {
      time: this.timeline.currentTime,
      thumbnail: `Frame ${this.timeline.keyframes.length + 1}`
    };
    
    this.timeline.keyframes.push(newKeyframe);
    this.timeline.keyframes.sort((a, b) => a.time - b.time);
    this.renderKeyframes();
    this.showToast('Keyframe added', 'success');
  }

  deleteKeyframe() {
    if (this.timeline.keyframes.length > 1) {
      this.timeline.keyframes.pop();
      this.renderKeyframes();
      this.showToast('Keyframe deleted', 'info');
    }
  }

  renderKeyframes() {
    const track = document.getElementById('timeline-track');
    const keyframes = track.querySelectorAll('.keyframe');
    keyframes.forEach(kf => kf.remove());

    this.timeline.keyframes.forEach((keyframe, index) => {
      const element = this.createKeyframeElement(keyframe, index);
      track.appendChild(element);
    });
  }

  createKeyframeElement(keyframe, index) {
    const element = document.createElement('div');
    element.className = 'keyframe';
    element.dataset.time = keyframe.time;
    element.style.left = `${(keyframe.time / this.timeline.duration) * 100}%`;
    
    element.innerHTML = `
      <div class="keyframe-thumbnail">
        <div class="thumbnail-preview">${keyframe.thumbnail}</div>
      </div>
      <div class="keyframe-time">${this.formatTime(keyframe.time)}</div>
    `;

    element.addEventListener('click', () => {
      this.timeline.currentTime = keyframe.time;
      this.updatePlayhead();
      this.updateCurrentTimeDisplay();
    });

    return element;
  }

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  zoomTimeline(factor) {
    // Timeline zoom functionality
    this.showToast(`Timeline zoom: ${factor > 1 ? 'In' : 'Out'}`, 'info');
  }

  setupTimelineDragging() {
    // Add drag functionality for keyframes
    const track = document.getElementById('timeline-track');
    let draggedElement = null;

    track.addEventListener('mousedown', (e) => {
      if (e.target.closest('.keyframe')) {
        draggedElement = e.target.closest('.keyframe');
        draggedElement.style.zIndex = '100';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (draggedElement) {
        const trackRect = track.getBoundingClientRect();
        const x = e.clientX - trackRect.left;
        const percentage = Math.max(0, Math.min(100, (x / trackRect.width) * 100));
        draggedElement.style.left = `${percentage}%`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (draggedElement) {
        draggedElement.style.zIndex = '';
        draggedElement = null;
      }
    });
  }

  // Preview controls
  toggleFullscreen() {
    const previewArea = document.getElementById('preview-area');
    const btn = document.getElementById('fullscreen-preview');
    
    if (!document.fullscreenElement) {
      previewArea.requestFullscreen();
      btn.classList.add('active');
    } else {
      document.exitFullscreen();
      btn.classList.remove('active');
    }
  }

  toggleGrid() {
    const grid = document.getElementById('grid-overlay-element');
    const btn = document.getElementById('grid-overlay');
    
    if (grid.style.display === 'none') {
      grid.style.display = 'block';
      btn.classList.add('active');
    } else {
      grid.style.display = 'none';
      btn.classList.remove('active');
    }
  }

  toggleMouseHighlight() {
    const cursor = document.getElementById('mouse-cursor');
    const btn = document.getElementById('mouse-highlight');
    
    if (cursor.style.display === 'none') {
      cursor.style.display = 'block';
      btn.classList.add('active');
      this.startMouseTracking();
    } else {
      cursor.style.display = 'none';
      btn.classList.remove('active');
      this.stopMouseTracking();
    }
  }

  setupMouseTracking() {
    this.mouseTrackingEnabled = false;
  }

  startMouseTracking() {
    this.mouseTrackingEnabled = true;
    const previewArea = document.getElementById('preview-area');
    const cursor = document.getElementById('mouse-cursor');

    this.mouseMoveHandler = (e) => {
      if (this.mouseTrackingEnabled) {
        const rect = previewArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
      }
    };

    previewArea.addEventListener('mousemove', this.mouseMoveHandler);
  }

  stopMouseTracking() {
    this.mouseTrackingEnabled = false;
    const previewArea = document.getElementById('preview-area');
    if (this.mouseMoveHandler) {
      previewArea.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  // Export functions
  selectFormat(format) {
    document.querySelectorAll('.format-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-format="${format}"]`).classList.add('active');
    this.selectedFormat = format;
  }

  previewExport() {
    this.showToast('Export preview would show estimated file size and quality', 'info');
  }

  async startExport() {
    if (!this.currentRecording && this.recordings.length === 0) {
      this.showToast('No recording to export', 'error');
      return;
    }

    const exportBtn = document.getElementById('start-export');
    const btnText = exportBtn.querySelector('.btn-text');
    const progress = exportBtn.querySelector('.export-progress');
    const progressFill = document.getElementById('export-progress-fill');
    const progressText = document.getElementById('export-progress-text');

    // Show export progress
    btnText.style.display = 'none';
    progress.style.display = 'flex';
    exportBtn.disabled = true;

    // Simulate export progress
    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 15;
      if (progressValue >= 100) {
        progressValue = 100;
        clearInterval(progressInterval);
        this.completeExport();
      }
      
      progressFill.style.width = `${progressValue}%`;
      progressText.textContent = `${Math.round(progressValue)}%`;
    }, 200);

    document.getElementById('export-status').textContent = 'Exporting...';
    document.getElementById('export-status').className = 'export-status exporting';
  }

  completeExport() {
    const exportBtn = document.getElementById('start-export');
    const btnText = exportBtn.querySelector('.btn-text');
    const progress = exportBtn.querySelector('.export-progress');

    // Reset button
    btnText.style.display = 'block';
    progress.style.display = 'none';
    exportBtn.disabled = false;

    document.getElementById('export-status').textContent = 'Export Complete';
    document.getElementById('export-status').className = 'export-status';

    // Simulate file download
    this.downloadExportedFile();
    this.showToast('Animation exported successfully!', 'success');
  }

  downloadExportedFile() {
    const format = this.selectedFormat || 'gif';
    const filename = `animation-${Date.now()}.${format}`;
    
    // In a real implementation, this would be the actual converted file
    const link = document.createElement('a');
    link.href = this.currentRecording?.url || '#';
    link.download = filename;
    link.click();
  }

  // History functions
  loadRecordings() {
    const grid = document.getElementById('recordings-grid');
    
    if (this.recordings.length === 0) {
      grid.innerHTML = `
        <div class="recording-item" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
          <div style="font-size: 3rem; margin-bottom: 15px;">🎬</div>
          <p>No recordings yet. Start recording to see your animations here!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.recordings.map((recording, index) => `
      <div class="recording-item">
        <div class="recording-thumbnail">
          <div class="thumbnail-placeholder">🎬</div>
          <div class="recording-duration">${recording.duration}</div>
        </div>
        <div class="recording-info">
          <h4>${recording.title}</h4>
          <p>Created ${this.formatDate(recording.timestamp)}</p>
          <div class="recording-actions">
            <button class="action-btn" onclick="studio.playRecording(${index})">▶️ Play</button>
            <button class="action-btn" onclick="studio.exportRecording(${index})">📤 Export</button>
            <button class="action-btn" onclick="studio.deleteRecording(${index})">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  playRecording(index) {
    const recording = this.recordings[index];
    if (recording) {
      const video = document.getElementById('recording-preview');
      video.src = recording.url;
      document.getElementById('recording-modal').classList.add('open');
    }
  }

  exportRecording(index) {
    this.currentRecording = this.recordings[index];
    this.startExport();
  }

  deleteRecording(index) {
    if (confirm('Are you sure you want to delete this recording?')) {
      const recording = this.recordings[index];
      URL.revokeObjectURL(recording.url);
      this.recordings.splice(index, 1);
      localStorage.setItem('studioRecordings', JSON.stringify(this.recordings));
      this.loadRecordings();
      this.showToast('Recording deleted', 'info');
    }
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear all recordings?')) {
      this.recordings.forEach(recording => URL.revokeObjectURL(recording.url));
      this.recordings = [];
      localStorage.removeItem('studioRecordings');
      this.loadRecordings();
      this.showToast('All recordings cleared', 'info');
    }
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'today';
    if (diffDays === 2) return 'yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  }

  // Utility functions
  closeModal(modal) {
    modal.classList.remove('open');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast show ${type}`;
    toast.textContent = message;
    
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };
    
    toast.style.backgroundColor = colors[type] || colors.info;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize the Recording Studio
const studio = new AnimationRecordingStudio();

// Handle page visibility for recording
document.addEventListener('visibilitychange', () => {
  if (document.hidden && studio.isRecording) {
    studio.pauseRecording();
  }
});

// Handle beforeunload for active recordings
window.addEventListener('beforeunload', (e) => {
  if (studio.isRecording) {
    e.preventDefault();
    e.returnValue = 'You have an active recording. Are you sure you want to leave?';
  }
});