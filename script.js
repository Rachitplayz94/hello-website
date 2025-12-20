import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3ng9GleOePwaF8azE3NLEsVvmiQ0sb4E",
  authDomain: "hello-51ac3.firebaseapp.com",
  projectId: "hello-51ac3",
  storageBucket: "hello-51ac3.firebasestorage.app",
  messagingSenderId: "625297281616",
  appId: "1:625297281616:web:923165fea1873f9d633755"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ref = collection(db, "comments");

window.addComment = async () => {
  const name = nameInput.value.trim();
  const text = commentInput.value.trim();
  if (!name || !text) return;

  await addDoc(ref, {
    name,
    text,
    time: serverTimestamp()
  });

  commentInput.value = "";
};

const q = query(ref, orderBy("time", "asc"));

onSnapshot(q, snap => {
  comments.innerHTML = "";
  snap.forEach(doc => {
    const d = doc.data();
    const t = d.time?.toDate().toLocaleString() || "";
    comments.innerHTML += `
      <div class="comment">
        <div class="name">${d.name}</div>
        <div>${d.text}</div>
        <div class="time">${t}</div>
      </div>`;
  });
  comments.scrollTop = comments.scrollHeight;
});




