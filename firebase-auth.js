// ===== Firebase Auth - ALL IN ONE =====
// TODO: Replace with your own Firebase project config from:
// https://console.firebase.google.com → Project Settings → Your apps → SDK setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ── Your Firebase config ──────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// ─────────────────────────────────────────────────────────────────────────────

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

// ===== UI helpers =============================================================

function showToast(msg, type = 'success') {
  // Remove existing toast
  document.querySelector('.auth-toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'auth-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
    background:${type === 'success' ? 'var(--accent-2)' : '#e74c3c'};
    color:#fff; padding:14px 28px; border-radius:40px;
    font-size:0.9rem; font-weight:600; z-index:9999;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    animation:fadeUp 0.4s ease forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setLoading(btn, loading) {
  btn.disabled   = loading;
  btn.textContent = loading ? 'Please wait...' : btn.dataset.label;
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function updateNavUser(user) {
  const actions = document.querySelector('.nav-actions');
  if (!actions) return;

  if (user) {
    actions.innerHTML = `
      <div class="nav-user-pill">
        <span class="nav-avatar">${user.displayName ? user.displayName[0].toUpperCase() : '👤'}</span>
        <span class="nav-username">${user.displayName || user.email.split('@')[0]}</span>
        <button class="btn-outline" id="logoutBtn">Log Out</button>
      </div>`;
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  } else {
    actions.innerHTML = `
      <div class="nav-search">
        <span>🔍</span>
        <input type="text" placeholder="Search documents..." id="globalSearch">
      </div>
      <button class="btn-outline" data-modal="loginModal">Log In</button>
      <button class="btn-primary" data-modal="signupModal">Sign Up Free</button>`;
  }
}

// ===== Auth state observer ====================================================
onAuthStateChanged(auth, user => {
  updateNavUser(user);
});

// ===== SIGN UP ================================================================
export async function handleSignup(e) {
  e.preventDefault();
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-password').value;
  const btn   = document.getElementById('signup-btn');

  if (!name || !email || !pass) { showToast('Please fill in all fields.', 'error'); return; }
  if (pass.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }

  setLoading(btn, true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    showToast(`Welcome, ${name}! 🎉`);
    closeAllModals();
  } catch (err) {
    showToast(friendlyError(err.code), 'error');
  } finally {
    setLoading(btn, false);
  }
}

// ===== LOG IN =================================================================
export async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const btn   = document.getElementById('login-btn');

  if (!email || !pass) { showToast('Please enter email and password.', 'error'); return; }

  setLoading(btn, true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    showToast(`Welcome back, ${cred.user.displayName || cred.user.email}! 👋`);
    closeAllModals();
  } catch (err) {
    showToast(friendlyError(err.code), 'error');
  } finally {
    setLoading(btn, false);
  }
}

// ===== GOOGLE SIGN-IN =========================================================
export async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    showToast(`Welcome, ${result.user.displayName}! 🎉`);
    closeAllModals();
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast(friendlyError(err.code), 'error');
    }
  }
}

// ===== LOG OUT ================================================================
export async function handleLogout() {
  await signOut(auth);
  showToast('You have been logged out.');
}

// ===== Error messages =========================================================
function friendlyError(code) {
  const map = {
    'auth/email-already-in-use'  : 'That email is already registered.',
    'auth/invalid-email'         : 'Please enter a valid email address.',
    'auth/weak-password'         : 'Password must be at least 6 characters.',
    'auth/user-not-found'        : 'No account found with that email.',
    'auth/wrong-password'        : 'Incorrect password. Please try again.',
    'auth/too-many-requests'     : 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/configuration-not-found': '⚠️ Firebase not configured yet. Add your config in firebase-auth.js.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
