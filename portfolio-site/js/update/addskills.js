import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add_skillForm");
  if (!form) return;

  const apiAdd = `${URL}api/user/addskill`; // POST endpoint
  const token = sessionStorage.getItem("jwt_token");

  const submitBtn = form.querySelector("button.add-btn-skill");
  const skillNameInput = document.getElementById("add_skill_name");
  const proficiencyInput = document.getElementById("add_skill_proficiency");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const payload = {
      skill_name: skillNameInput.value.trim(),
      proficiency: Number(proficiencyInput.value.trim()),
    };

    console.log("Submitting skill:", payload);

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
        throw new Error(data.message || "Failed to add skill");
      }

      alert("Skill added successfully!");
      form.reset();
    } catch (err) {
      console.error("Error adding skill:", err);
      alert("Error: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });
});
