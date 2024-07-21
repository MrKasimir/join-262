// Script Add Task.js

const BASE_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

let addedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

function PostUserTasks() {
    postData("User/UserID_1", {
        title: document.getElementById('Task-Title-id').value,
        description: document.getElementById('Task-Describtion-id').value,
        contact: document.getElementById('Task-choose-contact-id').value,
        date: document.getElementById('Task-Date-Id').value,
        category: document.getElementById('Task-choose-Category-id').value,
        subtask: document.getElementById('Task-Subtask-Id').value
    });
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function fetchUserData() {
    let response = await fetch(BASE_URL + "User/UserID_1" + ".json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    let data = await response.json();
    console.log("User Data:", data);
    return data;
}

// Beispiel für das Speichern eines Benutzers im Local Storage
function saveLoggedinUser(userId, email, name, id) {
    const user = {
        UserID: userId,  // Achten Sie darauf, dass die UserID hier "UserID" ist
        Email: email,
        Name: name,
        id: id  // Die spezifische ID des Benutzers
    };
    localStorage.setItem('loggedinUser', JSON.stringify([user]));  // Speichern Sie das Array im Local Storage
    window.loggedinUser = [user];  // Setzen Sie window.loggedinUser auf das Array
}

function CreatTaskbuttonOnclick() {
    addTaskToLocalStorage();
    window.location.href = './kanban-board.html';
}


function addTaskToLocalStorage() {
    if (document.getElementById('Task-Title-id').value != '' && document.getElementById('Task-Describtion-id').value != '') {
        addedTasks.push({
            'title': document.getElementById('Task-Title-id').value,
            'description': document.getElementById('Task-Describtion-id').value,
            'assignedTo': document.getElementById('Task-choose-contact-id').value,
            'dueDate': document.getElementById('Task-Date-Id').value,
            'priority': '',
            'titleCategory': document.getElementById('Task-choose-Category-id').value,
            'subtasks': document.getElementById('Task-Subtask-Id').value,
        });
        localStorage.setItem('tasks', JSON.stringify(addedTasks));
        clearAllInputFields();
    }
}

function clearAllInputFields() {
    document.getElementById('Task-Title-id').value = '';
    document.getElementById('Task-Describtion-id').value = '';
    document.getElementById('Task-choose-contact-id').value = '';
    document.getElementById('Task-Date-Id').value = '';
    document.getElementById('Task-choose-Category-id').value = '';
    document.getElementById('Task-Subtask-Id').value = '';
}