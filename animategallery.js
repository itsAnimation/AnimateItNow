function uploadArtwork() {
  const fileInput = document.getElementById("upload");
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const gallery = document.getElementById("gallery");

  if (fileInput.files.length === 0) {
    alert("Please select an image.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const card = document.createElement("div");
    card.classList.add("artwork-card", category);

    card.innerHTML = `
      <img src="${e.target.result}" alt="Artwork">
      <div class="artwork-info">
        <p><strong>Category:</strong> ${capitalize(category)}</p>
        <p>${description || 'No description provided.'}</p>
        <div class="rating">⭐️⭐️⭐️⭐️☆</div>
        <div class="vote-buttons">
          <button onclick="vote(this, 'up')">👍 <span class="vote-count">0</span></button>
          <button onclick="vote(this, 'down')">👎 <span class="vote-count">0</span></button>
        </div>
      </div>
    `;

    gallery.appendChild(card);
    fileInput.value = '';
    document.getElementById("description").value = '';
  };

  reader.readAsDataURL(file);
}

function filterGallery(category) {
  const artworks = document.querySelectorAll(".artwork-card");
  artworks.forEach(art => {
    if (category === "all" || art.classList.contains(category)) {
      art.style.display = "block";
    } else {
      art.style.display = "none";
    }
  });
}

function vote(button, type) {
  const countSpan = button.querySelector(".vote-count");
  let count = parseInt(countSpan.innerText);
  count = type === 'up' ? count + 1 : count - 1;
  countSpan.innerText = count;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

