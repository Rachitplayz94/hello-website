const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");

const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FF8C33"]; // random colors

// Add Comment
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

        // Random color for each user
        const color = colors[data.name.length % colors.length];

        // Format timestamp
        let time = data.timestamp ? data.timestamp.toDate().toLocaleString() : "";

        li.innerHTML = `<span class="comment-name" style="color:${color}">${data.name}</span> (${time}): ${data.text}`;
        commentList.appendChild(li);
    });
});
