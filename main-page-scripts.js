document.addEventListener('DOMContentLoaded', function() {

    arraysInitializer();   

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
        addDoubleClickEventListenersToTask(task); //função que adiciona os event listeners de double click
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
                const tasks = mergeAllTaskArrays();
                const draggedTask = tasks.find(task => task.id === taskId);
    
                if (draggedTask) {
                    
                    draggedTask.status = box.id;
                
                    box.appendChild(draggableTask);

                    updateAndSaveTaskStatus(taskId, box.id);
                    
                }
            }
        });
    });
});

// |||||||||||||| FUNÇÕES PARA ADICIONAR EVENT LISTENERS ÀS TASKS ||||||||||||||||||||||

//função para adicionar double click e mostrar o modal com os detalhes da task
function addDoubleClickEventListenersToTask(task) {
    task.addEventListener('dblclick', function () {
        showTaskDetails(task.title, task.description);
    });
}

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

// |||||||||||||| FUNCIONALIDADE DE MUDAR A TASK DE ARRAY E O SEU STATUS COM DRAG |||||||||||

function updateAndSaveTaskStatus(taskId, newStatus) {
    // Vai buscar todas as tasks da localStorage

    let taskToUpdate;
    const allArraysList = loadAllTaskArraysIntoOne();

    for (const list of allArraysList) {
        const taskIndex = list.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            
            taskToUpdate = list.splice(taskIndex, 1)[0]; //remove a task da lista em que está no loop
            // essa task fica atribuida à variavél, tem [0] porque o splice da return de uma array do 
            //que foi removido, mas neste caso foi só um elemento removido 
            break;
        }
    }

    let toDoTasks = allArraysList[0];
    let doingTasks = allArraysList[1];
    let doneTasks = allArraysList[2];

    // atualizar status da task selecionada conforme em que box for largada
    if (taskToUpdate) {
        taskToUpdate.status = newStatus;

        switch (newStatus) {
            case 'to-do':
                toDoTasks.push(taskToUpdate);
                break;
            case 'doing':
                doingTasks.push(taskToUpdate);
                break;
            case 'done':
                doneTasks.push(taskToUpdate);
                break;
        }
        saveAllTaskArrays(allArraysList)
    }
}

// ||||||||||||||| FUNÇÕES LIGADAS À CRIAÇÃO E INTERÇÃO DAS TASKS ||||||||||||||||||||||||||||||||||||||||||||

//função que vai buscar o input no modal de criar tarefas, cria um objeto com esses dados e ids através
//da função que criar IDs, adiciona esse objeto à local storage e adiciona todas as funcionalidades esperadas
//de uma task, por fim cria um elemento html a partir do objeto e adiciona esse elemento à lista do to-do
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
        
        //adiciona a task à array da local storage do to-do
        let toDoTaskStorage = JSON.parse(localStorage.getItem('to-do-tasks'));
        toDoTaskStorage.push(newTask);
        localStorage.setItem('to-do-tasks', JSON.stringify(toDoTaskStorage));


        let toDoList = document.getElementById("to-do");
        
        let newTaskAsElement = convertTaskObjectToElement(newTask); //cria elemento html da task a partir do objeto
        addDragEventListenersToTask(newTaskAsElement);//adciona event listeners de drag ao elemento
        toDoList.appendChild(newTaskAsElement);// adiciona elemento à lista do to-do

        //adiciona funcionalidade de double click para abrir modal com os detalhes da task
        newTaskAsElement.addEventListener("dblclick", function() {
            showTaskDetails(taskName, taskDescription); 
        });

        deleteTask(iconId, newTask); //adiciona funcionalidade de apagar 
        openEdit(pencilId, newTask); // adciona funcionalidade de abrir pagina de edição

        //limpa os campos de texto do modal de criação de uma task e fecha-o
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

// função para converter o objeto task num elemento html (neste caso o componente de uma lista)
function convertTaskObjectToElement(task) {
    let newTaskElement = document.createElement('li');
    newTaskElement.innerHTML = `
        <div>
            <i id="${task.iconId}" class="fa-regular fa-trash-can"></i>
            <i id="${task.pencilId}" class= "fa-regular fa-pen-to-square"> </i>
            ${task.title}<p class="task-description"> ${task.description}</p>
        </div>`;
    newTaskElement.id = task.id;
    newTaskElement.className = task.className;
    newTaskElement.draggable = true;
    newTaskElement.status = task.status;
    newTaskElement.title = task.title;
    newTaskElement.description = task.description;
    return newTaskElement; 
}

//função para apagar a task selecionada da local storage
function deleteTaskFromStorage(taskId) {

    const lists = loadAllTaskArraysIntoOne();

    //faz loop por todas as tasks das listas até encontrar um id igual ao id passado
    //no parametro, 
    for (const list of lists) {
        const taskIndex = list.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            list.splice(taskIndex, 1); // o indice onde vai começar a remover e qts elementos remove
            break;
        }
    }

    saveAllTaskArrays(lists);
};

// ||||||||||||||| FUNÇÃO PARA CARREGAR AS TASKS DA LOCAL STORAGE ||||||||||||||||

