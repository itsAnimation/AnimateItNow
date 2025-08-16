// Default Boilerplate Code
const defaultCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Live Preview</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: blue;
    }
  </style>
</head>
<body>
  <h1>Hello World 🚀</h1>
  <p>Welcome to the Enhanced Code Editor</p>

  <script>
    console.log("Hello from JavaScript!");
  </script>
</body>
</html>
`;

// Initialize CodeMirror editor
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  mode: "htmlmixed", // supports HTML + CSS + JS
  theme: "dracula"
});

// Set default boilerplate code
editor.setValue(defaultCode);

// Live preview iframe
const previewFrame = document.getElementById("preview");
const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;

// Debounced update
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Update preview
function updatePreview() {
  const code = editor.getValue();
  previewDoc.open();
  previewDoc.write(code);
  previewDoc.close();
}

// Editor change listener
editor.on("change", debounce(updatePreview, 300));

// Initial load
updatePreview();

// Copy to Clipboard (with toast)
document.getElementById("copyBtn").addEventListener("click", () => {
  const code = editor.getValue();
  navigator.clipboard.writeText(code).then(() => {
    showToast("Code copied to clipboard!");
  });
});

// Reset Code
document.getElementById("resetBtn").addEventListener("click", () => {
  editor.setValue(defaultCode);
  updatePreview();
  showToast("Editor reset to default!");
});

// Theme Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

// Toast Notification
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 2000);
}
