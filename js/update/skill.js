import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("skillForm");
  if (!form) return;

  const apiBase = `${URL}api/user/skill`; // GET skills
  const apiUpdate = `${URL}api/user/skillUpdate`; // PUT skill update
  const token = sessionStorage.getItem("jwt_token");

  const loadBtn = document.getElementById("loadBtnSkills");
  const recordSelect = document.getElementById("skillRecordSelect");  // fixed here
  const submitBtn = form.querySelector("button.update-btn-skill");

  const skillNameInput = document.getElementById("skill_name");
  const proficiencyInput = document.getElementById("proficiency");

  let records = [];

  // Load skills and populate select
  loadBtn.addEventListener("click", async () => {
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    try {
      const res = await fetch(apiBase, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch skill records");

      records = await res.json();
      console.log("Fetched skills:", records);

      recordSelect.innerHTML = `<option value="">-- Select a record --</option>`;
      records.forEach((ski) => {
        const option = document.createElement("option");
        option.value = ski.skill_id;
        option.textContent = ski.skill_name;
        recordSelect.appendChild(option);
      });

      form.classList.add("hidden");
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Error loading data: " + err.message);
    }
  });

  // Handle selection from dropdown
  recordSelect.addEventListener("change", () => {
    const selectedId = recordSelect.value;
    const selected = records.find((r) => r.skill_id.toString() === selectedId);

    if (!selected) {
      form.classList.add("hidden");
      form.reset();
      return;
    }

    skillNameInput.value = selected.skill_name || "";
    proficiencyInput.value = selected.proficiency || "";

    form.classList.remove("hidden");
  });

  // Submit update
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    const selectedId = recordSelect.value;

    const payload = {
      skill_id: parseInt(selectedId),
      skill_name: skillNameInput.value.trim(),
      proficiency: parseInt(proficiencyInput.value.trim())
    };

    try {
      const res = await fetch(apiUpdate, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update skill");

      alert("Skill record updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Update";
    }
  });
});
