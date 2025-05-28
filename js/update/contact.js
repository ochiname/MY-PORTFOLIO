import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const apiBase = `${URL}api/user/contact`; // GET contact by token
  const apiBase2 = `${URL}api/user/contactUpdate`; // PUT contact update
  const token = sessionStorage.getItem("jwt_token");

  const loadBtn = document.getElementById("loadBtn3");
  const recordSelect = document.getElementById("contactRecordSelect");
  const submitBtn = form.querySelector("button.update-btn2");

  const emailInput = document.getElementById("contact_email");
  const locationInput = document.getElementById("contact_location");
  const phone1Input = document.getElementById("phone1");
  const phone2Input = document.getElementById("phone2");

  let record = null;

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

      if (!res.ok) throw new Error("Failed to fetch contact record");

      const data = await res.json();
      console.log("Fetched record:", data);

      // Store the contact record
      record = data;

      // Populate the dropdown with a single static option
      recordSelect.innerHTML = `<option value="1">${data.email}</option>`;
      recordSelect.value = "1";

      // Trigger the change event to populate form
      recordSelect.dispatchEvent(new Event("change"));
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Error loading data: " + err.message);
    }
  });

  recordSelect.addEventListener("change", () => {
    if (!record) {
      form.classList.add("hidden");
      form.reset();
      return;
    }

    // Populate form fields
    emailInput.value = record.email || "";
    locationInput.value = record.location || "";
    phone1Input.value = record.phone1 || "";
    phone2Input.value = record.phone2 || "";

    form.classList.remove("hidden");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    const payload = {
      email: emailInput.value.trim(),
      location: locationInput.value.trim(),
      phone1: phone1Input.value.trim(),
      phone2: phone2Input.value.trim(),
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

      if (!res.ok) throw new Error("Failed to update contact record");

      alert("Contact record updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Update";
    }
  });
});