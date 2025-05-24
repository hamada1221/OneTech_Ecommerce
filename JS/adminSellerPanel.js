//-----------------dashboard-----------------
(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Sidebar Toggler
  
  $(".sidebar-toggler").click(function () {
    $(".sidebar, .content").toggleClass("open");


    return false;
  });
    $(document).ready(function () {
    $(".sidebar-toggler").on("click", function (e) {
      e.preventDefault();
      $("#newPanel").slideToggle("fast"); // Smooth slide toggle
    });
  });

  // Worldwide Sales Chart
  $(".worldwide-sales").each(function (index, canvas) {
    var ctx = canvas.getContext("2d");
    // Now you can create a chart for each canvas
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
        datasets: [
          {
            label: "USA",
            data: [15, 30, 55, 65, 60, 80, 95],
            backgroundColor: "#FF9F00",
          },
          {
            label: "UK",
            data: [8, 35, 40, 60, 70, 55, 75],
            backgroundColor: "#2D2D27",
          },
          {
            label: "AU",
            data: [12, 25, 45, 55, 65, 70, 60],
            backgroundColor: "rgba(255, 159, 0, .7)",
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  });

  // Salse & Revenue Chart
  $(".salse-revenue").each(function (index, canvas) {
    var ctx2 = canvas.getContext("2d");
    new Chart(ctx2, {
      type: "line",
      data: {
        labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
        datasets: [
          {
            label: "Salse",
            data: [15, 30, 55, 45, 70, 65, 85],
            backgroundColor: "#2D2D27",
            fill: true,
          },
          {
            label: "Revenue",
            data: [99, 135, 170, 130, 190, 180, 270],
            backgroundColor: "#FF9F00",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  });
})(jQuery);

// Sidebar navigation script





document.addEventListener("DOMContentLoaded", function () {
  
  document
    .querySelectorAll(".nav-item.nav-link, .chart-header")
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        // Remove 'active' from all links
        document
          .querySelectorAll(".nav-item.nav-link, .chart-header")
          .forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
        // If a chart-header is clicked, also activate the corresponding sidebar link
        if (this.classList.contains("chart-header")) {
          const section = this.getAttribute("data-section");
          const sidebarLink = document.querySelector(
            '.nav-item.nav-link[data-section="' + section + '"]'
          );
          if (sidebarLink) {
            sidebarLink.classList.add("active");
          }
        }
        // Show spinner
        document.getElementById("spinner").classList.add("show");
        // Hide all sections immediately
        document
          .querySelectorAll(".section")
          .forEach((sec) => (sec.style.display = "none"));
        // After a short delay, hide spinner and show the selected section
        setTimeout(() => {
          document.getElementById("spinner").classList.remove("show");
          const section = this.getAttribute("data-section");
          document.getElementById(section + "-section").style.display = "block";
        }, 500); // 500ms delay, adjust as needed
      });
    });
});

//----------------users Management---------------------
// User Management System
class UserManager {
  constructor() {
    // Initialize with sample data if no users exist
    const storedUsers = localStorage.getItem("usersData");
    // console.log('Stored users:', storedUsers);

    if (!storedUsers) {
      console.log("No stored users found, initializing with sample data");
      this.users = [
        {
          username: "admin1",
          email: "admin1@example.com",
          password: "admin123",
          role: "admin",
        },
        {
          username: "merchant1",
          email: "merchant1@example.com",
          password: "merchant123",
          role: "merchant",
        },
        {
          username: "user1",
          email: "user1@example.com",
          password: "user123",
          role: "user",
        },
      ];
      this.saveUsers();
    } else {
      // console.log('Loading stored users');
      this.users = JSON.parse(storedUsers);
    }

    this.currentUser = null;
    this.currentPage = 1;
    this.usersPerPage = 10;
    this.initializeEventListeners();
    this.renderUsers();
    this.updatePagination();
    this.deleteUserListenerInitialized = false;
  }

  initializeEventListeners() {
    // Add User Form Submit
    const userForm = document.getElementById("userForm");
    if (userForm) {
      userForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleUserSubmit();
      });
    }

    // Add event listener for modal close button
    const closeButton = document.querySelector("#userModal .btn-close");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        this.resetForm();
        this.closeModal();
      });
    }

    // Add event delegation for edit and delete buttons
    const usersTable = document.querySelector(".usersTable");
    if (usersTable) {
      usersTable.addEventListener("click", (e) => {
        const target = e.target.closest("a");
        if (!target) return;

        const row = target.closest("tr");
        if (!row) return;

        const username = row.cells[1].textContent; // Username is in the second column

        if (target.classList.contains("edit-user")) {
          e.preventDefault();
          this.editUser(username);
        } else if (target.classList.contains("delete-user")) {
          e.preventDefault();
          this.deleteUser(username);
        }
      });
    }

    // Search functionality
    const searchButton = document.querySelector(
      ".input-group .btn-outline-secondary"
    );
    if (searchButton) {
      searchButton.addEventListener("click", () => this.handleSearch());
    }

    // Reset search and show all users
    const resetButton = document.querySelector(".resetsearch");
    if (resetButton) {
      resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Clear all search inputs
        const searchInputs = document.querySelectorAll(
          '.input-group input[type="text"]'
        );
        searchInputs.forEach((input) => {
          input.value = "";
        });

        // Reset to first page and show all users
        this.currentPage = 1;
        this.renderUsers(this.users);
        this.updatePagination();
      });
    }
  }

  getTotalPages() {
    return Math.ceil(this.users.length / this.usersPerPage);
  }

  updatePagination() {
    const pagination = document.querySelector(".pagination");
    if (!pagination) return;

    const totalPages = this.getTotalPages();
    let paginationHTML = `
            <li class="page-item ${this.currentPage === 1 ? "disabled" : ""}">
                <a class="page-link" href="#">&laquo;</a>
            </li>
        `;

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
                <li class="page-item ${this.currentPage === i ? "active" : ""}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `;
    }

    paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? "disabled" : ""
      }">
                <a class="page-link" href="#">&raquo;</a>
            </li>
        `;

    pagination.innerHTML = paginationHTML;
  }

  handleUserSubmit() {
    const form = document.getElementById("userForm");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
      fname: document.getElementById("fname").value,
      lname: document.getElementById("lname").value,
      phone: document.getElementById("phone").value,
      bod: document.getElementById("bod").value,
      userId: this.users.length + 1,
    };

    try {
      if (this.currentUser) {
        // Update existing user
        const userIndex = this.users.findIndex(
          (u) => u.username === this.currentUser.username
        );
        if (userIndex !== -1) {
          this.users[userIndex] = formData;
          this.saveUsers();
          alert("User updated successfully");
        }
        this.currentUser = null;
      } else {
        // Check if username already exists
        if (this.users.some((u) => u.username === formData.username)) {
          alert("Username already exists");
          return;
        }
        // Add new user
        this.users.push(formData);
        this.saveUsers();
        alert("User added successfully");
      }

      this.renderUsers();
      this.resetForm();
      this.closeModal();
    } catch (error) {
      console.error("Error handling user submit:", error);
      alert("An error occurred while saving the user");
    }
  }

  closeModal() {
    const modalElement = document.getElementById("userModal");
    const modal =
      bootstrap.Modal.getInstance(modalElement) ||
      new bootstrap.Modal(modalElement);
    modal.hide();

    // Remove modal backdrop if it exists
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }

    // Remove modal-open class from body
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  deleteUser(username) {
    // Store the username to be deleted
    this.userToDelete = username;

    // Show the delete confirmation modal
    const deleteUserModal = document.getElementById("deleteUserModal");
    const bsDeleteModal = new bootstrap.Modal(deleteUserModal);
    bsDeleteModal.show();

    // Remove any existing event listener to prevent duplicates
    const confirmBtn = document.getElementById("confirmDeleteUser");
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Add the event listener to the new button
    newConfirmBtn.addEventListener("click", () => {
      try {
        this.users = this.users.filter(
          (user) => user.username !== this.userToDelete
        );
        this.saveUsers();
        this.renderUsers();
        this.updatePagination();

        // Force close the modal and remove backdrop
        bsDeleteModal.hide();

        // Add a safer way to clean up modal artifacts
        const cleanupModal = function () {
          // Remove any modal backdrops safely
          const backdrops = document.getElementsByClassName("modal-backdrop");
          while (backdrops.length > 0) {
            if (backdrops[0] && backdrops[0].parentNode) {
              backdrops[0].parentNode.removeChild(backdrops[0]);
            } else {
              break;
            }
          }

          // Clean up body classes and styles
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";

          // Remove this event listener to avoid duplicates
          document.removeEventListener("hidden.bs.modal", cleanupModal);
        };

        // Use setTimeout to ensure the modal has time to hide
        setTimeout(cleanupModal, 150);

        // Show success message
        const successToast = document.createElement("div");
        successToast.className = "position-fixed bottom-0 end-0 p-3";
        successToast.style.zIndex = "5";
        successToast.innerHTML = `
                    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-success text-white">
                            <strong class="me-auto">Success</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            User deleted successfully
                        </div>
                    </div>
                `;
        document.body.appendChild(successToast);

        // Remove the toast after 3 seconds
        setTimeout(() => {
          if (document.body.contains(successToast)) {
            document.body.removeChild(successToast);
          }
        }, 3000);
      } catch (error) {
        console.error("Error deleting user:", error);

        // Show error message
        const errorToast = document.createElement("div");
        errorToast.className = "position-fixed bottom-0 end-0 p-3";
        errorToast.style.zIndex = "5";
        errorToast.innerHTML = `
                    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-danger text-white">
                            <strong class="me-auto">Error</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body">
                            An error occurred while deleting the user
                        </div>
                    </div>
                `;
        document.body.appendChild(errorToast);

        // Remove the toast after 3 seconds
        setTimeout(() => {
          if (document.body.contains(errorToast)) {
            document.body.removeChild(errorToast);
          }
        }, 3000);
      }
    });
  }

  editUser(username) {
    try {
      const user = this.users.find((u) => u.username === username);
      if (user) {
        this.currentUser = user;
        document.getElementById("username").value = user.username;
        document.getElementById("fname").value = user.fname;
        document.getElementById("lname").value = user.lname;
        document.getElementById("phone").value = user.phone;
        document.getElementById("bod").value = user.bod;
        document.getElementById("email").value = user.email;
        document.getElementById("password").value = user.password;
        document.getElementById("role").value = user.role;

        document.getElementById("userModalLabel").textContent = "Edit User";
        const modal = new bootstrap.Modal(document.getElementById("userModal"));
        modal.show();

        // Add a global event listener for when modals are hidden
        document.addEventListener("hidden.bs.modal", function cleanupModal() {
          // Remove any modal backdrops safely
          const backdrops = document.getElementsByClassName("modal-backdrop");
          while (backdrops.length > 0) {
            if (backdrops[0] && backdrops[0].parentNode) {
              backdrops[0].parentNode.removeChild(backdrops[0]);
            } else {
              break;
            }
          }

          // Clean up body classes and styles
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";

          // Remove this event listener to avoid duplicates
          document.removeEventListener("hidden.bs.modal", cleanupModal);
        });
      }
    } catch (error) {
      console.error("Error editing user:", error);
      alert("An error occurred while editing the user");
    }
  }

  resetForm() {
    const form = document.getElementById("userForm");
    if (form) {
      form.reset();
    }
    document.getElementById("userModalLabel").textContent = "Add User";
  }

  saveUsers() {
    try {
      localStorage.setItem("usersData", JSON.stringify(this.users));
    } catch (error) {
      console.error("Error saving users:", error);
      throw error;
    }
  }

  renderUsers(usersToRender = this.users) {
    const table = document.querySelector(".usersTable");
    if (!table) return;

    // Add Bootstrap table classes
    table.classList.add("table", "table-hover", "align-middle", "text-center");

    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    // Calculate pagination
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    const endIndex = startIndex + this.usersPerPage;
    usersToRender = usersToRender.filter(
      (user) => user.role.toLowerCase() !== "admin"
    );

    const paginatedUsers = usersToRender.slice(startIndex, endIndex);
    // remove admins from show all users
    paginatedUsers.forEach((user) => {const tr = document.createElement("tr");tr.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${user.username}</td>
                <td>${user.fname}</td>
                <td>${user.lname}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.bod}</td>
                <td><span class="badge ${this.getRoleBadgeClass(user.role)}">${user.role
        }</span></td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-light" data-bs-toggle="dropdown"><i class="fa fa-ellipsis-v"></i></button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item edit-user" href="#"><i class="fa fa-edit me-2"></i>Edit</a></li>
                            <li><a class="dropdown-item text-danger delete-user" href="#"><i class="fa fa-trash me-2"></i>Delete</a></li>
                        </ul>
                    </div>
                </td>
            `;
      tbody.appendChild(tr);
    });

    this.updatePagination();
  }

  getRoleBadgeClass(role) {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-primary";
      case "merchant":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  }
}

