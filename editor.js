const htmlEditor = document.getElementById("htmlCode");
const cssEditor = document.getElementById("cssCode");
const jsEditor = document.getElementById("jsCode");
const output = document.getElementById("output");
const themeToggle = document.getElementById("themeToggle");

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


// Check for saved theme preference or respect OS preference
      if (localStorage.getItem('theme') === 'dark' || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
      }

      // Theme toggle functionality
      themeToggle.addEventListener('change', function() {
        if (this.checked) {
          document.body.classList.add('dark-theme');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark-theme');
          localStorage.setItem('theme', 'light');
        }
      });

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