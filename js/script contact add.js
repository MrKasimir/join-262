const BASE_URL = "https://join-262-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formStructure');
    form.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
    event.preventDefault();
    let submitButton = event.target.querySelector("button[type='submit']");
    submitButton.disabled = true;  // Deaktiviere den Button

    let name = document.getElementById("inputFieldContactFormName").value;
    let email = document.getElementById("inputFieldContactFormEmail").value;
    let number = document.getElementById("inputFieldContactFormNumber").value;
    let image = document.getElementById("profilImg").src; // Stelle sicher, dass die ID korrekt ist

    saveContactInfo(name, email, number, image).then(() => {
        submitButton.disabled = false;  // Aktiviere den Button wieder
        event.target.reset();  // Formular zurücksetzen
    });
}

async function saveContactInfo(name, email, number, image) {
    const user = JSON.parse(localStorage.getItem('loggedinUser'));
    if (!user || !user.UserID) {
        alert("Nicht angemeldet oder Benutzer-ID fehlt!");
        return;
    }
    const userId = user.UserID;
    const apiUrl = `${BASE_URL}User/${userId}/contacts.json`;

    const contactData = {
        name,
        email,
        number,
        image
    };

    try {
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        console.log('Data successfully saved:', data);
        alert("Kontakt erfolgreich gespeichert!");
        displayProfileValues(); // Update contact list display
    } catch (error) {
        console.error('Error saving contact:', error);
        alert("Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.");
    }
}

// Funktion, um einen Kontakt zu löschen
async function deleteContact(contactId) {
    const user = JSON.parse(localStorage.getItem('loggedinUser'));
    if (!user || !user.UserID) {
        alert("Nicht angemeldet oder Benutzer-ID fehlt!");
        return;
    }
    const userId = user.UserID;
    const apiUrl = `${BASE_URL}User/${userId}/contacts/${contactId}.json`;

    try {
        let response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Data successfully deleted');
        alert("Kontakt erfolgreich gelöscht!");
        displayProfileValues(); // Aktualisiere die Liste nach dem Löschen
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert("Fehler beim Löschen des Kontakts. Bitte versuchen Sie es erneut.");
    }
}

// Funktion, um alle Kontakte für den angemeldeten Benutzer anzuzeigen
async function displayProfileValues() {
    const user = JSON.parse(localStorage.getItem('loggedinUser'));
    if (!user || !user.UserID) {
        alert("Nicht angemeldet oder Benutzer-ID fehlt!");
        return;
    }
    const userId = user.UserID;
    const apiUrl = `${BASE_URL}User/${userId}/contacts.json`;

    try {
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        console.log('Contacts loaded:', data);
        // Hier müsstest du noch Code hinzufügen, um die Kontakte in deinem UI darzustellen
    } catch (error) {
        console.error('Error loading contacts:', error);
        alert("Fehler beim Laden der Kontakte.");
    }
}
