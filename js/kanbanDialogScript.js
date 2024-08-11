function makeEditable(containerId, textId, inputId) {
    const container = document.getElementById(containerId);
    const text = document.getElementById(textId);
    const input = document.getElementById(inputId);

    if (!container || !text || !input) {
        console.error(`Elemente nicht gefunden: ${containerId}, ${textId}, ${inputId}`);
        return;
    }

    container.addEventListener('click', function () {
        text.style.display = 'none';
        input.style.display = 'block';
        input.value = text.textContent;
        input.focus();
    });

    input.addEventListener('blur', function () {
        text.textContent = input.value;
        text.style.display = 'block';
        input.style.display = 'none';
    });

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            // Trigger blur event to save the title
            this.blur();
        }
    });
}

function makeEditableDropdown(containerId, textId, selectId) {
    const container = document.getElementById(containerId);
    const text = document.getElementById(textId);
    const select = document.getElementById(selectId);

    if (!container || !text || !select) {
        console.error(`Elemente nicht gefunden: ${containerId}, ${textId}, ${selectId}`);
        return;
    }

    container.addEventListener('click', function () {
        text.style.display = 'none';
        select.style.display = 'block';
        select.focus();
    });

    select.addEventListener('blur', function () {
        text.textContent = select.options[select.selectedIndex].text;
        text.style.display = 'block';
        select.style.display = 'none';
    });

    select.addEventListener('change', function () {
        text.textContent = this.options[this.selectedIndex].text;
        const selectedColor = this.options[this.selectedIndex].dataset.color;
        container.style.backgroundColor = selectedColor;
        text.style.display = 'block';
        select.style.display = 'none';
    });
}

function makeEditableSubtask(containerId, textId, checkboxId) {
    const container = document.getElementById(containerId);
    const text = document.getElementById(textId);
    const checkbox = document.getElementById(checkboxId);

    if (!container || !text || !checkbox) {
        console.error(`Elemente nicht gefunden: ${containerId}, ${textId}, ${checkboxId}`);
        return;
    }

    container.addEventListener('click', function () {
        text.style.display = 'none';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'editable-input';
        input.value = text.textContent;
        container.appendChild(input);
        input.focus();

        input.addEventListener('blur', function () {
            text.textContent = input.value;
            text.style.display = 'block';
            container.removeChild(input);
        });

        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                // Trigger blur event to save the subtask
                this.blur();
            }
        });
    });
}

function initializeSubtasks() {
    const subtasks = document.querySelectorAll('.subtasks li');
    subtasks.forEach((subtask, index) => {
        const textId = `subtask-text-${index + 1}`;
        const checkboxId = `subtask-checkbox-${index + 1}`;
        makeEditableSubtask(subtask.id, textId, checkboxId);
    });
}

function isValidDate(dateString) {
    // Überprüft, ob das Datum im Format dd/mm/yyyy ist
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;

    if (!dateString.match(regex)) return false;

    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

function makeEditableWithValidation(containerId, textId, inputId, validator = null) {
    const container = document.getElementById(containerId);
    const text = document.getElementById(textId);
    const input = document.getElementById(inputId);

    container.addEventListener('click', function () {
        text.style.display = 'none';
        input.style.display = 'block';
        input.value = text.textContent;
        input.focus();
    });

    input.addEventListener('blur', function () {
        if (validator && !validator(input.value)) {
            alert('Ungültiges Datum. Bitte geben Sie ein Datum im Format dd/mm/yyyy ein.');
            // Setzt das Eingabefeld auf den ursprünglichen Wert zurück
            input.value = text.textContent;
            input.focus();
            return;
        }
        text.textContent = input.value;
        text.style.display = 'block';
        input.style.display = 'none';
    });

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            // Trigger blur event to save the input
            this.blur();
        }
    });
}

// Initialize editable fields with date validation for due date
makeEditable('title-container', 'title-text', 'title-input');
makeEditable('subtitle-container', 'subtitle-text', 'subtitle-input');
makeEditableWithValidation('due-date-text', 'due-date-text', 'due-date-input', isValidDate);
makeEditableDropdown('story-category-container', 'story-category-text', 'story-category-select');
makeEditableDropdown('priority-container', 'priority-text', 'priority-select');

// Initialize subtasks
initializeSubtasks();




