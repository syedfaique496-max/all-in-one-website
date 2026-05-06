import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAm-2XDg3fuXXhrsIv0XI9W1j8Ebior0n4",
  authDomain: "all-in-one-website-25a28.firebaseapp.com",
  projectId: "all-in-one-website-25a28",
  storageBucket: "all-in-one-website-25a28.firebasestorage.app",
  messagingSenderId: "175636009900",
  appId: "1:175636009900:web:609f7897c73c817286e009",
  measurementId: "G-L04Q513KJY"
};

// ✅ Initialize Firebase
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

// ===== Toast notification =====
function showToast(msg, type = 'success') {
  document.querySelector('.auth-toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'auth-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
    background:${type === 'success' ? '#00d4aa' : '#e74c3c'};
    color:#fff; padding:14px 28px; border-radius:40px;
    font-size:0.9rem; font-weight:600; z-index:9999;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    animation:fadeUp 0.4s ease forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// ===== Auth state — update navbar =====
onAuthStateChanged(auth, user => {
  const actions = document.querySelector('.nav-actions');
  if (!actions) return;
  if (user) {
    actions.innerHTML = `
      <div class="nav-user-pill">
        <span class="nav-avatar">${user.displayName ? user.displayName[0].toUpperCase() : '👤'}</span>
        <span class="nav-username">${user.displayName || user.email.split('@')[0]}</span>
        <button class="btn-outline" onclick="logoutUser()">Log Out</button>
      </div>`;
  } else {
    actions.innerHTML = `
      <div class="nav-search">
        <span>🔍</span>
        <input type="text" placeholder="Search documents..." id="globalSearch">
      </div>
      <button class="btn-outline" data-modal="loginModal">Log In</button>
      <button class="btn-primary" data-modal="signupModal">Sign Up Free</button>`;
  }
});

// 🔐 LOGIN
window.loginUser = function () {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('login-btn');

  if (!email || !password) { showToast('Please enter email and password.', 'error'); return; }
  btn.textContent = 'Logging in...'; btn.disabled = true;

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      showToast(`Welcome back, ${cred.user.displayName || cred.user.email}! 👋`);
      closeAllModals();
    })
    .catch(err => showToast(friendlyError(err.code), 'error'))
    .finally(() => { btn.textContent = 'Log In'; btn.disabled = false; });
};

// 🔑 FORGOT PASSWORD
window.forgotPassword = function () {
  const email = document.getElementById('loginEmail').value.trim();
  if (!email) {
    showToast('Please enter your email address first.', 'error');
    return;
  }
  sendPasswordResetEmail(auth, email)
    .then(() => showToast('Password reset email sent! Check your inbox. 📧'))
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        showToast('No account found with that email.', 'error');
      } else if (error.code === 'auth/invalid-email') {
        showToast('Invalid email address.', 'error');
      } else {
        showToast(error.message, 'error');
      }
    });
};

// 🆕 SIGNUP
window.signupUser = function () {
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const btn      = document.getElementById('signup-btn');

  if (!name || !email || !password) { showToast('Please fill in all fields.', 'error'); return; }
  btn.textContent = 'Creating account...'; btn.disabled = true;

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      return cred.user.updateProfile({ displayName: name }).then(() => {
        showToast(`Account created successfully! Welcome, ${name}! 🎉`);
        closeAllModals();
      });
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        showToast('Account exists. Redirecting to login...', 'error');
        setTimeout(() => {
          closeAllModals();
          document.getElementById('loginModal').classList.add('active');
        }, 1500);
      } else if (error.code === 'auth/weak-password') {
        showToast('Password should be at least 6 characters.', 'error');
      } else {
        showToast(error.message, 'error');
      }
    })
    .finally(() => { btn.textContent = 'Create Account'; btn.disabled = false; });
};

// 🌐 GOOGLE SIGN-IN
window.googleSignIn = function () {
  signInWithPopup(auth, provider)
    .then(result => {
      showToast(`Welcome, ${result.user.displayName}! 🎉`);
      closeAllModals();
    })
    .catch(err => {
      if (err.code !== 'auth/popup-closed-by-user') showToast(friendlyError(err.code), 'error');
    });
};

// 🚪 LOGOUT
window.logoutUser = function () {
  signOut(auth).then(() => showToast('You have been logged out.'));
};

// ===== Friendly error messages =====
function friendlyError(code) {
  const map = {
    'auth/email-already-in-use'  : 'That email is already registered.',
    'auth/invalid-email'         : 'Please enter a valid email address.',
    'auth/weak-password'         : 'Password must be at least 6 characters.',
    'auth/user-not-found'        : 'No account found with that email.',
    'auth/wrong-password'        : 'Incorrect password. Please try again.',
    'auth/invalid-credential'    : 'Incorrect email or password.',
    'auth/too-many-requests'     : 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
