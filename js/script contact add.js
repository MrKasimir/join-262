// --------------------------- Dieser Code befasst sich nur mit der HTML Page contact Add -----------------------------------

// weiterleiten zu der Contact List Page
document.getElementById('linkToContactList').addEventListener('submit', function() {
    window.location.href = 'http://127.0.0.1:5500/join-262/contact/contact%20list.html';
});

// Leert die Inputfleder nach dem betätigen des Buttons Cancel
function clearInputFieldsAddPage() {
    document.getElementById("inputFieldContactFormName").value = '';
    document.getElementById("inputFieldContactFormEmail").value = '';
    document.getElementById("inputFieldContactFormNumber").value = '';
    document.getElementById("profilImg").src = "../assets/img/placeholder contact img.png"; // Setzt das Bild auf den Standard zurück
}

// Ermöglicht es ein Bild hochzuladen aus den eigenen Datein
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


// Speichert das hochgeladene Bild im Local Storage ab
function saveProfileValues() {
    localStorage.setItem('profileValues', JSON.stringify(profilValues));
}

// Funktion zum Laden des Profilbilds aus dem Local Storage
function loadProfileValues() {
    return JSON.parse(localStorage.getItem('profileValues') || '[]');
}




// Beim drücken von Submit wir diese Funktion ausgeführt und 
// nur wenn alles richtig eingegeben ist, wird sie ausgeführt 
function handleFormSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
        window.alert('Bitte fülle das Formular korrekt aus.');
        return;
    }
    takeValueFromInput();
    window.alert('Neues Profil wurde erstellt');
    window.location.href = 'http://127.0.0.1:5500/join-262/contact/contact%20list.html';
}
