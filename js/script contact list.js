//Variable um aktuellen Index, für das anzeigenede Profil zu ermitteln
let currentDisplayedProfile = null;


/*
// Stellt alle bereits hinzugefügten Profile in einer liste da
function displayProfileValues() {
    // Zuerst leeren wir alle relevanten Container, um Duplikate bei wiederholten Aufrufen zu vermeiden
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabet.split('').forEach(letter => {
        let section = document.getElementById(`contactListSection${letter}`);
        if (section) section.innerHTML = '';
    });

    // Durchläuft das profilValues Array
    profilValues.forEach(profile => {
        // Bestimmt den Container basierend auf dem ersten Buchstaben des Namens
        let firstLetter = profile.name.charAt(0).toUpperCase();
        let container = document.getElementById(`contactListSection${firstLetter}`);

        // Falls der Container existiert, fügt der Code es hinzu
        if (container) {
            let profileDiv = document.createElement('div');
            profileDiv.innerHTML = `
                <div> <img class="contactListProfilImages" src="${profile.image}" alt="Profilbild"></div>
                <div>
                    <ul>
                        <p class="contactListInfoText">${profile.name}</p>
                        <p class="contactListInfoTextEmail">${profile.email}</p>
                    </ul>
                </div>
            `;
            container.appendChild(profileDiv);
        } else {
            // Optional: Fehlermeldung, wenn kein Container für den Buchstaben existiert
            console.error(`Kein Container für den Buchstaben ${firstLetter} gefunden.`);
        }
    });
}
*/


// Wieder eine neue ID wird generiert
function generateNewId() {
    if (profilValues.length === 0) return 1;
    return Math.max(...profilValues.map(p => p.id)) + 1;
}

// Fügt die Id einem Profil hinzu
function addProfile(name, email, number, image) {
    const newId = generateNewId(); 
    const newProfile = { id: newId, name, email, number, image };
    profilValues.push(newProfile);
    saveProfileValues();
}

// Stellt alle bereits hinzugefügten Profile in einer liste da
function displayProfileValues() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabet.split('').forEach(letter => {
        let section = document.getElementById(`contactListSection${letter}`);
        if (section) section.innerHTML = '';
    });

    profilValues.forEach(profile => {
        let firstLetter = profile.name.charAt(0).toUpperCase();
        let container = document.getElementById(`contactListSection${firstLetter}`);
        if (container) {
            let profileDiv = document.createElement('div');
            profileDiv.classList.add('profile-entry');
            profileDiv.innerHTML = `
            <div class="contactListProfilStructureSmall">
                <div> <img class="contactListProfilImages" src="${profile.image}"></div>
                <div>
                    <ul>
                        <p class="contactListInfoText">${profile.name}</p>
                        <p class="contactListInfoTextEmail">${profile.email}</p>
                    </ul>
                </div>
            </div>
            `;
            container.appendChild(profileDiv);

            // Fügt den Click-Event-Listener hinzu
            profileDiv.addEventListener('click', () => {
                displayProfileValueInOverview(profile);
            });
        }
    });
}

// Stellt das angeklickte Profil von der Liste in einem Überblick da
function displayProfileValueInOverview(profile) {
    currentDisplayedProfile = profile;  // Speichert das aktuelle Profil global
    let container = document.getElementById('contactPageProfilOverview');
    if (!container) {
        console.error('Container nicht gefunden');
        return;
    }

    container.innerHTML = `
        <div class="contactProfilInfosContainer">
            <img class="contactProfilImagebig" src="${profile.image}" alt="Profilbild">
            <div>
                <p class="contactProfilInfosContainerNameStyle">${profile.name}</p>
                <div class="contactListContainerIconsandtext">
                    <div id="ContactListedit" onclick="editProfile()" class="ContactListeditAndDeleteIcons"><img class="contactListIconsSmall" src="../assets/img/edit icon.png" alt=""><p>Edit</p></div>
                    <div onclick="deleteProfile()" class="ContactListeditAndDeleteIcons"><img class="contactListIconsSmall" src="../assets/img/delete trash.png" alt=""><p>Delete</p></div>
                </div>
            </div>
        </div>
        <div class="contactListEmailNumberContainer">
            <p class="contactListEmailNumberGapEdit"> Contact Information</p>
            <p class="contactListEmailNumberGap"><b>Email:</b> <br>${profile.email}</p>
            <p class="contactListEmailNumberGap"><b>Phone:</b> <br>${profile.number}</p>
        </div>`;
}


