const BASE_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

// defaultTasks sind hier dummy Werte zum testen
// die tatsächlichen defaultTasks werden jedesmal aus firebase geladen 
let defaultTasks = [{
    'id': 0,
    'category': 'todo',
    'title': 'Create Title of your task here',
    'titleCategory': 'User Story',
    'description': 'Enter a description for your task',
    'priority': 'medium',
    'assignedTo': 'JS',
    'subtasks': 'create subtasks',
}];

let backUpTasks = defaultTasks;
let tasks = [];
let count = tasks.length;
let currentDialogTask = [];
let currentDraggedElement;
let currentDraggedCategory;
let addedId = tasks.length - 1;

let numberTodos = 0;
let numberInProgress = 0;
let numberAwaitFeedback = 0;
let numberDone = 0;

let numberTasksinBoard = 0;
let numberUrgentTasks = 0;

// Initialisierungsfunktion beim Laden der Seite
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.href.includes('kanban-board.html')) {
        await onloadFunction();
        document.getElementById('inputField').addEventListener('input', findTask);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    addDragAndDropEventListeners();
});

/**
 * Loads the kanban board when the page is loaded.
 */
async function onloadFunction() {
    let boardData = loadBoardFromLocalStorage();
    // Wenn nichts im local storage ist, dann Tasks aus der API laden
    if (boardData === null || boardData === undefined || (Array.isArray(boardData) && boardData.length === 0)) {
        defaultTasks = await fetchUserData();
        // Fallback zum leeren Array [] wenn fetchUserData fails
        tasks = defaultTasks || [];
    } else {
        // Andernfalls mit den geladenen Daten initialisieren
        tasks = boardData;
    }
    // Die renderByCategory Funktion soll nicht in addTask.html aufgerufen werden (wirft sonst error)
    if (window.location.href.includes('kanban-board.html')) {
        renderByCategory();
    }
}

/**
 * Saves the current board state to local storage.
 */
function saveBoardAsTasksToLocalStorage() {
    localStorage.setItem('board', JSON.stringify(tasks));
}

/**
 * Loads the board state from local storage.
 * 
 * @returns {Array} The array of tasks loaded from local storage.
 */
function loadBoardFromLocalStorage() {
    const boardTasks = localStorage.getItem('board');
    if (!boardTasks) {
        return [];
    } else {
        return JSON.parse(boardTasks);
    }
}

/**
 * Renders the tasks by their categories on the kanban board.
 */
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
    pushIfUserLogOut();
    addDragAndDropEventListeners(); // Add drag and drop listeners after rendering
}

/**
 * Clears the kanban board.
 */
