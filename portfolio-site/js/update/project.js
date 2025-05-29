import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("projectForm");
  if (!form) return;

  const apiBase = `${URL}api/user/project`; // GET skills
  const apiUpdate = `${URL}api/user/projectUpdate`; // PUT skill update
  const token = sessionStorage.getItem("jwt_token");

  const loadBtn = document.getElementById("loadBtnProjects");
  const recordSelect = document.getElementById("projectRecordSelect");  // fixed here
  const submitBtn = form.querySelector("button.update-btn-project");

  const projectNameInput = document.getElementById("project_name");
  const descriptionInput = document.getElementById("description");
  const technologiesInput = document.getElementById("technologies");

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

      if (!res.ok) throw new Error("Failed to fetch project records");

      records = await res.json();
      console.log("Fetched skills:", records);

      recordSelect.innerHTML = `<option value="">-- Select a record --</option>`;
      records.forEach((pro) => {
        const option = document.createElement("option");
        option.value = pro.project_id;
        option.textContent = pro.project_name;
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
    const selected = records.find((r) => r.project_id.toString() === selectedId);

    if (!selected) {
      form.classList.add("hidden");
      form.reset();
      return;
    }

    projectNameInput.value = selected.project_name || "";
    descriptionInput.value = selected.description || "";
    technologiesInput.value = selected.description || "";

    form.classList.remove("hidden");
  });

  // Submit update
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    const selectedId = recordSelect.value;

    const payload = {
      project_id: parseInt(selectedId),
      project_name: projectNameInput.value.trim(),
      description: descriptionInput.value.trim(),
      technologies: technologiesInput.value.trim(),
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

      if (!res.ok) throw new Error("Failed to update project");

      alert("project record updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Update";
    }
  });
});
