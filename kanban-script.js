// Task mit InputField hinzufügen:
// Event-Listener Funktion für Enter-Taste
document.addEventListener('DOMContentLoaded', (event) => {
    function createTask() {
        let task = document.getElementById('inputField').value;
        // Überprüfen, ob das Input-Feld nicht leer ist
        if (task.trim() !== '') {
            todo.innerHTML += `<div class="task-container" draggable="true">${task}</div>`;
            // Leeren des Input-Feldes
            document.getElementById('inputField').value = '';
        }
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
        todo.innerHTML += `<div class="task-container" draggable="true">${task}</div>`;
        // Leeren des Input-Feldes
        document.getElementById('inputField').value = '';
    }
}

// Task drag & dropbar machen:
