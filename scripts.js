// buttonClickHandler.js
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    username = username.trim();
    password = password.trim();
    if (username === '' || password === '') {
        alert('Please enter both username and password')
    } else {
            sessionStorage.setItem('username', username);
            window.location.href = 'main-page.html'; 
        };
    }


