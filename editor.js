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

