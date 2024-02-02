let totalLists = getAllTasks();
let taskIdStorage = localStorage.getItem('taskId');
//criar uma lista única
let taskWithId = totalLists.flat().find(task => task.id === taskIdStorage);

//criar uma lista com várias listas
function getAllTasks() {
    let storedTasksToDo = JSON.parse(localStorage.getItem("to-do-tasks")) || [];
    let storedTasksDoing = JSON.parse(localStorage.getItem("doing-tasks")) || [];
    let storedTasksDone = JSON.parse(localStorage.getItem("done-tasks")) || [];

    return [storedTasksToDo, storedTasksDoing, storedTasksDone];
}

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
function saveTask() {
    let taskIdStorage = localStorage.getItem('taskId');
    let storedTasksToDo = JSON.parse(localStorage.getItem("to-do-tasks")) || [];
    let storedTasksDoing = JSON.parse(localStorage.getItem("doing-tasks")) || [];
    let storedTasksDone = JSON.parse(localStorage.getItem("done-tasks")) || [];

    // procurar a task na lista correta todo/doing/done
    if (taskWithId = storedTasksToDo.find(task => task.id === taskIdStorage)) {
        // modificar o status
        taskWithId.title = document.getElementById("titlename").value;
        let statusCorrection = document.getElementById("stage").value;
        if (statusCorrection === "To Do") {
            statusCorrection = "to-do";
        }
        taskWithId.status = statusCorrection;
        taskWithId.description = document.getElementById("description").value;
    } else if (taskWithId = storedTasksDoing.find(task => task.id === taskIdStorage)) {
        taskWithId.title = document.getElementById("titlename").value;
        let statusCorrection = document.getElementById("stage").value;
        if (statusCorrection === "To Do") {
            statusCorrection = "to-do";
        }
        taskWithId.status = statusCorrection;
        taskWithId.description = document.getElementById("description").value;
    } else if (taskWithId = storedTasksDone.find(task => task.id === taskIdStorage)) {
        taskWithId.title = document.getElementById("titlename").value;
        let statusCorrection = document.getElementById("stage").value;
        if (statusCorrection === "To Do") {
            statusCorrection = "to-do";
        }
        taskWithId.status = statusCorrection;
        taskWithId.description = document.getElementById("description").value;
    }

    // update das tasks na storage
    localStorage.setItem("to-do-tasks", JSON.stringify(storedTasksToDo));
    localStorage.setItem("doing-tasks", JSON.stringify(storedTasksDoing));
    localStorage.setItem("done-tasks", JSON.stringify(storedTasksDone));

    const confirmed = window.confirm("Do you want to confirm these changes?");
    if (confirmed) {
        window.location.href = 'main-page.html';
    }
}

function goMain(){
    window.location.href='main-page.html';
}

function logout() {
    localStorage.removeItem('username');
    window.location.href='index.html';
}