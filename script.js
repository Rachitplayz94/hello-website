// Firebase config (UNCHANGED)
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

let userName = null;

/* =========================
   🔄 LOADER
========================= */
window.onload = () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    checkSession();
  }, 800);
};

/* =========================
   🔐 LOGIN SYSTEM
========================= */

function checkSession() {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    userName = savedUser;
    showMain();
  } else {
    document.getElementById("loginBox").style.display = "block";
  }
}

async function loginUser() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  const msg = document.getElementById("loginMsg");

  if (!name || !pass) {
    msg.innerText = "Fill all fields";
    return;
  }

  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();

  const hash = await sha256(pass);

  if (doc.exists) {
    // LOGIN
    if (doc.data().password !== hash) {
      msg.innerText = "Wrong password";
      return;
    }
  } else {
    // REGISTER
    await userRef.set({
      password: hash,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  localStorage.setItem("username", name);
  userName = name;
  showMain();
}

function showMain() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("welcomeUser").innerText = "Welcome, " + userName;
  loadComments();
}

/* =========================
   🔒 PASSWORD HASH
========================= */
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/* =========================
   💬 COMMENT SYSTEM (SAME)
========================= */

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
          <div style="font-size:12px;color:gray;">${time}</div>
        `;
        list.appendChild(li);
      });

      list.scrollTop = list.scrollHeight;
    });
}

/* =========================
   🌙 DARK MODE
========================= */

const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};
