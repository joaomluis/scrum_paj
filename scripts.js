// função para ir para a página main, obrigando o utilizador a preencher algo nos campos de input
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    username = username.trim();
    password = password.trim();
    if (username === '' || password === '') {
        alert('Please enter both username and password')
    } else {
            localStorage.setItem('username', username);
            window.location.href = 'main-page.html'; 
        };
    }


