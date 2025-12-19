// script.js (type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 NEW FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyA3ng9GleOePwaF8azE3NLEsVvmiQ0sb4E",
  authDomain: "hello-51ac3.firebaseapp.com",
  projectId: "hello-51ac3",
  storageBucket: "hello-51ac3.firebasestorage.app",
  messagingSenderId: "625297281616",
  appId: "1:625297281616:web:923165fea1873f9d633755",
  measurementId: "G-H87TJ2QSXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.userName = "Anonymous";

window.onload = () => {

  // Developer Name Top-left
  const devDiv = document.createElement("div");
  devDiv.id = "devName";
  devDiv.innerText = "Developer – Rachit";
  document.body.appendChild(devDiv);

  showNamePopup();

  const commentList = document.getElementById("commentList");
  const commentInput = document.getElementById("commentInput");
  const postBtn = document.getElementById("postBtn");

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"];

  // Add Comment Function
  postBtn.addEventListener("click", async () => {
    const text = commentInput.value.trim();
    if (text === "") { alert("Please write a comment first!"); return; }

    await addDoc(collection(db, "comments"), {
      name: window.userName,
      text: text,
      timestamp: serverTimestamp()
    });

    commentInput.value = "";
  });

  // Real-time comments
  const q = query(collection(db, "comments"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    commentList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");

      const color = colors[data.name.length % colors.length];
      const time = data.timestamp ? data.timestamp.toDate().toLocaleString() : "";

      li.innerHTML = `
        <span class="comment-name" style="color:${color}">${data.name}</span>
        <br>
        ${data.text}
        <div style="font-size:12px;color:gray;">${time}</div>
      `;
      commentList.appendChild(li);
    });
  });

};

// Popup Name
function showNamePopup() {
  const popup = document.createElement("div");
  popup.id = "namePopup";
  popup.innerHTML = `
    <h2>Enter Your Name</h2>
    <input type="text" id="popupNameInput" placeholder="Your Name">
    <br><br>
    <button id="submitNameBtn">Submit</button>
  `;
  document.body.appendChild(popup);

  document.getElementById("submitNameBtn").addEventListener("click", () => {
    const input = document.getElementById("popupNameInput").value.trim();
    window.userName = input !== "" ? input : "Anonymous";
    popup.remove();
  });
}

