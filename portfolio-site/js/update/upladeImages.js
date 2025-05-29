import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("jwt_token");
  const apiBase = `${URL}api/user`;

  const form = document.getElementById("uploadImageForm");
  const titleInput = document.getElementById("upload_ImgTitle");
  const descriptionInput = document.getElementById("upload_ImgDescription");
  const fileInput = document.getElementById("upload_ImgFile");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const file = fileInput.files[0];

    // Validation check
    if (!title || !description || !file) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const res = await fetch(`${apiBase}/uploadimage`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      alert("Image uploaded successfully!");
      form.reset();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error: " + error.message);
    }
  });
});
