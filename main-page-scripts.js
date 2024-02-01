document.addEventListener('DOMContentLoaded', function () {
    loadTasksToCorretctList();
});

// scritps para arrastar

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

    function drop() {
        console.log("Dropping")
        const draggingTask = document.querySelector('.dragging');
        console.log(draggingTask)
        this.appendChild(draggingTask);
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

//função para fazer get do username da storage e atribuir esse username à label da pagina incial
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');

    const welcomeLabel = document.getElementById('welcome-user');
    if (welcomeLabel) {
        welcomeLabel.textContent = 'Welcome, ' + username;
    }
});

function logout() {
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

function createTask() {
    let taskName = document.getElementById("taskName").value;
    let taskDescription = document.getElementById("text-area").value;
    

    if (taskName) {
        let taskId = createTaskId();
        let iconId = createTaskId();
        let pencilId = createTaskId();

        let newTask = {
            title: taskName,
            description: taskDescription,
            id: taskId,
            iconId : iconId,
            pencilId: pencilId,
            className: "task",
            status: "to-do",
            
        };
        addTaskToLocalStorage(newTask);

        let toDoList = document.getElementById("to-do-list");
        
        let newTaskAsElement = convertTaskObjectToElement(newTask);
        toDoList.appendChild(newTaskAsElement);

        newTaskAsElement.addEventListener("dblclick", function() {
            showTaskDetails(taskName, taskDescription);
        });

        // função para eliminar tarefas ao carregar no icone

        deleteTask(iconId, newTask);
        openEdit(pencilId, newTask);

        document.getElementById("taskName").value = "";
        document.getElementById("text-area").value = "";

        setupDragAndDrop();
        closeModal();
    
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
    newTaskElement.innerHTML = `
        <div>
            <i id="${task.iconId}" class="fa-regular fa-trash-can"></i>
            <i id="${task.pencilId}" class= "fa-regular fa-pen-to-square"> </i>
            ${task.title}<p class="task-description"> ${task.description}</p>
        </div>`;
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

            taskAsElement.addEventListener("dblclick", function() {
                showTaskDetails(task.title, task.description);
            });

            setupDragAndDrop();
            deleteTask(task.iconId, task);
            openEdit(task.pencilId, task);
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

function openEdit(pencilId, task){
    document.getElementById(pencilId).addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.setItem("taskId", task.id.toString());
        window.location.href = 'edit-note-page.html';
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


function showTaskDetails(taskTitle, taskDescription) {
    var modal = document.getElementById("seeTaskModal");
    var modalContent = modal.getElementsByClassName("modal-content")[0];

    // Get the input fields for the task title and description
    var taskNameInput = modalContent.querySelector("#taskName");
    var taskDescriptionTextArea = modalContent.querySelector("#text-area");

    // Populate the input fields with the task details
    taskNameInput.value = taskTitle;
    taskDescriptionTextArea.value = taskDescription;
    modal.style.display = "block";
}

function closeSeeTaskModal() {
    var modal = document.getElementById("seeTaskModal");
    modal.style.display = "none";
}