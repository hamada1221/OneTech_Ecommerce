function updateWishlistCount() {
  const savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customerId = currentUser ? currentUser.userId : null;

  const userItems = savedItems.filter((item) => item.customerId === customerId);
  document.getElementById("wishlistCount").textContent = userItems.length;
}

document.addEventListener("DOMContentLoaded", function () {
  let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
  const container = document.getElementById("itemsContainer");
  const noWishBox = document.getElementById("noWishBox");

  updateWishlistCount(); // Initial update

  //  Clear Wishlist Button Logic
  document
    .getElementById("showNoWishBtn")
    .addEventListener("click", function () {
      localStorage.removeItem("savedItems");
      savedItems = [];
      container.innerHTML = "";
      noWishBox.classList.remove("d-none");
      updateWishlistCount(); //
    });

  function renderWishlist() {
    container.innerHTML = "";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const customerId = currentUser ? currentUser.userId : null;
    savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    savedItems = savedItems.filter((item) => item.customerId === customerId);

    if (savedItems.length === 0) {
      noWishBox.classList.remove("d-none");
      return;
    } else {
      noWishBox.classList.add("d-none");
    }

    savedItems.forEach((item, index) => {
      const col = document.createElement("div");
      //السطرين دول عدلهم
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const inCart = cart.some(
        (cartItem) =>
          cartItem.title === item.title && cartItem.customerId === customerId
      );

      col.className = "col-12";
      col.innerHTML = `
        <div class="card d-flex align-items-center justify-content-center position-relative p-2 mb-2" style="height: auto;">
          <div class="row align-items-center justify-content-evenly w-100">
            <div class="col-2 d-flex align-items-center justify-content-start">
              <img src="${item.image[0]}" class="img-fluid rounded" alt="${
        item.title
      }" style="max-height: 90px; object-fit: contain;">
            </div>
            <div class="col-8 fs-5 d-flex align-items-center">
              <p class="mb-0">${item.about}</p>
            </div>
            <div class="col-2 d-flex align-items-center justify-content-evenly">
              <!-- Heart Icon -->
              <span class="delete-btn" data-index="${index}" data-title="${
        item.title
      }" title="Remove from wishlist" role="button" style="cursor: pointer; margin-right: 10px;">

                <i class="fa-solid fa-heart fa-2x text-danger"></i>
              </span>
              <!-- Cart Icon -->
            <span class="add-to-cart-btn" data-index="${index}" data-title="${
        item.title
      }" title="Add to cart" role="button" style="cursor: pointer;">

                <i class="fa-solid fa-cart-shopping fa-2x ${
                  inCart ? "text-success" : "text-secondary"
                }"></i>
              </span>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
    //here edit the buttons to work correctly
  }

  // Initial render
  renderWishlist();

  // Individual item delete (decrease count)
  container.addEventListener("click", function (e) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const customerId = currentUser ? currentUser.userId : null;

    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

    if (e.target.closest(".delete-btn")) {
      const title = e.target.closest(".delete-btn").getAttribute("data-title");

      // Remove item only for this user
      savedItems = savedItems.filter(
        (item) => !(item.title === title && item.customerId === customerId)
      );

      localStorage.setItem("savedItems", JSON.stringify(savedItems));
      updateWishlistCount();
      renderWishlist();
    }

    if (e.target.closest(".add-to-cart-btn")) {
      const title = e.target
        .closest(".add-to-cart-btn")
        .getAttribute("data-title");
      const item = savedItems.find(
        (item) => item.title === title && item.customerId === customerId
      );

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.title === item.title
      );

      if (existingItemIndex !== -1) {
        cart.splice(existingItemIndex, 1); // remove from cart
      } else {
        cart.push({
          title: item.title,
          price: item.price || 100,
          sellerId: item.sellerId,
          customerId: customerId,
          stock: item.stock,
          quantity: 1,
          image: item.image[0] || "default.png",
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCounter();
      renderWishlist();
    }
  });
});

//add counter function ....
function updateCartCounter() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.userId;
  const currentCart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
    (item) => item.customerId == userId
  );
  let totalItems = 0;

  for (let key in currentCart) {
    totalItems += currentCart[key].quantity;
  }
  const counterElement = document.querySelector(".num-cart");
  if (counterElement) {
    counterElement.textContent = totalItems;
  }
}
updateCartCounter();
