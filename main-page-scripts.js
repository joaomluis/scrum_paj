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