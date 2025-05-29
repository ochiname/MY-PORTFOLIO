import { URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('userForm');
  if (!form) return;

  const apiBase = `${URL}api/user/profile`; // GET user by token
  const apiBase2 = `${URL}api/user/update`; // PUT update user by token
  const token = sessionStorage.getItem("jwt_token");

  const loadBtn = document.getElementById("loadBtn2");
  const submitBtn = form.querySelector("button.update-btn1");

  // Form inputs
  const emailInput = document.getElementById("email");
  const firstNameInput = document.getElementById("first_name");
  const lastNameInput = document.getElementById("last_name");
  const roleInput = document.getElementById("role");
  const locationInput = document.getElementById("location");
  const bioInput = document.getElementById("bio");
  const phoneInput = document.getElementById("phone");
  const linkedinInput = document.getElementById("linkedin");
  const githubInput = document.getElementById("github");
  const twitterInput = document.getElementById("twitter");

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

      if (!res.ok) throw new Error("Failed to fetch user data");

      const user = await res.json();
      console.log("User data:", user);

      // Populate form fields
      emailInput.value = user.email || "";
      firstNameInput.value = user.first_name || "";
      lastNameInput.value = user.last_name || "";
      roleInput.value = user.role || "";
      locationInput.value = user.location || "";
      bioInput.value = user.bio || "";
      phoneInput.value = user.phone || "";
      linkedinInput.value = user.linkedin || "";
      githubInput.value = user.github || "";
      twitterInput.value = user.twitter || "";

      // Unhide form if hidden
      form.classList.remove("hidden");
      form.style.display = "block";
    } catch (err) {
      console.error("Error loading user data:", err);
      alert("Error loading data: " + err.message);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    const payload = {
      email: emailInput.value.trim(),
      first_name: firstNameInput.value.trim(),
      last_name: lastNameInput.value.trim(),
      role: roleInput.value.trim(),
      location: locationInput.value.trim(),
      bio: bioInput.value.trim(),
      phone: phoneInput.value.trim(),
      linkedin: linkedinInput.value.trim(),
      github: githubInput.value.trim(),
      twitter: twitterInput.value.trim(),
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user");
      }

      alert("User profile updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Update";
    }
  });
});
