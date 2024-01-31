let storedTasks = JSON.parse(localStorage.getItem("tasks")) || []; 
let taskIdStorage = localStorage.getItem('taskId');
let taskWithId = storedTasks.find(task => task.id === taskIdStorage);

//faz reset da descrição caso o texto for o padrão. Poderá não acontecer já que deverá ter sempre dados, mas...
function resetTextoPadrao() {
    let updatedDescription = document.getElementById('description').value;
    if(updatedDescription === "Describe the project tasks"){
    document.getElementById('description').value = "";
    }
}

// label com o user logado, código igual à main page
document.addEventListener('DOMContentLoaded', function() {
    
    const username = localStorage.getItem('username');
    const welcomeLabel = document.getElementById('welcome-user');
    if (welcomeLabel) {
        welcomeLabel.textContent = 'Welcome, ' + username;
    }
});

//update do conteúdo da task para a página a partir da storage
document.addEventListener('DOMContentLoaded', function() {
    var statusCorrection = taskWithId.status;
    if(statusCorrection === "to-do"){
        statusCorrection = "To Do"
    }
    document.getElementById('titlename').value = taskWithId.title;
    document.getElementById('stage').value = statusCorrection;
    document.getElementById('description').value = taskWithId.description;
});

// função para salvar quando se carrega no botão (ver html). Grava a nova informação na storage, fazendo um update da lista de task. 
function saveTask(){
    taskWithId.title = document.getElementById("titlename").value;
    var statusCorrection = document.getElementById("stage").value;
    if(statusCorrection === "To Do"){
        statusCorrection = "to-do"
    }
    taskWithId.status = statusCorrection;
    taskWithId.description = document.getElementById("description").value;
    for (let i = 0; i < storedTasks.length; i++) {
        const task = storedTasks[i];
        if (task.id === taskIdStorage) {
            storedTasks[i] = taskWithId;
            break;
        }
    }
    
    const confirmed = window.confirm("Do you want to confirm these changes?");
    if (confirmed) {
        localStorage.setItem("tasks", JSON.stringify(storedTasks));
        window.location.href = 'main-page.html';
    }
}