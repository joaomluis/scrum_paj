window.onload = function() {
    loadTasksToCorretctList();
};

// scritps para arrastar
function allowDrop(event) {
    event.preventDefault();
}

function setupDragAndDrop() {
    const boxes = document.querySelectorAll('.box');
    const tasks = document.querySelectorAll('.task')

    tasks.forEach(task => {
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);  
    });

    boxes.forEach(box => {
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragenter', dragEnter);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });

    function dragStart() {
        console.log("dragStart")
        this.classList.add('dragging');
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter() {
        this.classList.add('over');
    }

    function dragLeave() {
        this.classList.remove('over');
    }

    function drop(event) {
        console.log("Dropping");
        const draggingTask = document.querySelector('.dragging');
        console.log(draggingTask);

        // Check if the event target is a box before appending the task
        if (event.target.classList.contains('box')) {
        event.preventDefault();

        // Append the draggingTask to the target element
        event.target.appendChild(draggingTask);
        draggingTask.classList.remove('over');

        if (this.id === 'to-do-list') {
            draggingTask.status = 'to-do';
            console.log('changed');
        } else if (this.id === 'doing-list') {
            draggingTask.status = 'doing';
            console.log('changed');
        } else if (this.id === 'done-list') {
            draggingTask.status = 'done';
            console.log('changed');
        }
        updateTaskInLocalStorage(draggingTask);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("Running");
    setupDragAndDrop();    
});


//função para fazer get do username da storage e atribuir esse username à label da pagina incial
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    const welcomeLabel = document.getElementById('welcome-user');
    if (welcomeLabel) {
        welcomeLabel.textContent = 'Welcome, ' + username;
    }
});

function logout() {
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

function createTask() {
    let taskName = document.getElementById("taskName").value;
    let taskDescription = document.getElementById("text-area").value;
    

    if (taskName) {
        let taskId = createTaskId();
        let iconId = createTaskId();

        let newTask = {
            title: taskName,
            description: taskDescription,
            id: taskId,
            iconId : iconId,
            
            className: "task",
            status: "to-do",
            htmlContent: `
                <div>
                    <i id="${iconId}" class="fa-regular fa-trash-can"></i>
                    <i class="fa-regular fa-pen-to-square"> </i>
                    <i class="fa-regular fa-eye"></i>
                    ${taskName}<p class="task-description"> ${taskDescription}</p>
                </div>`
        };
        addTaskToLocalStorage(newTask);

        let toDoList = document.getElementById("to-do-list");
        
        let newTaskAsElement = convertTaskObjectToElement(newTask);
        toDoList.appendChild(newTaskAsElement);

        // função para eliminar tarefas ao carregar no icone

        deleteTask(iconId, newTask);

        document.getElementById("taskName").value = "";
        document.getElementById("text-area").value = "";

        closeModal();
        setupDragAndDrop();
    }
}

//função para criar random ID com a data de hoje convertida para código, mais dois numeros aleatórios
function createTaskId() {
    const dataString = Date.now().toString(36);
    const randomNum = Math.random().toString(36).substring(2);
    return dataString + randomNum;
}

function convertTaskObjectToElement(task) {
    let newTaskElement = document.createElement('li');
    newTaskElement.innerHTML = task.htmlContent;
    newTaskElement.id = task.id;
    newTaskElement.iconId = task.id;
    newTaskElement.className = task.className;
    newTaskElement.iconId = task.iconId;
    newTaskElement.draggable = true;
    newTaskElement.status = task.status;
    return newTaskElement; 
}

function addTaskToLocalStorage(task) {
    let tasks = loadTasksFromLocalStorage();
    if (!tasks) {
        tasks = [];
    }
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
}

function loadTasksFromLocalStorage() {
    let tasks = localStorage.getItem('tasks');
    if (tasks) {
        return JSON.parse(tasks);
    } else {
        return [];
    }
}
// função que adiciona task à array na local storage, tmb verifica se dita array existe, 
// se não exisitir cria uma e guarda na local storage com o saveTasksToLocalStorage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(updatedTask) {
    // Load tasks from local storage
    let tasks = loadTasksFromLocalStorage();

    // Find the index of the task to update
    let taskIndex = tasks.findIndex(task => task.id === updatedTask.id);

    // Merge the updated task object with the existing task object
    if (taskIndex !== -1) {
        tasks[taskIndex] = {...tasks[taskIndex], ...updatedTask};
    }

    // Save the updated tasks array to local storage
    saveTasksToLocalStorage(tasks);
}

//função que vai buscar as tasks à localStorage e carrega nas colunas certas de acordo com o status
function loadTasksToCorretctList() {
    let tasksSaved = JSON.parse(localStorage.getItem('tasks'));
    let toDoList = document.getElementById("to-do-list");
    let doingList = document.getElementById("doing-list");
    let doneList = document.getElementById("done-list");

    if (tasksSaved === null) {
        console.log('empty array');
        return;
    } else {
        tasksSaved.forEach(task => {
            let taskAsElement = convertTaskObjectToElement(task);
            
            let taskStatus = task.status;
            if (taskStatus == 'to-do') {
                toDoList.appendChild(taskAsElement);
            } else if (taskStatus == 'doing') {
                doingList.appendChild(taskAsElement);
            } else {
                doneList.appendChild(taskAsElement);
            }
            setupDragAndDrop();
            deleteTask(task.iconId, task);
        });
    }
}

function deleteTask(iconId, task) {
    document.getElementById(iconId).addEventListener("click", function(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this task?") == true) {
            this.parentElement.parentElement.remove();
            deleteTaskFromStorage(task);
        } else {
            close();
        }
    });
}

//função para apagar a task selecionada da local storage
function deleteTaskFromStorage(task) {
    let tasksFromStorage = loadTasksFromLocalStorage();
    let taskID = task.id;

    tasksFromStorage.forEach((taskFromStorage, index) => {
        if (taskFromStorage.id == taskID) {
            tasksFromStorage.splice(index, 1);
        }
    });

    saveTasksToLocalStorage(tasksFromStorage);
}

