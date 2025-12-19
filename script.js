// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqdmiq_qvhYb8luQbS3yWZ5yaUGEDXhwY",
  authDomain: "hello-website-d5502.firebaseapp.com",
  projectId: "hello-website-d5502",
  storageBucket: "hello-website-d5502.appspot.com",
  messagingSenderId: "887800679372",
  appId: "1:887800679372:web:78c74ebdabb1e076966b69"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

window.userName = "Anonymous";

window.onload = () => {

  // Developer name
  const devDiv = document.createElement("div");
  devDiv.id = "devName";
  devDiv.innerText = "Developer – Rachit";
  document.body.appendChild(devDiv);

  showNamePopup();

  const commentList = document.getElementById("commentList");
  const commentInput = document.getElementById("commentInput");

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"];

  window.addComment = function () {
    const text = commentInput.value.trim();

    if (text === "") {
      alert("Please write a comment first!");
      return;
    }

    db.collection("comments").add({
      name: window.userName,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    commentInput.value = "";
  };

  db.collection("comments")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      commentList.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");

        const color = colors[data.name.length % colors.length];
        const time = data.timestamp
          ? data.timestamp.toDate().toLocaleString()
          : "";

        li.innerHTML = `<span class="comment-name" style="color:${color}">
          ${data.name}</span> (${time}): ${data.text}`;

        commentList.appendChild(li);
      });
    });
};

// Popup
function showNamePopup() {
  const popup = document.createElement("div");
  popup.id = "namePopup";
  popup.innerHTML = `
    <h2>Enter Your Name</h2>
    <input type="text" id="popupNameInput" placeholder="Your Name">
    <br><br>
    <button onclick="submitName()">Submit</button>
  `;
  document.body.appendChild(popup);
}

function submitName() {
  const input = document.getElementById("popupNameInput").value.trim();
  window.userName = input !== "" ? input : "Anonymous";
  document.getElementById("namePopup").remove();
}
