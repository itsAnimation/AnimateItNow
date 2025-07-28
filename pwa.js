// PWA Install functionality
class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    // Check if app is already installed
    this.checkInstallStatus();
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App was installed');
      this.hideInstallButton();
      this.isInstalled = true;
      this.showInstalledMessage();
    });

    // Create install button
    this.createInstallButton();
  }

  checkInstallStatus() {
    // Check if running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('PWA: App is running in standalone mode');
    }

    // Check for iOS Safari
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('PWA: App is running in iOS standalone mode');
    }
  }

  createInstallButton() {
    // Create install button element
    this.installButton = document.createElement('button');
    this.installButton.id = 'pwa-install-btn';
    this.installButton.innerHTML = `
      <i class="fas fa-download"></i>
      <span>Install App</span>
    `;
    this.installButton.className = 'pwa-install-button';
    this.installButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
      display: none;
      align-items: center;
      gap: 8px;
      z-index: 1000;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    `;

    // Add hover effects
    this.installButton.addEventListener('mouseenter', () => {
      this.installButton.style.transform = 'translateY(-2px)';
      this.installButton.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
    });

    this.installButton.addEventListener('mouseleave', () => {
      this.installButton.style.transform = 'translateY(0)';
      this.installButton.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
    });

    // Add click event
    this.installButton.addEventListener('click', () => {
      this.installApp();
    });

    // Append to body
    document.body.appendChild(this.installButton);
  }

  showInstallButton() {
    if (this.installButton && !this.isInstalled) {
      this.installButton.style.display = 'flex';
      // Animate in
      setTimeout(() => {
        this.installButton.style.opacity = '1';
        this.installButton.style.transform = 'translateY(0)';
      }, 100);
    }
  }

  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
  }

  async installApp() {
    if (!this.deferredPrompt) {
      this.showManualInstallInstructions();
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user to respond
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      
      this.deferredPrompt = null;
    } catch (error) {
      console.error('PWA: Error during installation:', error);
    }
  }

  showManualInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
      instructions = `
        <div class="install-instructions">
          <h3>Install AnimateItNow</h3>
          <p>To install this app on your iOS device:</p>
          <ol>
            <li>Tap the Share button <i class="fas fa-share"></i></li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" to confirm</li>
          </ol>
        </div>
      `;
    } else if (isAndroid) {
      instructions = `
        <div class="install-instructions">
          <h3>Install AnimateItNow</h3>
          <p>To install this app on your Android device:</p>
          <ol>
            <li>Tap the menu button (⋮)</li>
            <li>Tap "Add to Home screen" or "Install app"</li>
            <li>Tap "Add" to confirm</li>
          </ol>
        </div>
      `;
    } else {
      instructions = `
        <div class="install-instructions">
          <h3>Install AnimateItNow</h3>
          <p>To install this app on your desktop:</p>
          <ol>
            <li>Look for the install icon in your browser's address bar</li>
            <li>Click it and follow the prompts</li>
            <li>Or use your browser's menu: Settings → Install AnimateItNow</li>
          </ol>
        </div>
      `;
    }
    
    this.showModal(instructions);
  }

  showInstalledMessage() {
    const message = `
      <div class="install-success">
        <i class="fas fa-check-circle" style="color: #4ecdc4; font-size: 48px; margin-bottom: 16px;"></i>
        <h3>App Installed Successfully!</h3>
        <p>AnimateItNow has been installed and is ready to use offline.</p>
      </div>
    `;
    this.showModal(message);
  }

  showModal(content) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      margin: 20px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;

    modal.innerHTML = content + `
      <button onclick="this.closest('.modal-overlay').remove()" 
              style="
                background: #ff6b6b;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 12px 24px;
                margin-top: 16px;
                cursor: pointer;
                font-weight: 600;
              ">
        Close
      </button>
    `;

    modalOverlay.className = 'modal-overlay';
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
  }
}

// Initialize PWA installer when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PWAInstaller();
  });
} else {
  new PWAInstaller();
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('New version available');
            showUpdateAvailable();
          }
        });
      });
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}

// Show update available notification
function showUpdateAvailable() {
  const updateBanner = document.createElement('div');
  updateBanner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: white;
    padding: 12px;
    text-align: center;
    z-index: 10000;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  `;
  
  updateBanner.innerHTML = `
    <span>New version available!</span>
    <button onclick="window.location.reload()" 
            style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 4px 12px;
              margin-left: 12px;
              border-radius: 4px;
              cursor: pointer;
            ">
      Update
    </button>
    <button onclick="this.parentElement.remove()" 
            style="
              background: transparent;
              border: none;
              color: white;
              padding: 4px 8px;
              margin-left: 8px;
              cursor: pointer;
            ">
      ×
    </button>
  `;
  
  document.body.appendChild(updateBanner);
  
  // Animate in
  setTimeout(() => {
    updateBanner.style.transform = 'translateY(0)';
  }, 100);
}
