window.addEventListener("DOMContentLoaded", () => {
  const logRegDiv = document.getElementById("LogReg");
  const accProfile = document.getElementById("accProfile");

  const currentUser = localStorage.getItem("currentUser");

  if (currentUser && currentUser !== '"none"') {
    accProfile.style.display = "block";
    logRegDiv.style.display = "none";
  } else {
    accProfile.style.display = "none";
    logRegDiv.style.display = "block";
  }
});

const logRegDiv = document.getElementById("LogReg");
const accProfile = document.getElementById("accProfile");
// in start after log in we hide acc profile box
accProfile.style.display = "none";

const accName = document.getElementById("accName");
const currentUserInfo = JSON.parse(localStorage.getItem("currentUser"));
const userName = currentUserInfo.username;
accName.innerText += "Hi " + userName;

const wishlist = document.getElementById("wishlist");
const adminPanel = document.getElementById("adminPanel");
const sellerPanel = document.getElementById("sellerPanel");
const settings = document.getElementById("settings");
const orders = document.getElementById("orders");

const signOutBtn = document.getElementById("signOut");

// Check user role and display differnet settings for everyone

// first check loggin by catch local item == currentUser
if (
  localStorage.getItem("currentUser") &&
  localStorage.getItem("currentUser") != '"none"'
) {
  // here diplay acc profile and hide login and regiter box
  logRegDiv.style.display = "none";
  accProfile.style.display = "block";
  if (JSON.parse(localStorage.getItem("currentUser")).role == "admin") {
    // if user an Admin == display admin panel and hide seller panel
    sellerPanel.style.display = "none";
    // orders.style.display = "none";
  }
  if (JSON.parse(localStorage.getItem("currentUser")).role == "seller") {
    // if user an Admin == display seller panel and hide admin panel
    adminPanel.style.display = "none";
    // orders.style.display = "none";
  }
  if (JSON.parse(localStorage.getItem("currentUser")).role == "customer") {
    // if user an Admin == hide seller panel and admin panel
    adminPanel.style.display = "none";
    sellerPanel.style.display = "none";
  }
}else {
  // hide wishlist for guest User
  // wishlist.style.display="none";
}

signOutBtn.addEventListener("click", function (e) {
  e.preventDefault()
  window.location.href = "products.html";
  localStorage.setItem("currentUser", JSON.stringify("none"));
  accProfile.style.display = "none";
});
