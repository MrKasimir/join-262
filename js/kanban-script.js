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

let count = tasks.length;

let currentDraggedElement;
let currentDraggedCategory;
let addedId = tasks.length - 1;

function onloadFunction() {
    getAddedTasksFromLocalStorage();
    addLocalStorageToBoard();
    saveBoardAsTasksToLocalStorage();
    tasks = loadBoardFromLocalStorage();
    renderByCategory();
}

function saveBoardAsTasksToLocalStorage() {
    localStorage.setItem('board', JSON.stringify(tasks));
}

function loadBoardFromLocalStorage() {
    const boardTasks = localStorage.getItem('board');
    if (!boardTasks) {
        return [];
    }
    else return JSON.parse(boardTasks);
}

function renderByCategory() {
    deleteKanbanBoard();
    for (let i = 0; i < tasks.length; i++) {
        if(tasks[i].title){
            if (tasks[i].category == 'todo') {
                updateKanbanBoard(i, tasks[i].category);
            }
            if (tasks[i].category == 'inProgress') {
                updateKanbanBoard(i, tasks[i].category);
            }
            if (tasks[i].category == 'awaitFeedback') {
                updateKanbanBoard(i, tasks[i].category);
            }
            if (tasks[i].category == 'done') {
                updateKanbanBoard(i, tasks[i].category);
            }
        }
    }
}

function deleteKanbanBoard() {
    document.getElementById('todo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('awaitFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
    document.getElementById('inputField').value = '';
    countCategoryInputs();
}

function updateKanbanBoard(i, category) {
    document.getElementById(category).innerHTML +=
        `<div class="task-container" draggable="true" ondragstart="startDragging(${tasks[i].id})">
    <div class="task-titlecategory">${tasks[i].titleCategory}</div>
    <div class="task-title">${tasks[i].title}</div>
    <div class="task-description">${tasks[i].description}</div>
    <div class="task-subtask">${tasks[i].subtasks} / 2 subtasks</div>
    <div class="task-assignee">${tasks[i].assignedTo}</div>
    </div>`;
}

function moveTo(id) {
    // Tasks verschieben
}

function moveTo(event) {
    event.preventDefault();
    const id = event.target.id;
    console.log(`Dropped in: ${id}`);
    if (id) { tasks[currentDraggedElement].category = id; }
    event.target.classList.remove('highlight');
    deleteKanbanBoard();
    renderByCategory();
}

function startDragging(id) {
    currentDraggedElement = id;
    console.log(currentDraggedElement);
}

function allowDrop(event) {
    event.preventDefault();
    const id = event.target.id;
    console.log(`Currently dragging over: ${id}`);
    if (id) { tasks[currentDraggedElement].category = id; }
    event.target.classList.add('highlight');
}

function removeHighlight(event) {
    const id = event.target.id;
    console.log(`remove highlight: Drag-ID: ${id}`);
    if (id) { tasks[currentDraggedElement].category = id; }
    event.target.classList.remove('highlight');
}

document.addEventListener('DOMContentLoaded', (event) => {
    function createTask() {
        let task = document.getElementById('inputField').value;
        if (task.trim() !== '') {
            addedId++;
            tasks.push({
                'id': addedId,
                'category': 'todo',
                'title': task,
                'titleCategory': 'enter title category',
                'description': 'enter description',
                'priority': 'set priority',
                'assignedTo': 'EF',
                'subtasks': 0,
            });
        }
        deleteKanbanBoard();
        renderByCategory();
    }
    document.getElementById('inputField').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            createTask();
        }
    });
});

function createTask() {
    let task = document.getElementById('inputField').value;
    if (task.trim() !== '') {
        addedId++;
        tasks.push({
            'id': addedId,
            'category': 'todo',
            'title': task,
            'titleCategory': 'enter title category',
            'description': 'enter description',
            'priority': 'set priority',
            'assignedTo': 'EF',
            'subtasks': 0,
        });
    }
    deleteKanbanBoard();
    renderByCategory();
}

let numberTodos = 0;
let numberInProgress = 0;
let numberAwaitFeedback = 0;
let numberDone = 0;

function countCategoryInputs() {
    for (let i = 0; i < tasks.length; i++) {
        let currentCategory = tasks[i].category;
        if (currentCategory == 'todo') {
            numberTodos++;
        }
        if (currentCategory == 'inProgress') {
            numberInProgress++;
        }
        if (currentCategory == 'awaitFeedback') {
            numberAwaitFeedback++;
        }
        if (currentCategory == 'done') {
            numberDone++;
        }
    }
    console.log(numberTodos);
    console.log(numberInProgress);
    console.log(numberAwaitFeedback);
    console.log(numberDone);

    if (numberTodos == 0) {
        renderEmptyCategoy('todo');
    }
    if (numberInProgress == 0) {
        renderEmptyCategoy('inProgress');
    }
    if (numberAwaitFeedback == 0) {
        renderEmptyCategoy('awaitFeedback');
    }
    if (numberDone == 0) {
        renderEmptyCategoy('done');
    }
    numberTodos = 0;
    numberInProgress = 0;
    numberAwaitFeedback = 0;
    numberDone = 0;
}

function renderEmptyCategoy(category) {
    document.getElementById(category).innerHTML +=
        `<div class="task-container">
    <div class="task-title">currently empty</div>
    </div>`;
}

function getAddedTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (!storedTasks) {
        return [];
    }
    else return JSON.parse(storedTasks);
}

function addLocalStorageToBoard() {
    const localStorageTasks = getAddedTasksFromLocalStorage();
    for (let i = 0; i < localStorageTasks.length; i++) {
        tasks.push(
            {
                'id': count,
                'category': 'todo',
                'title': localStorageTasks[i]['title'],
                'titleCategory': 'NEW',
                'description': 'NEW',
                'priority': 'NEW',
                'assignedTo': 'NEW',
                'subtasks': 99,
            }
        );
        count++;
    }
    saveBoardAsTasksToLocalStorage();
}
////////////////////////    Acces Local Storage von Add Task Seit - END ///////////////////////////////////