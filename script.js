// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA3ng9GleOePwaF8azE3NLEsVvmiQ0sb4E",
  authDomain: "hello-51ac3.firebaseapp.com",
  projectId: "hello-51ac3",
  storageBucket: "hello-51ac3.appspot.com",
  messagingSenderId: "625297281616",
  appId: "1:625297281616:web:923165fea1873f9d633755"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================
// Developer Name + Logo (JS)
// ==========================
window.onload = () => {
  const devDiv = document.createElement("div");
  devDiv.id = "devName";

  const logo = document.createElement("img");
  logo.src = "logo.png";   // root folder se
  logo.alt = "Logo";
  logo.style.width = "32px";
  logo.style.height = "32px";
  logo.style.marginRight = "8px";

  const text = document.createElement("span");
  text.textContent = "Hello 😄";

  devDiv.appendChild(logo);
  devDiv.appendChild(text);
  document.body.appendChild(devDiv);

  showNamePopup();
};

// ==========================
// Username Popup
// ==========================
window.userName = "Anonymous";

function showNamePopup() {
  const popup = document.createElement("div");
  popup.id = "namePopup";
  popup.innerHTML = `
    <h2>Enter Your Name</h2>
    <input type="text" id="popupNameInput" placeholder="Your Name">
    <button onclick="submitName()">Submit</button>
  `;
  document.body.appendChild(popup);
}

function submitName() {
  const input = document.getElementById("popupNameInput").value.trim();
  window.userName = input !== "" ? input : "Anonymous";
  document.getElementById("namePopup").remove();
}

// ==========================
// Comment System
// ==========================
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"];

function addComment() {
  const text = commentInput.value.trim();
  if (!text) return alert("Write something!");

  db.collection("comments").add({
    name: window.userName,
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  commentInput.value = "";
}

// Realtime comments
db.collection("comments").orderBy("timestamp").onSnapshot(snapshot => {
  commentList.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    const color = colors[d.name.length % colors.length];
    const time = d.timestamp ? d.timestamp.toDate().toLocaleString() : "";

    li.innerHTML = `
      <span class="comment-name" style="color:${color}">${d.name}</span>: ${d.text}
      <div style="font-size:12px;color:#555;margin-top:4px">${time}</div>
    `;
    commentList.appendChild(li);
  });

  commentList.scrollTop = commentList.scrollHeight;
});

// ==========================
// Auto delete after 24 hours
// ==========================
function deleteOldComments() {
  const cutoff = new Date(Date.now() - 24*60*60*1000);

  db.collection("comments")
    .where("timestamp", "<", cutoff)
    .get()
    .then(snap => {
      snap.forEach(doc => db.collection("comments").doc(doc.id).delete());
    });
}

setInterval(deleteOldComments, 24*60*60*1000);

