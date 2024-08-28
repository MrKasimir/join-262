// NEW:
const BASE_URL = "https://join262-default-rtdb.europe-west1.firebasedatabase.app/";

// OLD:
//const BASE_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * TODO: Split kanban-script into:
 * 
 * kanbanScript.js......................=> core script with all core functions and render functions
 * kanbanDialogScript.js................=> script to enable dialogCard feature from cardClick, plusSymbolClick and addTaskClick
 * kanbanDragDropScript.js..............=> script to enable Drag&Drop feature
 * kanbanSearchFunctionalityScript.js...=> script to enable search & highlight kanbanCard feature
 * kanbanLocalPlusApiStorage.js.........=> script to operate backend integration between board, local storage and firebase API
 */


/**
 * This function resets KanbanBoard and local Storage
 *  REMOVE THIS FUNCTION FROM FINAL VERSION
 */
function reset() {
    tasks = [];
    deleteKanbanBoard();
    localStorage.clear();
    tasks = backUpTasks;
    renderByCategory();
}

// defaultTasks sind hier dummy Werte zum testen
// die tatsächlichen defaultTasks werden jedesmal aus firebase geladen 
let defaultTasks = [{
    'id': 0,
    'category': 'todo',
    'title': 'Create Title of your task here...',
    'titleCategory': 'User Story',
    'description': 'Enter a description for your task',
    'priority': 'Medium',
    'assignedTo': ['Sophia Müller', 'Anton Maier'],
    'assignedInitials': ['SM', 'AM'],
    'assignedColorCodes': ['rgb(255, 122, 0)', 'rgb(31, 215, 193)'],
    'subtasks': ['start 1st Dialog', 'create 1st subtask'],
    'subtasksSelected': ['checked', 'unchecked'],
    'dueDate': '28/08/2024'
},
{
    'id': 1,
    'category': 'inProgress',
    'title': '2nd Title of your task here...',
    'titleCategory': 'Technical Task',
    'description': '2nd Description',
    'priority': 'Urgent',
    'assignedTo': ['Anton Maier'],
    'assignedInitials': ['AM'],
    'assignedColorCodes': ['rgb(31, 215, 193)'],
    'subtasks': ['start 2nd Dialog', 'create 2nd subtask'],
    'subtasksSelected': ['checked', 'checked'],
    'dueDate': '28/08/2024'
}
];

/////////////////// START: contactBook feature //////////////////
let contactBook = [
    { firstName: 'Sophia', lastName: 'Müller', initials: '', colorCode: '' },
    { firstName: 'Anton', lastName: 'Mayer', initials: '', colorCode: '' },
    { firstName: 'Anja', lastName: 'Schulz', initials: '', colorCode: '' },
    { firstName: 'Benedikt', lastName: 'Ziegler', initials: '', colorCode: '' },
    { firstName: 'David', lastName: 'Eisenberg', initials: '', colorCode: '' },
    { firstName: 'Clara', lastName: 'Müller', initials: '', colorCode: '' },
    { firstName: 'Erik', lastName: 'Wagner', initials: '', colorCode: '' },
];

function writeNameInitialsInContactBook() {
    for (let i = 0; i < contactBook.length; i++) {
        let initial = contactBook[i].firstName.charAt(0) + contactBook[i].lastName.charAt(0);
        contactBook[i].initials = initial;
    }
}

function writeColorCodeInContactBook() {
    let colorCodes = ['rgb(255, 122, 0)', 'rgb(31, 215, 193)', 'rgb(70, 47, 138)', 'rgb(252, 113, 255)', 'rgb(110, 82, 255)', 'rgb(0, 190, 232)', 'rgb(110, 82, 255)', 'rgb(255, 187, 43)', 'rgb(147, 39, 255)', 'rgb(255, 70, 70)'];
    let colorCount = 0;
    for (let i = 0; i < contactBook.length; i++) {
        contactBook[i].colorCode = colorCodes[colorCount];
        colorCount++
        if (colorCount == colorCodes.length) colorCount = 0;
    }
}

function unRenderContactsInDialog() {
    document.getElementById('contactSelectionId').innerHTML = '';
    document.getElementById('contactSelectionBoxId').classList.add('d-none');
}

