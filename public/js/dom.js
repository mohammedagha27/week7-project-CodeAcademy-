let addCart = document.querySelectorAll(
  "body  main  section.book-container  div.bookinfo a"
);
function editHeader(data) {
  if (!data.msg) {
    let menu = document.querySelector(".menu");
    menu.textContent = "";
    menu.innerHTML = `
        <div class="userInfo">
        <a href="/logout" id="logout">Logout</a></li>
        <div class="user">
            <div id="username">${data.username}</div>
            <div id="userImg"><img src="${data.imgurl}" alt=""></div>
        </div>
        <div id="cart"><a href="./pages/cart.html"><i class="fa-solid fa-cart-shopping"></i></a></div>
    </div>
        `;
  }
}
fetch("/checkLoggedUser")
  .then((data) => data.json())
  .then(editHeader);
addCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("/checkLoggedUser")
      .then((data) => data.json())
      .then((data) => {
        if (data.msg) {
          window.location.href = "../pages/login.html";
        } else {
          alert("added");
        }
      });
  });
});
fetch("/getAllBooks")
  .then((data) => data.json())
  .then((data) => generateBooksCards(data.rows));

function generateBooksCards(data) {
  let container = document.querySelector(".book-container");
  container.textContent = "";
  data.forEach((ele) => {
    let book = creatNode("div", "book");
    let bookpic = creatNode("div", "bookpic");
    bookpic.style.backgroundImage = `url(${ele.imgurl})`;
    let bookinfo = creatNode("div", "bookinfo");
    let title = creatNode("div", "title");
    title.textContent = ele.book_name;
    let price = creatNode("div", "price");
    price.textContent = ele.price + "$";
    let desc = creatNode("div", "desc");
    desc.textContent = ele.details;
    let btn = creatNode("a", "add-cart");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      fetch("/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: ele.id,
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.msg) {
            window.location.href = "../pages/login.html";
          }
        });
    });
    btn.innerHTML = `
    <i class="fa-solid fa-cart-arrow-down"></i> Add To Cart
    `;
    book.appendChild(bookpic);
    bookinfo.appendChild(title);
    bookinfo.appendChild(price);
    bookinfo.appendChild(desc);
    bookinfo.appendChild(btn);
    book.appendChild(bookinfo);
    container.appendChild(book);
  });
}

function creatNode(type, className) {
  let node = document.createElement(type);
  node.className = className;
  return node;
}
