onst BASE_URL = "https://test-join-8aa59-default-rtdb.europe-west1.firebasedatabase.app/";

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