function renderContactsInDialog() {
    unRenderContactsInDialog();
    writeNameInitialsInContactBook();
    writeColorCodeInContactBook();
    for (let i = 0; i < contactBook.length; i++) {
        document.getElementById('contactSelectionId').innerHTML += `
    <div class="contact-row">
    <div class="contact-row">
        <div class="contact-initials" id="assignedInitial${i}" style="background-color: ${contactBook[i].colorCode} !important">${contactBook[i].initials}</div>
        <div class="contact-name" id="assignedContactName${i}">${contactBook[i].firstName} ${contactBook[i].lastName}</div>
    </div>    
        <input type="checkbox" onclick="updateAssignedContacts()" id="contactCheckbox${i}" unchecked></input>
    </div>
    `;
    }
}

function makeContactsVisible() {
    document.getElementById('contactSelectionBoxId').classList.remove('d-none');
    document.getElementById('contactSelectionBoxId').classList.remove('d-none');
}

function populateAssigneeSelect() {
    const selectElement = document.getElementById('assignee-select');
    contactBook.forEach(contact => {
        const option = document.createElement('option');
        option.value = `${contact.firstName} ${contact.lastName}`;
        option.textContent = `${contact.firstName} ${contact.lastName}`;
        selectElement.appendChild(option);
    });
}
/////////////////// END: contactBook feature //////////////////

let backUpTasks = defaultTasks;
let tasks = [];
let count = tasks.length;
let currentDialogTask = [];
let currentDraggedElement;
let currentDraggedCategory;

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
        if (tasks[i].category) {
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

/* TEST improved updateKanbanBoard Funktion: */
function updateKanbanBoard(i, category) {
    let kanbanDetails = [
        tasks[i].id,
        tasks[i].category, // todo, awaitFeddback, etc
        tasks[i].title,
        tasks[i].titleCategory, // user story or technical task
        tasks[i].description,
        tasks[i].priority,
        tasks[i].assignedTo,
        tasks[i].assignedInitials,
        tasks[i].assignedColorCodes,
        tasks[i].subtasks,
        tasks[i].subtasksSelected,
        tasks[i].dueDate
    ];
    /* console.log('kanbanDetailsAsJson :' + kanbanDetails);
    let kanbanDetailsAsJson = JSON.stringify(kanbanDetails); */

    // Background color based on titleCategory
    let bgColorClass = '';
    if (tasks[i].titleCategory === 'User Story') {
        bgColorClass = 'user-story';
    } else if (tasks[i].titleCategory === 'Technical Task') {
        bgColorClass = 'technical-task';
    }

    // Priority class
    let priorityClass = '';
    if (tasks[i].priority === 'Urgent') {
        priorityClass = 'task-priority-urgent';
    } else if (tasks[i].priority === 'Medium') {
        priorityClass = 'task-priority-medium';
    } else if (tasks[i].priority === 'Low') {
        priorityClass = 'task-priority-low';
    }

    document.getElementById(category).innerHTML +=
        `<div onclick='openDialogFromCardClick(${i})' class="task-container" draggable="true" ondragstart="startDragging(${tasks[i].id})">
                <div class="task-titlecategory ${bgColorClass}">${tasks[i].titleCategory}</div>
                <div class="task-title">${tasks[i].title}</div>
                <div class="task-description">${tasks[i].description}</div>
                <div class="task-subtask">
                    <div class="progress-section in-parallel">
                        <div class="progress-bar">
                            <div id="relativeProgressBoardId${i}" class="relative-progress"></div>
                        </div>
                        <div id="progressSectionBoardId${i}" class="progress-fraction">subs?</div>
                    </div>
                </div>
                <div class="in-parallel">
                    <div class="card-members" id="kanbanMembersId${i}"></div>
                    <div class="task-priority ${priorityClass}">_</div>
                </div>
            </div>`;

    // Update members on kanban-board
    if (tasks[i].assignedInitials && tasks[i].assignedInitials.length > 0) {
        for (let j = 0; j < tasks[i].assignedInitials.length; j++) {
            document.getElementById('kanbanMembersId' + i).innerHTML += `
                <div class="task-assignee" style="background-color: ${tasks[i].assignedColorCodes[j]} !important;">${tasks[i].assignedInitials[j]}</div>
                `;
        }
    }

    // render amount of done subtasks in respective to total subtasks, example: 1 / 3 subtasks
    let numberAllSubtasks = tasks[i].subtasks.length;
    let doneSubtasks = tasks[i].subtasksSelected.filter(value => value === 'checked').length;
    let progressbarPercentage = (doneSubtasks / numberAllSubtasks) * 100;

    if (tasks[i].subtasks.length > 1) {
        document.getElementById('progressSectionBoardId' + i).innerText = doneSubtasks + '/' + numberAllSubtasks + ' subtasks';
    } else document.getElementById('progressSectionBoardId' + i).innerText = doneSubtasks + '/' + numberAllSubtasks + ' subtask';
    document.getElementById('relativeProgressBoardId' + i).style.width = progressbarPercentage + '%';
}

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
// TODO: Fehlende Werte ergänzen (nicht nur Titel)
function refreshDialogDetails() {
    unRenderContactsInDialog();
    unclickAllPrioButtons();
    document.getElementById('title-text').innerHTML = 'add in new title';
    document.getElementById('subtitle-text').innerHTML = 'add new description'; // Clearing description for new task
    document.getElementById('story-category-select').value = 'User Story'; // Default value
    document.getElementById('subtasksId').innerHTML = '';
}

// saveDialogToBoard
function saveDialogToBoard() {
    if (currentDialogTask.length === 0) return;

    // Hole aktuelle Werte aus dem Dialog und speichere sie
    const updatedTask = {
        ...currentDialogTask,
        title: document.getElementById('title-text').innerHTML,
        description: document.getElementById('subtitle-text').innerHTML,
        titleCategory: document.getElementById('story-category-select').value,
    };

    tasks.push(updatedTask);
    currentDialogTask = []; // Leere den aktuellen Dialog

    removeOverlay();
    renderByCategory(); // Stelle sicher, dass das Board aktualisiert wird
    saveBoardAsTasksToLocalStorage(); // Speichere die Änderungen lokal
}

//////////////////// START - SECTION: Open Dialog Card - //////////////////
/**
 * This function resets all dialog inputFields for a VOID dialogCard
 */
function resetVoidDialogVisuals() {
    addOverlay();
    renderContactsInDialog();
    pressEditInDialog();
    unclickAllPrioButtons();
    unRenderDialogOkButton()

    document.getElementById('title-text').innerText = 'Create a NEW Title';
    document.getElementById('subtitle-text').innerText = 'Create a NEW description...';
    document.getElementById('due-date-text').innerText = getToday();
    document.getElementById('story-category-text').innerText = 'User Story';
    document.getElementById('subtasksId').innerHTML = '';
    document.getElementById('cardMembersId').innerHTML = '';
}

/**
 * This function returns today's date in the format yyyy/mm/dd.
 * @returns {string} The formatted date string in the format "yyyy/mm/dd".
 */
function getToday() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    return formattedDate = `${year}/${month}/${day}`;
}

