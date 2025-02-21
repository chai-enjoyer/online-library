document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profileLink = document.getElementById('profile-link');
    const adminLink = document.getElementById('admin-link');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutBtn = document.getElementById('logout-btn');

    function updateNav(isAuthenticated, isAdmin) {
      profileLink.style.display = isAuthenticated ? 'inline' : 'none';
      adminLink.style.display = isAuthenticated && isAdmin ? 'inline' : 'none';
      loginLink.style.display = isAuthenticated ? 'none' : 'inline';
      registerLink.style.display = isAuthenticated ? 'none' : 'inline';
      logoutBtn.style.display = isAuthenticated ? 'inline' : 'none';
    }

    // Check token validity without redirecting unless explicitly needed
    if (token) {
      fetch('/users/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Token invalid');
        }
      }).then(user => {
        updateNav(true, user.role === 'admin');
      }).catch(() => {
        localStorage.removeItem('token');
        updateNav(false, false);
        // Only redirect to login if on a protected page (handled by individual page scripts)
      });
    } else {
      updateNav(false, false);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');
        errorDiv.style.display = 'none';
        try {
          const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
          } else {
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
          }
        } catch (error) {
          errorDiv.textContent = 'Login failed. Please try again.';
          errorDiv.style.display = 'block';
        }
      });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorDiv = document.getElementById('register-error');
        errorDiv.style.display = 'none';
        try {
          const res = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
          } else {
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
          }
        } catch (error) {
          errorDiv.textContent = 'Registration failed. Please try again.';
          errorDiv.style.display = 'block';
        }
      });
    }
  });

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
