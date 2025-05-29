import { URL } from './config.js';
const img = [
  "https://i.postimg.cc/bNBTGy5j/image-fx.png",
  "https://i.postimg.cc/nh91q889/image-fx-1.png",
  "https://i.postimg.cc/4Zpr0rD2/Image-fx-10.png",
  "https://i.postimg.cc/J0KpYjKy/Image-fx-11.png",
  "https://i.postimg.cc/J46TbcGv/Image-fx-12.png",
  "https://i.postimg.cc/PfMVqkht/Image-fx-13.png",
  "https://i.postimg.cc/rsqh9fGX/Image-fx-14.png",
  "https://i.postimg.cc/7xcFvDPd/Image-fx-15.png",
  "https://i.postimg.cc/JnVYsrGh/Image-fx-16.png",
  "https://i.postimg.cc/vm6S8g8j/Image-fx-17.png",
  "https://i.postimg.cc/T2QQ6qq1/image-fx-2.png",
  "https://i.postimg.cc/Wb38bFXn/Image-fx-3.png",
  "https://i.postimg.cc/RhPTL4VK/Image-fx-4.png",
  "https://i.postimg.cc/j2qXfLKR/Image-fx-5.png",
  "https://i.postimg.cc/XJkLX9R2/Image-fx-6.png",
  "https://i.postimg.cc/mgPmVz9D/Image-fx-7.png",
  "https://i.postimg.cc/Tw6QRt4L/Image-fx-8.png",
  "https://i.postimg.cc/13bJdm0K/Image-fx-9.png",
  "https://img.freepik.com/free-vector/flat-design-portfolio-template-design_52683-80880.jpg",
  "https://img.freepik.com/free-photo/front-view-open-copybook-with-colorful-pencils_140725-104899.jpg",
  "https://img.freepik.com/free-vector/weather-icon-collection_1294-69.jpg",
  "https://img.freepik.com/free-vector/self-checkout-concept-illustration_114360-2228.jpg",
  "https://img.freepik.com/free-photo/3d-illustration-hand-putting-tick-paper_107791-15903.jpg",
];

// Fetch repos from your backend
fetch(`${URL}api/user/repos`)
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch repos");
    return response.json();
  })
  .then(data => {
    // Check if data is an array or if repos are nested inside a property
    let repos = [];

    if (Array.isArray(data)) {
      repos = data;
    } else if (data && Array.isArray(data.repos)) {
      repos = data.repos;
    } else {
      console.error('Unexpected data structure, expected an array or an object with a "repos" array:', data);
      return;
    }

    rendering(repos);
  })
  .catch(err => {
    console.error("Error fetching repos:", err);
  });

function rendering(repos) {
  if (!Array.isArray(repos)) {
    console.error('Expected repos to be an array but got:', repos);
    return;
  }

  const container2 = document.getElementById("container2");
  if (!container2) {
    console.error('Container with ID "container2" not found in DOM');
    return;
  }

  repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  container2.innerHTML = ''; // Clear container

  repos.forEach((repo, index) => {
    const imgUrl = img[index % img.length];
    const createdYear = new Date(repo.created_at).getFullYear();
    const updatedYear = new Date(repo.updated_at).getFullYear();

    const repoItem = document.createElement('div');
    repoItem.classList.add('repo-item');

    const repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";

    const repoImg = document.createElement('img');
    repoImg.src = imgUrl;
    repoImg.alt = repo.name;
    repoImg.width = 100;
    repoImg.height = 70;

    repoLink.appendChild(repoImg);

    const repoName = document.createElement('h2');
    repoName.textContent = repo.name;

    const repoDescription = document.createElement('p');
    repoDescription.textContent = repo.description || 'No description provided.';

    const createdYearEl = document.createElement('li');
    createdYearEl.textContent = `Year Created: ${createdYear}`;

    const updatedYearEl = document.createElement('li');
    updatedYearEl.textContent = `Year Updated: ${updatedYear}`;

    repoItem.appendChild(repoLink);
    repoItem.appendChild(repoName);
    repoItem.appendChild(repoDescription);
    repoItem.appendChild(createdYearEl);
    repoItem.appendChild(updatedYearEl);

    container2.appendChild(repoItem);
  });
}