// Ansicht sobald man auf den Button Edit Klickt. Nun erscheinen ebenso Inputfelder zum Aktualisieren der Kontakt-Werte
function editProfile() {
    let container = document.getElementById('contactPageProfilOverview');
    container.innerHTML = 
        `<form class="contactListHoleEditContainerForForm" onsubmit="saveEditedProfile(event);">
        <div class="contactProfilInfosContainer">
            <input type="file" id="imageInput" style="display: none;" accept="image/*" onchange="previewImage();">
            <label class="contactProfilImagebigEdit" for="imageInput"><img class="contactProfilImagebig" src="${currentDisplayedProfile.image}" alt="Profilbild" onclick="document.getElementById('imageInput').click();"></label>
            <div>
                <p><b>Name:</p>
                <input class="contactProfilEditInputfieldCss" type="text" minlength="3" maxlength="30" pattern="[A-Za-z ]+" id="editName" value="${currentDisplayedProfile.name}" class="editInput">
            </div>
        </div>
        <div class="contactListEmailNumberContainer">
            <p class="contactListEmailNumberGapEdit editText">Contact Information</p>
            <p class="contactListEmailNumberGap"><b>Email:</p>
            <input class="contactProfilEditInputfieldCss" type="email" minlength="3" maxlength="30" id="editEmail" value="${currentDisplayedProfile.email}" class="editInput">
            <p class="contactListEmailNumberGap"><b>Phone:</p>
            <input class="contactProfilEditInputfieldCss" type="number" min="100" max="999999999999999999999999999999" id="editNumber" value="${currentDisplayedProfile.number}" class="editInput">
            <div class="buttonContainerProfilOvervieEdit">
                        <button id="contactEditDelete" class="contactListOverviewButtonLeft" onclick="deleteProfile()">
                            Delete <img src="../assets/img/close.png">
                        </button>
                        <button type="submit" class="contactListOverviewButtonRight">
                            Save <img src="../assets/img/check.png">
                        </button>
            </div>
            
        </div>
        </form>`
}

// Ermöglicht es ein neues Profil Bild einem bestehendem Kontakt zuzuweisen
function previewImage() {
    var file = document.getElementById('imageInput').files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        document.querySelector('.contactProfilImagebig').src = reader.result;
        // Aktualisieren des Bildpfads im aktuellen Profil
        if (currentDisplayedProfile) {
            currentDisplayedProfile.image = reader.result;
        }
    }
    if (file) {
        reader.readAsDataURL(file);
    }
}

/*
// Nimmt die Werte aus dem Inputfeldern und Speichert die Änderungen erneut im Array
function saveProfileChanges() {
    let editedName = document.getElementById('editName').value;
    let editedEmail = document.getElementById('editEmail').value;
    let editedNumber = document.getElementById('editNumber').value;

    // Aktualisieren des Profils im Array
    const index = profilValues.findIndex(p => p.id === currentDisplayedProfile.id);
    if (index !== -1) {
        // Erstellen eines neuen Objekts anstatt das bestehende zu mutieren
        profilValues[index] = { ...profilValues[index], name: editedName, email: editedEmail, number: editedNumber };
        saveProfileValues();
        displayProfileValueInOverview(profilValues[index]); // Anzeige des aktualisierten Profils
    } else {
        console.error('Profile not found');
    }
}
*/

// Nimmt die Werte aus dem Inputfeldern und Speichert die Änderungen erneut im Array
function saveEditedProfile(event) {
    event.preventDefault(); // Verhindert das Standard-Formularabsenden
    if (!currentDisplayedProfile) {
        console.error('Kein Profil geladen zum Bearbeiten.');
        return;
    }

    // Aktualisiert die Profildaten mit den neuen Eingaben
    let editedName = document.getElementById('editName').value;
    let editedEmail = document.getElementById('editEmail').value;
    let editedNumber = document.getElementById('editNumber').value;
    let editedImage = currentDisplayedProfile.image; // Aktualisiertes Bild wird genutzt

    const index = profilValues.findIndex(p => p.id === currentDisplayedProfile.id);
    if (index !== -1) {
        profilValues[index] = {
            ...currentDisplayedProfile,
            name: editedName,
            email: editedEmail,
            number: editedNumber,
            image: editedImage // Füge das aktualisierte Bild hinzu
        };
        saveProfileValues(); // Speichert die Änderungen im Local Storage
        displayProfileValues(); // Aktualisiert die Liste auf der Hauptseite
        displayProfileValueInOverview(profilValues[index]); // Zeigt das aktualisierte Profil an
    } else {
        console.error('Profile not found');
    }
}

// Leer die Profil Übersicht wieder
function clearProfileOverview() {
    let container = document.getElementById('contactPageProfilOverview');
    if (container) {
        container.innerHTML = '';
    }
}

// löschen eines Profil aus der Liste 
function deleteProfile() {
    if (currentDisplayedProfile) {
        const index = profilValues.indexOf(currentDisplayedProfile);
        if (index > -1) {
            profilValues.splice(index, 1);
            saveProfileValues();  // Aktualisiert den Local Storage
            displayProfileValues();  // Aktualisiert die angezeigte Liste
            clearProfileOverview();  // Leert den Details-Container
            window.alert("Profil erfolgreich gelöscht.");
        }
    } else {
        console.error("Kein Profil zum Löschen ausgewählt.");
    }
}

// Stellen Sie sicher, dass diese Funktion aufgerufen wird, wenn die Seite geladen wird oder wenn neue Daten hinzugefügt wurden
window.onload = function() {
    displayProfileValues();
}
