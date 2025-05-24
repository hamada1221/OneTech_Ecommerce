document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const rePassword = document.getElementById("rePassword").value;
  const phone = document.getElementById("phone").value.trim();
  const userRole = document.querySelector('input[name="gender"]:checked').value;
  const msg = document.getElementById("msg");
  const submitBtn = document.getElementById("submitBtn");

  function showMsg(text, inputElement = null) {
    msg.style.display = "block";
    msg.innerText = text;

    // Remove previous error styles
    document
      .querySelectorAll("input")
      .forEach((inp) => inp.classList.remove("input-error"));

    // Highlight the invalid input
    if (inputElement) {
      inputElement.classList.add("input-error");
      inputElement.focus();
    }
  }

  // Validation
  if (username.length < 4 || username.length > 12) {
    showMsg(
      "Username must be between 4 and 12 characters.",
      document.getElementById("name")
    );
    return;
  }

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      password
    )
  ) {
    showMsg(
      "Password must be at least 8 characters, with uppercase, lowercase, number, and symbol.",
      document.getElementById("password")
    );
    return;
  }

  if (password !== rePassword) {
    showMsg("Passwords do not match.", document.getElementById("rePassword"));
    return;
  }

  if (!/^01[0-25][0-9]{8}$/.test(phone)) {
    showMsg(
      "Phone must be a valid Egyptian number (11 digits starting with 01).",
      document.getElementById("phone")
    );
    return;
  }

  let usersData = JSON.parse(localStorage.getItem("usersData")) || [];

  const isUsernameTaken = usersData.some((user) => user.username === username);
  const isEmailTaken = usersData.some((user) => user.email === email);
  const isPhoneTaken = usersData.some((user) => user.phone === phone);

  if (isUsernameTaken) {
    showMsg(
      "This username is already taken. Please choose another.",
      document.getElementById("name")
    );
    return;
  }
  if (isEmailTaken) {
    showMsg(
      "This email is already registered. Please use another.",
      document.getElementById("email")
    );
    return;
  }
  if (isPhoneTaken) {
    showMsg(
      "This phone number is already used. Please enter a different one.",
      document.getElementById("phone")
    );
    return;
  }

  // Proceed
  msg.style.display = "none";
  submitBtn.disabled = true;
  submitBtn.innerText = "Registered. Redirecting to login....";
  submitBtn.classList.add("reg-done")


  usersData.push({
    username: username,
    fname: "",
    lname: "",
    email: email,
    password: password,
    phone: phone,
    address: "Egypt",
    bod: "",
    role: userRole,
    userId: usersData.length + 1,
  });

  localStorage.setItem("usersData", JSON.stringify(usersData));
  localStorage.setItem("lastestEmail", email);
  localStorage.setItem("lastestPass", password);
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});
