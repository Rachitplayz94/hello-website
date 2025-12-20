// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqdmiq_qvhYb8luQbS3yWZ5yaUGEDXhwY",
  authDomain: "hello-website-d5502.firebaseapp.com",
  projectId: "hello-website-d5502",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let userName = null;

/* Loader */
window.onload = () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    checkSession();
  }, 800);
};

/* Login system */
function checkSession() {
  const saved = localStorage.getItem("username");
  if (saved) {
    userName = saved;
    showMain();
  } else {
    document.getElementById("loginBox").style.display = "block";
  }
}

async function loginUser() {
  const name = username.value.trim();
  const pass = password.value;
  const msg = loginMsg;

  if (!name || !pass) {
    msg.innerText = "Fill all fields";
    return;
  }

  const ref = db.collection("users").doc(name);
  const doc = await ref.get();
  const hash = await sha256(pass);

  if (doc.exists) {
    if (doc.data().password !== hash) {
      msg.innerText = "Wrong password";
      return;
    }
  } else {
    await ref.set({ password: hash });
  }

  localStorage.setItem("username", name);
  userName = name;
  showMain();
}

function showMain() {
  loginBox.style.display = "none";
  mainContent.style.display = "block";
  welcomeUser.innerText = "Welcome, " + userName;
  loadComments();
}

/* Hash */
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,"0")).join("");
}

/* Comments */
function addComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();
  if (!text) return alert("Write something!");

  db.collection("comments").add({
    name: userName,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = "";

  const list = document.getElementById("commentList");
  list.scrollTop = list.scrollHeight;
}

function loadComments() {
  const list = document.getElementById("commentList");

  db.collection("comments")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      const isAtBottom = list.scrollHeight - list.scrollTop <= list.clientHeight + 50;

      list.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `<b>${d.name}</b>: ${d.text}`;
        list.appendChild(li);
      });

      if (isAtBottom) {
        list.scrollTop = list.scrollHeight;
      }
    });
}

/* Hamburger Menu + Dark Mode + Logout + Overlay */
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
  sideMenu.classList.toggle("show");
  overlay.classList.toggle("show");
}

const menuDarkBtn = document.getElementById("menuDarkToggle");
menuDarkBtn.onclick = () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    menuDarkBtn.innerText = "☀️ Dark Mode";
  } else {
    localStorage.setItem("theme", "light");
    menuDarkBtn.innerText = "🌙 Dark Mode";
  }
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  menuDarkBtn.innerText = "☀️ Dark Mode";
} else {
  menuDarkBtn.innerText = "🌙 Dark Mode";
}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.onclick = () => {
  localStorage.removeItem("username");
  location.reload();
};






