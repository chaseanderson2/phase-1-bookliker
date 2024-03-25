document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("list");
    const bookDetails = document.getElementById("show-panel");
  
    fetch("http://localhost:3000/books")
      .then(response => response.json())
      .then(data => {
        data.forEach(book => {
          const bookTitle = document.createElement("li");
          bookTitle.textContent = book.title;
  
          bookTitle.addEventListener("click", () => {
            showBookDetails(book);
          });
  
          bookList.appendChild(bookTitle);
        });
      })
      .catch(error => console.log(error));
  
    function showBookDetails(book) {
      bookDetails.innerHTML = `
        <img src="${book.img_url}" alt="${book.title}" />
        <h2>${book.title}</h2>
        <p>${book.description}</p>
        <h3>Liked By:</h3>
        <ul id="liked-users"></ul>
        <button id="like-button">${book.users.includes(1) ? "Unlike" : "Like"}</button>
      `;
  
      const likeButton = document.getElementById("like-button");
      const likedUsersList = document.getElementById("liked-users");
  
      likeButton.addEventListener("click", () => {
        if (book.users.includes(1)) {
          unlikeBook(book, likedUsersList);
        } else {
          likeBook(book, likedUsersList);
        }
      });
  
      book.users.forEach(user => {
        const likedUser = document.createElement("li");
        likedUser.textContent = user.username;
        likedUsersList.appendChild(likedUser);
      });
    }
  
    function likeBook(book, likedUsersList) {
      book.users.push({ id: 1, username: "pouros" });
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ users: book.users }),
      })
        .then(response => response.json())
        .then(data => {
          const newLikedUser = document.createElement("li");
          newLikedUser.textContent = data.users[data.users.length - 1].username;
          likedUsersList.appendChild(newLikedUser);
          document.getElementById("like-button").textContent = "Unlike";
        })
        .catch(error => console.log(error));
    }
  
    function unlikeBook(book, likedUsersList) {
      const updatedUsers = book.users.filter(user => user.id !== 1);
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ users: updatedUsers }),
      })
        .then(response => response.json())
        .then(data => {
          likedUsersList.innerHTML = "";
          data.users.forEach(user => {
            const likedUser = document.createElement("li");
            likedUser.textContent = user.username;
            likedUsersList.appendChild(likedUser);
          });
          document.getElementById("like-button").textContent = "Like";
        })
        .catch(error => console.log(error));
    }
  });