// buttonClickHandler.js
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === '' || password === '') {
        alert('Please enter both username and password')
    } else {
            window.location.href = 'main-page.html';  
        };
    }


// Add this to your scripts.js file or within a <script> tag in the head section
document.addEventListener("scroll", function() {
    var scrollPosition = window.scrollY;
    var windowHeight = window.innerHeight;
    var documentHeight = document.body.scrollHeight;

    // Adjust the value (e.g., 50) to determine when to show the footer
    if (scrollPosition + windowHeight >= documentHeight - 50) {
        document.getElementById("main-page-footer").style.display = "block";
    } else {
        document.getElementById("main-page-footer").style.display = "none";
    }
});