/**
 * This function resets all dialog inputFields for a CLICKED kanbanCard
 */
function resetClickedDialogVisuals() {
    unRenderDialogOkButton()
    addOverlay();
    renderContactsInDialog();
    makeContactsVisible();
    makeSubtasksVisible();
    addSubtaskInputField();

    document.getElementById('cardMembersId').innerHTML = '';
    document.getElementById('title-text').innerText = currentDialogTask[0].title;
    document.getElementById('subtitle-text').innerText = currentDialogTask[0].description;
    document.getElementById('due-date-text').innerText = currentDialogTask[0].dueDate;
    document.getElementById('story-category-text').innerText = currentDialogTask[0].titleCategory;
    if (document.getElementById('story-category-text').innerText == 'Technical Task') document.getElementById('story-category-container').style.backgroundColor = "#20c997";
    else document.getElementById('story-category-container').style.backgroundColor = "#007bff";

    switch (currentDialogTask[0].priority) {
        case ('Low'): prioLowClick(); break;
        case ('Medium'): prioMediumClick(); break;
        case ('Urgent'): prioUrgentClick(); break;
    }
    // Update members on dialog from card click
    if (currentDialogTask[0].assignedInitials && currentDialogTask[0].assignedInitials.length > 0) {
        for (let j = 0; j < currentDialogTask[0].assignedInitials.length; j++) {
            document.getElementById('cardMembersId').innerHTML += `
                    <div class="task-assignee" style="background-color: ${currentDialogTask[0].assignedColorCodes[j]} !important;">${currentDialogTask[0].assignedInitials[j]}</div>
                    `;
            for (let i = 0; i < contactBook.length; i++) {
                if (contactBook[i].initials == currentDialogTask[0].assignedInitials[j]) {
                    document.getElementById('contactCheckbox' + i).checked = true;
                }
            }
        }
    }
}