//função que vai buscar as tasks à localStorage e carrega nas colunas certas de acordo com o status
function loadTasksToCorretctList() {

    let allTasks = mergeAllTaskArrays();

    let toDoList = document.getElementById("to-do");
    let doingList = document.getElementById("doing");
    let doneList = document.getElementById("done");


    if (allTasks === null) {
        console.log('no tasks to show');
        return;
    } else {
        allTasks.forEach(task => {
            let taskConvertedToElement = convertTaskObjectToElement(task);

            if (taskConvertedToElement.status == 'to-do') {
                toDoList.appendChild(taskConvertedToElement);
            } else if (taskConvertedToElement.status == 'doing'){
                doingList.appendChild(taskConvertedToElement);
            } else {
                doneList.appendChild(taskConvertedToElement);
            }
            deleteTask(task.iconId, task);
            openEdit(task.pencilId, task);
            
        });
    }
}


// |||||||||||||| FUNÇÕES PARA INTERAGIR COM A LOCAL STORAGE ||||||||||||||||||||||||

//função chamada sempre que a página é carregada para verificar a existencia das arrays 
//na local storage, se não existe cria essas arrays
function arraysInitializer() {
    let toDoTasks = JSON.parse(localStorage.getItem('to-do-tasks'));
    let doingTasks = JSON.parse(localStorage.getItem('doing-tasks'));
    let doneTasks = JSON.parse(localStorage.getItem('done-tasks'));

    if (toDoTasks === null) {
        localStorage.setItem('to-do-tasks', JSON.stringify(newArray = []));
    }
    
    if (doingTasks === null) {
        localStorage.setItem('doing-tasks', JSON.stringify(newArray = []));
    }

    if (doneTasks === null) {
        localStorage.setItem('done-tasks', JSON.stringify(newArray = []));
    }
}

//agrupa todas as arrays da local storage numa só
function mergeAllTaskArrays() {
    let toDoTasksSaved = JSON.parse(localStorage.getItem('to-do-tasks'));
    let doingTasksSaved = JSON.parse(localStorage.getItem('doing-tasks'));
    let doneTasksSaved = JSON.parse(localStorage.getItem('done-tasks'));
    //utilização de spread/rest operator para fazer merge das arrays
    return [...toDoTasksSaved, ...doingTasksSaved, ...doneTasksSaved];
}

//agrupa as 3 arrays diferentes numa lista de arrays
function loadAllTaskArraysIntoOne() {
    let toDoTasks = JSON.parse(localStorage.getItem('to-do-tasks'));
    let doingTasks = JSON.parse(localStorage.getItem('doing-tasks'));
    let doneTasks = JSON.parse(localStorage.getItem('done-tasks'));

    return [toDoTasks, doingTasks, doneTasks];
}
//função que recebe uma array de arrays e através da sua descontrução permite guardar na local
//storage as alteraçoes em cada array
function saveAllTaskArrays(lists) {
    const [toDoTasks, doingTasks, doneTasks] = lists; //extrai as arrays através da descontrução da array inicial

    localStorage.setItem('to-do-tasks', JSON.stringify(toDoTasks));
    localStorage.setItem('doing-tasks', JSON.stringify(doingTasks));
    localStorage.setItem('done-tasks', JSON.stringify(doneTasks));
}

// |||||||||||||||||||| FUNÇÕES PARA ATRIBUIR FUNCIONALIDADES AOS ICONES DE EDITAR E APAGAR ||||||||||||

//função que apaga a task elemento e objeto quando se carrega no icone do caixote
function deleteTask(iconId, task) {
    let taskID = task.id;
    document.getElementById(iconId).addEventListener("click", function(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this task?")) {
            this.parentElement.parentElement.remove();
            deleteTaskFromStorage(taskID);
        } 
    });
}

//dá a funcionalidade de abrir a pagina de editar ao icone na task
function openEdit(pencilId, task){
    document.getElementById(pencilId).addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.setItem("taskId", task.id);
        window.location.href = 'edit-note-page.html';
    });
}

// |||||||||||||||||||||| FUNÇÕES PARA ABRIR MODALS |||||||||||||||||||||||||||||||||||||||||||||||||||

//função que vai buscar os elementos do modal ao html e recebe como parametros os dados
//da task selecionada para mostrar depois de um double click na task
function showTaskDetails(taskTitle, taskDescription) {
    var modal = document.getElementById("seeTaskModal");
    var modalContent = modal.getElementsByClassName("modal-content")[0];

    var taskNameInput = modalContent.querySelector("#taskName1");
    var taskDescriptionTextArea = modalContent.querySelector("#text-area1");

    taskNameInput.value = taskTitle;
    taskDescriptionTextArea.value = taskDescription;
    modal.style.display = "block";
}

//fecha o modal que mostra os detalhes da task
function closeSeeTaskModal() {
    var modal = document.getElementById("seeTaskModal");
    modal.style.display = "none";
}

//função para abrir o modal de criar tasks
function openModal() {
    var modal = document.getElementById("taskModal");
    modal.style.display = "block";
}

//função para fechar o modal de criar tasks
function closeModal() {
    var modal = document.getElementById("taskModal");
    modal.style.display = "none";
}

// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

//remove o username da local storage e regressa à página inicial
function logout() {
    localStorage.removeItem('username');
    window.location.href='index.html';
}


