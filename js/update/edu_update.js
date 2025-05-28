import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('educationForm');
  if (!form) {
      return;
  }
  const apiBase = `${URL}api/user/education`; // GET by token
  const apiBase2 = `${URL}api/user/educationUpdate`; // PUT by token
  const token = sessionStorage.getItem("jwt_token");

  const loadBtn = document.getElementById("loadBtn");
  const recordSelect = document.getElementById("eduRecordSelect");
  // const form = document.getElementById("educationForm");
  const submitBtn = form.querySelector("button.update-btn");

  const institutionInput = document.getElementById("institution");
  const degreeInput = document.getElementById("degree");
  const startYearInput = document.getElementById("start_year");
  const endYearInput = document.getElementById("end_year");

  let records = [];

  loadBtn.addEventListener("click", async () => {
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    try {
      const res = await fetch(apiBase, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch records");

      records = await res.json();
      console.log("Fetched records:", records);

      recordSelect.innerHTML = `<option value="">-- Select a record --</option>`;
      records.forEach((record) => {
        const option = document.createElement("option");
        option.value = record.education_id;
        option.textContent = `${record.degree}`;
        recordSelect.appendChild(option);
      });

      form.classList.add("hidden");
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Error loading data: " + err.message);
    }
  });

  recordSelect.addEventListener("change", () => {
    const selectedId = recordSelect.value;
    const selected = records.find((r) => r.education_id.toString() === selectedId);

    if (!selected) {
      form.classList.add("hidden");
      form.reset();
      return;
    }

    institutionInput.value = selected.institution;
    degreeInput.value = selected.degree;
    startYearInput.value = selected.start_year;
    endYearInput.value = selected.end_year;
    console.log({
      institutionInput,
      degreeInput,
      startYearInput,
      endYearInput,
      recordSelect,
      loadBtn,
      form
    });
    form.classList.remove("hidden");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    const selectedId = recordSelect.value;

    const payload = {
      education_id: parseInt(selectedId),
      institution: institutionInput.value.trim(),
      degree: degreeInput.value.trim(),
      start_year: parseInt(startYearInput.value.trim()),
      end_year: parseInt(endYearInput.value.trim()),
    };

    try {
      const res = await fetch(apiBase2, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update record");

      alert("Education record updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Update";
    }
  });
});