// Initialize the UserManager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new UserManager();
});

//-------------products Management---------------------
document.addEventListener("DOMContentLoaded", function () {
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Initialize products array in localStorage if not exists
  if (!localStorage.getItem("localProducts")) {
    localStorage.setItem("localProducts", JSON.stringify([]));
  }

  // Add event listener for modal hidden event
  document
    .getElementById("editProductModal")
    .addEventListener("hidden.bs.modal", function () {
      loadProducts();
    });

  // DOM Elements
  const productsTableBody = document.getElementById("productsTableBody");
  const productForm = document.getElementById("productForm");
  const editProductForm = document.getElementById("editProductForm");
  const searchProduct = document.getElementById("searchProduct");
  const searchBtn = document.getElementById("searchBtn");
  const selectAll = document.getElementById("selectAll");

  // Move loadProducts to global scope
  function loadProducts() {
    console.log("Loading products...");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const products = JSON.parse(localStorage.getItem("localProducts")) || [];
    console.log("Current products:", products);

    // If user is admin, show all products, otherwise show only seller's products
    const userProducts =
      currentUser.role === "admin"
        ? products
        : products.filter((product) => product.sellerId === currentUser.userId);
    console.log("Filtered products:", userProducts);

    // Clear the table body first
    const productsTableBody = document.getElementById("productsTableBody");
    if (productsTableBody) {
      productsTableBody.innerHTML = "";
      displayProducts(userProducts);
    } else {
      console.error("Products table body not found");
    }
  }

  // Display products in table
  function displayProducts(products) {
    console.log("Displaying products:", products);
    const productsTableBody = document.getElementById("productsTableBody");
    if (!productsTableBody) {
      console.error("Products table body not found");
      return;
    }

    productsTableBody.innerHTML = "";

    if (products.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td colspan="7" class="text-center py-4">
                    <div class="text-muted">
                        <i class="fa fa-search fa-2x mb-2"></i>
                        <p class="mb-0">No products found</p>
                    </div>
                </td>
            `;
      productsTableBody.appendChild(row);
      return;
    }

    products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><input type="checkbox" class="product-checkbox" data-id="${product.id || ""
        }"></td>
                <td>${product.title || ""}</td>
                <td>${product.category || ""}</td>
                <td>${product.brand || ""}</td>
                <td>${product.price || "0"} EGP</td>
                <td>${product.stock || "0"}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-primary edit-product" data-id="${product.id
        }">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger delete-product" data-id="${product.id
        }">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
      productsTableBody.appendChild(row);
    });

    // Reattach event listeners for edit and delete buttons
    document.querySelectorAll(".edit-product").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        editProduct(productId);
      });
    });

    document.querySelectorAll(".delete-product").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        console.log("Deleting product:", productId);
        deleteProduct(productId);
      });
    });
  }

  // Edit product
function editProduct(productId) {
  const products = JSON.parse(localStorage.getItem("localProducts")) || [];
  const product = products.find(
    (p) => p.id.toString() === productId.toString()
  );

  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  document.getElementById("editProductId").value = product.id;
  document.getElementById("editProductTitle").value = product.title || "";
  document.getElementById("editProductCategory").value = product.category || "";
  document.getElementById("editProductBrand").value = product.brand || "";
  document.getElementById("editProductPrice").value = product.price || "";
  document.getElementById("editProductStock").value = product.stock || "";
  document.getElementById("editProductDescription").value = product.about || "";

  // Display current images
  const currentImagesContainer = document.getElementById("currentImages");
  currentImagesContainer.innerHTML = "";
  if (product.image && product.image.length > 0) {
    product.image.forEach((img, index) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "position-relative";
      imgWrapper.innerHTML = `
        <img 
          src="${img}" 
          alt="Product image ${index + 1}" 
          style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
      `;
      currentImagesContainer.appendChild(imgWrapper);
    });
  }

  // 🔔 Notification logic
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUsername = currentUser?.username || "Unknown user";
  PushNotification(`"${product.title}" is being edited by ${currentUsername}`);
  DisplayedNotifications();

  // Show modal
  const editModal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );
  editModal.show();

  // Clean up modal when hidden
  document.addEventListener("hidden.bs.modal", function cleanupModal() {
    const backdrops = document.getElementsByClassName("modal-backdrop");
    while (backdrops.length > 0) {
      if (backdrops[0] && backdrops[0].parentNode) {
        backdrops[0].parentNode.removeChild(backdrops[0]);
      } else {
        break;
      }
    }
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.removeEventListener("hidden.bs.modal", cleanupModal);
  });
}

  // Delete product
function deleteProduct(productId) {
  console.log("Deleting product:", productId); // Debug log

  // Store the product ID to be deleted
  window.productIdToDelete = productId;

  // Show the delete confirmation modal
  const deleteProductModal = document.getElementById("deleteProductModal");
  const bsDeleteModal = new bootstrap.Modal(deleteProductModal);
  bsDeleteModal.show();

  // Replace the confirm button to remove old event listeners
  const confirmBtn = document.getElementById("confirmDeleteProduct");
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  // Add the event listener to the new confirm button
  newConfirmBtn.addEventListener("click", function () {
    const products = JSON.parse(localStorage.getItem("localProducts")) || [];

    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUsername = currentUser?.username || "Unknown user";

    // Find the product to be deleted for notification
    const productToDelete = products.find(
      (p) => p.id.toString() === window.productIdToDelete.toString()
    );
    const productTitle = productToDelete ? productToDelete.title : "Unknown";

    // Filter out the deleted product
    const updatedProducts = products.filter(
      (p) => p.id.toString() !== window.productIdToDelete.toString()
    );
    localStorage.setItem("localProducts", JSON.stringify(updatedProducts));

    // Close the modal
    bsDeleteModal.hide();

    // Clean up modal backdrops and styles
    const cleanupModal = function () {
      const backdrops = document.getElementsByClassName("modal-backdrop");
      while (backdrops.length > 0) {
        if (backdrops[0] && backdrops[0].parentNode) {
          backdrops[0].parentNode.removeChild(backdrops[0]);
        } else {
          break;
        }
      }
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };

    setTimeout(cleanupModal, 150);

    // Immediately remove the product card if in category view
    const categoryGrid = document.getElementById("categoryProductGrid");
    if (categoryGrid) {
      const productCards = categoryGrid.querySelectorAll(
        `.btn[data-id="${window.productIdToDelete}"]`
      );
      productCards.forEach((button) => {
        const card = button.closest(".col-12");
        if (card) {
          card.remove();
        }
      });

      // If no products left, show fallback message
      if (categoryGrid.children.length === 0) {
        categoryGrid.innerHTML =
          '<div class="col-12 text-center text-muted py-5">No products found.</div>';
      }
    }

    // Reload views and update notification
    loadProducts();

    // Show notification with current user
    PushNotification(`Product "${productTitle}" was deleted by ${currentUsername}.`);
    DisplayedNotifications();
  });
}


  // Remove the old event delegation code since we're using onclick handlers now
  function attachEventListeners() {
    // Only keep checkbox related event listeners
    productsTableBody.addEventListener("change", function (e) {
      if (e.target.classList.contains("product-checkbox")) {
        updateSelectAllCheckbox();
      }
    });
  }

  // Update select all checkbox
  function updateSelectAllCheckbox() {
    const checkboxes = document.querySelectorAll(".product-checkbox");
    const checkedBoxes = document.querySelectorAll(".product-checkbox:checked");
    selectAll.checked = checkboxes.length === checkedBoxes.length;
  }

  // Event Listeners
  selectAll.addEventListener("change", function () {
    document.querySelectorAll(".product-checkbox").forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });

  searchBtn.addEventListener("click", function () {
    const searchQuery = searchProduct.value.trim();
    if (searchQuery) {
      searchProducts(searchQuery);
    }
  });

  searchProduct.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      const searchQuery = this.value.trim();
      if (searchQuery) {
        searchProducts(searchQuery);
      }
    }
  });

  // Reset search
  document.getElementById("resetSearch").addEventListener("click", function () {
    searchProduct.value = "";
    loadProducts();
  });

  // Initial load
  loadProducts();
  attachEventListeners();

  //category products
  const grid = document.getElementById("categoryProductGrid");
  const filter = document.getElementById("categoryFilter");
  const brandFilter = document.getElementById("brandFilter");
  if (!grid || !filter || !brandFilter) return;

  // Get products based on user role
  const allProducts = (
    JSON.parse(localStorage.getItem("localProducts")) || []
  ).filter((product) =>
    currentUser.role === "admin"
      ? true
      : product.sellerId === currentUser.userId
  );

  function renderGrid(products) {
    grid.innerHTML = "";
    if (products.length === 0) {
      grid.innerHTML =
        '<div class="col-12 text-center text-muted py-5">No products found.</div>';
      return;
    }
    products.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
      col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="position-relative">
                        <img 
                            src="${product.image && product.image[0]
          ? product.image[0]
          : "img/default-product.jpg"
        }" 
                            class="card-img-top product-card-img" 
                            alt="${product.title}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text mb-2" style="color: #000000;">${product.brand
        }</p>
                        <p class="card-text text-danger mb-1">EGP ${product.price || "0"
        }</p>
                        <p class="card-text mb-2" style="color: #ff6600;">Stock: ${product.stock || "0"
        }</p>
                        <div class="d-flex gap-2 mb-2 justify-content-end">
                            <button type="button" class="btn btn-sm btn-primary edit-product" data-id="${product.id || ""
        }">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-danger delete-product" data-id="${product.id || ""
        }">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
      grid.appendChild(col);
    });
  }

  //newStock
  
  //newStock

  // Initial render
  renderGrid(allProducts);

  // Filter logic
  filter.addEventListener("change", function () {
    const selected = filter.value;
    if (selected === "all") {
      renderGrid(allProducts);
    } else {
      const filtered = allProducts.filter((p) => p.category === selected);
      renderGrid(filtered);
    }
  });

  //brand filter
  brandFilter.addEventListener("change", function () {
    const selected = brandFilter.value;
    if (selected === "all") {
      renderGrid(allProducts);
    } else {
      const filtered = allProducts.filter((p) => p.brand === selected);
      renderGrid(filtered);
    }
  });

  // Event delegation for edit/delete in category section
  grid.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const productId = btn.getAttribute("data-id");
    if (!productId) return;

    if (
      btn.classList.contains("edit-product") ||
      e.target.closest(".fa-edit")
    ) {
      e.preventDefault();
      console.log("Edit button clicked for product:", productId);
      // Call the edit function directly
      editProduct(productId);
    } else if (
      btn.classList.contains("delete-product") ||
      e.target.closest(".fa-trash")
    ) {
      e.preventDefault();
      console.log("Delete button clicked for product:", productId);
      deleteProduct(productId);
    }
  });
});

// Initialize the UserManager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new UserManager();
});

// Function to update username display
function updateUsernameDisplay() {
  const userNameElements = document.querySelectorAll(".userName");
  // Get the currentUser array from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "user",
    role: "user",
  };
  const storedUsername = currentUser.username;
  const storedRole = currentUser.role;

  userNameElements.forEach((element) => {
    if (element.tagName === "DIV") {
      // For the sidebar username
      element.querySelector("h6").textContent = storedUsername;
      element.querySelector("span").textContent = storedRole;
    } else if (element.tagName === "A") {
      // For the navbar dropdown
      element.querySelector("span").textContent = storedUsername;
    }
  });
}

// Function to handle logout
function handleLogout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", updateUsernameDisplay);

// Update product
document.getElementById("updateProduct").addEventListener("click", function () {
  console.log("Update product clicked");
  const productId = document.getElementById("editProductId").value;
  const title = document.getElementById("editProductTitle").value;
  const category = document.getElementById("editProductCategory").value;
  const brand = document.getElementById("editProductBrand").value;
  const price = document.getElementById("editProductPrice").value;
  const stock = document.getElementById("editProductStock").value;
  const about = document.getElementById("editProductDescription").value;
  const imageFiles = document.getElementById("editProductImages").files;

  if (!title || !category || !brand || !price || !stock || !about) {
    showBootstrapToast("Please fill in all required fields.", "warning");
    return;
  }

  function showBootstrapToast(message, type = "success") {
    const toastElement = document.getElementById("liveToast");
    const toastBody = toastElement.querySelector(".toast-body");
    const parentToast = document.getElementById("parentToast");
    parentToast.style.zIndex = "1100";
    toastBody.textContent = message;
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }

  const products = JSON.parse(localStorage.getItem("localProducts")) || [];
  const productIndex = products.findIndex(
    (p) => p.id.toString() === productId.toString()
  );

  if (productIndex === -1) {
    console.error("Product not found:", productId);
    return;
  }

  const updatedProduct = {
    ...products[productIndex],
    title,
    category,
    brand,
    price,
    stock: parseInt(stock),
    about,
    details: `<h2 style="font-size: 24px; font-weight: bold;">Product Details</h2><p>${about}</p>`,
    updatedAt: new Date().toISOString(),
    customerId: products[productIndex].customerId,
    quantity: products[productIndex].quantity || 1,
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUsername = currentUser?.username || "Unknown user";

  function afterUpdateActions() {
    document.getElementById("editProductForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("editProductModal"));
    modal.hide();
    updateProductCardInCategory(updatedProduct);
    loadProducts();

    // 🔔 Show notification
    PushNotification(`"${updatedProduct.title}" has been updated by ${currentUsername}.`);
    DisplayedNotifications();
  }

  if (imageFiles.length > 0) {
    const imagePromises = Array.from(imageFiles).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      updatedProduct.image = images;
      products[productIndex] = updatedProduct;
      localStorage.setItem("localProducts", JSON.stringify(products));
      afterUpdateActions();
    });
  } else {
    products[productIndex] = updatedProduct;
    localStorage.setItem("localProducts", JSON.stringify(products));
    afterUpdateActions();
  }
});


// Add new product
document.getElementById("saveProduct").addEventListener("click", function () {
  const title = document.getElementById("productTitle").value;
  const category = document.getElementById("productCategory").value;
  const brand = document.getElementById("productBrand").value;
  const price = document.getElementById("productPrice").value;
  const stock = document.getElementById("productStock").value;
  const about = document.getElementById("productDescription").value;
  const imageFiles = document.getElementById("productImages").files;

  if (
    !title ||
    !category ||
    !brand ||
    !price ||
    !stock ||
    !about ||
    imageFiles.length === 0
  ) {
    alert("Please fill in all fields");
    return;
  }

  // Convert images to base64
  const imagePromises = Array.from(imageFiles).map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "user",
    role: "user",
  };
  const products = JSON.parse(localStorage.getItem("localProducts")) || [];
  Promise.all(imagePromises).then((images) => {
    // In the "Add new product" section, modify the new product object:
    const newProduct = {
      id: Date.now(), // More unique ID than products.length + 1
      sellerName: currentUser.username,
      sellerId: currentUser.userId,
      stock: parseInt(stock),
      title: title,
      brand: brand,
      about: about,
      price: price,
      image: images,
      details: `<h2 style="font-size: 24px; font-weight: bold;">Product Details</h2><p>${about}</p>`,
      category: category,
      createdAt: new Date().toISOString(),
      // Add these fields for cart compatibility:
      customerId: null, // Will be set when added to cart
      quantity: 1, // Default quantity
    };
    PushNotification(`"${title}" is being added by ${currentUser.username}`);
     DisplayedNotifications();
    // Add the new product to the array
    products.push(newProduct);
    
    // Save to localStorage
    localStorage.setItem("localProducts", JSON.stringify(products));

    // Reset form and close modal
    productForm.reset();
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    
    // Instead of reloading, directly add the product to the table
    addProductToTable(newProduct);
    
    // Add the product to the category grid if it's visible
    addProductToGrid(newProduct);
    
    // Show success toast
    showSuccessToast("Product added successfully");
  });
});

// Search products
function searchProducts(query) {
  const products = JSON.parse(localStorage.getItem("localProducts")) || [];
  const userProducts =
    currentUser.role === "admin"
      ? products
      : products.filter(
        (product) => product.sellerId === currentUser.userId.toString()
      );

  const filteredProducts = userProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.price.toString().includes(query) ||
      product.stock.toString().includes(query)
  );

  displayProducts(filteredProducts);
}

//recent orders

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
  
  // Filter orders based on user role
  const sellerOrders =
    currentUser.role === "admin"
      ? allOrders
      : allOrders.filter((order) => order.sellerId === currentUser.userId);

  let todaySale = 0;
  
  // First check if we have any orders at all
  if (sellerOrders.length > 0) {
    // For demonstration, use all orders as today's sales
    todaySale = sellerOrders.reduce((sum, order) => {
      const price = parseFloat(order.price) || 0;
      const quantity = parseInt(order.quantity) || 0;
      return sum + price * quantity;
    }, 0);
    
  }
  
  // Calculate total sales - filtered by seller
  const totalSale = sellerOrders.reduce((sum, order) => {
    const price = parseFloat(order.price) || 0;
    const quantity = parseInt(order.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  // Calculate unique users who purchased from this specific seller
  const totalUsers = new Set(sellerOrders.map((order) => order.userId)).size;
  const userOnline = 1; // Or calculate based on your logic

  // Update dashboard with proper number formatting
  document.getElementById("todaySale").textContent = `${todaySale.toFixed(
    2
  )} EGP`;
  document.getElementById("totalSale").textContent = `${totalSale.toFixed(
    2
  )} EGP`;
  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("userOnline").textContent = userOnline;

  // Calculate sales per seller
  const calculateSellerSales = () => {
    const products = JSON.parse(localStorage.getItem("localProducts")) || [];
    const usersData = JSON.parse(localStorage.getItem("usersData")) || [];
    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];

    // Create a map to store seller information
    const sellerMap = new Map();

    // Initialize seller map with user data
    // For admin, include all sellers; for sellers, only include themselves
    if (currentUser.role === "admin") {
      usersData.forEach(user => {
        if (user.role === "merchant" || user.role === "admin") {
          sellerMap.set(user.userId, {
            id: user.userId,
            name: `${user.fname || ''} ${user.lname || ''}`.trim() || user.username,
            totalSales: 0,
            itemsSold: 0
          });
        }
      });
    } else {
      // For sellers, only include their own data
      sellerMap.set(currentUser.userId, {
        id: currentUser.userId,
        name: `${currentUser.fname || ''} ${currentUser.lname || ''}`.trim() || currentUser.username,
        totalSales: 0,
        itemsSold: 0
      });
    }

    // Calculate sales for each seller
    // For admin, process all orders; for sellers, only their orders
    const ordersToProcess = currentUser.role === "admin" 
      ? allOrders 
      : allOrders.filter(order => order.sellerId === currentUser.userId);
      
    ordersToProcess.forEach(order => {
      if (order.sellerId && sellerMap.has(order.sellerId)) {
        const price = parseFloat(order.price) || 0;
        const quantity = parseInt(order.quantity) || 0;
        const total = price * quantity;
        
        const sellerData = sellerMap.get(order.sellerId);
        sellerData.totalSales += total;
        sellerData.itemsSold += quantity;
        sellerMap.set(order.sellerId, sellerData);
      }
    });

    return Array.from(sellerMap.values());
  };

  // Get seller sales data
  const sellerSalesData = calculateSellerSales();

  // Create seller sales table
  const createSellerSalesTable = () => {
    const salesSection = document.getElementById("sales-section");
    if (!salesSection) return;

    // Check if seller sales container already exists
    let sellerSalesContainer = document.getElementById("sellerSalesContainer");
    if (!sellerSalesContainer) {
      // Create container for seller sales
      sellerSalesContainer = document.createElement("div");
      sellerSalesContainer.id = "sellerSalesContainer";
      sellerSalesContainer.className = "container-fluid pt-4 px-4 mb-4";
      sellerSalesContainer.innerHTML = `
        <div class="row g-4">
          <div class="col-12">
            <div class="bg-light rounded h-100 p-4">
              <h6 class="mb-4">Seller Sales Summary</h6>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Seller Name</th>
                      <th scope="col">Total Sales</th>
                      <th scope="col">Items Sold</th>
                      <th scope="col">Performance</th>
                    </tr>
                  </thead>
                  <tbody id="sellerSalesTableBody">
                    <!-- Seller sales data will be inserted here -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      // Insert seller sales container after the first container in sales section
      const firstContainer = salesSection.querySelector(".container-fluid");
      if (firstContainer) {
        salesSection.insertBefore(sellerSalesContainer, firstContainer.nextSibling);
      } else {
        salesSection.appendChild(sellerSalesContainer);
      }
    }

    // Populate seller sales table
    const sellerSalesTableBody = document.getElementById("sellerSalesTableBody");
    if (sellerSalesTableBody) {
      sellerSalesTableBody.innerHTML = "";

      if (sellerSalesData.length === 0) {
        sellerSalesTableBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center py-4">
              <div class="text-muted">
                <i class="fa fa-chart-bar fa-2x mb-2"></i>
                <p class="mb-0">No seller sales data found</p>
              </div>
            </td>
          </tr>
        `;
      } else {
        // Sort sellers by total sales (highest first)
        const sortedSellers = [...sellerSalesData].sort((a, b) => b.totalSales - a.totalSales);

        // Calculate total sales for percentage
        const grandTotal = sortedSellers.reduce((sum, seller) => sum + seller.totalSales, 0);

        sortedSellers.forEach((seller, index) => {
          // Calculate percentage of total sales
          const percentage = grandTotal > 0 ? (seller.totalSales / grandTotal * 100).toFixed(1) : 0;

          // Determine performance badge color based on percentage
          let badgeClass = "secondary";
          if (percentage >= 50) badgeClass = "success";
          else if (percentage >= 25) badgeClass = "primary";
          else if (percentage >= 10) badgeClass = "info";
          else if (percentage > 0) badgeClass = "warning";

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${seller.name}</td>
            <td>${seller.totalSales.toFixed(2)} EGP</td>
            <td>${seller.itemsSold}</td>
            <td>
              <div class="progress">
                <div class="progress-bar bg-${badgeClass}" role="progressbar" 
                    style="width: ${percentage}%" 
                    aria-valuenow="${percentage}" 
                    aria-valuemin="0" 
                    aria-valuemax="100">
                  ${percentage}%
                </div>
              </div>
            </td>
          `;
          sellerSalesTableBody.appendChild(row);
        });
      }
    }
  };

  // Initialize seller sales table
  createSellerSalesTable();

  // Show seller sales table when sales section is shown
  document
    .querySelector('.nav-item.nav-link[data-section="sales"]')
    ?.addEventListener("click", () => {
      createSellerSalesTable();
    });

  // Function to load and display orders
  function loadOrders(limit = null) {
    const orderTables = document.querySelectorAll(".ordersTableBody");
    if (!orderTables.length) return;

    // Sort orders by date (newest first)
    const sortedOrders = [...sellerOrders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Apply limit if specified (for Recent Sales)
    const ordersToShow = limit ? sortedOrders.slice(0, limit) : sortedOrders;

    // Update each table
    orderTables.forEach((tableBody) => {
      tableBody.innerHTML = "";

      if (ordersToShow.length === 0) {
        tableBody.innerHTML = `
                  <tr>
                    <td colspan="8" class="text-center py-4">
                      <div class="text-muted">
                        <i class="fa fa-shopping-cart fa-2x mb-2"></i>
                        <p class="mb-0">No orders found</p>
                      </div>
                    </td>
                  </tr>
              `;
        return;
      }

      ordersToShow.forEach((order, index) => {
        // Get today's date
        const today = new Date();
        const orderDate = today.toLocaleDateString();

        const quantity = parseInt(order.quantity) || 0;
        const price = parseFloat(order.price) || 0;
        const total = price * quantity;

        // Get user info from localStorage
        const usersData = JSON.parse(localStorage.getItem("usersData")) || [];
        const user = usersData.find((u) => u.userId === order.customerId) || {};

        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>#${index + 1}</td>
                  <td>${orderDate}</td>
                  <td>
                    <div>${user.fname || "Guest"} ${user.lname || ""}</div>
                    <small class="text-muted">${user.email || "No email"
          }</small>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img src="${order.image || "img/default-product.jpg"
          }" 
                          alt="${order.title || "Product"}" 
                          style="width: 50px; height: 50px; object-fit: cover;" 
                          class="me-2">
                      <div>${order.title || "Product"}</div>
                    </div>
                  </td>
                  <td>${quantity}</td>
                  <td>${total.toFixed(2)} EGP</td>
                  <td>${order.paymentMethod || "Cash on Delivery"}</td>
              `;
        tableBody.appendChild(row);
      });
    });
  }


  // Load recent sales (limited to 5 most recent orders)
  loadOrders(5);

  // Load orders when orders section is shown
  document
    .querySelector('.nav-item.nav-link[data-section="orders"]')
    .addEventListener("click", () => {
      loadOrders();
    });

  // Initial load if orders section is visible
  if (document.getElementById("orders-section").style.display !== "none") {
    loadOrders();
  }
});

// Function to view order details
function viewOrderDetails(orderId) {
  const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
  const order = allOrders.find((o) => o.orderId === orderId);

  if (order) {
    alert(`
            Order Details:
            Order ID: #${order.orderId}
            Customer: ${order.customerName}
            Email: ${order.customerEmail}
            Address: ${order.customerAddress}
            Product: ${order.title}
            Quantity: ${order.quantity}
            Total: ${order.total} EGP
            Status: ${order.status}
            Payment Method: ${order.paymentMethod}
            Order Date: ${new Date(order.createdAt).toLocaleString()}
        `);
  }
}

// Function to update order status
function updateOrderStatus(orderId) {
  const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
  const orderIndex = allOrders.findIndex((o) => o.orderId === orderId);

  if (orderIndex !== -1) {
    const currentStatus = allOrders[orderIndex].status;
    const statuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    allOrders[orderIndex].status = nextStatus;
    allOrders[orderIndex].updatedAt = new Date().toISOString();

    localStorage.setItem("allOrders", JSON.stringify(allOrders));

    // Reload orders display
    const event = new Event("click");
    document
      .querySelector('.nav-item.nav-link[data-section="orders"]')
      .dispatchEvent(event);
  }
}

// Function to update a product card in the category section without reloading
function updateProductCardInCategory(product) {
  const categoryGrid = document.getElementById("categoryProductGrid");
  if (!categoryGrid) return;

  // Find the card for this product
  const productCards = categoryGrid.querySelectorAll(
    `.btn[data-id="${product.id}"]`
  );
  if (productCards.length === 0) return;

  // Get the card container
  const card = productCards[0].closest(".col-12");
  if (!card) return;

  // Create updated card HTML
  const updatedCardHTML = `
        <div class="card h-100 shadow-sm">
            <div class="position-relative">
                <img 
                    src="${product.image && product.image[0]
      ? product.image[0]
      : "img/default-product.jpg"
    }" 
                    class="card-img-top product-card-img" 
                    alt="${product.title}">
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text mb-2" style="color: #000000;">${product.brand
    }</p>
                <p class="card-text text-danger mb-1">EGP ${product.price || "0"
    }</p>
                <p class="card-text mb-2" style="color: #ff6600;">Stock: ${product.stock || "0"
    }</p>
                <div class="d-flex gap-2 mb-2 justify-content-end">
                    <button type="button" class="btn btn-sm btn-primary edit-product" data-id="${product.id || ""
    }">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger delete-product" data-id="${product.id || ""
    }">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

  // Update the card content
  card.innerHTML = updatedCardHTML;

  // Show a success toast notification
  const successToast = document.createElement("div");
  successToast.className = "position-fixed bottom-0 end-0 p-3";
  successToast.style.zIndex = "5";
  successToast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Success</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Product updated successfully
            </div>
        </div>
    `;
  document.body.appendChild(successToast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    if (document.body.contains(successToast)) {
      document.body.removeChild(successToast);
    }
  }, 3000);
}

// Function to add a single product to the table without reloading
function addProductToTable(product) {
  const productsTableBody = document.getElementById("productsTableBody");
  if (!productsTableBody) return;
  
  // If this is the first product (table shows "No products found"), clear the table first
  if (productsTableBody.querySelector("td[colspan='7']")) {
    productsTableBody.innerHTML = "";
  }
  
  // Create a new row for the product
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="checkbox" class="product-checkbox" data-id="${product.id || ""}"></td>
    <td>${product.title || ""}</td>
    <td>${product.category || ""}</td>
    <td>${product.brand || ""}</td>
    <td>${product.price || "0"} EGP</td>
    <td>${product.stock || "0"}</td>
    <td>
      <button type="button" class="btn btn-sm btn-primary edit-product" data-id="${product.id}">
        <i class="fa fa-edit"></i>
      </button>
      <button type="button" class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
        <i class="fa fa-trash"></i>
      </button>
    </td>
  `;
  
  // Add the row to the table
  productsTableBody.appendChild(row);
  
  // Add event listeners to the new buttons
  const editButton = row.querySelector(".edit-product");
  const deleteButton = row.querySelector(".delete-product");
  
  editButton.addEventListener("click", function() {
    const productId = this.getAttribute("data-id");
    editProduct(productId);
    
  });
  
  deleteButton.addEventListener("click", function() {
    const productId = this.getAttribute("data-id");
    deleteProduct(productId);
  });
  
  // Update select all checkbox state
  updateSelectAllCheckbox();
}

