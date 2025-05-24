// Get DOM elements
const ordersList = document.getElementById("ordersList");
const emptyOrders = document.getElementById("emptyOrders");
const pagination = document.getElementById("pagination");
const ordersSearchInput = document.getElementById("ordersSearchInput");
const statusFilter = document.getElementById("statusFilter");

// Pagination variables
const itemsPerPage = 4;
let currentPage = 1;
let filteredOrders = [];
let userOrders = [];

// Show orders on page load
function showOrders() {
  const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const userId = currentUser.userId;
  let totalMoney = 0;

  // Filter orders for the logged-in user
  userOrders = allOrders.filter((order) => order.customerId == userId);
  filteredOrders = [...userOrders];

  // Calculate total spent
  userOrders.forEach((item) => {
    // totalMoney += Number(item.price);
    totalMoney += Number(item.price);
  });

  init();
}

// Initialize page
function init() {
  renderOrders();
  renderPagination();

  // Add event listeners
  ordersSearchInput.addEventListener("input", handleSearch);
  if (statusFilter) {
    statusFilter.addEventListener("change", handleFilter);
  }
}

// Render orders list
function renderOrders() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const ordersToDisplay = filteredOrders.slice(startIndex, endIndex);

  if (ordersToDisplay.length === 0) {
    emptyOrders.classList.remove("hidden");
    ordersList.innerHTML = "";
  } else {
    emptyOrders.classList.add("hidden");
    ordersList.innerHTML = ordersToDisplay.map(createOrderCard).join("");
  }
}

// Create a single order card HTML
function createOrderCard(order) {
  let metaHtml = `
    <div><span>Price:</span> <strong>EGP ${order.price}</strong></div>
    <div><span>Quantity:</span> <strong>${order.quantity || 1}</strong></div>
  `;

  let actionsHtml = `
  <button class="btn btn-outline view-details-btn" data-title="${encodeURIComponent(
    order.title
  )}">View Details</button>
  <button class="btn btn-primary buy-again-btn" data-title="${encodeURIComponent(
    order.title
  )}">Buy Again</button>
`;

  // Generate a stable ID based on order properties
  const orderId = order.id || generateStableId(order);
  const orderDate = order.date || new Date().toLocaleDateString();

  return `
    <div class="order-card">
      <div class="order-header">
        <div>
          <span class="order-id">Order #${orderId}</span>
          <span class="order-date">Placed on ${orderDate}</span>
        </div>
      </div>
      <div class="order-details">
        <img src="${
          order.image || order.img
        }" alt="Product" class="order-image" onerror="this.src='placeholder.jpg'">
        <div class="order-info">
          <h3 class="order-product-name">${order.title}</h3>
          ${
            order.description
              ? `<p class="order-product-description">${order.description}</p>`
              : ""
          }
          <div class="order-meta">
            ${metaHtml}
          </div>
        </div>
      </div>
      <div class="order-footer">
        <div class="order-total">Total: EGP ${(
          Number(order.price) * (Number(order.quantity) || 1)
        ).toFixed(2)}</div>
        <div class="order-actions">
          ${actionsHtml}
        </div>
      </div>
    </div>
  `;
}

// Function to generate a stable ID based on order properties
function generateStableId(order) {
  // Create a string from order properties that should be unique
  const idString = `${order.title}-${order.price}-${order.quantity || 1}-${
    order.date || new Date().toLocaleDateString()
  }`;

  // Generate a hash from the string
  let hash = 0;
  for (let i = 0; i < idString.length; i++) {
    const char = idString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert to a positive hex string and take first 8 characters
  return Math.abs(hash).toString(16).substring(0, 8).toUpperCase();
}

// Event Delegation for dynamic buttons
ordersList.addEventListener("click", function (event) {
  if (event.target.classList.contains("view-details-btn")) {
    const title = decodeURIComponent(event.target.dataset.title);
    viewDetails(title);
  } else if (event.target.classList.contains("buy-again-btn")) {
    const title = decodeURIComponent(event.target.dataset.title);
    buyAgain(title);
  }
});

function buyAgain(orderTitle) {
  const order = userOrders.find((o) => o.title === orderTitle);
  if (!order) {
    alert("Order not found!");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.userId;

  if (!userId) {
    alert("You must be logged in!");
    return;
  }

  const existingItemIndex = cart.findIndex(
    (item) => item.title === order.title && item.customerId == userId
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    const newItem = {
      title: order.title,
      price: order.price,
      quantity: 1,
      image: order.image,
      customerId: userId,
      sellerId: order.sellerId || 1,
    };
    cart.push(newItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showBootstrapToast("Item added to Cart.", "success");
  updateCartCounter();

  // alert("Added to cart successfully!");
  // window.location.href = "Cart-Page.html";
}
function updateCartCounter() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.userId;
  const currentCart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
    (item) => item.customerId == userId
  );

  let totalItems = 0;
  currentCart.forEach((item) => {
    totalItems += item.quantity;
  });
  const counterElement = document.querySelector(".num-cart");
  if (counterElement) {
    counterElement.textContent = totalItems;
  }
}

updateCartCounter();

// New Fun toast by Tarek
function showBootstrapToast(message, type = "success") {
  const toastElement = document.getElementById("liveToast");
  const toastBody = toastElement.querySelector(".toast-body");
  const parentToast = document.getElementById("parentToast");
  parentToast.style.zIndex = "1100";
  // غير الرسالة
  toastBody.textContent = message;

  // غيّر اللون حسب النوع (success, danger, info...)
  toastElement.className = `toast align-items-center text-white bg-${type} border-0`;

  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// New Fun toast by Tarek

function viewDetails(orderTitle) {
  const order = userOrders.find((o) => o.title === orderTitle);
  if (!order) {
    alert("Order not found!");
    return;
  }

  localStorage.setItem("localItems", JSON.stringify(order.title));
  window.location.href = "productdetails.html";
}

// Render pagination buttons
function renderPagination() {
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let buttonsHtml = `
    <div class="pagination-btn ${
      currentPage === 1 ? "disabled" : ""
    }" onclick="changePage(${currentPage - 1})">
      <i class="fas fa-chevron-left"></i>
    </div>
  `;

  for (let i = 1; i <= totalPages; i++) {
    buttonsHtml += `
      <div class="pagination-btn ${
        i === currentPage ? "active" : ""
      }" onclick="changePage(${i})">
        ${i}
      </div>
    `;
  }

  buttonsHtml += `
    <div class="pagination-btn ${
      currentPage === totalPages ? "disabled" : ""
    }" onclick="changePage(${currentPage + 1})">
      <i class="fas fa-chevron-right"></i>
    </div>
  `;

  pagination.innerHTML = buttonsHtml;
}

// Change current page
function changePage(page) {
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderOrders();
  renderPagination();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Handle search input
function handleSearch() {
  const searchTerm = ordersSearchInput.value.toLowerCase();
  filterOrders(searchTerm);
}

// Handle status filter change (optional)
function handleFilter() {
  const status = statusFilter.value;
  filterOrders(ordersSearchInput.value.toLowerCase(), status);
}

// Filter orders by search text (and status if needed)
function filterOrders(searchTerm) {
  filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchTerm) ||
      (order.description &&
        order.description.toLowerCase().includes(searchTerm));

    return matchesSearch;
  });

  currentPage = 1;
  renderOrders();
  renderPagination();
}


// Start the script when page is loaded
document.addEventListener("DOMContentLoaded", showOrders);
