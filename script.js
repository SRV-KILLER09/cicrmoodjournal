document.addEventListener('DOMContentLoaded', () => {

  // ===== LOGIN =====
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const storedUser = localStorage.getItem(email);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
          localStorage.setItem('username', user.username); // Save username for dashboard
          window.location.href = 'dashboard.html';
        } else {
          alert('Incorrect password!');
        }
      } else {
        alert('Account not found. Please sign up.');
      }
    });
  }

  // ===== SIGNUP =====
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const contact = document.getElementById('contact').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const user = { username, contact, password };
      localStorage.setItem(email, JSON.stringify(user));

      alert('Account created successfully!');
      window.location.href = 'index.html';
    });
  }

  // ===== PASSWORD TOGGLE =====
  window.togglePassword = function() {
    const pass = document.getElementById('password');
    const toggle = document.querySelector('.toggle');
    if (pass.type === 'password') {
      pass.type = 'text';
      toggle.textContent = 'Hide';
    } else {
      pass.type = 'password';
      toggle.textContent = 'Show';
    }
  }

  // ===== LIVE TIME =====
  const timeEl = document.getElementById('time');
  if (timeEl) {
    setInterval(() => {
      const now = new Date();
      timeEl.textContent = now.toLocaleString();
    }, 1000);
  }
});
