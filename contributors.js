// 👨‍💻 Contributors fetch
document.addEventListener("DOMContentLoaded", () => {
  const contributorsGrid = document.getElementById("contributors-grid");

  if (contributorsGrid) {
    fetch("https://api.github.com/repos/itsAnimation/AnimateItNow/contributors")
      .then((res) => res.json())
      .then((contributors) => {
        contributorsGrid.innerHTML = "";
        contributors.forEach((contributor) => {
          const card = document.createElement("a");
          card.href = contributor.html_url;
          card.className = "contributor-card";
          card.target = "_blank";
          card.rel = "noopener noreferrer";
          card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.login}" class="contributor-avatar">
            <h3>${contributor.login}</h3>
            <p>Contributions: ${contributor.contributions}</p>
          `;
          contributorsGrid.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("Error fetching contributors:", err);
        contributorsGrid.innerHTML = "<p>Could not load contributors at this time.</p>";
      });
  }
});
