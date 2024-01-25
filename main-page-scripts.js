// scritps para arrastar

document.addEventListener('DOMContentLoaded', function() {
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
        const draggingTask = document.querySelector('.dragging');
        this.appendChild(draggingTask);
        draggingTask.classList.remove('over');
    }

});


//função para fazer get do username da storage e atribuir esse username à label da pagina incial
document.addEventListener('DOMContentLoaded', function() {
    const username = sessionStorage.getItem('username');

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
    var taskName = document.getElementById("taskName").value;
    var taskDescription = document.getElementById("text-area").value;

    if (taskName) {
        var newTask = document.createElement("div");
        newTask.className = "task";
        newTask.draggable = true;
        newTask.innerHTML = `<p>${taskName}</p><p>${taskDescription}</p>`;

        var toDoList = document.getElementById("to-do-list");
        toDoList.appendChild(newTask);

        closeModal();
    }
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

