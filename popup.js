document.addEventListener("DOMContentLoaded", init);

console.log(chrome.storage);

function init() {
    const addBtn = document.getElementById("addNote");
    const noteInput = document.getElementById("notion");
    const notesList = document.getElementById("notesList");

    // Загружаем заметки при открытии
    loadNotes();

    addBtn.addEventListener("click", () => {
        if (noteInput.value.trim()) {
            saveNote(noteInput.value);
            noteInput.value = "";
        }
    });

    // Удаление заметки
    notesList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const noteId = e.target.parentElement.dataset.id;
            deleteNote(noteId);
        }
    });
}

function saveNote(text) {
    chrome.storage.local.get({ notes: [] }, (data) => {
        const notes = data.notes;
        const newNote = {
            id: Date.now(),
            text: text,
            date: new Date().toLocaleString(),
        };
        notes.push(newNote);
        chrome.storage.local.set({ notes }, () => loadNotes());
    });
}

function deleteNote(id) {
    chrome.storage.local.get({ notes: [] }, (data) => {
        const notes = data.notes.filter((note) => note.id !== Number(id));
        chrome.storage.local.set({ notes }, () => loadNotes());
    });
}

function loadNotes() {
    chrome.storage.local.get({ notes: [] }, (data) => {
        const notesList = document.getElementById("notesList");
        notesList.innerHTML = data.notes
            .map(
                (note) => `
        <li data-id="${note.id}">
          ${note.text}
          <button>Удалить</button>
        </li>
      `
            )
            .join("");
    });
}
