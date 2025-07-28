const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const gradientType = document.getElementById("gradient-type");
const cssOutput = document.getElementById("css-output");
const randomBtn = document.getElementById("random-btn");
const copyBtn = document.getElementById("copy-btn");

function setGradient() {
    const type = gradientType.value;
    const gradient =
        type === "linear"
            ? `linear-gradient(to right, ${color1.value}, ${color2.value})`
            : `radial-gradient(circle, ${color1.value}, ${color2.value})`;
    document.body.style.background = gradient;
    cssOutput.value = `background: ${gradient};`;
}

function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function setRandomGradient() {
    color1.value = getRandomColor();
    color2.value = getRandomColor();
    setGradient();
}

function copyToClipboard() {
    cssOutput.select();
    document.execCommand("copy");
    alert("Copied to clipboard!");
}

color1.addEventListener("input", setGradient);
color2.addEventListener("input", setGradient);
gradientType.addEventListener("change", setGradient);
randomBtn.addEventListener("click", setRandomGradient);
copyBtn.addEventListener("click", copyToClipboard);

// Initial render
setGradient();