// Function to add a single product to the category grid without reloading
function addProductToGrid(product) {
  // Get the grid directly from the DOM each time to ensure we have the latest reference
  const categoryGrid = document.getElementById("categoryProductGrid");
  if (!categoryGrid) {
    console.log("Category grid not found");
    return;
  }
  
  // Check if categories section is visible
  const categoriesSection = document.getElementById("categories-section");
  if (categoriesSection && categoriesSection.style.display === "none") {
    console.log("Categories section is not visible, product will be added when section is shown");
    return;
  }
  
  // Check if we're in the right category view
  const filter = document.getElementById("categoryFilter");
  const brandFilter = document.getElementById("brandFilter");
  
  if (!filter || !brandFilter) {
    console.log("Category or brand filter not found");
    return;
  }
  
  console.log("Adding product to grid:", product);
  console.log("Current filters:", { category: filter.value, brand: brandFilter.value });
  
  if (
    (filter.value === "all" || filter.value === product.category) &&
    (brandFilter.value === "all" || brandFilter.value === product.brand)
  ) {
    // Create a new column for the product
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="position-relative">
          <img 
            src="${product.image && product.image[0] ? product.image[0] : "img/default-product.jpg"}" 
            class="card-img-top product-card-img" 
            alt="${product.title}">
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text mb-2" style="color: #000000;">${product.brand}</p>
          <p class="card-text text-danger mb-1">EGP ${product.price || "0"}</p>
          <p class="card-text mb-2" style="color: #ff6600;">Stock: ${product.stock || "0"}</p>
          <div class="d-flex gap-2 mb-2 justify-content-end">
            <button type="button" class="btn btn-sm btn-primary edit-product" data-id="${product.id || ""}">
              <i class="fa fa-edit"></i>
            </button>
            <button type="button" class="btn btn-sm btn-danger delete-product" data-id="${product.id || ""}">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add the column to the grid
    categoryGrid.appendChild(col);
    
    // Add event listeners to the new buttons
    const editButton = col.querySelector(".edit-product");
    const deleteButton = col.querySelector(".delete-product");
    
    editButton.addEventListener("click", function(e) {
      e.preventDefault();
      const productId = this.getAttribute("data-id");
      editProduct(productId);
    });
    
    deleteButton.addEventListener("click", function(e) {
      e.preventDefault();
      const productId = this.getAttribute("data-id");
      deleteProduct(productId);
    });
    
    // If this was the first product (grid shows "No products found"), remove that message
    const noProductsMessage = categoryGrid.querySelector(".text-center.text-muted");
    if (noProductsMessage) {
      noProductsMessage.remove();
    }
    
    console.log("Product added to grid successfully");
  } else {
    console.log("Product doesn't match current filters, not added to grid");
  }
}

