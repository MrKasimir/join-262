const Base_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

// Abrufen des eingeloggten Benutzers aus dem Local Storage
window.loggedinUser = JSON.parse(localStorage.getItem('loggedinUser')) || null;

if (window.loggedinUser && window.loggedinUser.length > 0) {
    console.log("Eingeloggter Benutzer:", window.loggedinUser[0]);
} else {
    console.log("Kein Benutzer eingeloggt.");
}

function PostUserTasks() {
    if (window.loggedinUser && window.loggedinUser.length > 0 && window.loggedinUser[0].id) {
        const userId = window.loggedinUser[0].UserID;
        const id = window.loggedinUser[0].id;

        postData(`User/${userId}/${id}/task`, {
            title: document.getElementById('Task-Title-id').value,
            description: document.getElementById('Task-Describtion-id').value,
            contact: document.getElementById('Task-choose-contact-id').value,
            date: document.getElementById('Task-Date-Id').value,
            category: document.getElementById('Task-choose-Category-id').value,
            subtask: document.getElementById('Task-Subtask-Id').value
        });
    } else {
        console.log("Kein eingeloggter Benutzer gefunden. Aufgabe kann nicht gepostet werden.");
    }
}

async function postData(path = "", data = {}) {
    try {
        let response = await fetch(Base_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        let responsetoJson = await response.json();
        return responsetoJson;
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
    }
}

async function fetchUserData() {
    if (window.loggedinUser && window.loggedinUser.length > 0 && window.loggedinUser[0].id) {
        const userId = window.loggedinUser[0].UserID;

        try {
            let response = await fetch(Base_URL + `User/${userId}.json`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            let data = await response.json();
            console.log("Benutzerdaten:", data);
            return data;
        } catch (error) {
            console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        }
    } else {
        console.log("Kein eingeloggter Benutzer gefunden. Benutzerdaten können nicht abgerufen werden.");
    }
}

function CreatTaskbuttonOnclick() {
    PostUserTasks();
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