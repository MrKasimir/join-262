/**
 * This function is used to initialze the join app
 *  
 */
function init() {
    let initialScreen = document.getElementById('initial-screen');
    fadeIn(initialScreen);
    setTimeout(initializeUserDialog, 2500);
}

function initializeUserDialog() {
    fadeOut(document.getElementById('initial-screen'));
}

/**
 * This function is used to fade out the fron image element
 * 
 * @param {divObject} element - This is the name of the Div-Object that shall be faded out
 */
function fadeOut(element) {
    var opacity = 1;
    var duration = 1500; // hier: Millisekunden
    var start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        opacity = 1 - Math.min(progress / duration, 1);
        element.style.opacity = opacity;
        if (progress < duration) {// Wenn die Animation noch nicht abgeschlossen ist, führe den nächsten Frame aus
            requestAnimationFrame(animate);
        } else {// Wenn die Animation abgeschlossen ist, setze die Opazität auf 0 und verstecke das Element
            element.style.opacity = 0;
            element.style.display = 'none';
            if (element.id == 'initial-screen') {
                fadeIn(document.getElementById('header'));
                fadeIn(document.getElementById('content-screen'));
                fadeIn(document.getElementById('user-dialog'));
                fadeIn(document.getElementById('legal-bar'));
                fadeIn(document.getElementById('footer'));
            }
        }
    }
    requestAnimationFrame(animate);
}

function fadeIn(element) {
    var opacity = 0; // Setze die Anfangsopazität auf 0
    var duration = 1000; // Dauer in Millisekunden
    var start = null;

    // Stelle sicher, dass das Element die richtige Anfangsopazität hat und sichtbar ist
    element.style.opacity = opacity;
    element.style.display = 'flex'; // oder 'block', je nach Bedarf
    element.classList.remove('d-none');

    function animateFadeIn(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        opacity = Math.min(progress / duration, 1);

        element.style.opacity = opacity;

        if (progress < duration) {
            // Wenn die Animation noch nicht abgeschlossen ist, führe den nächsten Frame aus
            requestAnimationFrame(animateFadeIn);
        } else {
            // Wenn die Animation abgeschlossen ist, setze die Opazität auf 1
            element.style.opacity = 1;
        }
    }
    // Starte die Animation
    requestAnimationFrame(animateFadeIn);
}

