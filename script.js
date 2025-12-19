const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");

// Add Comment
function addComment() {
    const commentText = commentInput.value.trim();
    if(commentText !== "") {
        db.collection("comments").add({
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
        const li = document.createElement("li");
        li.textContent = doc.data().text;
        commentList.appendChild(li);
    });
});

