let tasks = [{
    'id': 0,
    'category': 'todo',
    'title': 'Contact Form and Imprint',
    'titleCategory': 'User Story',
    'description': 'Create contact form & imprint page',
    'priority': 'medium',
    'assignedTo': 'AB',
    'subtasks': 1,
},
{
    'id': 1,
    'category': 'inProgress',
    'title': 'Kochwelt Page & Recipe Recommender',
    'titleCategory': 'User Story',
    'description': 'Build start page with recipe recommendation',
    'priority': 'medium',
    'assignedTo': 'CD',
    'subtasks': 2,
},
{
    'id': 2,
    'category': 'awaitFeedback',
    'title': 'Monthly Kochwelt Recipe',
    'titleCategory': 'User Story',
    'description': 'Implement monthly recipe portion and calculator',
    'priority': 'low',
    'assignedTo': 'EF',
    'subtasks': 2,
},
{
    'id': 3,
    'category': 'awaitFeedback',
    'title': 'Yearly Kochwelt Recipe',
    'titleCategory': 'User Story',
    'description': 'Implement yearly recipe portion and calculator',
    'priority': 'low',
    'assignedTo': 'EF',
    'subtasks': 2,
},
{
    'id': 4,
    'category': 'done',
    'title': 'Projektmeeting',
    'titleCategory': 'User Story',
    'description': 'Decide on next steps.',
    'priority': 'low',
    'assignedTo': 'EF',
    'subtasks': 2,
}
];
let count = 0;
let currentDraggedElement;
let addedId = -1;

function onloadFunction() {
    tasks = loadBoardFromLocalStorage(); // Läd die Aufgaben aus dem Local Storage
    renderByCategory();
}

function saveBoardAsTasksToLocalStorage() {
    localStorage.setItem('board', JSON.stringify(tasks));
}

function loadBoardFromLocalStorage() {
    const boardTasks = localStorage.getItem('board');
    return boardTasks ? JSON.parse(boardTasks) : [];
}

function renderByCategory() {
    deleteKanbanBoard();
    tasks.forEach((task, i) => {
        if (task.title) {
            updateKanbanBoard(i, task.category);
        }
    });
}

function deleteKanbanBoard() {
    ['todo', 'inProgress', 'awaitFeedback', 'done'].forEach(category => {
        document.getElementById(category).innerHTML = '';
    });
    document.getElementById('inputField').value = '';
    countCategoryInputs();
}

function updateKanbanBoard(i, category) {
    document.getElementById(category).innerHTML += `
        <div class="task-container" draggable="true" ondragstart="startDragging(${tasks[i].id})">
            <div class="task-titlecategory">${tasks[i].titleCategory}</div>
            <div class="task-title">${tasks[i].title}</div>
            <div class="task-description">${tasks[i].description}</div>
            <div class="task-subtask">${tasks[i].subtasks} / 2 subtasks</div>
            <div class="task-assignee">${tasks[i].assignedTo}</div>
        </div>`;
}

function moveTo(event) {
    event.preventDefault();
    const categoryId = event.target.id;
    if (categoryId && currentDraggedElement !== undefined) {
        tasks[currentDraggedElement].category = categoryId;
        saveBoardAsTasksToLocalStorage(); // Speichere die Änderungen im Local Storage
        deleteKanbanBoard();
        renderByCategory();
    }
    event.target.classList.remove('highlight');
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
    event.target.classList.add('highlight');
}

function removeHighlight(event) {
    event.target.classList.remove('highlight');
}

function createTask() {
    let task = document.getElementById('inputField').value;
    if (task.trim() !== '') {
        addedId++;
        const newTask = {
            'id': addedId,
            'category': 'todo',
            'title': task,
            'titleCategory': 'enter title category',
            'description': 'enter description',
            'priority': 'set priority',
            'assignedTo': 'EF',
            'subtasks': 0,
        };
        tasks.push(newTask);
        saveBoardAsTasksToLocalStorage();
        deleteKanbanBoard();
        renderByCategory();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    onloadFunction();
    document.getElementById('inputField').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            createTask();
        }
    });
});

let numberTodos = 0;
let numberInProgress = 0;
let numberAwaitFeedback = 0;
let numberDone = 0;

function countCategoryInputs() {
    ['todo', 'inProgress', 'awaitFeedback', 'done'].forEach(category => {
        numberTodos += tasks.filter(task => task.category === category).length;
        console.log(category, numberTodos);
        numberTodos = 0;
    });
    // Render empty categories if needed
    ['todo', 'inProgress', 'awaitFeedback', 'done'].forEach(category => {
        if (tasks.filter(task => task.category === category).length === 0) {
            renderEmptyCategory(category);
        }
    });
}

function renderEmptyCategory(category) {
    document.getElementById(category).innerHTML += `
        <div class="task-container">
            <div class="task-title">currently empty</div>
        </div>`;
}
////////////////////////    Acces Local Storage von Add Task Seite - END ///////////////////////////////////