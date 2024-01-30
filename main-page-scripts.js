// ========================================
// Secção 1: Tasks e storage
// ========================================

// lidar com as Tasks. Esta parte de código guarda todas as tasks numa só lista e também guarda à parte o último id a ser atribuído. 

var listaTask = JSON.parse(localStorage.getItem("listaTask")) || [];
var taskIdCounter = getLastStoredTaskId();
var todoCounter = 0;
var doingCounter = 0;
var doneCounter = 0;
updateCounters()

//função para dizer quantas tasks existem em cada box
function updateCounters() {
    todoCounter = 0;
    doingCounter = 0;
    doneCounter = 0;

    for (let i = 0; i < listaTask.length; i++) {
        const task = listaTask[i];
        switch (task.status) {
            case "ToDo":
                todoCounter++;
                break;
            case "Doing":
                doingCounter++;
                break;
            case "Done":
                doneCounter++;
                break;
        }
    }
    // Tive que usar innerHTML porque o textContent tirava a parte do <hr>
    document.getElementById("todo-list").innerHTML = "TO DO(" + todoCounter + ")<hr>";
    document.getElementById("doing-list").innerHTML = "DOING(" + doingCounter + ")<hr>";
    document.getElementById("done-list").innerHTML = "DONE(" + doneCounter + ")<hr>";
}

function getLastStoredTaskId() {
    const storedTaskId = localStorage.getItem("lastTaskId");
    if (storedTaskId) {
        // Se o valor não for nulo retorna o último id da storage
        return parseInt(storedTaskId, 10);
    } else {
        // Caso não haja nenhum valor, este será 1
        return 1;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadTasksAndDisplay();
});

function loadTasksAndDisplay() {
    // Colocação das tasks nas respectivas boxes
    for (let i = 0; i < listaTask.length; i++) {
        createTaskElement(listaTask[i]);
    }
}

function createTask() {
    var taskName = document.getElementById("taskName").value;
    var taskDescription = document.getElementById("taskDescription").value;
    if (taskName) {
        // atributos de uma nova task
        var newTask = {
            id: taskIdCounter++,
            title: taskName,
            description: taskDescription,
            status: "ToDo", // quando se cria uma nova task será sempre no ToDo
        };

        // criar um elemento task
        createTaskElement(newTask);

        listaTask.push(newTask);

        // Update dos valores no local storage
        localStorage.setItem("lastTaskId",  taskIdCounter.toString());
        localStorage.setItem("listaTask", JSON.stringify(listaTask));

        // Reset dos valores e fechar modal
        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        closeModal();
        updateCounters()
        loadTasksAndDisplay()
    }
}

// criar um elemento task
// criar variavel para pen ex: pen-id como o eliminar. Adicionar event listener botão para mudar janela e ir buscar a informação da task e meter na página 3. O resto da informação deve ter update da storage no outro ficheiro de JS, assim como fazer reload da informação ao voltar para página 2 
function createTaskElement(task) {
    var newTaskElement = document.createElement("div");
    var iconId = "icon-" + task.id;
    var pencilId = "pencil" + task.id;
    newTaskElement.className = "task";
    newTaskElement.draggable = true;
    //inserir o texto html
    newTaskElement.innerHTML = `
        <div>
            <i id="${iconId}" class="fa-regular fa-trash-can"></i>
            <i id="${pencilId}" class= "fa-regular fa-pen-to-square"> </i>
            ${task.title}<p class="task-description"> ${task.description}</p>
        </div>`;

    var taskContainer;
    switch (task.status) {
        case "ToDo":
            taskContainer = document.getElementById("todo-list");
            break;
        case "Doing":
            taskContainer = document.getElementById("doing-list");
            break;
        case "Done":
            taskContainer = document.getElementById("done-list");
            break;
    }

    if (taskContainer) {
        taskContainer.appendChild(newTaskElement);
    }
    
    // Event listener para remoção de task
    document.getElementById(iconId).addEventListener("click", function(event) {
        event.preventDefault();
        removeTask(task);
        updateCounters()
        loadTasksAndDisplay()
    });

    document.getElementById(pencilId).addEventListener("click", function(event) {
        idTarefa = parseInt(pencilId.replace("pencil", ""), 10);
        event.preventDefault();
        localStorage.setItem("pencilId", idTarefa.toString());
        window.location.href = 'edit-note-page.html';
    });

    return newTaskElement;
}

function removeTask(task) {
    // Encontrar o index da task na lista storage
    let taskIndex = -1;
    for (let i = 0; i < listaTask.length; i++) {
        if (listaTask[i].id === task.id) {
            taskIndex = i;
            break;
        }
    }

    if (taskIndex !== -1) {
        // Remoção do elemento na lista
        listaTask.splice(taskIndex, 1);

        // Faz o update da lista na storage sem o elemento
        localStorage.setItem("listaTask", JSON.stringify(listaTask));

        // Remove o elemento do DOM
        const taskElement = document.getElementById("icon-" + task.id);
        if (taskElement) {
            taskElement.parentElement.parentElement.remove();
        }
    }
}


// ========================================
// Secção 2: Listeners
// ========================================



// scritps para arrastar



//função para fazer get do username da storage e atribuir esse username à label da pagina incial
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    const welcomeLabel = document.getElementById('welcome-user');
    if (welcomeLabel) {
        welcomeLabel.textContent = 'Welcome, ' + username;
    }
});

function logout() {
    // remoção de username em logout da storage
    localStorage.removeItem('username');
    window.location.href='index.html';
}

function openModal() {
    var modal = document.getElementById("taskModal");
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("taskModal");
    modal.style.display = "none";
}


//funçoes para adicionar tasks as boxes que o prof fez 

function fromHTML(html, trim = true) {
    // Process the HTML string.
    html = trim ? html : html.trim();
    if (!html) return null;
    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;
    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length === 1) return result[0];
    return result;
}

function addDummyData() {
    const tasks = [
        {title: "teste1", description: "testedesc"},
        {title: "teste2", description: "testedesc"},
        {title: "teste3", description: "testedesc"},
    ];

    const todoDiv = document.querySelector('#box1');
    for (const task of tasks) {
        console.log(task);
        const newTask = fromHTML(`<div class="task" draggable="true">${task.title}</div>`);
        todoDiv.append(newTask);

    }
}

