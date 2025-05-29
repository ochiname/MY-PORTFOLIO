import { URL } from './config.js';
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const backendUrl = URL;

  try {
    const response = await fetch(`${backendUrl}api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      sessionStorage.setItem('jwt_token', data.token);
      window.location.href = '/portfolio-site/update.html';
      showToast('Login successful!', 'success');
    } else {
      showToast(data.message || 'Login failed.', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Something went wrong. Please try again.', 'error');
  }
});

// Clear password field on page load
window.addEventListener('load', () => {
  document.getElementById('password').value = '';
});

// Function to display toast notifications
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.classList.add('toast', type);

  toast.textContent = message;

  // Append the toast to the container
  document.getElementById('toast-container').appendChild(toast);

  // Show the toast and then fade out after 3 seconds
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Remove the toast after it fades out
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
