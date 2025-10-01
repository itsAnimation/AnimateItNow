# AnimateItNow 🚀✨

<p align="center">
  <img src="https://raw.githubusercontent.com/itsAnimation/AnimateItNow/main/images/logo.png" alt="AnimateItNow Logo" width="120"/>
  <br>
  <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="Verdana" fill="#6C63FF">
      AnimateItNow
    </text>
    <g>
      <animateTransform attributeName="transform" type="translate" from="0 0" to="0 10" begin="0s" dur="0.8s" repeatCount="indefinite"/>
      <circle cx="200" cy="20" r="8" fill="#FFD700">
        <animate attributeName="cy" values="20;40;20" dur="1.2s" repeatCount="indefinite"/>
      </circle>
    </g>
  </svg>
  <br>
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=2000&pause=500&color=6C63FF&center=true&vCenter=true&width=380&lines=Beautiful+UI+Animations;Open+Source+Templates;Contribute+and+Learn" alt="Typing SVG" />
</p>

<p align="center">
  <b>Welcome to AnimateItNow — a creative, open-source hub for beautiful web UI components and animations!</b>
</p>

## 🚀 Quick Preview

<div align="center">
  
| Login Form Animation | Button Hover Effects | Loading Animations |
|:---:|:---:|:---:|
| ![Login Preview](https://via.placeholder.com/300x200/6C63FF/FFFFFF?text=Login+Animation) | ![Button Preview](https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Button+Effects) | ![Loading Preview](https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Loading+Animations) |
| Smooth form transitions | Interactive hover effects | Creative loading states |

| Modal Animations | Card Transitions | Navigation Effects |
|:---:|:---:|:---:|
| ![Modal Preview](https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Modal+Animations) | ![Card Preview](https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Card+Effects) | ![Nav Preview](https://via.placeholder.com/300x200/FECA57/FFFFFF?text=Navigation+Animations) |
| Elegant modal displays | Smooth card transitions | Animated navigation |

</div>

## 📋 Table of Contents
- [🌟 Quick Start](#-quick-start)
- [🌈 Features & Demos](#-features--demos)
- [🛠 Installation & Setup](#-installation--setup)
- [🎯 Open Source Programs](#-open-source-programs)
- [🤝 How to Contribute](#-how-to-contribute)
- [🔧 Project Structure](#-project-structure)
- [📬 Contact](#-contact)
- [📄 License](#-license)

## 🌟 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript
- Git (for contribution)

### 🚀 Getting Started in 3 Steps

1. Clone the Repository
   ```bash
   git clone https://github.com/itsAnimation/AnimateItNow.git
   cd AnimateItNow 
   ```
   
Open the Project

* Simply open index.html in your web browser

* Or use a local server for better development:
bash
# Using Python
```python -m http.server 8000```

# Using Node.js (if you have http-server installed)
```npx http-server```

# Using PHP
```php -S localhost:8000```

Start Exploring!

* Browse templates in the gallery

* View source code for each animation

* Customize and experiment with effects

---

## 🛠 Installation & Setup

### Local Development Setup

To start working with AnimateItNow locally, follow one of the options below based on your preference and environment.

---

### Option 1: Basic Setup (Quick Start)

1. **Clone the Repository**

```bash
git clone https://github.com/itsAnimation/AnimateItNow.git
cd AnimateItNow
```

2. **Open the Project**

* Simply open `index.html` in your favorite web browser by double-clicking the file or using:

  * macOS:

    ```bash
    open index.html
    ```

  * Windows:

    ```bash
    start index.html
    ```

  * Linux:

    ```bash
    xdg-open index.html
    ```

---

### Option 2: Run a Local Server (Recommended for Development)

Running a local server allows you to test animations properly and avoid issues related to browser security policies when loading local files.

Choose one of the following methods:

* **Using Python**

  If you have Python installed:

  ```bash
  python -m http.server 8000
  ```

  Then open your browser and go to:
  `http://localhost:8000`

* **Using Node.js**

  If you have Node.js and `http-server` installed (install it globally if you don't):

  ```bash
  npm install -g http-server
  http-server
  ```

  Then open your browser and go to the address shown in the terminal (usually `http://localhost:8080`).

* **Using PHP**

  If you have PHP installed:

  ```bash
  php -S localhost:8000
  ```

  Open your browser and go to:
  `http://localhost:8000`

---

### Option 3: Using VS Code Live Server Extension

If you use Visual Studio Code:

1. Install the **Live Server** extension.

2. Open the project folder in VS Code.

3. Right-click on `index.html` and select **Open with Live Server**.

4. Your default browser will launch and display the project.

---

### After Setup

* Browse through the templates folder to explore different animations.

* Open HTML files in the templates folder to see examples.

* Modify CSS and JavaScript files in `css/` and `js/` directories to customize animations.

* Preview changes live if using a local server or Live Server.


# File Structure Overview
text \
AnimateItNow/
├── index.html                #Main landing page\
├── templates                # Animation templates\
│   ├── buttons/           # Button animations\
│   ├── loaders/           # Loading animations\
│   ├── modals/            # Modal animations\
│   └── forms/             # Form animations\
├── css/                   # Stylesheets\
├── js/                    # JavaScript files\
├── images/               # Project images and assets\
└── README.md             # Project documentation\
🌈 Features & Demos\
🎨 Animation Categories\
* Button Animations

- Hover effects (glow, bounce, fill, etc.)

- Click animations (ripple, press, etc.)

- Loading states

- Form Animations

- Input field animations

- Validation effects

- Submit button transitions

- Loading Animations

- Spinners and loaders

- Skeleton screens

- Progress indicators

- Modal & Popup Effects

- Entrance/exit animations

- Background overlays

- Interactive modals

🔹 Hover Effects Gallery
Effect	Preview	Code Example
Blur	https://via.placeholder.com/150/6C63FF/FFFFFF?text=Blur	class="blur-effect"
Skew	https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Skew	class="skew-effect"
Bounce	https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Bounce	class="bounce-effect"
Shadow Pulse	https://via.placeholder.com/150/45B7D1/FFFFFF?text=Shadow	class="shadow-pulse"
css
/* Example: Combined effects */
.animated-button {
  transition: all 0.3s ease;
}

.animated-button:hover {
  transform: scale(1.05) skewX(-5deg);
  filter: blur(0.5px);
  animation: bounce 0.5s ease;
}
🤝 How to Contribute
We welcome contributors of all skill levels! Here's how you can get involved:

# 🎯 First Time Contributors
- Fork the Repository

- Click the "Fork" button at the top right of this page

  This creates your personal copy of the project

- Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/AnimateItNow.git
cd AnimateItNow
```

- Create a New Branch

```bash
git checkout -b feature/your-animation-name
Add Your Animation
```


- Create your animation in the appropriate folder

- Update the gallery page to showcase your work

- Test your animation thoroughly

- Submit Your Contribution

```bash
git add .
git commit -m 
"Add: [Your Animation Name] animation"
git push origin "feature/your-animation-name"
```
Then create a Pull Request from your fork to the main repository


# 📋 Contribution Guidelines
✅ Add your animation to the correct category folder

✅ Include a preview GIF (300x200 pixels)

✅ Add comments to your CSS/JavaScript code

✅ Test across different browsers

✅ Update the templates gallery page

✅ Follow the existing code style

🆕 Good First Issues
- Look for issues labeled good-first-issue or beginner-friendly to start contributing!

🎯 Open Source Programs
<div align="center"> <img src="https://github.com/apu52/METAVERSE/assets/114172928/e79eb6de-81b1-4ffb-b6ed-f018bb977e88" alt="GSSOC" width="80%"> </div>
🌟 GirlScript Summer of Code 2025
We're excited to be part of GSSoC 2025 - one of India's largest 3-month open source programs!

Benefits for Contributors:

🎓 Learn from experienced mentors

🤝 Collaborate with developers worldwide

📜 Receive certificates and swag

🏆 Get recognition for your work

💼 Build your portfolio with real-world projects

GSSoC Timeline:

📅 Registration: March 2025

🚀 Coding Period: April-June 2025

🎉 Results: July 2025

Ready to join? Check out GSSoC 2025 details

🔧 Project Structure
text
AnimateItNow/
├── 📁 templates/          # All animation templates\
│   ├── 📁 buttons/       # Button animations and effects\
│   ├── 📁 loaders/       # Loading animations\
│   ├── 📁 modals/        # Modal and popup animations\
│   ├── 📁 forms/         # Form animations\
│   └── 📁 navigation/    # Menu and nav animations\
├── 📁 css/               # Global styles and utilities\
├── 📁 js/                # JavaScript functionality\
├── 📁 images/           # Assets and preview images\
├── 📁 docs/             # Documentation files\
├── index.html           # Main landing page\
├── templates.html       # Templates gallery\
└── CONTRIBUTING.md      # Contribution guidelines\
🚀 Live Demo
Check out our live website: AnimateItNow Live

📱 Browser Compatibility
✅ Chrome 60+

✅ Firefox 55+

✅ Safari 12+

✅ Edge 79+

📬 Need Help?
💬 Community Support
Discussions: GitHub Discussions

Issues: Report Bugs

Email: Your Email

📚 Learning Resources
CSS Animations Guide

JavaScript Animation Basics

GSAP Animation Library

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙌 Acknowledgments
💖 Our Amazing Contributors
<p align="center"> <a href="https://github.com/itsAnimation/AnimateItnow/graphs/contributors"> <img src="https://api.vaunt.dev/v1/github/entities/itsAnimation/repositories/AnimateItnow/contributors?format=svg&limit=54" width="700" height="250" /> </a> </p>
🌟 Project Admin
<p align="center"> <img src="https://raw.githubusercontent.com/itsAnimation/AnimateItNow/main/images/pa.png" width="600px;" alt="Project Admin"/><br /> <br/> <a href="https://github.com/AnujShrivastava01"> <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/> </a> <a href="https://www.linkedin.com/in/anujshrivastava1/"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/> </a> </p><p align="center"> Made with ❤ by Anuj and Contributors </p>
<div align="center">
⭐ Star This Repository
If you find this project helpful, please give it a star! ⭐

https://api.star-history.com/svg?repos=itsAnimation/AnimateItNow&type=Date

</div> ``
