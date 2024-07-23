// kanban-script.js

let defaultTasks = [{
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

let tasks = [];  // nächster Schritt: die defaultTasks aus firebase laden lassne
let count = tasks.length;

let currentDraggedElement;
let currentDraggedCategory;
let addedId = tasks.length - 1;

function onloadFunction() {
    // erst prüfen, ob das board schon im local storage liegt
    if (loadBoardFromLocalStorage().length == 0) {
        tasks = defaultTasks;
    } else {
        // Wenn noch keins drin ist, dann mit defaultArray initialisieren
        tasks = loadBoardFromLocalStorage();
    }
    // die renderByCategory Funktion soll nicht in addTask.html aufgerufen werden
    if (window.location.href.includes('kanban-board.html')) {
        renderByCategory();
    }
}

// im Local Storage die tasks ablegen mit dem key 'board'
function saveBoardAsTasksToLocalStorage() {
    localStorage.setItem('board', JSON.stringify(tasks));
}

function loadBoardFromLocalStorage() {
    const boardTasks = localStorage.getItem('board');
    if (!boardTasks) {
        return [];
    }

    else {
        return JSON.parse(boardTasks);
    }
}

function renderByCategory() {
    deleteKanbanBoard();
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].title) {
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

function moveTo(event) {
    event.preventDefault();
    const id = event.target.id;
    if (id) {
        tasks[currentDraggedElement].category = id;

    }
    event.target.classList.remove('highlight');
    deleteKanbanBoard();
    renderByCategory();
    saveBoardAsTasksToLocalStorage();
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
    /* event.target.classList.remove('highlight'); */
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

// Das kanban-script.js soll auf der addTask.html direkt aus den Feldern auslesen
function CreatTaskbuttonOnclick() {
    addTaskFromInputPage();
    window.location.href = './kanban-board.html';
}

function addTaskFromInputPage() {
    let newListOfTasks = loadBoardFromLocalStorage();

    if (document.getElementById('Task-Title-id').value != '' && document.getElementById('Task-Describtion-id').value != '') {
        newListOfTasks.push({
            'id': newListOfTasks.length,
            'category': 'todo',
            'title': document.getElementById('Task-Title-id').value,
            'titleCategory': 'NEW',
            'description': document.getElementById('Task-Describtion-id').value,
            'priority': 'NEW',
            'assignedTo': document.getElementById('Task-choose-contact-id').value,
            'subtasks': document.getElementById('Task-Subtask-Id').value,
        });
        clearAllInputFields();
    }
    localStorage.setItem('board', JSON.stringify(newListOfTasks));
}

function clearAllInputFields() {
    document.getElementById('Task-Title-id').value = '';
    document.getElementById('Task-Describtion-id').value = '';
    document.getElementById('Task-choose-contact-id').value = '';
    document.getElementById('Task-Date-Id').value = '';
    document.getElementById('Task-choose-Category-id').value = '';
    document.getElementById('Task-Subtask-Id').value = '';
}

// Funktion zum Finden eines Tasks anhand des inputFields
function findTask() {
    const searchText = getSearchText();
    clearHighlightsAndFormatting();

    if (searchText === '') return;

    searchTasksAndHighlight(searchText);
}

// Funktion zum Returnen des inputStrings
function getSearchText() {
    return document.getElementById('inputField').value.toLowerCase().trim();
}

// Funktion zum Entfernen möglicher vorheriger tasks searches
function clearHighlightsAndFormatting() {
    document.querySelectorAll('.task-container').forEach(task => {
        resetTaskStyles(task);
        clearTaskHighlights(task);
    });
}

// Funktion zum Zurücksetzen der styles
function resetTaskStyles(task) {
    task.style.border = '';
    task.style.boxShadow = '';
}

// Funktion zum Entfernen von Titel -und Description Markierungen
function clearTaskHighlights(task) {
    const titleElement = task.querySelector('.task-title');
    const descriptionElement = task.querySelector('.task-description');

    if (titleElement) clearHighlight(titleElement);
    if (descriptionElement) clearHighlight(descriptionElement);
}

// Funktion zum Entfernen der Markierung von einem ganzen Element
function clearHighlight(element) {
    element.innerHTML = element.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
}

// Funktion zum Durchsuchen des Tasks zur und Hervorhebung bei Übereinstimmungen
function searchTasksAndHighlight(searchText) {
    document.querySelectorAll('.task-container').forEach(task => {
        if (taskMatchesSearch(task, searchText)) {
            highlightTask(task, searchText);
        }
    });
}

// Funktion zur Prüfung, ob ein Task den Suchtext enthält
function taskMatchesSearch(task, searchText) {
    const titleElement = task.querySelector('.task-title');
    const descriptionElement = task.querySelector('.task-description');

    if (!titleElement || !descriptionElement) return false;

    const title = titleElement.innerText.toLowerCase();
    const description = descriptionElement.innerText.toLowerCase();

    return title.includes(searchText) || description.includes(searchText);
}

// Funktion zur Hervorhebung eines Tasks
function highlightTask(task, searchText) {
    task.style.border = '2px solid grey';
    task.style.boxShadow = '0 0 5px grey';

    const titleElement = task.querySelector('.task-title');
    const descriptionElement = task.querySelector('.task-description');

    if (titleElement) highlightText(titleElement, searchText);
    if (descriptionElement) highlightText(descriptionElement, searchText);
}

// Funktion zur Hervorhebung des searchStrings innerhalb eines Elements
function highlightText(element, searchText) {
    let html = element.innerHTML;
    const regex = new RegExp(`(${searchText})`, 'gi');
    html = html.replace(regex, '<mark>$1</mark>');
    element.innerHTML = html;
}

// Event-Listener (wird ausgeführt wird, sobald der DOM-Inhalt vollständig geladen ist)
// Der Listener darf nur im kanban-board.html aktiv sein
if (window.location.href.includes('kanban-board.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        onloadFunction();
        document.getElementById('inputField').addEventListener('input', findTask);
    });
}