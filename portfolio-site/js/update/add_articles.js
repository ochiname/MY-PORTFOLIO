import{ URL }from '../config.js'
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add_articleForm");
  if (!form) return;

  const apiAdd = `${URL}api/user/addarticle`; // POST endpoint
  const token  = sessionStorage.getItem("jwt_token");

  const submitBtn       = form.querySelector("button.add-btn-article");
  const titleInput      = document.getElementById("add_article_title");
  const imgUrlInput     = document.getElementById("add_article_img_url");
  const descriptionInput= document.getElementById("add_article_description");
  const linkInput       = document.getElementById("add_article_link");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled    = true;
    submitBtn.textContent = "Submitting...";

    const payload = {
      title           : titleInput.value.trim(),
      img_url         : imgUrlInput.value.trim(),
      description     : descriptionInput.value.trim(),
      link_to_article : linkInput.value.trim()
    };

    console.log("Submitting article:", payload);

    try {
      const res = await fetch(apiAdd, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to add article");
      }

      alert("Article added successfully!");
      form.reset();
    } catch (err) {
      console.error("Error adding article:", err);
      alert("Error: " + err.message);
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Submit";
    }
  });
});
