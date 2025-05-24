document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Get products from localStorage
  const products = JSON.parse(localStorage.getItem("localProducts")) || [];

  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm.length === 0) {
      searchResults.classList.add("d-none");
      return;
    }

    const filteredProducts = products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5); // Limit to 5 results

    if (filteredProducts.length > 0) {
      searchResults.innerHTML = filteredProducts
        .map(
          (product) => `
          <div class="search-result-item d-flex align-items-center p-2 text-decoration-none" 
               onclick="handleProductClick('${product.title}')">
            <img src="${product.image[0]}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover;">
            <div class="ms-3">
              <div class="fw-bold text-dark">${product.title}</div>
              <div class="text-muted">EGP ${product.price}</div>
            </div>
          </div>
        `
        )
        .join("");
      searchResults.classList.remove("d-none");
    } else {
      searchResults.innerHTML =
        '<div class="p-2 text-muted">No products found</div>';
      searchResults.classList.remove("d-none");
    }
  });

  // Close search results when clicking outside
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add("d-none");
    }
  });

  // Close button functionality
  const closeButton = document.querySelector(".search-close");
  closeButton.addEventListener("click", function () {
    searchInput.value = "";
    searchResults.classList.add("d-none");
  });
});

// Function to handle product click
function handleProductClick(productTitle) {
  localStorage.setItem("localItems", JSON.stringify(productTitle));
  window.location.href = "productdetails.html";
}
