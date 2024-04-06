document.addEventListener("DOMContentLoaded", function () {
  autoResizeTextarea();

  const storedComments = JSON.parse(localStorage.getItem("comments")) || [];
  const commentsList = document.getElementById("commentsList");

  storedComments.forEach(function (comment) {
    const newComment = createCommentElement(
      comment.name,
      comment.text,
      comment.image,
      new Date(comment.timestamp) // передаем время публикации как объект Date
    );
    commentsList.appendChild(newComment);
  });
});

//! textarea
function autoResizeTextarea() {
  const textarea = document.getElementById("comment");
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

document.addEventListener("input", function (event) {
  if (event.target && event.target.matches("[data-autoresize]")) {
    autoResizeTextarea();
  }
});

//! download
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const imageDisplay = document.getElementById("imageDisplay");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.onload = function () {
          img.width = this.naturalWidth;
          img.height = this.naturalHeight;
        };
        img.src = e.target.result;
        imageDisplay.innerHTML = "";
        imageDisplay.appendChild(img);
      };
      reader.readAsDataURL(file);
    } else {
      imageDisplay.textContent = "";
    }
  });

//! form
document.querySelector(".form").addEventListener("submit", function (event) {
  event.preventDefault();

  const nameInput = document.querySelector('input[type="text"]');
  const commentInput = document.getElementById("comment");
  const imageDisplay = document.getElementById("imageDisplay");

  let name = nameInput.value.trim();
  const comment = commentInput.value.trim();
  const image = imageDisplay.innerHTML.trim();

  if (name) {
    if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
      alert("First letter of the name must be capital.");
      return;
    }
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.substring(0, 15);
  } else {
    alert("Please enter a name.");
    return;
  }

  if (comment) {
    const commentsList = document.getElementById("commentsList");
    const timestamp = new Date(); // сохраняем текущее время публикации
    const newComment = createCommentElement(name, comment, image, timestamp);
    commentsList.appendChild(newComment);

    nameInput.value = "";
    commentInput.value = "";
    imageDisplay.innerHTML = "";

    const storedComments = JSON.parse(localStorage.getItem("comments")) || [];
    const newStoredComment = {
      name: name,
      text: comment,
      image: image,
      timestamp: timestamp,
    };
    storedComments.push(newStoredComment);
    localStorage.setItem("comments", JSON.stringify(storedComments));
  } else {
    alert("Please enter a comment.");
  }
});

function createCommentElement(name, comment, image, timestamp) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const dateString = timestamp.toLocaleString("en-US", options);

  const newComment = document.createElement("li");
  newComment.classList = "list";
  newComment.innerHTML = `
    <label class="avatar" for="fileInputAvatar">
      <img src="./images/user.png" alt="Upload Image" width="40" height="40"/>
    </label>
    <span class="name">${name}</span>
    <p class="text">${comment}</p>
    ${image ? `<div class="text-img">${image}</div>` : ""}
    <p class="date">Опубликовано: ${dateString}</p>
    <div class="line"></div>
  `;
  return newComment;
}
