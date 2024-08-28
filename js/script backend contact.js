const BASE_URL = "https://test-join-8aa59-default-rtdb.europe-west1.firebasedatabase.app/";

// Funktion zum Laden der Profilwerte aus Firebase
function loadProfileValues() {
    return fetch(`${BASE_URL}/contacts.json`)
    .then(response => response.json())
    .then(data => {
        profilValues = Object.keys(data || {}).map(key => ({
            ...data[key],
            id: key
        }));
        console.log('Loaded profile values:', profilValues);
        displayContacts(profilValues); // Stelle sicher, dass du eine Funktion hast, die die Kontakte anzeigt
    })
    .catch(error => console.error('Error loading profiles:', error));
}

// Funktion zum Speichern neuer Profilwerte in Firebase
function saveProfileValues() {
    let image = document.getElementById("profilImg").src;
    let name = document.getElementById("inputFieldContactFormName").value;
    let email = document.getElementById("inputFieldContactFormEmail").value;
    let number = document.getElementById("inputFieldContactFormNumber").value;

    const contactData = { name, email, number, image };

    fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Profile saved:', data);
        loadProfileValues(); // Nach dem Speichern die Kontaktliste neu laden
    })
    .catch(error => console.error('Failed to save profile values:', error));
}

// Funktion zum Löschen eines Profils in Firebase
function deleteProfile(index) {
    const key = profilValues[index].id;
    fetch(`${BASE_URL}/contacts/${key}.json`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log("Profile deleted successfully!");
            loadProfileValues(); // Kontaktliste nach dem Löschen neu laden
        }
    })
    .catch(error => {
        console.error("Failed to delete profile:", error);
        alert("Failed to delete profile: " + error.message);
    });
}

// Funktion zum Anzeigen der Kontakte auf der Webseite
function displayContacts(contacts) {
    const contactListElement = document.getElementById('contactList');
    contactListElement.innerHTML = ''; // Liste leeren
    contacts.forEach(contact => {
        const li = document.createElement('li');
        li.textContent = `${contact.name} - ${contact.email} - ${contact.number}`;
        contactListElement.appendChild(li);
    });
}

// Event-Listener für das Formular
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    saveProfileValues();
});

// Stellt sicher, dass die Profildaten beim Laden der Seite aus Firebase abgerufen werden
window.onload = loadProfileValues;


//------------------------------ Nicht ganz klar - vergessen zu Löschen - Ende ------------------------------


//----------------- Kein Backend/Speicherungen ------------------//

// Möglichkeit Bilder hochzuladen
function previewImage() {
    var file = document.getElementById('imageInput').files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        document.getElementById('profilImg').src = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.getElementById('profilImg').src = "";
    }
}
