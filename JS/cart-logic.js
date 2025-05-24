document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.querySelector("#cartSection");
  let total = 0;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser ? currentUser.userId : null;

  cart = cart.filter((item) => item.customerId == userId);

  function renderCart() {
    let output = `
        <h3 class="mb-4">Cart Items</h3>
        <div class="cart-head row fw-bold text-center d-none d-md-flex border-bottom pb-2">
          <div class="col-md-3 h4">Item Details</div>
          <div class="col-md-2 h4">Price</div>
          <div class="col-md-2 h4">Quantity</div>
          <div class="col-md-3 h4">Total Price</div>
          <div class="col-md-2 h4">Remove</div>
        </div>
    `;

    total = 0;

    cart.forEach((item, index) => {
      const cleanPrice = parseFloat(item.price.toString().replace(/,/g, ""));
      const itemTotal = cleanPrice * item.quantity;
      total += itemTotal;

      output += `
        <div class="cart-item row align-items-center text-center py-3 border-bottom del-item" data-index="${index}">
          <div class="col-12 col-md-3 d-flex align-items-center justify-content-center">
            <img src="${item.image}" class="img-fluid me-3" />
            <div class="text-start">
              <h5 class="mb-1">${item.title}</h5>
            </div>
          </div>
          <div class="d-none d-md-block col-md-2">
            <h5 class="price" data-unit-price="${cleanPrice}">EGP ${cleanPrice.toFixed(
        2
      )}</h5>
          </div>
          <div class="col-12 col-md-2 d-flex justify-content-center align-items-center">
            <input type="button" value="-" class="btn btn-sm minus me-1" />
            <input type="number" class="form-control quantity text-center" style="width: 60px" min="1" max="50" value="${
              item.quantity
            }" />
            <input type="button" value="+" class="btn btn-sm plus ms-1" />
          </div>
          <div class="col-12 col-md-3"><h5 class="total-price">EGP ${itemTotal.toFixed(
            2
          )}</h5></div>
          <input type="hidden" id="stock" value="${item.stock}"/>
          <div class="col-12 col-md-2">
            <button class="btn btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" data-index="${index}">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>`;
    });

    if (cart.length === 0) {
      output = `
        <h2>Cart List</h2>
        <section class="container d-flex justify-content-center align-items-center noCart">
        <svg xmlns="http://www.w3.org/2000/svg" height="450px" viewBox="0 -960 960 960" width="420px" fill="#FF9F00" stroke="black" stroke-width="3"><path d="M640-452h-35l-59-60h85l126-228H316l-60-60h529q26 0 38 21.5t-2 46.5L680-476q-5.87 11.43-14.93 17.71Q656-452 640-452ZM286.79-81Q257-81 236-102.21t-21-51Q215-183 236.21-204t51-21Q317-225 338-203.79t21 51Q359-123 337.79-102t-51 21ZM851-35 595-289H277q-38 0-56-27.5t1-59.5l70-117-86-187L46-840l43-43L894-78l-43 43ZM535-349 434-453h-95l-63 104h259Zm96-163h-85 85Zm57 431q-29 0-50.5-21.21t-21.5-51Q616-183 637.5-204t50.5-21q29 0 50.5 21.21t21.5 51Q760-123 738.5-102T688-81Z"/></svg>
        </section>
      `;
    }

    output += `</section>`;
    container.innerHTML = output;
  }
  renderCart();

  document.querySelectorAll(".plus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const cartItem = btn.closest(".cart-item");
      const quantityInput = cartItem.querySelector(".quantity");
      const unitPriceElement = cartItem.querySelector(".price");
      const totalPriceElement = cartItem.querySelector(".total-price");
      const index = parseInt(cartItem.dataset.index);

      // جلب الكارت والبروداكتس من اللوكال
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let products = JSON.parse(localStorage.getItem("localProducts")) || [];

      const itemInCart = cart[index];

      // البحث عن المنتج الحقيقي في localProducts باستخدام title أو id
      const realProduct = products.find(
        (product) => product.title === itemInCart.title // أو استخدم product.id === itemInCart.productId لو متوفر
      );

      if (!realProduct) {
        console.error("Product not found in localProducts");
        return;
      }

      const stock = parseInt(realProduct.stock);
      let currentQuantity = parseInt(quantityInput.value);
      const unitPrice = parseFloat(unitPriceElement.dataset.unitPrice);

      if (isNaN(stock) || isNaN(currentQuantity) || isNaN(unitPrice)) {
        console.error("Invalid stock, quantity or price value");
        return;
      }

      if (currentQuantity >= stock) {
        alert("Sorry, you can't add more than available in stock.");
        btn.disabled = true;
        return;
      }

      const newQuantity = currentQuantity + 1;
      quantityInput.value = newQuantity;

      // Update cart data
      cart[index].quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update total price display
      const newTotalPrice = unitPrice * newQuantity;
      totalPriceElement.textContent = `EGP ${newTotalPrice.toFixed(2)}`;

      // Update checkout total
      updateCheckoutTotal();
      updateCartCounter();
      
      // renderCart();

      // Disable plus button if reached max stock
      if (newQuantity >= stock) {
        btn.disabled = true;
      }
    });
  });
  document.querySelectorAll(".minus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const cartItem = btn.closest(".cart-item");
      const quantityInput = cartItem.querySelector(".quantity");
      const plusBtn = cartItem.querySelector(".plus");
      const unitPriceElement = cartItem.querySelector(".price");
      const totalPriceElement = cartItem.querySelector(".total-price");
      const index = parseInt(cartItem.dataset.index);

      let currentQuantity = parseInt(quantityInput.value);
      const unitPrice = parseFloat(unitPriceElement.dataset.unitPrice);

      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;
        quantityInput.value = newQuantity;

        // Update cart data
        cart[index].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update total price display
        const newTotalPrice = unitPrice * newQuantity;
        totalPriceElement.textContent = `EGP ${newTotalPrice.toFixed(2)}`;

        // Update checkout total
        updateCheckoutTotal();
        updateCartCounter();

        // Enable plus button
        plusBtn.disabled = false;
      }
    });
  });

  const checkoutTotal = document.getElementById("checkoutTotal");
  if (checkoutTotal) {
    checkoutTotal.textContent = total.toFixed(2);
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

  document.addEventListener("change", (event) => {
    if (event.target.classList.contains("quantity")) {
      const row = event.target.closest(".cart-item");
      const index = parseInt(row.dataset.index);
      const unitPrice = parseFloat(
        row.querySelector(".price").dataset.unitPrice
      );
      const totalPriceElement = row.querySelector(".total-price");
      const stock = parseInt(row.querySelector("#stock").value);

      let newQty = parseInt(event.target.value) || 1;

      // Validate quantity
      if (newQty < 1) newQty = 1;
      if (newQty > stock) {
        newQty = stock;
        event.target.value = stock;
        alert("Quantity cannot exceed available stock");
      }

      // Update cart data
      cart[index].quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update total price display
      const newTotalPrice = unitPrice * newQty;
      totalPriceElement.textContent = `EGP ${newTotalPrice.toFixed(2)}`;

      // Update plus button state
      const plusBtn = row.querySelector(".plus");
      plusBtn.disabled = newQty >= stock;

      updateCartCounter();
      updateCheckoutTotal();
    }
  });

  function updateCheckoutTotal() {
    let newTotal = 0;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userId = currentUser?.userId;
    const currentCart = (JSON.parse(localStorage.getItem("cart")) || []).filter(
      (item) => item.customerId == userId
    );

    currentCart.forEach((item) => {
      const cleanPrice = parseFloat(item.price.toString().replace(/,/g, ""));
      newTotal += cleanPrice * item.quantity;
    });
    if (checkoutTotal) {
      checkoutTotal.textContent = newTotal.toFixed(2);
    }
  }

  let itemToDeleteIndex = null;

  document.addEventListener("click", (event) => {
    if (event.target.closest(".delete-btn")) {
      const btn = event.target.closest(".delete-btn");
      itemToDeleteIndex = parseInt(btn.dataset.index);
    }
  });

  document.getElementById("confirmDelete").addEventListener("click", () => {
    if (itemToDeleteIndex !== null) {
      cart.splice(itemToDeleteIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cart));

      renderCart();
      updateCartCounter();
      updateCheckoutTotal();
      checkCartStatus();

      const deleteModal = bootstrap.Modal.getInstance(
        document.getElementById("deleteModal")
      );
      if (deleteModal) {
        deleteModal.hide();
      }
    }
  });

  // Save user info with Checkbox
  const userNameInput = document.getElementById("userName");
  const emailInput = document.getElementById("email");
  const addressInput = document.getElementById("address");
  const saveInfoCheckbox = document.getElementById("save-info");

  if (userNameInput && emailInput && addressInput && saveInfoCheckbox) {
    // Load saved data if exists
    const savedInfo = JSON.parse(localStorage.getItem(`userInfo:${userId}`));
    if (savedInfo) {
      userNameInput.value = savedInfo.name || "";
      emailInput.value = savedInfo.email || "";
      addressInput.value = savedInfo.address || "";
      saveInfoCheckbox.checked = true;
    }

    saveInfoCheckbox.addEventListener("change", () => {
      if (saveInfoCheckbox.checked) {
        saveUserInfo();
      } else {
        localStorage.removeItem(`userInfo:${userId}`);
      }
    });

    [userNameInput, emailInput, addressInput].forEach((input) => {
      input.addEventListener("input", () => {
        if (saveInfoCheckbox.checked) {
          saveUserInfo();
        }
      });
    });

    function saveUserInfo() {
      const userInfo = {
        name: userNameInput.value.trim(),
        email: emailInput.value.trim(),
        address: addressInput.value.trim(),
      };
      localStorage.setItem(`userInfo:${userId}`, JSON.stringify(userInfo));
    }
  }

  // Payment method selection
  document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
    input.checked = false;
  });
  const paymentInputs = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  const cardInfoSection = document.querySelector(".card-info");

  paymentInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (document.getElementById("CashOnDelivery").checked) {
        if (cardInfoSection) {
          cardInfoSection.classList.add("d-none");
          cardInfoSection.querySelectorAll("input").forEach((field) => {
            field.required = false;
          });
        }
      } else {
        if (cardInfoSection) {
          cardInfoSection.classList.remove("d-none");
          cardInfoSection.querySelectorAll("input").forEach((field) => {
            field.required = true;
          });
        }
      }
    });
  });

  const forms = document.querySelectorAll(".needs-validation");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;

      const userName = form.querySelector("#userName");
      const email = form.querySelector("#email");
      const address = form.querySelector("#address");
      const ccNumber = form.querySelector("#cc-number");
      const cvv = form.querySelector("#cc-cvv");

      const nameRegex = /^[A-Za-z\s'-]{3,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const addressRegex = /^[A-Za-z0-9\s,.-]{10,}$/;
      const ccRegex = /^\d{13,19}$/;
      const cvvRegex = /^\d{3,4}$/;

      const validateField = (input, regex) => {
        const test = regex.test(input.value.trim());
        input.classList.toggle("is-invalid", !test);
        input.classList.toggle("is-valid", test);
        return test;
      };

      if (!validateField(userName, nameRegex)) valid = false;
      if (!validateField(email, emailRegex)) valid = false;
      if (!validateField(address, addressRegex)) {
        valid = false;
        address.nextElementSibling.textContent =
          "Please enter a valid address (minimum 10 characters)";
      }

      const isCashOnDelivery =
        document.getElementById("CashOnDelivery").checked;
      if (!isCashOnDelivery) {
        if (!validateField(ccNumber, ccRegex)) {
          valid = false;
          ccNumber.nextElementSibling.textContent =
            "Please enter a valid credit card number (13-19 digits)";
        }
        if (!validateField(cvv, cvvRegex)) {
          valid = false;
          cvv.nextElementSibling.textContent =
            "Please enter a valid CVV (3-4 digits)";
        }
      }

      function saveOrdersQuantity(cart, userId) {
        // تصفية السلة حسب المستخدم الحالي
        const userCart = cart.filter((item) => item.customerId == userId);

        // تجهيز البيانات المطلوبة فقط
        const orderQuantities = userCart.map((item) => ({
          productId: item.id,
          title: item.title,
          quantity: item.quantity,
        }));

        // حفظها في localStorage تحت اسم OrdersQuantity
        localStorage.setItem("OrdersQuantity", JSON.stringify(orderQuantities));
      }

      if (!form.checkValidity() || !valid) {
        event.stopPropagation();
      } else {
        const existingOrders =
          JSON.parse(localStorage.getItem("allOrders")) || [];
          const currentUser = JSON.parse(localStorage.getItem("currentUser"));
          const userId = currentUser?.userId;
          const currentCart = (
            JSON.parse(localStorage.getItem("cart")) || []
          ).filter((item) => item.customerId == userId);
        cart = currentCart.filter((item) => item.customerId == userId);

        cart.forEach((item) => {
          existingOrders.push({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            sellerId: item.sellerId,
            image: item.image,
            customerId: item.customerId,
            productId: item.id,
          });

          function PushNots(){
            const localNots =
              JSON.parse(localStorage.getItem("Notification")) || [];
              localNots.unshift(
                `${item.quantity}x of Item ${item.title} was orderd by "${currentUser.username}"`
              );
              localStorage.setItem("Notification", JSON.stringify(localNots));
          }
          PushNots();

        });
        // save in new local for stocks
        saveOrdersQuantity(cart, userId);
        localStorage.setItem("allOrders", JSON.stringify(existingOrders));

        renderStock();

        const checkoutModalElement = document.getElementById("checkoutModal");
        const checkoutModal = bootstrap.Modal.getInstance(checkoutModalElement);
        if (checkoutModal) {
          checkoutModal.hide();
        }

        const successModal = new bootstrap.Modal(
          document.getElementById("orderSuccessModal")
        );
        successModal.show();
        localStorage.removeItem("cart");
        cart = [];
        renderCart();
        updateCartCounter();
        updateCheckoutTotal();
        checkCartStatus();

        form.reset();
        form.classList.remove("was-validated");
      }

      form.classList.add("was-validated");
    });
  });


  

  const checkCartStatus = () => {
    const cartItems = document.querySelectorAll(".cart-item");
    const emptyCartSection = document.querySelector(".noCart");
    const payBtn = document.querySelector(".checkOut");
    const cartHead = document.querySelector(".cart-head");

    if (cartItems.length === 0) {
      if (emptyCartSection) emptyCartSection.classList.remove("d-none");
      if (payBtn) payBtn.classList.add("d-none");
      if (cartHead) cartHead.classList.add("d-none");
    } else {
      if (emptyCartSection) emptyCartSection.classList.add("d-none");
      if (payBtn) payBtn.classList.remove("d-none");
      if (cartHead) cartHead.classList.remove("d-none");
    }
  };

  checkCartStatus();

  // Toast function
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

  function checkLogin() {
    const checkOutBtn = document.querySelector(".checkOut");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser === "none") {
      checkOutBtn.removeAttribute("data-bs-target");
      checkOutBtn.onclick = () => {
        showBootstrapToast("You need to login First", "warning");
      };
    } else {
      checkOutBtn.setAttribute("data-bs-target", "#checkoutModal");
    }
  }
  checkLogin();

  // Minus stock from quantity
  function renderStock() {
    // 1. جلب المنتجات والطلبات من localStorage
    let products = JSON.parse(localStorage.getItem("localProducts")) || [];
    let orders = JSON.parse(localStorage.getItem("OrdersQuantity")) || [];

    // 2. تحديث الاستوك بناءً على الطلبات الجديدة فقط
    orders.forEach((order) => {
      let product = products.find((p) => p.title === order.title);

      if (product) {
        product.stock -= order.quantity;

        // تأكد إن الاستوك ميبقاش بالسالب
        if (product.stock < 0) {
          product.stock = 0;
        }
      }
    });

    // 3. حفظ التعديلات في localStorage
    localStorage.setItem("localProducts", JSON.stringify(products));

    // 4. حذف الطلبات المؤقتة عشان العملية متتكررش
    // localStorage.removeItem("OrdersQuantity");
  }
  // Minus stock from quantity
  // Update Cart Stock
  function updateCartStock() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let products = JSON.parse(localStorage.getItem("localProducts")) || [];

    cart = cart.map((cartItem) => {
      const updatedProduct = products.find(
        (product) => product.title === cartItem.title // أو استخدم title لو مفيش id
      );

      if (updatedProduct) {
        // حدّث الاستوك
        cartItem.stock = updatedProduct.stock;
      }

      return cartItem;
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  updateCartStock();

  
});
