import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Reuse existing Firebase app
const app = getApps().length ? getApps()[0] : initializeApp({
  apiKey: "AIzaSyAm-2XDg3fuXXhrsIv0XI9W1j8Ebior0n4",
  authDomain: "all-in-one-website-25a28.firebaseapp.com",
  projectId: "all-in-one-website-25a28",
  storageBucket: "all-in-one-website-25a28.firebasestorage.app",
  messagingSenderId: "175636009900",
  appId: "1:175636009900:web:609f7897c73c817286e009"
});

const storage = getStorage();
const auth    = getAuth();

// ===== Toast =====
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
  setTimeout(() => toast.remove(), 4000);
}

// ===== Upload Button =====
document.getElementById("uploadBtn").addEventListener("click", async () => {
  const file = document.getElementById("pdfUpload").files[0];

  if (!file) {
    showToast("Select a file first.", "error");
    return;
  }

  if (!auth.currentUser) {
    showToast("Please log in to upload files.", "error");
    return;
  }

  const btn = document.getElementById("uploadBtn");
  btn.disabled    = true;
  btn.textContent = "Uploading...";

  try {
    const storageRef = ref(storage, "documents/" + auth.currentUser.uid + "/" + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    console.log("File URL:", url);
    showToast("✅ Uploaded successfully!");

    // Show link
    const link = document.getElementById("uploadedLink");
    if (link) { link.href = url; link.textContent = "📄 " + file.name; link.style.display = "block"; }

    document.getElementById("pdfUpload").value = "";
    const fn = document.querySelector(".dropzone-filename");
    if (fn) fn.textContent = "";

  } catch (error) {
    console.error(error);
    showToast("Upload failed: " + error.message, "error");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Upload";
  }
});

// ===== Drag & Drop =====
document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  if (!dropzone) return;

  dropzone.addEventListener("dragover", e => { e.preventDefault(); dropzone.style.borderColor = "var(--accent-1)"; });
  dropzone.addEventListener("dragleave", () => { dropzone.style.borderColor = ""; });
  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.style.borderColor = "";
    const file = e.dataTransfer.files[0];
    if (file) {
      document.getElementById("pdfUpload").files = e.dataTransfer.files;
      const fn = document.querySelector(".dropzone-filename");
      if (fn) fn.textContent = file.name;
    }
  });

  document.getElementById("pdfUpload")?.addEventListener("change", e => {
    const fn = document.querySelector(".dropzone-filename");
    if (fn) fn.textContent = e.target.files[0]?.name || "";
  });
});
