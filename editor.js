
// Editor functionality
=======
n
const htmlEditor = document.getElementById("htmlCode");
const cssEditor = document.getElementById("cssCode");
const jsEditor = document.getElementById("jsCode");
const output = document.getElementById("output");


// Run code function
function runCode() {
  const html = htmlEditor.value;
  const css = cssEditor.value;
  const js = jsEditor.value;
  
  const outputDoc = output.contentDocument || output.contentWindow.document;
  
  outputDoc.open();
  outputDoc.write(`
=======
// ▶️ Run button functionality
document.getElementById("runBtn").addEventListener("click", () => {
  const html = htmlEditor.value.trim();
  const css = cssEditor.value.trim();
  const js = jsEditor.value.trim();

  // 🏗️ Construct the result HTML
  const result = `

                 
    <!DOCTYPE html>
    <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}<\/script>
    </body>
    </html>
  `);
  outputDoc.close();
}

// Reset code function
function resetCode() {
  if (confirm('Are you sure you want to reset all code?')) {
    htmlEditor.value = `<!DOCTYPE html>
<html>
<head>
    <title>My Animation</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to AnimateItNow</h1>
        <div class="box"></div>
        <button id="animateBtn">Animate</button>
    </div>
</body>
</html>`;
    
    cssEditor.value = `body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, #6c63ff, #36d1dc);
}


.container {
    text-align: center;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

h1 {
    color: #6c63ff;
    margin-bottom: 20px;
}

.box {
    width: 100px;
    height: 100px;
    background: #6c63ff;
    margin: 20px auto;
    border-radius: 8px;
    transition: all 0.5s ease;
}

.box.animated {
    transform: rotate(360deg) scale(1.2);
    background: #ff6584;
    border-radius: 50%;
}

button {
    background: #6c63ff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}



button:hover {
    background: #554fd8;
}`;
    
    jsEditor.value = `document.getElementById('animateBtn').addEventListener('click', function() {
    const box = document.querySelector('.box');
    box.classList.toggle('animated');
    
    // Add some fun effects
    if (box.classList.contains('animated')) {
        this.textContent = 'Reset';
        // Create particles
        createParticles();
    } else {
        this.textContent = 'Animate';
    }
});

function createParticles() {
    const container = document.querySelector('.container');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = '#ff6584';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = \`float \${Math.random() * 2 + 1}s ease-in-out infinite\`;
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 3000);
=======
// 🔄 Reset button functionality
document.getElementById("resetBtn").addEventListener("click", () => {
  htmlEditor.value = "";
  cssEditor.value = "";
  jsEditor.value = "";
  output.srcdoc = "<!DOCTYPE html><html><body></body></html>";
});
 
// 📜 Scroll indicator functionality
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(".scroll-indicator").style.width = scrollPercent + "%";
}); 

// 📋 Copy to clipboard functionality
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const targetId = e.target.getAttribute('data-target');
    const textarea = document.getElementById(targetId);
    const tooltip = e.target.parentElement.querySelector('.copy-tooltip');
    
    try {
      await navigator.clipboard.writeText(textarea.value);
      tooltip.classList.add('show');
      // 🕒 Auto-hide tooltip after 1.5 seconds
      setTimeout(() => {
        tooltip.classList.remove('show');
      }, 1500);
    } catch (err) {
      // 🆘 Fallback for older browsers
      textarea.select();
      document.execCommand('copy');
      tooltip.classList.add('show');
      // 🕒 Auto-hide tooltip after 1.5 seconds
      setTimeout(() => {
        tooltip.classList.remove('show');
      }, 1500);

    }
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = \`
@keyframes float {
    0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
    50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
}
\`;
document.head.appendChild(style);`;
    
    runCode();
  }
}

// Copy code function
async function copyCode(targetId) {
  const textarea = document.getElementById(targetId);
  
  try {
    await navigator.clipboard.writeText(textarea.value);
    
    // Show feedback
    const button = event.currentTarget;
    const tooltip = button.querySelector('.copy-tooltip');
    tooltip.classList.add('show');
    
    setTimeout(() => {
      tooltip.classList.remove('show');
    }, 2000);
  } catch (err) {
    // Fallback for older browsers
    textarea.select();
    document.execCommand('copy');
    
    // Show feedback
    const button = event.currentTarget;
    const tooltip = button.querySelector('.copy-tooltip');
    tooltip.classList.add('show');
    
    setTimeout(() => {
      tooltip.classList.remove('show');
    }, 2000);
  }
}

// Toggle fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    output.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
    document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    document.exitFullscreen();
    document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-expand"></i>';
  }
}

// Auto-save code
function autoSave() {
  const code = {
    html: htmlEditor.value,
    css: cssEditor.value,
    js: jsEditor.value
  };
  localStorage.setItem('animateItNowCode', JSON.stringify(code));
}

function autoLoad() {
  const savedCode = localStorage.getItem('animateItNowCode');
  if (savedCode) {
    const code = JSON.parse(savedCode);
    htmlEditor.value = code.html;
    cssEditor.value = code.css;
    jsEditor.value = code.js;
  }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Load saved code on page load
  autoLoad();
  runCode();
  
  // Set up auto-save
  htmlEditor.addEventListener('input', autoSave);
  cssEditor.addEventListener('input', autoSave);
  jsEditor.addEventListener('input', autoSave);
  
  // Button event listeners
  document.getElementById("runBtn").addEventListener("click", runCode);
  document.getElementById("resetBtn").addEventListener("click", resetCode);
  document.getElementById("refreshBtn").addEventListener("click", runCode);
  document.getElementById("fullscreenBtn").addEventListener("click", toggleFullscreen);
  
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      copyCode(target);
    });
  });
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector(".scroll-indicator").style.width = scrollPercent + "%";
  });

});

// 🐛 Debug logging function for development
function debugLog(message) {
  // 📝 This is a placeholder for future debugging
  // console.log(`[Editor Debug] ${message}`);
}

// 🧪 Performance monitoring placeholder
function monitorPerformance() {
  // 📊 This is a placeholder for future performance monitoring
  // console.log("Performance metrics:", performance.memory);
}

// 🧼 Cleanup function for memory management
function cleanup() {
  // 🧹 This is a placeholder for future cleanup operations
  console.log("🧹 Editor cleanup completed");
}


// Theme Toggle Logic
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function setIcon(theme) {
  const icon = theme === 'dark-theme' ? 'fa-sun' : 'fa-moon';
  themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
}

function toggleTheme() {
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light-theme');
    setIcon('light-theme');
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark-theme');
    setIcon('dark-theme');
  }
}

// Check for saved theme on load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light-theme';
  if (savedTheme === 'dark-theme') {
    body.classList.add('dark-theme');
  }
  setIcon(savedTheme);
}
// Add to DOMContentLoaded listener:
// loadTheme();
// themeToggle.addEventListener("click", toggleTheme);
