import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("jwt_token");
  const apiBase = `${URL}api/user`;

  const loadPicBtn = document.getElementById("loadPicRecordsBtn");
  const picSelect = document.getElementById("picRecordSelect");
  const updateForm = document.getElementById("updatePicForm");
  const updateUsageInput = document.getElementById("updateUsageType");
  const updateImageSelect = document.getElementById("updateImageUrl");

  let picRecords = [];
  let allImages = [];

  // Load all images for reuse in dropdown
  const loadImageOptions = async () => {
    const res = await fetch(`${apiBase}/images`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const images = await res.json();
    if (!res.ok) throw new Error(images.message || "Failed to fetch images");

    allImages = images;
    updateImageSelect.innerHTML = `<option value="">-- Select new image URL --</option>`;
    images.forEach(img => {
      const option = document.createElement("option");
      option.value = img.url_link;
      option.textContent = `${img.title} - ${img.url_link}`;
      updateImageSelect.appendChild(option);
    });
  };

  // Load pic records
  loadPicBtn.addEventListener("click", async () => {
    if (!token) return alert("You are not authenticated");

    try {
      await loadImageOptions();

      const res = await fetch(`${apiBase}/pics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load pics");

      picRecords = data;
      picSelect.innerHTML = `<option value="">-- Select a pic record --</option>`;
      data.forEach(pic => {
        const option = document.createElement("option");
        option.value = pic.id;
        option.textContent = `${pic.id}: ${pic.image_url} | ${pic.usage_type}`;
        picSelect.appendChild(option);
      });

      alert("Pic records loaded.");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  });

  // On pic selection, populate form
  picSelect.addEventListener("change", () => {
    const selectedId = parseInt(picSelect.value);
    const selected = picRecords.find(p => p.id === selectedId);
    if (!selected) {
      updateForm.classList.add("hidden");
      return;
    }

    updateImageSelect.value = selected.image_url;
    updateUsageInput.value = selected.usage_type;
    updateForm.classList.remove("hidden");
  });

  // Submit update
  updateForm.addEventListener("submit", async e => {
    e.preventDefault();

    const id = parseInt(picSelect.value);
    const image_url = updateImageSelect.value;
    const usage_type = updateUsageInput.value.trim();

    if (!id || !image_url || !usage_type) return alert("Missing data");

    try {
      const res = await fetch(`${apiBase}/pic/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image_url, usage_type }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update pic");

      alert("Pic updated successfully!");
      updateForm.classList.add("hidden");
      updateForm.reset();
    } catch (err) {
      console.error(err);
      alert("Update error: " + err.message);
    }
  });
});
