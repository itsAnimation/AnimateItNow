document.addEventListener("DOMContentLoaded", () => {
  const previewBox = document.getElementById("preview-box");
  const generatedCss = document.getElementById("generated-css");
  const copyButton = document.getElementById("copy-btn");

  // Box Shadow Controls
  const offsetX = document.getElementById("offsetX");
  const offsetY = document.getElementById("offsetY");
  const blurRadius = document.getElementById("blurRadius");
  const spreadRadius = document.getElementById("spreadRadius");
  const shadowColor = document.getElementById("shadowColor");
  const shadowInset = document.getElementById("shadowInset");

  // Gradient Controls
  const gradientColor1 = document.getElementById("gradientColor1");
  const gradientColor2 = document.getElementById("gradientColor2");
  const gradientDirection = document.getElementById("gradientDirection");

  // Border Radius Controls
  const topLeft = document.getElementById("topLeft");
  const topRight = document.getElementById("topRight");
  const bottomRight = document.getElementById("bottomRight");
  const bottomLeft = document.getElementById("bottomLeft");

  // Update a single control's value display
  function updateValueDisplay(input) {
    const valueSpan = document.getElementById(`${input.id}-value`);
    if (valueSpan) {
      valueSpan.textContent = `${input.value}px`;
    }
  }

  // Master function to generate all CSS and update the preview/code
  function generateCSS() {
    // Box Shadow
    const inset = shadowInset.checked ? "inset" : "";
    const boxShadowCSS = `box-shadow: ${inset} ${offsetX.value}px ${offsetY.value}px ${blurRadius.value}px ${spreadRadius.value}px ${shadowColor.value};`;

    // Linear Gradient
    const gradientCSS = `background-image: linear-gradient(${gradientDirection.value}, ${gradientColor1.value}, ${gradientColor2.value});`;

    // Border Radius
    const borderRadiusCSS = `border-radius: ${topLeft.value}px ${topRight.value}px ${bottomRight.value}px ${bottomLeft.value}px;`;

    // Apply styles to the preview box
    previewBox.style.cssText = `${boxShadowCSS} ${gradientCSS} ${borderRadiusCSS}`;

    // Update code block
    generatedCss.textContent = `${boxShadowCSS}\n${gradientCSS}\n${borderRadiusCSS}`;

    // Update value displays for sliders
    updateValueDisplay(offsetX);
    updateValueDisplay(offsetY);
    updateValueDisplay(blurRadius);
    updateValueDisplay(spreadRadius);
    updateValueDisplay(topLeft);
    updateValueDisplay(topRight);
    updateValueDisplay(bottomRight);
    updateValueDisplay(bottomLeft);
  }

  // Add event listeners to all controls
  const controls = document.querySelectorAll(
    'input[type="range"], input[type="color"], input[type="checkbox"], select'
  );
  controls.forEach((control) => {
    control.addEventListener("input", generateCSS);
    if (control.type === "range") {
      control.addEventListener("input", () => updateValueDisplay(control));
    }
  });

  // Copy to clipboard functionality
  copyButton.addEventListener("click", () => {
    const textToCopy = generatedCss.textContent;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("CSS code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  });

  // Initial generation on page load
  generateCSS();
});
