import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("certificationForm");
  if (!form) return;

  const apiBase = `${URL}api/user/certificate`; // GET certifications
  const apiUpdate = `${URL}api/user/certificateUpdate`; // PUT certification update
  const token = sessionStorage.getItem("jwt_token");

  const loadBtn = document.getElementById("loadBtn4");
  const recordSelect = document.getElementById("certificationRecordSelect");
  const submitBtn = form.querySelector("button.update-btn3");

  const certificationNameInput = document.getElementById("certification_name");
  const institutionNameInput = document.getElementById("institution_name");
  const yearInput = document.getElementById("certification_year");

  let records = [];

  // Load certifications and populate select
  loadBtn.addEventListener("click", async () => {
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    try {
      const res = await fetch(apiBase, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch certification records");

      records = await res.json();
      console.log("Fetched certifications:", records);

      recordSelect.innerHTML = `<option value="">-- Select a record --</option>`;
      records.forEach((cert) => {
        const option = document.createElement("option");
        option.value = cert.certification_id;
        option.textContent = cert.certification_name;
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
    const selected = records.find((r) => r.certification_id.toString() === selectedId);

    if (!selected) {
      form.classList.add("hidden");
      form.reset();
      return;
    }

    certificationNameInput.value = selected.certification_name || "";
    institutionNameInput.value = selected.institution_name || "";
    yearInput.value = selected.year || "";

    form.classList.remove("hidden");
  });

  // Submit update
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    const selectedId = recordSelect.value;

    const payload = {
      certification_id: parseInt(selectedId),
      certification_name: certificationNameInput.value.trim(),
      institution_name: institutionNameInput.value.trim(),
      year: parseInt(yearInput.value.trim()) // 
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

      if (!res.ok) throw new Error("Failed to update certification");

      alert("Certification record updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Update";
    }
  });
});
