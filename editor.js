// 📝 Editor functionality for the live code editor
const htmlEditor = document.getElementById("htmlCode");
const cssEditor = document.getElementById("cssCode");
const jsEditor = document.getElementById("jsCode");
const output = document.getElementById("output");

// ▶️ Run button functionality
document.getElementById("runBtn").addEventListener("click", () => {
  const html = htmlEditor.value.trim();
  const css = cssEditor.value.trim();
  const js = jsEditor.value.trim();

  // 🏗️ Construct the result HTML
  const result = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>
        try {
          ${js}
        } catch (e) {
          document.body.innerHTML += '<pre style="color:red;">' + e + '</pre>';
        }
      <\/script>
    </body>
    </html>
  `;

  output.srcdoc = result;
});

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