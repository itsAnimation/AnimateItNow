// assets/js/contributors.js
async function loadContributors(limit = 12) {
  const container = document.getElementById('contributors-list');
  if (!container) return;

  try {
    const res = await fetch('/data/contributors.json', {cache: "no-cache"});
    if (!res.ok) throw new Error('No contributors file');
    const data = await res.json();
    const top = data.slice(0, limit);

    container.innerHTML = top.map(c => {
      const name = c.login || (c.name || 'Anonymous');
      const contributions = c.contributions || 0;
      const avatar = c.avatar_url ? `${c.avatar_url}&s=96` : '/assets/img/default-avatar.png';
      return `
        <a class="contributor-card" href="${c.html_url || '#'}" target="_blank" rel="noopener noreferrer">
          <img src="${avatar}" alt="${name} avatar" loading="lazy" width="72" height="72"/>
          <div class="meta">
            <div class="name">${name}</div>
            <div class="count">${contributions} contributions</div>
          </div>
        </a>
      `;
    }).join('');
  } catch (err) {
    console.error('Failed to load contributors:', err);
    container.innerHTML = `<p class="error">Unable to load contributors. <a href="https://github.com/NishthaGavandi05/AnimateItNow/graphs/contributors" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => loadContributors(12));
