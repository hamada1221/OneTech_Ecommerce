document.addEventListener("DOMContentLoaded", function () {
  productsArrs = "";

  allCards = document.querySelectorAll(".card img");
  allCards.forEach((item) => {
    item.addEventListener("click", function (e) {
      newCard = e.target.closest(".card");
      let title = newCard.querySelector(".item-title").innerText;
      productsArrs = title;
      localitems = localStorage.setItem(
        "localItems",
        JSON.stringify(productsArrs)
      );
      window.location.href = "productdetails.html";
    });
  });

  pditem = document.querySelector(".productd");

  const newFun = function () {
    arr3 = JSON.parse(localStorage.getItem("localItems"));
    let arrAllProds = JSON.parse(localStorage.getItem("localProducts"));
    for (let i = 0; i < arrAllProds.length; i++) {
      if (arr3.includes(arrAllProds[i].title)) {
        pditem.innerHTML += `
          <div class="col-md-4 shadow-lg rounded">
            <img id="main-image" src="${arrAllProds[i].image[0]}" class="w-100 rounded pt-2" style="height:420px" alt="Product Image">
            <hr>
            <ul id="image-thumbnails" class="d-flex justify-content-center my-2 gap-2 list-unstyled ">
              <div class="w-static"><li class="border-img"><img src="${arrAllProds[i].image[1]}" style="width:100%" class="img-thumbnail border-0 shadow"></li></div>
              <div class="w-static"><li class="border-img"><img src="${arrAllProds[i].image[2]}" style="width:100%" class="img-thumbnail border-0 shadow"></li></div>
              <div class="w-static"><li class="border-img"><img src="${arrAllProds[i].image[3]}" style="width:100%" class="img-thumbnail border-0 shadow"></li></div>
            </ul>
          </div>

          <div class="col-md-8 d-flex flex-column justify-content-start bg-light shadow-lg rounded">

            <p id="category" class="text-info mt-4">${arrAllProds[i].category}</p>

            <p id="title" class="line-clamp-1 item-price fw-bold fs-5 my-2">${arrAllProds[i].title}</p>

            <p id="description" class="font-thin mb-4">${arrAllProds[i].about}</p>

            <div class="d-flex justify-content-between align-items-center mb-2">
              <p id="price" class="item-price">EGP ${arrAllProds[i].price}</p>
              <p id="stock" class="item-stock d-none">${arrAllProds[i].stock}</p>
              <input id="sellerId" type="hidden" value="${arrAllProds[i].sellerId}"/>
              <p id="rating" class="text-warning"><i class="fa-solid fa-star" style="color: #FFD43B;"></i> 4.5</p>
            </div>
            <button id="add-to-cart" class="text-white button-style py-2 fs-6 border-0 rounded-3 fw-semibold position-relative w-100">Add to Cart</button>

            <div class="extra-info mt-4">

            <!-- Delivery and Payment -->
            <div class="bg-light p-3 rounded shadow-sm mb-3">
              <h6 class="text-primary mb-2"><i class="fa fa-truck me-2"></i>Delivery & Payment</h6>
              <ul class="mb-0 ps-3 small text-muted">
                <li>Delivery within 2-4 business days</li>
                <li>Cash on Delivery or Credit Card accepted</li>
              </ul>
            </div>

            <!-- Warranty and Return -->
            <div class="bg-light p-3 rounded shadow-sm mb-3">
              <h6 class="text-success mb-2"><i class="fa fa-shield-alt me-2"></i>Warranty & Return</h6>
              <p class="small text-muted mb-0">
                1-year warranty. Free return within 14 days if the product is defective.
              </p>
            </div>

            <!-- Why Shop With Us -->
            <div class="bg-light p-3 rounded shadow-sm mb-2">
              <h6 class="text-dark mb-2"><i class="fa fa-check-circle me-2"></i>Why Shop With Us?</h6>
              <ul class="mb-0 ps-3 small text-muted">
                <li>100% Genuine Products</li>
                <li>24/7 Customer Support</li>
                <li>Trusted by thousands of happy buyers</li>
                <li>Secure payment & fast delivery</li>
              </ul>
            </div>
          </div>

          </div>
        `;
        document.querySelector(".product-details").innerHTML +=
          arrAllProds[i].details;
      }
    }
  };

  newFun();

  allImg = document.querySelectorAll("ul#image-thumbnails li img");

  function createImageList(images) {
    images.forEach((img) => {
      img.addEventListener("click", function () {
        document.getElementById("main-image").src = img.src;
      });
    });
  }
  createImageList(allImg);

  // add to cart
  function setupAddToCart() {
    const addToCartButton = document.getElementById("add-to-cart");
    if (!addToCartButton) return;

    const title = document.getElementById("title").textContent.trim();
    const price = document
      .getElementById("price")
      .textContent.trim()
      .replace(/[^\d.]/g, "");
    const image = document.getElementById("main-image").src;
    const sellerId = document.getElementById("sellerId").value;
    const stock = document.getElementById("stock").textContent.trim();
    const customerId = JSON.parse(localStorage.getItem("currentUser")).userId;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function isInCart(title) {
      return cart.some((item) => item.title === title);
    }

    function updateButtonText() {
      addToCartButton.textContent = isInCart(title)
        ? "Remove from Cart"
        : "Add to Cart";
    }

    updateButtonText();

    addToCartButton.addEventListener("click", function () {
      cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (isInCart(title)) {
        cart = cart.filter((item) => item.title !== title);
        showBootstrapToast("Item removed from Cart.", "danger");
      } else {
        cart.push({
          title,
          price,
          image,
          quantity: 1,
          sellerId,
          customerId,
          stock,
        });
        showBootstrapToast("Item added to Cart.", "success");
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCounter();
      updateButtonText();
    });
  }

  function updateCartCounter() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.userId;
    const cart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
      (item) => item.customerId == userId
    );
    let totalItems = 0;
    cart.forEach((item) => {
      totalItems += item.quantity;
    });

    const counterElement = document.querySelector(".num-cart");
    if (counterElement) {
      counterElement.textContent = totalItems;
    }
  }

  updateCartCounter();

  if (document.getElementById("add-to-cart")) {
    setupAddToCart();
  }

  // start review
  const staticReviews = [
    {
      name: "Ahmed Ali",
      text: "المنتج ممتاز جدًا وأنصح به بشدة لأي شخص يبحث عن جودة عالية",
    },
    {
      name: "Sara Khaled",
      text: "التعامل رائع، وسرعة التوصيل فاقت توقعاتي، شكرًا لكم",
    },
    {
      name: "Mohamed Adel",
      text: "سعيد جدًا بالخدمة، وسأكرر الشراء بالتأكيد في المستقبل",
    },
  ];

  let savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
  let reviewData = [...staticReviews, ...savedReviews];

  let currentIndex = 0;
  const nameEl = document.getElementById("review-name"); // name input
  const textEl = document.getElementById("review-text");
  const cardEl = document.querySelector(".review-box");

  function renderReview(index) {
    const review = reviewData[index];
    cardEl.style.opacity = 0;
    setTimeout(() => {
      nameEl.textContent = review.name; // name input
      textEl.textContent = review.text;
      cardEl.style.opacity = 1;
    }, 300);
  }

  renderReview(currentIndex);

  // Buttons prev , next
  document.getElementById("prev-review").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + reviewData.length) % reviewData.length;
    renderReview(currentIndex);
  });

  document.getElementById("next-review").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % reviewData.length;
    renderReview(currentIndex);
  });

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

  // // Add new review
  // document.getElementById("submit-review").addEventListener("click", () => {
  //   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //   if (!currentUser || currentUser === "none") {
  //     // alert("GO to login First"); // Toast Fun
  //     showBootstrapToast("You need to login first.", "warning");
  //   } else {
  //     const name = JSON.parse(localStorage.getItem("currentUser")).username; // name input
  //     const text = document.getElementById("input-review").value.trim();

  //     if (name && text) {
  //       const newReview = { name, text }; // name input
  //       savedReviews.push(newReview);
  //       localStorage.setItem("reviews", JSON.stringify(savedReviews));
  //       reviewData.push(newReview);
  //       currentIndex = reviewData.length - 1;
  //       renderReview(currentIndex);
  //       document.getElementById("input-review").value = "";
  //     }
  //   }
  // });

  // Add new review - Simplified Version
  document.getElementById("submit-review").addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser === "none") {
      showBootstrapToast("You need to login first.", "warning");
      return; // Early return for better flow
    }

    const name = currentUser.username; // Simplified access
    const text = document.getElementById("input-review").value.trim();

    if (!text) {
      // Validate review text exists
      showBootstrapToast("Please write a review text", "warning");
      return;
    }

    const newReview = { name, text };

    // 1. Save to main reviews
    savedReviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(savedReviews));

    // 2. Add notification directly
    addReviewNotification(newReview);

    // 3. Update UI
    reviewData.push(newReview);
    currentIndex = reviewData.length - 1;
    renderReview(currentIndex);
    document.getElementById("input-review").value = "";

    // Show success message
    showBootstrapToast("Your review has been added", "success");
  });

  // Notification function - Optimized
  function addReviewNotification(review) {
    const notifications =
      JSON.parse(localStorage.getItem("Notification")) || [];

    notifications.unshift(`New review by ${review.name}: "${review.text}"`);

    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.length = 100;
    }

    localStorage.setItem("Notification", JSON.stringify(notifications));
  }

  // Add relatid Products depending on viewd device

  function displayRelatidProds() {
    const relatedDiv = document.getElementById("relatedSlide");
    const relatedWrapper = document.getElementById("relatedDiv"); // البوكس الأب
    const productCat = document.getElementById("category").textContent.trim();
    const allProducts = JSON.parse(
      localStorage.getItem("localProducts")
    ).filter((item) => item.category === productCat);

    // إذا لم توجد أي منتجات في نفس التصنيف، إخفاء البوكس الأب
    if (allProducts.length === 0) {
      relatedWrapper.classList.add("d-none");
      return;
    }

    // إظهار البوكس الأب إذا كان يحتوي على منتجات
    relatedWrapper.classList.remove("d-none");

    // تأكد من عرض 4 منتجات فقط كحد أقصى
    const productsToShow = allProducts.slice(0, 4);

    // تصفير المحتوى السابق
    relatedDiv.innerHTML = "";

    // إضافة المنتجات المعروضة
    productsToShow.forEach((item) => {
      relatedDiv.innerHTML += `
      <div class="col-xl-2 row m-2 d-flex flex-column align-items-center box-item">
        <div class="position-relative view-details-btn" style="width: 200px;height:200px" data-title="${encodeURIComponent(
          item.title
        )}">
          <img src="${
            item.image[0]
          }" class="d-block w-100 rounded related-img" style="height:100%" alt="${
        item.title
      }" style="width: 100%;">
          <span class="badge bg-danger position-absolute top-0 start-0 m-2"></span>
        </div>
        <div>
          <h5 class="mt-3 fs-5 fw-bold">${item.title}</h5>
          <p class="item-price fw-bold">EGP ${item.price}</p>
        </div>
      </div>
    `;
    });
  }

  displayRelatidProds();
  //here is added new part by maryam
  const ordersList = document.getElementById("relatedSlide");
  ordersList.addEventListener("click", function (event) {
    let target = event.target;
    if (target.tagName === "IMG") {
      target = target.closest(".view-details-btn");
    }
    if (target && target.classList.contains("view-details-btn")) {
      const title = decodeURIComponent(target.dataset.title);
      localStorage.setItem("localItems", JSON.stringify(title));
      window.location.href = "productdetails.html";
    }
  });
});
