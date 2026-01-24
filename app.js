import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxuo95DyyECTtIom3xRP2DnR8g0wdjzU4",
  authDomain: "cloud-notes-976f1.firebaseapp.com",
  databaseURL: "https://cloud-notes-976f1-default-rtdb.firebaseio.com",
  projectId: "cloud-notes-976f1",
  storageBucket: "cloud-notes-976f1.appspot.com",
  messagingSenderId: "629752556604",
  appId: "1:629752556604:web:1b93c009e5a79a5598e739"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const notesEl = document.getElementById("notes");
const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");

const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");

const notesRef = ref(db, "notes");

addBtn.addEventListener("click", async () => {
  const text = noteInput.value.trim();
  if (!text) return;

  await push(notesRef, { text, createdAt: Date.now() });
  noteInput.value = "";
  noteInput.focus();
});

// Enter يضيف
noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

onValue(notesRef, (snapshot) => {
  notesEl.innerHTML = "";
  let count = 0;

  snapshot.forEach((child) => {
    count++;

    const data = child.val() ?? {};
    const text = escapeHtml(data.text ?? "");
    const dateText = formatDate(data.createdAt);

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="noteText">
        <div>${text}</div>
        <div class="meta">${dateText}</div>
      </div>
      <button class="btn btn-danger" data-key="${child.key}">حذف</button>
    `;

    li.querySelector("button").onclick = async (e) => {
      const key = e.target.getAttribute("data-key");
      await remove(ref(db, "notes/" + key));
    };

    notesEl.appendChild(li);
  });

  if (countEl) countEl.textContent = String(count);
  if (emptyEl) emptyEl.style.display = count ? "none" : "block";
});

function formatDate(ts){
  if (!ts) return "";
  try{
    return new Date(ts).toLocaleString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }catch{
    return "";
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