function deleteKanbanBoard() {
    document.getElementById('todo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('awaitFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
    document.getElementById('inputField').value = '';
    countCategoryInputs();
}

/**
 * Updates the kanban board with a task.
 * 
 * @param {number} i - The index of the task.
 * @param {string} category - The category of the task.
 */
function updateKanbanBoard(i, category) {
    let kanbanDetails = [tasks[i].id,
    tasks[i].category, // todo, awaitFeddback, etc
    tasks[i].titleCategory, // user story, technical task etc
    tasks[i].title,
    tasks[i].description,
    tasks[i].subtasks,
    tasks[i].assignedTo,
    tasks[i].priority];
    let kanbanDetailsAsJson = JSON.stringify(kanbanDetails)/* .replace(/"/g, '&quot;') */;

    // background depends on category 'user story' vs 'technical task'
    let bgColorClass = '';
    if (tasks[i].titleCategory === 'User Story') {
        bgColorClass = 'user-story';
    } else if (tasks[i].titleCategory === 'Technical Task') {
        bgColorClass = 'technical-task';
    }

    // Bestimmen der Prioritätsklasse
    let priorityClass = '';
    if (tasks[i].priority === 'Urgent') {
        priorityClass = 'task-priority-urgent';
    } else if (tasks[i].priority === 'Medium') {
        priorityClass = 'task-priority-medium';
    } else if (tasks[i].priority === 'Low') {
        priorityClass = 'task-priority-low';
    }

    document.getElementById(category).innerHTML +=
        `<div onclick='openDialogOnCardClick(${kanbanDetailsAsJson})' class="task-container" draggable="true" ondragstart="startDragging(${tasks[i].id})">
            <div class="task-titlecategory ${bgColorClass}">${tasks[i].titleCategory}</div>
            <div class="task-title">${tasks[i].title}</div>
            <div class="task-description">${tasks[i].description}</div>
            <div class="task-subtask">${tasks[i].subtasks}</div>
            <div class="in-parallel">
                <div class="task-assignee">${tasks[i].assignedTo}</div>
                <div class="task-priority ${priorityClass}">_</div>
            </div>
        </div>`;
}

///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Add drag and drop event listeners to the appropriate elements
function addDragAndDropEventListeners() {
    const categories = ['todo', 'inProgress', 'awaitFeedback', 'done'];
    categories.forEach(category => {
        const element = document.getElementById(category);
        element.addEventListener('dragover', allowDrop);
        element.addEventListener('drop', moveTo);
        element.addEventListener('dragleave', removeHighlight);
    });
}
////////////////////////////////////////////////////////////////

/**
 * Starts dragging a task.
 * 
 * @param {number} id - The ID of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
    console.log('Dragging started with ID:', currentDraggedElement);
}

/**
 * Allows a task to be dropped.
 * 
 * @param {Event} event - The drag event.
 */
function allowDrop(event) {
    event.preventDefault();
    event.target.classList.add('drag-over');
}

/**
 * Moves a task to a new category.
 * 
 * @param {Event} event - The drop event.
 */
function moveTo(event) {
    event.preventDefault();
    const targetCategory = event.target.id;

    if (targetCategory && currentDraggedElement !== undefined) {
        const task = tasks.find(task => task.id === currentDraggedElement);
        if (task) {
            task.category = targetCategory;
        }

        deleteKanbanBoard();
        renderByCategory();
        saveBoardAsTasksToLocalStorage();
    }
    event.target.classList.remove('highlight');
    event.target.classList.remove('drag-over');
}

function removeHighlight(event) {
    event.target.classList.remove('highlight');
    event.target.classList.remove('drag-over');
}

////*css*/`


////*css*/`


/////////////////////////////////////////////////////////////////////////

/**
 * Counts the tasks in each category.
 */
function countCategoryInputs() {
    numberTodos = 0;
    numberInProgress = 0;
    numberAwaitFeedback = 0;
    numberDone = 0;
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
        if (currentCategory == 'numberTasksinBoard') {
            numberDone++;
        }
        if (currentCategory == 'numberUrgentTasks') {
            numberDone++;
        }

    }
    saveBoardAsTasksToLocalStorage();
    renderEmptyCategories();
}

/**
 * Renders a message for empty categories.
 */
function renderEmptyCategories() {
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
}

/**
 * Renders an empty category message.
 * 
 * @param {string} category - The category to render the message for.
 */
function renderEmptyCategoy(category) {
    document.getElementById(category).innerHTML +=
        `<div class="empty-task-container">
    <div class="task-title">No tasks To do</div>
    </div>`;
}

function getAddedTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (!storedTasks) {
        return [];
    } else return JSON.parse(storedTasks);
}

/**
 * Adds a task from the input fields on the add task page.
 */
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

/**
 * Redirects to the kanban board (from the addTask.html inputFields) after creating a task.
 */
function CreatTaskbuttonOnclick() {
    addTaskFromInputPage();
    window.location.href = './kanban-board.html';
}

/**
 * Clears all input fields on the add task page.
 */
function clearAllInputFields() {
    document.getElementById('Task-Title-id').value = '';
    document.getElementById('Task-Describtion-id').value = '';
    document.getElementById('Task-choose-contact-id').value = '';
    document.getElementById('Task-Date-Id').value = '';
    document.getElementById('Task-choose-Category-id').value = '';
    document.getElementById('Task-Subtask-Id').value = '';
}

/**
 * Finds and highlights tasks based on the search input.
 */
function findTask() {
    const searchText = getSearchText();
    clearHighlightsAndFormatting();
    if (searchText === '') return;
    searchTasksAndHighlight(searchText);
}

/**
 * Gets the search text from the input field.
 * 
 * @returns {string} The search text.
 */
function getSearchText() {
    return document.getElementById('inputField').value.toLowerCase().trim();
}

/**
 * Clears any previous task search highlights and formatting.
 */
function clearHighlightsAndFormatting() {
    document.querySelectorAll('.task-container').forEach(task => {
        resetTaskStyles(task);
        clearTaskHighlights(task);
    });
}

/**
 * Resets the styles of a task.
 * 
 * @param {Element} task - The task element.
 */
function resetTaskStyles(task) {
    task.style.border = '';
    task.style.boxShadow = '';
}

