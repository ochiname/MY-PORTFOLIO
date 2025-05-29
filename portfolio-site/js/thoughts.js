import { URL } from './config.js';
const articleImages = [
  "https://i.postimg.cc/4Zpr0rD2/Image-fx-10.png",
  "https://i.postimg.cc/J0KpYjKy/Image-fx-11.png",
  "https://i.postimg.cc/J46TbcGv/Image-fx-12.png",
  "https://i.postimg.cc/PfMVqkht/Image-fx-13.png",
  "https://i.postimg.cc/rsqh9fGX/Image-fx-14.png",
  "https://i.postimg.cc/7xcFvDPd/Image-fx-15.png",
  "https://i.postimg.cc/JnVYsrGh/Image-fx-16.png",
  "https://i.postimg.cc/vm6S8g8j/Image-fx-17.png",
  "https://i.postimg.cc/bNBTGy5j/image-fx.png",
  "https://i.postimg.cc/nh91q889/image-fx-1.png",
  "https://i.postimg.cc/T2QQ6qq1/image-fx-2.png",
  "https://i.postimg.cc/Wb38bFXn/Image-fx-3.png",
  "https://i.postimg.cc/RhPTL4VK/Image-fx-4.png",
  "https://i.postimg.cc/j2qXfLKR/Image-fx-5.png",
  "https://i.postimg.cc/XJkLX9R2/Image-fx-6.png",
  "https://i.postimg.cc/mgPmVz9D/Image-fx-7.png",
  "https://i.postimg.cc/Tw6QRt4L/Image-fx-8.png",
  "https://i.postimg.cc/13bJdm0K/Image-fx-9.png"
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
