function updateWishlistCount() {
  const savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customerId = currentUser ? currentUser.userId : null;

  const userItems = savedItems.filter((item) => item.customerId === customerId);
  document.getElementById("wishlistCount").textContent = userItems.length;
}

// Event: clicking the heart icon
$(document).on("click", ".favorite-icon", function () {
  // new animation by Tarek
  // const icon = $(this);
  // icon.addClass("bounce-once");
  // setTimeout(() => icon.removeClass("bounce-once"), 400);
  // // new animation by Tarek
  const card = $(this).closest(".card");
  const title = card.find(".item-title").text().trim();

  const localProducts = JSON.parse(localStorage.getItem("localProducts")) || [];
  let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];

  const product = localProducts.find((p) => p.title === title);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customerId = currentUser ? currentUser.userId : null;

  if (!product || !customerId) return; // لو مفيش يوزر أو منتج، نخرج

  const alreadySaved = savedItems.some(
    (p) => p.title === product.title && p.customerId === customerId
  );

  // New Fun toast by Tarek
    function showBootstrapToast(message, type = "success") {
      const toastElement = document.getElementById("liveToast");
      const toastBody = toastElement.querySelector(".toast-body");

      // غير الرسالة
      toastBody.textContent = message;

      // غيّر اللون حسب النوع (success, danger, info...)
      toastElement.className = `toast align-items-center text-white bg-${type} border-0`;

      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }

  // New Fun toast by Tarek


  if (!alreadySaved) {
    // نسخ المنتج وإضافة customerId
    const productWithCustomer = { ...product, customerId };
    savedItems.push(productWithCustomer);
    $(this).addClass("active-favorite");
    $(this).parent().addClass("favorite-item");
    // alert("Product added to wishlist.");
    // showBootstrapToast("Item added to wishlist.", "success");
  } else {
    // إزالة المنتج اللي تبع نفس اليوزر فقط
    savedItems = savedItems.filter(
      (p) => !(p.title === product.title && p.customerId === customerId)
    );

    $(this).removeClass("active-favorite");
    $(this).parent().removeClass("favorite-item");
    // alert("Product removed from wishlist.");
    // showBootstrapToast("Item removed from wishlist", "danger");
  }

  // حفظ التعديلات
  localStorage.setItem("savedItems", JSON.stringify(savedItems));
  updateWishlistCount();
});

// Initial count update on page load
$(document).ready(function () {
  updateWishlistCount();

  const savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const customerId = currentUser ? currentUser.userId : null;

  $(".card").each(function () {
    const title = $(this).find(".item-title").text().trim();

    const isSaved = savedItems.some(
      (p) => p.title === title && p.customerId === customerId
    );

    if (isSaved) {
      $(this).find(".favorite-icon").addClass("active-favorite");
    } else {
      $(this).find(".favorite-icon").removeClass("active-favorite");
    }
  });
});


// Hide heart icon for guest user by Tarek 

function hideHeart() {
  const favIcon = document.querySelectorAll(".favorite-icon");
  if (
    localStorage.getItem("currentUser") &&
    localStorage.getItem("currentUser") != '"none"'
  ) {
    return;
  } else {
    favIcon.forEach((icon)=>{
      // icon.style.visibility = "hidden";
      icon.onclick=(e)=> {
        // alert("Done")
        // e.preventDefault();
      }
    })
  }
}
hideHeart();