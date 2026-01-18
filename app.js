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

const notesRef = ref(db, "notes");

addBtn.addEventListener("click", async () => {
  const text = noteInput.value.trim();
  if (!text) return;

  await push(notesRef, { text, createdAt: Date.now() });
  noteInput.value = "";
});

onValue(notesRef, (snapshot) => {
  notesEl.innerHTML = "";
  snapshot.forEach((child) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${escapeHtml(child.val().text ?? "")}</span>
      <button data-key="${child.key}">حذف</button>
    `;

    li.querySelector("button").onclick = async (e) => {
      const key = e.target.getAttribute("data-key");
      await remove(ref(db, "notes/" + key));
    };

    notesEl.appendChild(li);
  });
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
