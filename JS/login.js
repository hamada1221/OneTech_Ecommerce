//-----------------login-----------------
// Sample user data for testing ===> Done in Register Page by Hamda 
// const users = [
//     {
//         email: 'test@example.com',
//         password: '123456',
//         role: 'user'
//     },
//     {
//         email: 'admin@example.com', 
//         password: 'admin123',
//         role: 'admin'
//     }
// ];

// // Store users in localStorage
// localStorage.setItem('users', JSON.stringify(users));






$(document).ready(function() {


    const $loginForm = $('#loginForm');
    const $emailInput = $('#email');
    const $passwordInput = $('#password');
    const $submitBtn = $('#submitBtn');
    const $registerBtn = $('#registerbtn');
    const $forget = $('#forget');

    // Create error message element
    const $errorMsg = $('<div>').addClass('msg');
    $loginForm.prepend($errorMsg);

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password validation function
    function isValidPassword(password) {
        return password.length >= 6;
    }


    //lastest Email and Pass from Local
    const lastestEmail = localStorage.getItem("lastestEmail");
    if (lastestEmail) {
        $emailInput.val(lastestEmail); 
        localStorage.removeItem("lastestEmail"); 
    }
    const lastestPass = localStorage.getItem("lastestPass");
    if (lastestPass) {
        $passwordInput.val(lastestPass); 
        localStorage.removeItem("lastestPass"); 
    }
    //lastest Email and Pass from Local

    // Form submission handler
    $loginForm.on('submit', function(e) {
        e.preventDefault();
        
        const email = $emailInput.val().trim();
        const password = $passwordInput.val().trim();
        
        // Reset error message
        $errorMsg.hide().text('');
        
        // Validate email
        if (!email) {
            showError('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Validate password
        if (!password) {
            showError('Please enter your password');
            return;
        }
        
        if (!isValidPassword(password)) {
            showError('Password must be at least 6 characters long');
            return;
        }
        

        // Check local storage for user credentials
        const storedUsers = JSON.parse(localStorage.getItem('usersData')) || [];
        const userExists = storedUsers.find(user => user.email === email && user.password === password);

        if (userExists) {
            // Store current user and redirect to home
            localStorage.setItem('currentUser', JSON.stringify(userExists));
            //if user is admin, redirect to dashboard page
            if (localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).role === 'admin') {
                // localStorage.setItem("")
            window.location.href = 'index.html';
            }

            //if user is user, redirect to home page
            if (localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).role === 'seller') {
            window.location.href = 'index.html';
            
            }
            if (localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')).role === 'customer') {
            window.location.href = 'index.html';
            
        }
    } else {
        // User not found, show registration message
        showError("Account not found. Please register first.");
    }
});

// Register button click handler
$registerBtn.on('click', function() {
    // TODO: Add your registration page redirection logic here
        window.location.href = 'registeration.html';
        console.log('Redirect to registration page');
    });

    // Helper function to show error messages
    function showError(message) {
        $errorMsg.text(message).show();
    }

    // Add input event listeners for real-time validation
    $emailInput.on('input', function() {
        if ($errorMsg.is(':visible')) {
            $errorMsg.hide();
        }
    });

    $passwordInput.on('input', function() {
        if ($errorMsg.is(':visible')) {
            $errorMsg.hide();
        }
    });
});

