import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("jwt_token");
  const apiBase = `${URL}api/user`;
  const loadBtn = document.getElementById("loadImagesBtn");
  const imageSelect = document.getElementById("imageSelect");
  const assignForm = document.getElementById("assignPicForm");
  const usageInput = document.getElementById("usageType");

  const previewImg = document.getElementById("previewImg");
  const imgDesc = document.getElementById("imgDescription");

  let images = [];

  // Load images from server
  loadBtn.addEventListener("click", async () => {
    if (!token) return alert("Not authenticated");

    try {
      const res = await fetch(`${apiBase}/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch images");

      images = data;
      imageSelect.innerHTML = `<option value="">-- Select an image --</option>`;
      data.forEach(img => {
        const option = document.createElement("option");
        option.value = img.url_link;
        option.textContent = `${img.title} - ${img.url_link}`;
        imageSelect.appendChild(option);
      });

      alert("Images loaded.");
    } catch (err) {
      console.error(err);
      alert("Error loading images: " + err.message);
    }
  });

  // On image select - show preview
  imageSelect.addEventListener("change", () => {
    const selectedUrl = imageSelect.value;
    const selectedImage = images.find(img => img.url_link === selectedUrl);

    if (!selectedUrl || !selectedImage) {
      previewImg.style.display = "none";
      imgDesc.textContent = "";
      assignForm.classList.add("hidden");
      return;
    }

    previewImg.src = selectedImage.url_link;
    previewImg.style.display = "block";
    imgDesc.textContent = selectedImage.description || "";
    assignForm.classList.remove("hidden");
  });

  // Submit new pic
  assignForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const image_url = imageSelect.value;
    const usage_type = usageInput.value.trim();

    if (!image_url || !usage_type) {
      return alert("Please select an image and provide usage type.");
    }

    try {
      const res = await fetch(`${apiBase}/pics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image_url, usage_type }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to assign pic");

      alert("Pic assigned successfully!");
      assignForm.reset();
      previewImg.style.display = "none";
      imgDesc.textContent = "";
      assignForm.classList.add("hidden");
    } catch (err) {
      console.error(err);
      alert("Error assigning pic: " + err.message);
    }
  });
});
