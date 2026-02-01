/**
 * Auth Handler
 * Manages Login, Register, Logout and Session Chcking
 */

// Check authentication for protected pages
const protectedPages = ['dashboard.html', 'task_history.html', 'profile.html'];
const authPages = ['login.html', 'register.html'];
const currentPage = window.location.pathname.split('/').pop();

function checkAuth() {
    const user = StorageManager.getCurrentUser();

    if (user) {
        // Update User Name in UI if element exists
        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = user.name || user.email;

        // Redirect if on login/register pages
        if (authPages.includes(currentPage)) {
            window.location.href = 'dashboard.html';
        }

        // Show auth-aware navigation
        updateNav(true);
        updateHeroButtons(true);
    } else {
        // Redirect to login if on protected pages
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }

        // Show public navigation
        updateNav(false);
        updateHeroButtons(false);
    }
}

function updateNav(isLoggedIn) {
    const navAuth = document.getElementById('authAwareNav');
    if (!navAuth) return;

    if (isLoggedIn) {
        navAuth.innerHTML = `
            <a href="index.html" class="btn btn-primary" style="margin-right: 0.5rem">Home</a>
            <a href="dashboard.html" class="btn btn-primary" style="margin-right: 0.5rem">Dashboard</a>
            <a href="task_history.html" class="btn btn-info" style="margin-right: 0.5rem">Task History</a>
            <a href="profile.html" class="btn btn-warning" style="margin-right: 0.5rem">Profile</a>
            <a href="#" id="logoutBtn" class="btn btn-danger">Logout</a>
        `;
    } else {
        navAuth.innerHTML = `
            <a href="index.html" class="btn btn-primary" style="margin-right: 0.5rem">Home</a>
            <a href="login.html" class="btn btn-primary" style="margin-right: 0.5rem">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
    }
}

function updateHeroButtons(isLoggedIn) {
    const heroButtons = document.querySelector('.hero-top .buttons');
    if (!heroButtons) return;

    if (isLoggedIn) {
        heroButtons.innerHTML = `
            <a href="dashboard.html" class="btn login" aria-label="Go to dashboard">Go to Dashboard</a>
            <a href="#" id="homeLogoutBtn" class="btn register" aria-label="Logout">Logout</a>
        `;
    } else {
        heroButtons.innerHTML = `
            <a href="login.html" class="btn login" aria-label="Login to your account">Login</a>
            <a href="register.html" class="btn register" aria-label="Register for a new account">Register</a>
        `;
    }
}


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                StorageManager.saveUser({ name, email, password });
                StorageManager.authenticate(email, password); // Auto login
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                StorageManager.authenticate(email, password);
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Global Logout Handler (Event Delegation)
    document.addEventListener('click', (e) => {
        if (e.target && (e.target.id === 'logoutBtn' || e.target.id === 'homeLogoutBtn')) {
            e.preventDefault();
            StorageManager.logout();
            window.location.href = 'index.html'; // Go to home after logout
        }
    });
});
