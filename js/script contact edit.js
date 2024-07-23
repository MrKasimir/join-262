// Seite wird momentan nicht genutzt aus diesem Grund ist dieser Code erstmal nicht relavant

window.onload = function() {
    // URL-Parameter extrahieren
    let params = new URLSearchParams(window.location.search);
    let name = params.get('name');
    let email = params.get('email');
    let number = params.get('number');
    let image = params.get('image');

    // Füllen Sie die Eingabefelder aus
    document.getElementById('contactEditInputName').value = decodeURIComponent(name);
    document.getElementById('contactEditInputEmail').value = decodeURIComponent(email);
    document.getElementById('contactEditInputNumber').value = decodeURIComponent(number);
    document.getElementById('profilImg').src = decodeURIComponent(image);
};

//-------------------- Kein Backend ------------------------//

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