function openDialogFromCardClick(i) {
    currentDialogTask = new Array;
    currentDialogTask = [{
        'id': tasks[i].id,
        'category': tasks[i].category,
        'title': tasks[i].title,
        'titleCategory': tasks[i].titleCategory,
        'description': tasks[i].description,
        'priority': tasks[i].priority,
        'assignedTo': tasks[i].assignedTo,
        'assignedInitials': tasks[i].assignedInitials,
        'assignedColorCodes': tasks[i].assignedColorCodes,
        'subtasks': tasks[i].subtasks,
        'subtasksSelected': tasks[i].subtasksSelected,
        'dueDate': tasks[i].dueDate,
    }];
    resetClickedDialogVisuals();
}

/**
 * Onclick Plus-Symbol in KanbanBoard, this function generates a new dialogCard
 * @param {string} inputCategory 
 */
function openDialog(inputCategory) {
    currentDialogTask = new Array;
    currentDialogTask = [{
        'id': Math.max(...getIdsFromTasks()) + 1, //tasks.length,
        'category': inputCategory,
        'title': 'Create a NEW Title',
        'titleCategory': 'User Story',
        'description': 'Create a NEW description...',
        'priority': 'Low',
        'assignedTo': [],
        'assignedInitials': [],
        'assignedColorCodes': [],
        'subtasks': ['no subtasks added yet'],
        'subtasksSelected': ['unchecked'],
        'dueDate': '',
    }];
    resetVoidDialogVisuals();

    for (let i = 0; i < currentDialogTask[0].subtasks.length; i++) {
        document.getElementById('subtasksId').innerHTML += `
        <li id="subtask${i}">
            <input onclick="readCheckMark(${i})" type="checkbox" id="selectedSubtaskId${i}" ${currentDialogTask[0].subtasksSelected[i]}></input>
            <input onclick="remindEventListener(${i})" type="inputField" id="subtaskId${i}" placeholder="..." class="subtask-input"></input>      
        </li>`;
        readCheckMark(i);
        remindEventListener(i);
    }
}

function remindEventListener(i) {
    document.getElementById('subtaskId' + i).addEventListener('blur', function (event) {
        let boxStatus = document.getElementById('selectedSubtaskId' + i).checked;
        let inputString = document.getElementById('subtaskId' + i).value;
        console.log('box: ' + boxStatus + ' ---- value: ' + inputString);
        currentDialogTask[0].subtasks[i] = inputString;
    });
}

function readCheckMark(i) {
    let boxStatus = document.getElementById('selectedSubtaskId' + i).checked;
    if (boxStatus == false) currentDialogTask[0].subtasksSelected[i] = 'unchecked';
    else if (boxStatus == true) currentDialogTask[0].subtasksSelected[i] = 'checked';
    console.log(boxStatus);
}

function readStoryCategory() {
    let storyCategory = document.getElementById('story-category-select').value;
    currentDialogTask[0].titleCategory = storyCategory;
}

function readTitleInput() {
    let title = document.getElementById('title-text').innerText;
    currentDialogTask[0].title = title;
}

function readDescriptionInput() {
    let description = document.getElementById('subtitle-text').innerText;
    currentDialogTask[0].description = description;
}

function readDateInput() {
    let dueDate = document.getElementById('due-date-input').value;
    if (dueDate != '') currentDialogTask[0].dueDate = dueDate;
    else currentDialogTask[0].dueDate = document.getElementById('due-date-text').innerText;
}

function addOverlay() {
    document.getElementById('overlay').classList.remove('d-none');
}

function removeOverlay() {
    document.getElementById('overlay').classList.add('d-none');
}

function makeSubtasksVisible() {
    document.getElementById('subtasksId').classList.remove('d-none');
}

function pressEditInDialog() {
    makeContactsVisible();
    makeSubtasksVisible();
    readStoryCategory();
    readTitleInput();
    readDescriptionInput();
    readDateInput();
}

function renderDialogOkButton() {
    document.getElementById('okButtonId').classList.remove('d-none');
}

function unRenderDialogOkButton() {
    document.getElementById('okButtonId').classList.add('d-none');
}

function pressOkInDialog() {
    saveDialogCardToTasks();
}

