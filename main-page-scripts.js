document.addEventListener('DOMContentLoaded', function() {

    loadTasksToCorretctList(); //carrega todas as tasks em local storage para as colunas correspondentes

    // fecha modal de ver a task ao carregar em qualquer lado (fora dela)
    window.onclick = function(event) {
        var modal = document.getElementById("seeTaskModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //guarda o nome utilizado para logar na storage e atribui à label no header 
    //assim o username fica sempre disponivel 
    const username = localStorage.getItem('username');

    const welcomeLabel = document.getElementById('welcome-user');
    if (welcomeLabel) {
        welcomeLabel.textContent = 'Welcome, ' + username;
    }
// funcionalidade de drag 
    const boxes = document.querySelectorAll('.box');
    const tasks = document.querySelectorAll('.task')

    //percorre todos os elementos com a classe de task e a atribui dois event listeners
    // o de dragstart e de dragend
    tasks.forEach(task => {
        addDragEventListenersToTask(task); // função que adiciona event listeners do drag 
    });

    //percorre todos os elementos com classe box e atribui o event listener dragover
    //através do elemento que está a ser arrastado vai buscar o objeto que esse elemento representa
    //e muda o status do objeto conforme a box em que o elemento for largado
    boxes.forEach(box => {
        box.addEventListener('dragover', e => {
            e.preventDefault();
            const draggableTask = document.querySelector('.dragging');
            
            if (draggableTask) {
                
                const taskId = draggableTask.id;
                const tasks = loadTasksFromLocalStorage();
                const draggedTask = tasks.find(task => task.id === taskId);
    
                if (draggedTask) {
                    
                    draggedTask.status = box.id;
                    saveTasksToLocalStorage(tasks);
                    box.appendChild(draggableTask);
                }
            }
        });
    });
});

//função que adiciona os event listeners do drag, é chamada quando a página é carregada
// ou quando uma task nova é criada
function addDragEventListenersToTask(task) {
    task.addEventListener('dragstart', () => {
        task.classList.add('dragging')
    });
    task.addEventListener('dragend', () => {
        task.classList.remove('dragging')
    });
}

//remove o username da local storage e regressa à página inicial
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
            draggable: true,
            className: "task",
            status: "to-do",
            
        };
        addTaskToLocalStorage(newTask);
        

        let toDoList = document.getElementById("to-do");
        
        let newTaskAsElement = convertTaskObjectToElement(newTask);
        addDragEventListenersToTask(newTaskAsElement);
        toDoList.appendChild(newTaskAsElement);

        newTaskAsElement.addEventListener("dblclick", function() {
            showTaskDetails(taskName, taskDescription);
        });

        // função para eliminar tarefas ao carregar no icone

        deleteTask(iconId, newTask);
        openEdit(pencilId, newTask);

        document.getElementById("taskName").value = "";
        document.getElementById("text-area").value = "";

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
    let toDoList = document.getElementById("to-do");
    let doingList = document.getElementById("doing");
    let doneList = document.getElementById("done");

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