// Update the navigation click handler to refresh the category grid
document.addEventListener("DOMContentLoaded", function() {
  // Add event listener for category section navigation
  const categoryNavLink = document.querySelector('.nav-item.nav-link[data-section="categories"]');
  if (categoryNavLink) {
    categoryNavLink.addEventListener("click", function() {
      // Get products based on user role
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const allProducts = (
        JSON.parse(localStorage.getItem("localProducts")) || []
      ).filter((product) =>
        currentUser.role === "admin"
          ? true
          : product.sellerId === currentUser.userId
      );
      
      // Get the grid element
      const grid = document.getElementById("categoryProductGrid");
      if (grid) {
        // Refresh the grid with all products
        const renderGrid = function(products) {
          grid.innerHTML = "";
          if (products.length === 0) {
            grid.innerHTML =
              '<div class="col-12 text-center text-muted py-5">No products found.</div>';
            return;
          }
          products.forEach((product) => {
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-md-4 col-lg-3";
            col.innerHTML = `
              <div class="card h-100 shadow-sm">
                <div class="position-relative">
                  <img 
                    src="${product.image && product.image[0] ? product.image[0] : "img/default-product.jpg"}" 
                    class="card-img-top product-card-img" 
                    alt="${product.title}">
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text mb-2" style="color: #000000;">${product.brand}</p>
                  <p class="card-text text-danger mb-1">EGP ${product.price || "0"}</p>
                  <p class="card-text mb-2" style="color: #ff6600;">Stock: ${product.stock || "0"}</p>
                  <div class="d-flex gap-2 mb-2 justify-content-end">
                    <button type="button" class="btn btn-sm btn-primary edit-product" data-id="${product.id || ""}">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger delete-product" data-id="${product.id || ""}">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
            grid.appendChild(col);
          });
        };
        
        // Render all products when category section is shown
        renderGrid(allProducts);
      }
    });
  }
});

// Function to show a success toast notification
function showSuccessToast(message) {
  const successToast = document.createElement("div");
  successToast.className = "position-fixed bottom-0 end-0 p-3";
  successToast.style.zIndex = "5";
  successToast.innerHTML = `
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Success</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  document.body.appendChild(successToast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    if (document.body.contains(successToast)) {
      document.body.removeChild(successToast);
    }
  }, 3000);
}
//////////////////Notification//////////////////////
//Setlocalstorage for notification 
// Push Notification function
const PushNotification = (Message) => {
  // clone
  const OldNotification = localStorage.getItem("Notification")
    ? JSON.parse(localStorage.getItem("Notification"))
    : [];
  if (!OldNotification) {
    localStorage.setItem("Notification", JSON.stringify([]));
  }
  // prepend new message
  const editNotification = [Message, ...OldNotification];
  // update localStorage
  localStorage.setItem("Notification", JSON.stringify(editNotification));

  console.log(Message, localStorage.getItem("Notification"));
};

// Display notifications in dropdown
function DisplayedNotifications() {
  const notifications = JSON.parse(localStorage.getItem("Notification")) || [];

  $("#notify").empty(); // Clear old content

  if (notifications.length === 0) {
    $("#notify").append(`<span class="dropdown-item text-muted">No notifications</span>`);
    return;
  }

  // Show only the first 4 notifications
  notifications.slice(0, 4).forEach((msg) => {
    $("#notify").append(`
      <a href="#" class="dropdown-item">
        <h6 class="fw-normal mb-0">${msg}</h6>
      </a>
      <hr class="dropdown-divider">
    `);
  });

  // Optional: Add "See all" link at the bottom
  $("#notify").append(`<a href="#" class="dropdown-item text-center">See all notifications</a>`);
}

// Refresh notifications when dropdown opens
$('#notify').parent().on('show.bs.dropdown', function () {
  DisplayedNotifications();
});

// Display reviews in table
function displayReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  if (reviews.length === 0) {
    $("#reviews").html("<p class='text-muted'>No reviews available.</p>");
    return;
  }

  let tableHtml = `
    <div class="table-responsive">
      <table class="table table-striped table-bordered table-hover align-middle text-center">
        <thead class="style">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Review</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  `;

  reviews.forEach((review, index) => {
    tableHtml += `
      <tr data-index="${index}">
        <td>${index + 1}</td>
        <td>${review.name}</td>
        <td>${review.text}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-review" data-index="${index}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  $("#reviews").html(tableHtml);
}

// Add a new review and notify
//////////////problem///////////////////////////

// دالة إضافة مراجعة جديدة مع إشعار

// function addReview(newReview) {
//   let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
//   let notifiedReviewers = JSON.parse(localStorage.getItem("notifiedReviewers")) || [];

//   const normalizedName = newReview.name.trim().toLowerCase();
//   const normalizedNotified = notifiedReviewers.map(name => name.trim().toLowerCase());

//   reviews.push(newReview);
//   localStorage.setItem("reviews", JSON.stringify(reviews));

//   if (!normalizedNotified.includes(normalizedName)) {
//     PushNotification(`Review added by ${newReview.name}`); // Show notification on new review
//     notifiedReviewers.push(newReview.name.trim());
//     localStorage.setItem("notifiedReviewers", JSON.stringify(notifiedReviewers));
//   }

//   displayReviews();
//   DisplayedNotifications();

//   const dropdownElement = $('#notify').parent();
//   if (!dropdownElement.hasClass('show')) {
//     dropdownElement.dropdown('toggle');
//   }
// }

// Delete review event handler
$(document).on("click", ".delete-review", function () {
  const index = $(this).data("index");
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  if (index === undefined || index < 0 || index >= reviews.length) {
    console.error("Invalid review index:", index);
    return;
  }

  const deletedReviewer = reviews[index].name;

  // Remove the review
  reviews.splice(index, 1);
  localStorage.setItem("reviews", JSON.stringify(reviews));

  // Get current user name from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { name: "Unknown User" };
  const currentUserName = currentUser.fname || "Unknown User";

  // Notify deletion by current user
  PushNotification(`Review deleted by ${currentUserName}`);

  // Remove from notifiedReviewers list
  let notifiedReviewers = JSON.parse(localStorage.getItem("notifiedReviewers")) || [];
  notifiedReviewers = notifiedReviewers.filter(name => name !== deletedReviewer);
  localStorage.setItem("notifiedReviewers", JSON.stringify(notifiedReviewers));

  // Refresh reviews display
  displayReviews();

  // Refresh notifications display
  DisplayedNotifications();

  // Optionally open notifications dropdown if closed
  const dropdownElement = $('#notify').parent();
  if (!dropdownElement.hasClass('show')) {
    dropdownElement.dropdown('toggle');
  }
});



// Load on page
displayReviews();

/***************************** */
