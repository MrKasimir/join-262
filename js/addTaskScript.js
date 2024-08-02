// Array zur Speicherung der Priorität
let selectedPriorities = [];

// Funktion zum Setzen der Priorität
function setPriority(priority) {
    // Leeren des Arrays, um nur die aktuell ausgewählte Priorität zu speichern
    selectedPriorities = [priority];

    // Entfernen der 'selected' Klasse von allen Buttons
    const priorityButtons = document.querySelectorAll('.addTask-button');
    priorityButtons.forEach(button => {
        button.classList.remove('selected');
    });

    // Hinzufügen der 'selected' Klasse zum gedrückten Button
    const activeButton = document.querySelector(`.addTask-button[data-priority="${priority}"]`);
    if (activeButton) {
        activeButton.classList.add('selected');
    }

    console.log('Aktuelle Priorität:', selectedPriorities);
}

// Hinzufügen der Event-Listener zu den Buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.addTask-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const priority = this.getAttribute('data-priority'); // Erhält die Priorität von data-priority
            setPriority(priority);
        });
    });
});

// Funktion zum Erstellen neuer Aufgaben
// Funktion zum Erstellen neuer Aufgaben
function PostUserTasks() {
    // Überprüfen, ob eine Priorität ausgewählt wurde und den Default-Wert 'medium' setzen
    const priority = selectedPriorities.length > 0 ? selectedPriorities[0] : 'medium';

    // Auslesen der Werte aus den Eingabefeldern
    const assignedTo = document.getElementById('Task-choose-contact-id').value;
    const titleCategory = document.getElementById('Task-choose-Category-id').value; // Kategorie auslesen
    const category = document.getElementById('Task-choose-Category-id').value; // Kategorie auslesen

    const newTask = {
        'id': tasks.length, // Zuweisung einer neuen ID basierend auf der aktuellen Länge des tasks-Arrays
        'category': category,
        'title': document.getElementById('Task-Title-id').value,
        'titleCategory': titleCategory, // Kategorie-Wert setzen
        'description': document.getElementById('Task-Describtion-id').value,
        'priority': priority, // Setzen der Priorität aus dem selectedPriorities-Array
        'assignedTo': assignedTo, // Setzen des Werts aus dem Assigned To-Feld
        'subtasks': document.getElementById('Task-Subtask-Id').value ? 1 : 0 // Assuming 1 if there is a subtask, otherwise 0
    };

    tasks.push(newTask); // Fügen Sie die neue Aufgabe dem vorhandenen Array hinzu
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Aktualisieren Sie das vorhandene 'tasks'-Array im lokalen Speicher
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

// Funktion zum Löschen von Aufgaben aus dem lokalen Speicher
function clearTasks() {
    localStorage.removeItem('tasks');
}

// Löschen Sie das Aufgaben-Array im lokalen Speicher, wenn der Benutzer sich abmeldet
function logout() {
    clearTasks();
    // Fügen Sie hier Ihre Abmelde-Logik hinzu, z. B. Weiterleitung zu einer Anmeldeseite
    window.location.href = './login.html';
}

// Löschen Sie das Aufgaben-Array im lokalen Speicher, wenn die Webseite geschlossen wird
window.addEventListener('beforeunload', (event) => {
    clearTasks();
});
