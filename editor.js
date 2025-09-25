const htmlEditor = document.getElementById("htmlCode");
const cssEditor = document.getElementById("cssCode");
const jsEditor = document.getElementById("jsCode");
const output = document.getElementById("output");

document.getElementById("runBtn").addEventListener("click", () => {
  const html = htmlEditor.value.trim();
  const css = cssEditor.value.trim();
  const js = jsEditor.value.trim();

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

document.getElementById("resetBtn").addEventListener("click", () => {
  htmlEditor.value = "";
  cssEditor.value = "";
  jsEditor.value = "";
  output.srcdoc = "<!DOCTYPE html><html><body></body></html>";
});
 
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector(".scroll-indicator").style.width = scrollPercent + "%";
}); 
// Copy to clipboard functionality
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const targetId = e.target.getAttribute('data-target');
    const textarea = document.getElementById(targetId);
    const tooltip = e.target.parentElement.querySelector('.copy-tooltip');
    
    try {
      await navigator.clipboard.writeText(textarea.value);
      tooltip.classList.add('show');
      setTimeout(() => {
        tooltip.classList.remove('show');
      }, 1500);
    } catch (err) {
      // Fallback for older browsers
      textarea.select();
      document.execCommand('copy');
      tooltip.classList.add('show');
      setTimeout(() => {
        tooltip.classList.remove('show');
      }, 1500);
    }
  });
}); 

// Play/Pause Toggle
const toggleBtn = document.querySelector('#toggleBtn');
const outputIframe = document.querySelector('#output');

toggleBtn.addEventListener('click', () => {
  const icon = toggleBtn.querySelector('.icon');

  // Toggle icon class
  icon.classList.toggle('play');
  icon.classList.toggle('pause');

  // Pause/resume all animations inside iframe (CSS only)
  if (outputIframe.contentWindow) {
    const allElements = outputIframe.contentWindow.document.querySelectorAll('*');
    const isPaused = icon.classList.contains('pause');
    allElements.forEach(el => {
      el.style.animationPlayState = isPaused ? 'paused' : 'running';
    });
  }
});