/**
 * Clears highlights from a task's title and description.
 * 
 * @param {Element} task - The task element.
 */
function clearTaskHighlights(task) {
    const titleElement = task.querySelector('.task-title');
    const descriptionElement = task.querySelector('.task-description');
    if (titleElement) clearHighlight(titleElement);
    if (descriptionElement) clearHighlight(descriptionElement);
}

/**
 * Clears highlight from an element.
 * 
 * @param {Element} element - The element to clear highlights from.
 */
function clearHighlight(element) {
    element.innerHTML = element.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
}

/**
 * Searches tasks and highlights those that match the search text.
 * 
 * @param {string} searchText - The search text.
 */
function searchTasksAndHighlight(searchText) {
    document.querySelectorAll('.task-container').forEach(task => {
        if (taskMatchesSearch(task, searchText)) {
            highlightTask(task, searchText);
        }
    });
}

/**
 * Highlights matching text within an element.
 * 
 * @param {Element} task - The element containing text to highlight.
 * @param {string} searchText - The text to highlight.
 */
function taskMatchesSearch(task, searchText) {
    const titleElement = task.querySelector('.task-title');
    const descriptionElement = task.querySelector('.task-description');

    if (!titleElement || !descriptionElement) return false;

    const title = titleElement.innerText.toLowerCase();
    const description = descriptionElement.innerText.toLowerCase();

    return title.includes(searchText) || description.includes(searchText);
}

/**
 * Highlights a task.
 * 
 * @param {Element} task - The task element.
 * @param {string} searchText - The search text.
 */
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
    document.addEventListener('DOMContentLoaded', async () => {
        // await onloadFunction();  // Await the async function
        document.getElementById('inputField').addEventListener('input', findTask);
    });
}
//push funktion die dafür sorgt, dass immer zum richtigen user mit dem richtigem path gepusht wird
function pushIfUserLogOut() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedinUser'));
    if (!loggedInUser || !loggedInUser[0] || !loggedInUser[0].UserID) {
        console.error('User not found in local storage');
        return;
    }

    const userId = loggedInUser[0].UserID;
    const board = JSON.parse(localStorage.getItem('board'));

    if (!board) {
        console.log('No board data to push');
        return;
    }

    const apiUrl = `${BASE_URL}/User/${userId}/board.json`;

    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(board)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data successfully pushed:', data);
        })
        .catch(error => {
            console.error('Error pushing data:', error);
        });
}

