import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase, ref, push, onValue, remove
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDxuo95DyyECTtIom3xRP2DnR8g0wdjzU4",
  authDomain: "cloud-notes-976f1.firebaseapp.com",
  projectId: "cloud-notes-976f1",
  storageBucket: "cloud-notes-976f1.firebasestorage.app",
  messagingSenderId: "629752556604",
  appId: "1:629752556604:web:1b93c009e5a79a5598e739"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const notesEl = document.getElementById("notes");
const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");

const notesCol = collection(db, "notes");
const q = query(notesCol, orderBy("createdAt", "desc"));

addBtn.addEventListener("click", async () => {
  const text = noteInput.value.trim();
  if (!text) return;

  await addDoc(notesCol, {
    text,
    createdAt: serverTimestamp(),
  });

  noteInput.value = "";
});

onSnapshot(q, (snapshot) => {
  notesEl.innerHTML = "";
  snapshot.forEach((d) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${escapeHtml(d.data().text)}</span>
      <button data-id="${d.id}">حذف</button>
    `;
    li.querySelector("button").onclick = async (e) => {
      const id = e.target.getAttribute("data-id");
      await deleteDoc(doc(db, "notes", id));
    };
    notesEl.appendChild(li);
  });
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