function updateAssignedContacts() {
    let selectedContacts = []; // these contacts shall be included to kanban card
    let selectedInitials = [];
    let colorCodesRgb = [];
    let backgroundColor;

    // clean out all assigned members on dialogCard and kanbanCard before rendering;
    document.getElementById('cardMembersId').innerHTML = '';
    // document.getElementById('kanbanMembersId').innerHTML = '';

    for (let i = 0; i < contactBook.length; i++) {
        if (document.getElementById('contactCheckbox' + i).checked) {
            let selectedContact = document.getElementById('assignedContactName' + i).innerText;
            let selectedInitial = document.getElementById('assignedInitial' + i).innerText;
            console.log(selectedContact);
            selectedContacts.push(selectedContact);
            selectedInitials.push(selectedInitial);

            let element = document.getElementById('assignedInitial' + i);
            let computedStyle = window.getComputedStyle(element);
            backgroundColor = computedStyle.backgroundColor;
            colorCodesRgb.push(backgroundColor);
        }
    }

    currentDialogTask[0]['assignedTo'] = selectedContacts;
    currentDialogTask[0]['assignedInitials'] = selectedInitials;
    currentDialogTask[0]['assignedColorCodes'] = colorCodesRgb;

    for (let i = 0; i < selectedInitials.length; i++) {
        // update on dialog-card
        document.getElementById('cardMembersId').innerHTML += `
         <div class="task-assignee" style="background-color: ${currentDialogTask[0].assignedColorCodes[i]} !important;">
         ${currentDialogTask[0].assignedInitials[i]}</div>
         `;
    }
    console.log(selectedContacts);
    console.log(selectedInitials);
    console.log(colorCodesRgb);
}

function pressXInDialog() {
    removeOverlay();
    renderByCategory();
}
// old save function 
/* function saveDialogCardToTasks(){
    pressEditInDialog();
    // case: id of Dialog not in tasks yet => push Card from openDialog to tasks
    if(!tasks[id].includes(currentDialogTask[0].id)) tasks.push(currentDialogTask[0]);
    // case: id of Dialog already in tasks => save currentDialog Card at the right position in tasks
    else tasks[currentDialogTask[0].id] = currentDialogTask[0];
    removeOverlay();
    renderByCategory();
    // empty currentDialogTask completely
    currentDialogTask = new Array;
} */

/**
 * Returns an array with all task IDs.
 * 
 * @returns {Array} An array containing all task IDs.
 */
function getIdsFromTasks() {
    let existingIds = [];
    for (let i = 0; i < tasks.length; i++) {
        existingIds.push(tasks[i].id);
    }
    return existingIds;
}


// new save function
function saveDialogCardToTasks() {
    pressEditInDialog();

    let existingIds = getIdsFromTasks();
    // if the id of the dialogCard is not in tasks yet => push Card from openDialog to tasks
    if (!existingIds.includes(currentDialogTask[0].id)) {
        tasks.push(currentDialogTask[0]);
    }
    // case: id of Dialog already in tasks => save currentDialog Card at the right position in tasks
    // dort, wo currentDialogTask[0].id == Index of(existingIds) ist muss in task der Wert currentDialogTask[0] zugewiesen werden
    else {
        let position = getIdsFromTasks().indexOf(currentDialogTask[0].id);
        console.log('Position in tasks: ' + position);
        tasks[position] = currentDialogTask[0];
    }
    
    removeOverlay();
    renderByCategory();
    // empty currentDialogTask completely
    currentDialogTask = new Array;
}

/* let newTasks = []; */
function pressDeleteInDialog() {
    let newTasks = [];
    //id von currentDialog in tasks suchen
    for (let i = 0; i < tasks.length; i++) {
        if (currentDialogTask[0].id == tasks[i].id) {
            continue;
            //tasks.splice(currentDialogTask[0].id,1);
        }
        else newTasks.push(tasks[i]);
    }
    tasks = new Array;
    tasks = newTasks;
    newTasks = [];

    unRenderContactsInDialog();
    unclickAllPrioButtons();
    removeOverlay();

    renderByCategory();
}
//////////////////// END - SECTION: Open Dialog Card - //////////////////

function switchOnOffMinimenue1() {
    if (document.getElementById('miniMenue1').classList.contains('d-none')) {
        document.getElementById('miniMenue1').classList.remove('d-none');
    }
    else document.getElementById('miniMenue1').classList.add('d-none');
}


