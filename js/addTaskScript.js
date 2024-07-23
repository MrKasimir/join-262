
// Fetch the existing tasks array from local storage, or initialize it as an empty array if it doesn't exist

function PostUserTasks() {
    const newTask = {
        'id': tasks.length, // Assign a new ID based on the current length of the tasks array
        'category': 'todo',
        'title': document.getElementById('Task-Title-id').value,
        'titleCategory': document.getElementById('Task-choose-Category-id').value,
        'description': document.getElementById('Task-Describtion-id').value,
        'priority': 'medium', // Assuming 'medium' is a constant value for priority
        'assignedTo': document.getElementById('Task-choose-contact-id').value,
        'subtasks': document.getElementById('Task-Subtask-Id').value ? 1 : 0 // Assuming 1 if there is a subtask, otherwise 0
    };

    tasks.push(newTask); // Add the new task to the existing array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update the existing 'tasks' array in local storage
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

// Add Tasks to Board & to local storage => now in kanban-script.js
/* function CreatTaskbuttonOnclick() {
    addTaskToLocalStorage();
    window.location.href = './kanban-board.html';
} */

function init() {
    PostUserTasks();
}

// Function to clear tasks from local storage
function clearTasks() {
    localStorage.removeItem('tasks');
}

// Clear local storage tasks array when the user logs out
function logout() {
    clearTasks();
    // Add your logout logic here, like redirecting to a login page
    window.location.href = './login.html';
}

// Clear local storage tasks array when the webpage is closed
window.addEventListener('beforeunload', (event) => {
    clearTasks();
});