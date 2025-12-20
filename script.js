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

/* =====================
   TOP NAME + LOGO (JS)
===================== */
window.onload = () => {
  const devDiv = document.createElement("div");
  devDiv.id = "devName";

  const img = document.createElement("img");
  img.src = "logo.png";
  img.style.width = "32px";
  img.style.height = "32px";
  img.style.marginRight = "8px";

  const text = document.createElement("span");
  text.textContent = "Hello 😄";

  devDiv.appendChild(img);
  devDiv.appendChild(text);
  document.body.appendChild(devDiv);

  showNamePopup();
};

/* =====================
   NAME POPUP
===================== */
window.userName = "Anonymous";

function showNamePopup() {
  const popup = document.createElement("div");
  popup.id = "namePopup";
  popup.innerHTML = `
    <h2>Enter your name</h2>
    <input id="popupNameInput" placeholder="Your name">
    <button onclick="submitName()">Submit</button>
  `;
  document.body.appendChild(popup);
}

function submitName() {
  const v = document.getElementById("popupNameInput").value.trim();
  window.userName = v || "Anonymous";
  document.getElementById("namePopup").remove();
}

/* =====================
   COMMENT SYSTEM
===================== */
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");

function addComment() {
  const text = commentInput.value.trim();
  if (!text) return alert("Write something");

  db.collection("comments").add({
    name: window.userName,
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  commentInput.value = "";
}

/* =====================
   REALTIME COMMENTS
===================== */
db.collection("comments").orderBy("timestamp").onSnapshot(snapshot => {
  commentList.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");

    const time = d.timestamp
      ? d.timestamp.toDate().toLocaleString()
      : "";

    li.innerHTML = `
      <strong>${d.name}</strong>: ${d.text}
      <div style="font-size:12px;color:#666;margin-top:4px">
        ${time}
      </div>
    `;

    commentList.appendChild(li);
  });

  commentList.scrollTop = commentList.scrollHeight;
});

/* =====================
   AUTO DELETE (24 HOURS)
===================== */
function deleteOldComments() {
  const limit = new Date(Date.now() - 24*60*60*1000);

  db.collection("comments")
    .where("timestamp", "<", limit)
    .get()
    .then(snap => {
      snap.forEach(d =>
        db.collection("comments").doc(d.id).delete()
      );
    });
}

setInterval(deleteOldComments, 24*60*60*1000);


