function myFunction() {
    let updatedDescription = document.getElementById('description').value;
    if(updatedDescription === "Describe the project tasks"){
    document.getElementById('description').value = "";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    const username = localStorage.getItem('username');
    const welcomeLabel = document.getElementById('welcome-user');
    if (welcomeLabel) {
        welcomeLabel.textContent = 'Welcome, ' + username;
    }
});