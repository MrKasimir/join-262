<<<<<<< HEAD
// Lädt vorhandene Profildaten aus dem Local Storage oder initialisiert ein leeres Array
let profilValues = loadProfileValues() || []; 
function loadBoardFromLocalStorage() {
    window.loggedinUser = JSON.parse(localStorage.getItem("loggedinUser")) || [];
    const boardTasks = localStorage.getItem('board');
    if (!boardTasks) {
        return [];
    } else {
        return JSON.parse(boardTasks);
    }
}
=======
onst BASE_URL = "https://test-join-8aa59-default-rtdb.europe-west1.firebasedatabase.app/";
>>>>>>> 9a4876414f95f76d6b7d4ce9c6124f9c56f9a1e1

// Lädt alle Profile direkt aus Firebase und stellt sie dar
function displayProfileValues() {
    const apiUrl = `${BASE_URL}contacts.json`;

    console.log("Fetching data from:", apiUrl); // Debug-Ausgabe

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Loaded data:", data); // Zeigt geladene Daten in der Konsole an

        if (!data) {
            console.log("No data received, check Firebase database structure.");
            return; // Wenn keine Daten vorhanden sind, beende die Funktion
        }

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        alphabet.split('').forEach(letter => {
            let section = document.getElementById(`contactListSection${letter}`);
            if (section) section.innerHTML = ''; // Bereinigt den aktuellen Inhalt
        });

<<<<<<< HEAD
    // Ruft Function auf, welches das Inputfeld leert
    clearInputFields();
}




// contacts api test
async function postContactData(contactData = {}) {
    const userId = window.loggedinUser.id;  // ID des eingeloggten Benutzers abrufen

    if (!userId) {
        console.error("Kein Benutzer ist eingeloggt!");
        return;
    }

    try {
        // Hole die höchste ContactID für den Benutzer
        let highestContactID = await fetchHighestContactID(userId);
        let newContactID = highestContactID + 1;  // Erzeuge eine neue, eindeutige ContactID

        const path = `User/${userId}/contacts/ContactID_${newContactID}`;
        let response = await fetch(Base_URL + path + ".json", {
            method: "PUT", // Verwende PUT, um an einem spezifischen Ort zu speichern
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contactData)
        });
        let responsetoJson = await response.json();
        return responsetoJson;
    } catch (error) {
        console.error("Error:", error);
    }

    // Beispiel für die Nutzung der Funktion:
const newContact = {
    Name: "John Doe",
    Email: "john.doe@example.com",
    Phone: "+123456789"
};

postContactData(newContact)
    .then(response => console.log("Kontakt hinzugefügt:", response))
    .catch(error => console.error("Fehler beim Hinzufügen des Kontakts:", error));
}
/* 
// ein bischen eine andere version musst mal schauen welche besser geht 

async function postContactData(contactData = {}) {
    const userId = window.loggedinUser.id;  // ID des eingeloggten Benutzers abrufen

    if (!userId) {
        console.error("Kein Benutzer ist eingeloggt!");
        return;
    }

    try {
        const path = `User/${userId}/contacts`;
        let response = await fetch(Base_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contactData)
        });
        let responsetoJson = await response.json();
        return responsetoJson;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Beispiel für die Nutzung der Funktion:
const newContact = {
    Name: "John Doe",
    Email: "john.doe@example.com",
    Phone: "+123456789"
};

postContactData(newContact)
    .then(response => console.log("Kontakt hinzugefügt:", response))
    .catch(error => console.error("Fehler beim Hinzufügen des Kontakts:", error));

 */








// Beispiel für die Nutzung der Funktion:
const newContact = {
    Name: "John Doe",
    Email: "john.doe@example.com",
    Phone: "+123456789"
};

postContactData(newContact)
    .then(response => console.log("Kontakt hinzugefügt:", response))
    .catch(error => console.error("Fehler beim Hinzufügen des Kontakts:", error));


// Speichert Werte im Local Storage
function saveProfileValues() {
    try {
        localStorage.setItem('profileValues', JSON.stringify(profilValues));
        console.log("Profile data saved to localStorage.");
    } catch (error) {
        console.error('Failed to save profile values:', error);
    }
}

// Ladet gespeicherte Werte wieder uas dem Local Storage
function loadProfileValues() {
    const data = localStorage.getItem('profileValues');
    return data ? JSON.parse(data) : [];
}

// Leers nach Submit wieder die Inputfelder und etzt das Bild auf den Standard zurück
function clearInputFields() {
    document.getElementById("inputFieldContactFormName").value = '';
    document.getElementById("inputFieldContactFormEmail").value = '';
    document.getElementById("inputFieldContactFormNumber").value = '';
    document.getElementById("profilImg").src = "../assets/img/placeholder contact img.png"; // Setzt das Bild auf den Standard zurück
}

