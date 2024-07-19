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