async function fetchUserData() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedinUser'));
    if (!loggedInUser || !loggedInUser[0] || !loggedInUser[0].UserID) {
        console.error('User not found in local storage');
        return;
    }

    const userId = loggedInUser[0].UserID;

    const response = await fetch(`${BASE_URL}User/${userId}/board.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        console.error('Network response was not ok', response.statusText);
        return;
    }

    const data = await response.json();
    console.log("User Data:", data);

    // Overwrite the defaultTasks array with the fetched data
    defaultTasks = data;
    console.log("Updated defaultTasks:", defaultTasks);

    return data;
}


/////////////////////////////// Dialog Card Funktions //////////////////////////////

function getDialogDetails(inputCategory) {

    console.log('dialog started in :' + inputCategory);
    console.log('Title:' + document.getElementById('title-text').innerHTML);
    currentDialogTask = {
        'id': tasks.length,
        'category': inputCategory,
        'title': document.getElementById('title-text').innerHTML,
        'titleCategory': document.getElementById('story-category-select').value,
        'description': document.getElementById('subtitle-text').innerHTML,
        'priority': document.getElementById('priority-select').value,
        'assignedTo': 'JS',
        'subtasks': 'subtask',
    };
}



// TODO: Fehlende Werte ergänzen (nicht nur Titel)
function refreshDialogDetails() {
    document.getElementById('title-text').innerHTML = 'add in new title';
    document.getElementById('subtitle-text').innerHTML = 'add new description'; // Clearing description for new task
    document.getElementById('story-category-select').value = 'User Story'; // Default value
    document.getElementById('priority-select').value = 'low'; // Default value
}




/* function saveDialogToBoard() {
    getDialogDetails(currentDialogTask['category']);
    // add dialog task to task json
    tasks.push(currentDialogTask);
    // empty current dialog task details
    currentDialogTask = [];
    // close Dialog Window
    removeOverlay();

    // getBoardFromLocalStorage
    // addToThatBoard
    // saveToNewBoard to Local Storage
    renderByCategory();
    console.log('changes pinned to board');
} */
// saveDialogToBoard
function saveDialogToBoard() {
    if (currentDialogTask.length === 0) return;

    // Hole aktuelle Werte aus dem Dialog und speichere sie
    const updatedTask = {
        ...currentDialogTask,
        title: document.getElementById('title-text').innerHTML,
        description: document.getElementById('subtitle-text').innerHTML,
        titleCategory: document.getElementById('story-category-select').value,
        priority: document.getElementById('priority-select').value
    };

    tasks.push(updatedTask);
    currentDialogTask = []; // Leere den aktuellen Dialog

    removeOverlay();
    renderByCategory(); // Stelle sicher, dass das Board aktualisiert wird
    saveBoardAsTasksToLocalStorage(); // Speichere die Änderungen lokal
}



// openDialog('awaitFeedback') soll den Task in die Await Feedback in die Kategorie "Await Feedback" ablegen 
function openDialog(inputCategory) {
    addOverlay();
    getDialogDetails(inputCategory);
    refreshDialogDetails();
}



// openDialogOnCardClick
/* function openDialogOnCardClick(kanbanDetailsAsJson) {
    currentDialogTask = {
        'id': kanbanDetailsAsJson[0],
        'category': kanbanDetailsAsJson[1],
        'title': kanbanDetailsAsJson[3],
        'titleCategory': kanbanDetailsAsJson[2],
        'description': kanbanDetailsAsJson[4],
        'priority': 'default',
        'assignedTo': 'default',
        'subtasks': 'default',
    };

    // angeklickte Karte aus tasks löschen (wird bei save wieder hinzugefügt)
    for (let i = 0; i < tasks.length; i++) {
        // ID's abgleichen
        if (tasks[i]['id'] == kanbanDetailsAsJson[0]) {
            tasks.splice(i, 1);  // Entferne den Task aus dem Array
            break;
        }
    }

    addOverlay();
    console.log(kanbanDetailsAsJson);

    document.getElementById('title-text').innerHTML = kanbanDetailsAsJson[3]; // title
    document.getElementById('subtitle-text').innerHTML = kanbanDetailsAsJson[4]; // description
    document.getElementById('story-category-select').value = kanbanDetailsAsJson[2]; // titleCategory: user story vs technical task
} */

// neue openDialogOnCardClick
/**
 * Opens the task dialog when a task is clicked.
 * 
 * @param {number} id - The ID of the task.
 * @param {string} category - The category of the task.
 * @param {string} titleCategory - The title category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} subtasks - The subtasks of the task.
 * @param {string} assignedTo - The assignee of the task.
 * @param {string} priority - The assignee of the task.
 */
function openDialogOnCardClick(kanbanDetailsAsJson) {
    currentDialogTask = {
        'id': kanbanDetailsAsJson[0],
        'category': kanbanDetailsAsJson[1],
        'title': kanbanDetailsAsJson[3],
        'titleCategory': kanbanDetailsAsJson[2],
        'description': kanbanDetailsAsJson[4],
        'priority': kanbanDetailsAsJson[7],
        'assignedTo': kanbanDetailsAsJson[6],
        'subtasks': kanbanDetailsAsJson[5],
    };

    // Entferne die Karte aus der aktuellen Liste
    tasks = tasks.filter(task => task.id !== kanbanDetailsAsJson[0]);
    addOverlay();
    document.getElementById('title-text').innerHTML = kanbanDetailsAsJson[3]; // title
    document.getElementById('subtitle-text').innerHTML = kanbanDetailsAsJson[4]; // description
    document.getElementById('story-category-select').value = kanbanDetailsAsJson[2]; // titleCategory: user story vs technical task
    document.getElementById('priority-select').value = kanbanDetailsAsJson[7];
}

function addOverlay() {
    //... nimmt display: none Eigenschaft raus
    document.getElementById('overlay').classList.remove('d-none');
}

function removeOverlay() {
    //... fügt display: none Eigenschaft hinzu
    document.getElementById('overlay').classList.add('d-none');
}

function pressSaveInDialog() {

    saveDialogToBoard();
    //    saveBoardAsTasksToLocalStorage();
    removeOverlay();
    //    renderByCategory();
}

function pressXInDialog() {
    saveDialogToBoard();
    removeOverlay();
    renderByCategory();
}

function pressDeleteInDialog() {
    removeOverlay();
    renderByCategory();
}


