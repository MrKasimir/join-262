// Lädt vorhandene Profildaten aus dem Local Storage oder initialisiert ein leeres Array
let profilValues = loadProfileValues() || []; 

// generiert eine ID 
function generateId() {
    const existingIds = profilValues.map(p => p.id);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return maxId + 1;
}

//--------------------------- Code für die Contact Add Page - Start ---------------------------------------------

// nimmt die Werte aus dem Form von der Contact Add Page
function takeValueFromInput() {
    let image = document.getElementById("profilImg").src;
    let name = document.getElementById("inputFieldContactFormName").value;
    let email = document.getElementById("inputFieldContactFormEmail").value;
    let number = document.getElementById("inputFieldContactFormNumber").value;
    let id = generateId(); // Generiert eine eindeutige ID

    // Fügt das neue Profil zum Array hinzu
    profilValues.push({ id, image, name, email, number });
    console.log(profilValues); // Zeigt das aktuelle Array in der Konsole an

    // Ruft Function auf, welches das aktualisierte Array im Local Storage speichert
    saveProfileValues();

    // Ruft Function auf, welches das Inputfeld leert
    clearInputFields();
}

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
    });
});

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