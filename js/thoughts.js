import { URL } from '../js/config.js';
const articleImages = [
  "https://i.imgur.com/l5sV5Hf.png",
  "https://i.imgur.com/tgf7G8E.png",
  "https://i.imgur.com/yAjW8Pu.png",
  "https://i.imgur.com/1xDtNq6.png",
  "https://i.imgur.com/SG7f56t.png",
  "https://i.imgur.com/jFv3i07.png",
  "https://i.imgur.com/rA4lfPj.png",
  "https://i.imgur.com/1IgW9oX.png",
  "https://i.imgur.com/XCnmT9e.png",
  "https://i.imgur.com/vNL6uMr.png",
  "https://i.imgur.com/D5gMUKP.png",
  "https://i.imgur.com/Xp2mAc3.png",
  "https://i.imgur.com/Xp2mAc3.png",
  "https://i.imgur.com/2YJVMCc.png",
  "https://i.imgur.com/gsB2dTW.png",
  "https://i.imgur.com/HTnA2MW.png",
  "https://i.imgur.com/LMAFXYd.png"
];

fetch(`${URL}api/user/newarticles`) // Replace with your actual API URL
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch articles");
    return response.json();
  })
  .then(data => {
    if (Array.isArray(data)) {
      renderArticles(data);
    } else if (Array.isArray(data.articles)) {
      renderArticles(data.articles);
    } else {
      console.error("Unexpected structure:", data);
    }
  })
  .catch(err => console.error("Fetch error:", err));

function renderArticles(articles) {
  const container = document.getElementById("container2");
  if (!container) return;

  container.innerHTML = ''; // Clear static placeholders

  articles.forEach((article, index) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    const image = document.createElement("img");
    image.src = articleImages[index % articleImages.length];
    image.alt = article.title || "Article Image";

    const title = document.createElement("h3");
    title.textContent = article.title || "Untitled";

    const desc = document.createElement("p");
    desc.textContent = article.description || "No description available.";

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(desc);

    container.appendChild(card);
  });
}
