// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA3ng9GleOePwaF8azE3NLEsVvmiQ0sb4E",
  authDomain: "hello-51ac3.firebaseapp.com",
  projectId: "hello-51ac3",
  storageBucket: "hello-51ac3.appspot.com",
  messagingSenderId: "625297281616",
  appId: "1:625297281616:web:923165fea1873f9d633755",
  measurementId: "G-H87TJ2QSXY"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Developer Name
window.onload = () => {
  const devDiv = document.createElement("div");
  devDiv.id = "devName";
  devDiv.textContent = "Developer – Rachit";
  document.body.appendChild(devDiv);

  showNamePopup();
};

// Global user name
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

// Comment System
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const submitBtn = document.getElementById("submitCommentBtn");
const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"];

function addComment() {
  const commentText = commentInput.value.trim();
  if(commentText !== "") {
    db.collection("comments").add({
      name: window.userName || "Anonymous",
      text: commentText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    commentInput.value = "";
  } else {
    alert("Please write a comment first!");
  }
}

// Real-time listener
db.collection("comments").orderBy("timestamp").onSnapshot((snapshot) => {
  commentList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    const color = colors[data.name.length % colors.length];

    // Timestamp below comment
    let time = data.timestamp ? data.timestamp.toDate().toLocaleString() : "";
    li.innerHTML = `<span class="comment-name" style="color:${color}">${data.name}</span>: ${data.text}<div class="comment-time" style="font-size:12px;color:#555;margin-top:4px;">${time}</div>`;
    commentList.appendChild(li);
  });

  // Scroll to bottom so input stays below latest comment
  commentList.scrollTop = commentList.scrollHeight;
});

// Auto-delete old comments (older than 24 hours)
function deleteOldComments() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 1*24*60*60*1000); // 24 hours

  db.collection("comments")
    .where("timestamp", "<", cutoff)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("comments").doc(doc.id).delete()
          .then(() => console.log("Deleted old comment:", doc.id))
          .catch(err => console.error(err));
      });
    })
    .catch(err => console.error(err));
}

// Call once a day
setInterval(deleteOldComments, 24*60*60*1000); // 24 hours
