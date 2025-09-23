const htmlEditor = document.getElementById("htmlCode");
const cssEditor = document.getElementById("cssCode");
const jsEditor = document.getElementById("jsCode");
const output = document.getElementById("output");
const themeToggle = document.getElementById("themeToggle");

// Run button functionality
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

// Reset button functionality
document.getElementById("resetBtn").addEventListener("click", () => {
  htmlEditor.value = "";
  cssEditor.value = "";
  jsEditor.value = "";
  output.srcdoc = "<!DOCTYPE html><html><body></body></html>";
});


// Theme functionality
if (localStorage.getItem('theme') === 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
  document.body.classList.add('dark-theme');
  themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
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