// Stellt sicher, dass die Profildaten beim Laden der Seite aus dem Local Storage abgerufen werden
window.onload = function() {
    profilValues = loadProfileValues();
    console.log('Loaded profile values:', profilValues);
}


//--------------------------- Code für die Contact Add Page - Ende ---------------------------------------------

//------------------------------ Nicht ganz klar - vergessen zu Löschen - Start ------------------------------

// Löscht ein Kontakt Profil nach seinem Index
function deleteProfile(index) {
    if (index > -1 && index < profilValues.length) {
        profilValues.splice(index, 1);
        saveProfileValues();
        console.log("Profile at index", index, "deleted");
        alert("Profile deleted successfully!");
    } else {
        console.error("Invalid index", index);
        alert("Failed to delete profile: Invalid index.");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contactEditDelete').addEventListener('click', function() {
        deleteProfile(0); // Löscht das erste Profil im Array
=======
        for (const key in data) {
            const profile = data[key];
            let firstLetter = profile.name.charAt(0).toUpperCase();
            let container = document.getElementById(`contactListSection${firstLetter}`);
            if (container) {
                let profileDiv = document.createElement('div');
                profileDiv.classList.add('profile-entry');
                profileDiv.innerHTML = `
                    <div class="contactListProfilStructureSmall">
                        <div> <img class="contactListProfilImages" src="${profile.image || './assets/img/placeholder contact img.png'}"></div>
                        <div>
                            <ul>
                                <p class="contactListInfoText">${profile.name}</p>
                                <p class="contactListInfoTextEmail">${profile.email}</p>
                            </ul>
                        </div>
                    </div>
                `;
                container.appendChild(profileDiv);
                profileDiv.addEventListener('click', () => {
                    displayProfileValueInOverview({...profile, id: key});
                });
            }
        }
    })
    .catch(error => {
        console.error('Error loading contacts:', error);
        alert("Fehler beim Laden der Kontakte. Details: " + error.message);
>>>>>>> 9a4876414f95f76d6b7d4ce9c6124f9c56f9a1e1
    });
}

// Update displayProfileValueInOverview to handle Firebase keys
function displayProfileValueInOverview(profile) {
    currentDisplayedProfile = profile;
    let container = document.getElementById('contactPageProfilOverview');
    if (!container) {
        console.error('Container nicht gefunden');
        return;
    }

    container.innerHTML = `
        <div class="contactProfilInfosContainer">
            <img class="contactProfilImagebig" src="${profile.image || './assets/img/placeholder contact img.png'}" alt="Profilbild">
            <div>
                <p class="contactProfilInfosContainerNameStyle">${profile.name}</p>
                <div class="contactListContainerIconsandtext">
                    <div id="ContactListedit" onclick="editProfile()" class="ContactListeditAndDeleteIcons"><img class="contactListIconsSmall" src="./assets/img/edit icon.png" alt=""><p>Edit</p></div>
<div onclick="deleteContact('${profile.id}')" class="ContactListeditAndDeleteIcons">
    <img class="contactListIconsSmall" src="./assets/img/delete trash.png" alt=""><p>Delete</p>
</div>
                </div>
            </div>
        </div>
        <div class="contactListEmailNumberContainer">
            <p class="contactListEmailNumberGapEdit"> Contact Information</p>
            <p class="contactListEmailNumberGap"><b>Email:</b> <br>${profile.email}</p>
            <p class="contactListEmailNumberGap"><b>Phone:</b> <br>${profile.number}</p>
        </div>`;
    toggleContactView(true); // Zeigt die Kontaktinformationen an und verbirgt die Kontaktliste
}












// Funktion zum Editieren von Kontaktprofilen
function editProfile() {
    let container = document.getElementById('contactPageProfilOverview');
    container.innerHTML = `
        <form class="contactListHoleEditContainerForForm" onsubmit="saveEditedProfile(event);">
            <div class="contactProfilInfosContainer">
                <input type="file" id="imageInput" style="display: none;" accept="image/*" onchange="previewImage();">
                <label class="contactProfilImagebigEdit" for="imageInput">
                    <img class="contactProfilImagebig" src="${currentDisplayedProfile.image || './assets/img/placeholder contact img.png'}" alt="Profilbild" onclick="document.getElementById('imageInput').click();">
                </label>
                <div>
                    <p><b>Name:</b></p>
                    <input class="contactProfilEditInputfieldCss" type="text" minlength="3" maxlength="30" pattern="[A-Za-z ]+" id="editName" value="${currentDisplayedProfile.name}" class="editInput">
                </div>
            </div>
            <div class="contactListEmailNumberContainer">
                <p class="contactListEmailNumberGapEdit editText">Contact Information</p>
                <p class="contactListEmailNumberGap"><b>Email:</b></p>
                <input class="contactProfilEditInputfieldCss" type="email" minlength="3" maxlength="30" id="editEmail" value="${currentDisplayedProfile.email}" class="editInput">
                <p class="contactListEmailNumberGap"><b>Phone:</b></p>
                <input class="contactProfilEditInputfieldCss" type="number" min="100" max="999999999999999999999999999999" id="editNumber" value="${currentDisplayedProfile.number}" class="editInput">
                <div class="buttonContainerProfilOvervieEdit">
<button class="contactListOverviewButtonLeft" onclick="deleteContact('${currentDisplayedProfile.id}')">
    Delete <img src="./assets/img/close.png">
</button>

                    <button type="submit" class="contactListOverviewButtonRight">
                        Save <img src="./assets/img/check.png">
                    </button>
                </div>
            </div>
        </form>`;
}

