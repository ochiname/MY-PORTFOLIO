import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("articleForm");
  if (!form) return;

  const apiBase   = `${URL}api/user/article`;       // GET articles
  const apiUpdate = `${URL}api/user/articleUpdate`; // PUT article update
  const token     = sessionStorage.getItem("jwt_token");

  const loadBtn      = document.getElementById("loadBtnArticles");
  const recordSelect = document.getElementById("articleRecordSelect");
  const submitBtn    = form.querySelector("button.update-btn-article");

  const titleInput       = document.getElementById("article_title");
  const imgUrlInput      = document.getElementById("article_img_url");
  const descriptionInput = document.getElementById("article_description");
  const linkInput        = document.getElementById("article_link");

  let records = [];

  // 1) Load and populate dropdown
  loadBtn.addEventListener("click", async () => {
    if (!token) {
      alert("You are not authenticated.");
      return;
    }
    try {
      const res = await fetch(apiBase, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch article records");

      records = await res.json();
      console.log("Fetched articles:", records);

      recordSelect.innerHTML = `<option value="">-- Select an article --</option>`;
      records.forEach(rec => {
        const opt = document.createElement("option");
        opt.value       = rec.id;
        opt.textContent = rec.title;
        recordSelect.appendChild(opt);
      });

      form.classList.add("hidden");
      form.reset();
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Error loading data: " + err.message);
    }
  });

  // 2) When an article is selected, populate the form
  recordSelect.addEventListener("change", () => {
    const selectedId = recordSelect.value;
    const selected   = records.find(r => r.id.toString() === selectedId);

    if (!selected) {
      form.classList.add("hidden");
      form.reset();
      return;
    }

    titleInput.value       = selected.title       || "";
    imgUrlInput.value      = selected.img_url     || "";
    descriptionInput.value = selected.description || "";
    linkInput.value        = selected.link_to_article || "";

    console.log("Selected article:", selected);
    form.classList.remove("hidden");
  });

  // 3) Submit update
  form.addEventListener("submit", async e => {
    e.preventDefault();
    submitBtn.disabled    = true;
    submitBtn.textContent = "Updating...";

    const selectedId  = parseInt(recordSelect.value);
    const payload     = {
      id               : parseInt(selectedId),
      title            : titleInput.value.trim(),
      img_url          : imgUrlInput.value.trim(),
      description      : descriptionInput.value.trim(),
      link_to_article  : linkInput.value.trim()
    };

    console.log("Payload sent:", payload);

    try {
      const res = await fetch(apiUpdate, {
        method : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      console.log("Response received:", data);
      if (!res.ok) {
        throw new Error(data.message || "Failed to update article");
      }

      alert("Article updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Update";
    }
  });
});
