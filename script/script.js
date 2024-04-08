document.addEventListener("DOMContentLoaded", function () {
  autoResizeTextarea();

  const storedComments = JSON.parse(localStorage.getItem("comments")) || [];
  const commentsList = document.getElementById("commentsList");

  storedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  storedComments.forEach(function (comment) {
    const newComment = createCommentElement(
      comment.name,
      comment.text,
      comment.image,
      new Date(comment.timestamp)
    );
    commentsList.appendChild(newComment);
  });

  let currentIndex = storedComments.length;
  let scrolledToComments = false;

  window.addEventListener("scroll", function () {
    const commentsWrapper = document.querySelector(".comments-wrapper");
    const commentsWrapperPosition = commentsWrapper.getBoundingClientRect().top;

    if (commentsWrapperPosition <= window.innerHeight && !scrolledToComments) {
      scrolledToComments = true;
      setTimeout(function () {
        if (currentIndex < sample.length) {
          const newCommentData = sample[currentIndex];
          const newComment = createCommentElement(
            newCommentData.name,
            newCommentData.text,
            newCommentData.image,
            new Date()
          );
          commentsList.insertAdjacentHTML(
            "afterbegin",
            `
            <li class="list">
              <label class="avatar" for="fileInputAvatar">
                <img src="./images/user.png" alt="Upload Image" width="40" height="40"/>
              </label>
              <span class="name">${newCommentData.name}</span>
              <p class="text">${newCommentData.text}</p>
              ${
                newCommentData.image
                  ? `<div class="text-img">${newCommentData.image}</div>`
                  : ""
              }
              <p class="date">Published: ${new Date().toLocaleString()}</p>
              <div class="line"></div>
            </li>
          `
          );

          storedComments.unshift({
            id: Date.now().toString(),
            name: newCommentData.name,
            text: newCommentData.text,
            image: newCommentData.image,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem("comments", JSON.stringify(storedComments));

          currentIndex++;
        }
      }, 2000);
    }
  });

  setInterval(function () {
    if (currentIndex < sample.length) {
      const newCommentData = sample[currentIndex];
      commentsList.insertAdjacentHTML(
        "afterbegin",
        `
        <li class="list">
          <label class="avatar" for="fileInputAvatar">
            <img src="./images/user.png" alt="Upload Image" width="40" height="40"/>
          </label>
          <span class="name">${newCommentData.name}</span>
          <p class="text">${newCommentData.text}</p>
          ${
            newCommentData.image
              ? `<div class="text-img">${newCommentData.image}</div>`
              : ""
          }
          <p class="date">Published: ${new Date().toLocaleString()}</p>
          <div class="line"></div>
        </li>
      `
      );

      storedComments.unshift({
        id: Date.now().toString(),
        name: newCommentData.name,
        text: newCommentData.text,
        image: newCommentData.image,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("comments", JSON.stringify(storedComments));

      currentIndex++;
    }
  }, 20 * 1000);
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
    const timestamp = new Date();
    const newComment = createCommentElement(name, comment, image, timestamp);
    commentsList.insertBefore(newComment, commentsList.firstChild);

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
    storedComments.unshift(newStoredComment);
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
    <p class="date">Published: ${new Date().toLocaleString()}</p>
    <div class="line"></div>
  `;
  return newComment;
}

const sample = [
  {
    name: "Yair Rodríguez",
    text: "¡Realmente es bueno! Llevo unas semanas tomando D-Norm. No me he sentido así en mucho tiempo. Mis niveles de azúcar volvieron a la normalidad al día siguiente de tomarlo por primera vez, ¡qué pasará cuando haya tomado todo el curso!",
    image: "",
    timestamp: "2024-04-06T13:40:10.333Z",
  },
  {
    name: "Elizabeth Vargas",
    text: "Esta es la verdad sobre lo que hay detrás de las compañías farmacéuticas. Todo lo que quieren de nosotros es dinero. Recomiendan suplementos que son ineficaces y sólo dan falsas esperanzas. No recetan suplementos que realmente ayudan, simplemente no los tienen en las farmacias. Me preocupo por mi país. Nadie se preocupa por los diabéticos. Es triste que no pueda vivir en Europa. Gracias por compartir la información.",
    image: "",
    timestamp: "2024-04-06T13:40:10.333Z",
  },
  {
    name: "Maribel Peña",
    text: "Soy diabética desde hace mucho tiempo (más de 16 años), he probado de todo para normalizar mi azúcar, quitar el adormecimiento de las manos y la sed excesiva. Bebí varias infusiones de hierbas, seguí dietas estrictas, compré todos los productos que se ofrecían en la farmacia, pero el resultado fue insignificante. Sólo vi un efecto real con D-Norm. No me he sentido tan bien en años. Mi nivel de azúcar en sangre ha dejado de aumentar, puedo olvidarme de las restricciones dietéticas estrictas (¡por fin!), incluso he dejado de llevar una botella de agua de 1,5 litros a todos lados porque ahora no quiero beberla todo el tiempo. Sólo quiero dar las gracias a los creadores de D-Norm, ¡han revolucionado la lucha contra diabetes de tipo 2!",
    image: "",
    timestamp: "2024-04-06T13:40:10.333Z",
  },
  {
    name: "Carmela Espinoza",
    text: "Usé D-Norm hace dos años. Lo pedí en la página web oficial. Desde hace 2 años me siento como una persona sana. De todas las cosas que he probado (soy diabética desde hace mucho tiempo), D-Norm es el mejor suplemento. ¡No lo dudes! ¡Es tu salvador de las enfermedades!",
    image: "",
    timestamp: "2024-04-06T13:40:10.333Z",
  },
  {
    name: "Mario Pacheco",
    text: "Pedí D-Norm. Vivo en Oaxaca y me prometieron la entrega en una semana. Estoy deseando que llegue.",
    image: "",
    timestamp: "2024-04-06T13:40:10.333Z",
  },
];