// Funktion zum Speichern von Änderungen an einem Kontaktprofil in Firebase
function saveEditedProfile(event) {
    event.preventDefault(); // Verhindert das Standard-Formularabsenden
    let editedName = document.getElementById('editName').value;
    let editedEmail = document.getElementById('editEmail').value;
    let editedNumber = document.getElementById('editNumber').value;
    let editedImage = document.getElementById('imageInput').files[0] ? URL.createObjectURL(document.getElementById('imageInput').files[0]) : currentDisplayedProfile.image;

    const apiUrl = `${BASE_URL}contacts/${currentDisplayedProfile.id}.json`;
    const updatedData = { name: editedName, email: editedEmail, number: editedNumber, image: editedImage };

    fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        alert("Kontakt erfolgreich aktualisiert!");
        displayProfileValues(); // Aktualisiert die Liste auf der Hauptseite
    })
    .catch(error => {
        console.error('Error updating contact:', error);
        alert("Fehler beim Aktualisieren des Kontakts. Bitte versuchen Sie es erneut.");
    });
}

function deleteContact(key) {
    const apiUrl = `${BASE_URL}contacts/${key}.json`;

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        console.log('Data successfully deleted');
        alert("Kontakt erfolgreich gelöscht!");
        displayProfileValues(); // Aktualisiere die Liste nach dem Löschen
    })
    .catch(error => {
        console.error('Error deleting contact:', error);
        alert("Fehler beim Löschen des Kontakts. Bitte versuchen Sie es erneut.");
    });
}






















// Funktion zum Umschalten der Kontaktansicht in der mobilen Ansicht
function toggleContactView(showDetails) {
    const contactList = document.querySelector('.containerStructureListWidth');
    const contactDetails = document.querySelector('#contactPageProfilOverview');
    const backButton = document.querySelector('#backToContactList');
    const contactHeadline = document.querySelector('.contactListOverviewProfilHeadline');

    if (window.innerWidth <= 730) { // Prüft, ob die Bildschirmbreite unter 730px ist
        if (showDetails) {
            contactList.style.display = 'none';
            contactDetails.style.display = 'block';
            backButton.style.display = 'block'; // Zeigt den Zurück-Pfeil an
            contactHeadline.style.display = 'block'; // Zeigt die Profilüberschrift an
        } else {
            contactList.style.display = 'block';
            contactDetails.style.display = 'none';
            backButton.style.display = 'none'; // Verbirgt den Zurück-Pfeil
            contactHeadline.style.display = 'none'; // Verbirgt die Profilüberschrift, wenn die Kontaktliste angezeigt wird
        }
    }
}

// Event-Listener für den Zurück-Pfeil
document.getElementById('backToContactList').addEventListener('click', function() {
    toggleContactView(false);
});



function handleResize() {
    const contactList = document.querySelector('.containerStructureListWidth');
    const contactDetails = document.querySelector('#contactPageProfilOverview');
    const backButton = document.querySelector('#backToContactList');
    const contactHeadline = document.querySelector('.contactListOverviewProfilHeadline');

    if (window.innerWidth > 730) {
        // Stellt die Standardansicht für Desktop-Bildschirme wieder her
        contactList.style.display = 'block';
        contactDetails.style.display = 'block'; // Du kannst dies anpassen, falls nicht beide Elemente sichtbar sein sollen
        backButton.style.display = 'none';
        contactHeadline.style.display = 'block';
    } else {
        // Stellt sicher, dass der mobile Ansichtsmodus korrekt ist
        toggleContactView(currentDisplayedProfile !== null);
    }
}

// Fügt den Event Listener hinzu, der bei jeder Größenänderung des Fensters aufgerufen wird
window.addEventListener('resize', handleResize);

// Initialer Aufruf, um die Ansicht beim Laden der Seite korrekt zu setzen
handleResize();






















// Stellen Sie sicher, dass diese Funktion aufgerufen wird, wenn die Seite geladen wird oder wenn neue Daten hinzugefügt wurden
window.onload = function() {
    displayProfileValues();
}
