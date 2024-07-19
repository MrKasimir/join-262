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

let currentDraggedElement;
let currentDraggedCategory;
let addedId = tasks.length - 1;



// Ein Array für jede Kategorie erstellen
// ein seperates array für alle  "todo - Karten", alle "in progress - Karten", alle "await feedback - Karten"
function renderByCategory() {
    deleteKanbanBoard();
    for (let i = 0; i < tasks.length; i++) {
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
    /*     tasks[id].category = 'done';
        deleteKanbanBoard();
        renderByCategory(); */
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


// Task mit InputField hinzufügen:
// Event-Listener Funktion für Enter-Taste
document.addEventListener('DOMContentLoaded', (event) => {
    function createTask() {
        let task = document.getElementById('inputField').value;
        // Überprüfen, ob das Input-Feld nicht leer ist
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
            }
            )
        }
        deleteKanbanBoard();
        renderByCategory();
    }
    // Event-Listener für die Enter-Taste hinzufügen
    document.getElementById('inputField').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            createTask();
        }
    });
});

// normale "onclick"-ausführbare Funktion
function createTask() {
    let task = document.getElementById('inputField').value;
    // Überprüfen, ob das Input-Feld nicht leer ist
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
        }
        )
    }
    deleteKanbanBoard();
    renderByCategory();
}

// folgender Abschnitt muss komplett in CLEAN CODE REVIEW
// nächster Schritt: Empty Categories rendern
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

///////////////////////////////
// START TEST AREA FOR FIREBASE

const BASE_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";
const userID = "UserID_2";

async function saveTasksToFirebase() {
    try {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const taskPath = `${BASE_URL}User/${userID}_Tasks_TaskId_${task.id}.json`;

            console.log('Saving task to Firebase at path:', taskPath);

            const response = await fetch(taskPath, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok for ${taskPath}: ${response.statusText}`);
            }

            console.log(`Task saved successfully: ${task.id}`);
        }
    } catch (error) {
        console.error('Error saving tasks to Firebase:', error);
    }
}

async function loadTasksFromFirebase() {
    try {
        const loadedTasks = [];

        // hope we never have more than 50 tasks
        for (let i = 0; i < 50; i++) {
            const taskPath = `${BASE_URL}User/${userID}_Tasks_TaskId_${i}.json`;
            console.log('Fetching data from Firebase at path:', taskPath);

            const response = await fetch(taskPath);
            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`Task ${i} not found`);
                    // Continue with next ID, if task can't be found
                    continue;
                }
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            if (data) {
                loadedTasks.push(data);
                console.log('Task loaded from Firebase:', data);
            }
        }
        tasks = loadedTasks;
    } catch (error) {
        console.error('Error loading tasks from Firebase:', error);
    }
}

///////////////////////////////
// TEST AREA END