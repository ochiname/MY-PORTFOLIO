import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("languageForm");
  if (!form) return;

  const apiBase   = `${URL}api/user/language`;       // GET all languages
  const apiUpdate = `${URL}api/user/languageUpdate`; // PUT update
  const token     = sessionStorage.getItem("jwt_token");

  const loadBtn      = document.getElementById("loadBtnLanguages");
  const recordSelect = document.getElementById("languageRecordSelect");
  const submitBtn    = form.querySelector("button.update-btn-language");

  const languageNameInput = document.getElementById("language_name");
  const proficiencyInput  = document.getElementById("language_proficiency");

  let records = [];

  // 1) Load and populate
  loadBtn.addEventListener("click", async () => {
    if (!token) return alert("You are not authenticated.");

    try {
      const res = await fetch(apiBase, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch language records");

      records = await res.json();
      console.log("Fetched languages:", records);

      // rebuild dropdown
      recordSelect.innerHTML = `<option value="">-- Select a record --</option>`;
      records.forEach(lang => {
        const opt = document.createElement("option");
        opt.value       = lang.language_id;
        opt.textContent = lang.language_name;
        recordSelect.appendChild(opt);
      });

      form.classList.add("hidden");
      languageNameInput.value = "";
      proficiencyInput.value  = "";
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Error loading data: " + err.message);
    }
  });

  // 2) On selection, fill form
  recordSelect.addEventListener("change", () => {
    const selectedId = recordSelect.value;
    const selected   = records.find(r => r.language_id.toString() === selectedId);

    console.log("recordSelect:", recordSelect);
    console.log("selected record:", selected);

    if (!selected) {
      form.classList.add("hidden");
      form.reset();
      return;
    }

    languageNameInput.value = selected.language_name  || "";
    console.log("selected.proficiency:", selected.proficiency);
    proficiencyInput.value  = selected.proficiency     || "";

    console.log("→ setting proficiencyInput.value =", proficiencyInput.value);

    form.classList.remove("hidden");
  });

  // 3) Submit update
  form.addEventListener("submit", async e => {
    e.preventDefault();
    submitBtn.disabled    = true;
    submitBtn.textContent = "Updating...";

    const selectedId      = parseInt(recordSelect.value, 10);
    const language_name   = languageNameInput.value.trim();
    const proficiency     = proficiencyInput.value.trim();

    const payload = {
      language_id:    selectedId,
      language_name,
      proficiency
    };
    console.log("payload:", payload);

    try {
      const res = await fetch(apiUpdate, {
        method:  "PUT",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      console.log("response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to update language");
      }
      alert("Language record updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Update";
    }
  });
});
