// buttonClickHandler.js
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === '' || password === '') {
        alert('Please enter both username and password')
    } else {
        document.getElementById('login-button').addEventListener('click', function() {
            window.location.href = 'main-page.html';
        });
    }
}

