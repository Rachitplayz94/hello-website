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

let userName = "Anonymous";

// Page load
window.onload = () => {
  showNamePopup();
  loadComments();
};

// Add comment
function addComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();

  if (text === "") {
    alert("Write something first!");
    return;
  }

  db.collection("comments").add({
    name: userName,
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = "";
}

// Load comments (REAL TIME)
function loadComments() {
  const list = document.getElementById("commentList");

  db.collection("comments")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      list.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();

        const li = document.createElement("li");

        const time = data.timestamp
          ? data.timestamp.toDate().toLocaleString()
          : "";

        li.innerHTML = `
          <div><b>${data.name}</b>: ${data.text}</div>
          <div style="font-size:12px; color:gray; margin-top:4px;">
            ${time}
          </div>
        `;

        list.appendChild(li);
      });

      // auto scroll to bottom
      list.scrollTop = list.scrollHeight;
    });
}

// Name popup
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
  const val = document.getElementById("popupNameInput").value.trim();
  userName = val !== "" ? val : "Anonymous";
  document.getElementById("namePopup").remove();
}







