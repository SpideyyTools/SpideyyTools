// Idea Notepad / Quote Collector JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const noteTextInput = document.getElementById('note-text');
  const noteTagInput = document.getElementById('note-tag');
  const notesList = document.getElementById('notes-list');
  const searchInput = document.getElementById('search-input');

  let notes = JSON.parse(localStorage.getItem('spideyytools_notes')) || [];

  function saveNotes() {
    localStorage.setItem('spideyytools_notes', JSON.stringify(notes));
  }

  function renderNotes(filter = '') {
    notesList.innerHTML = '';

    const filteredNotes = notes.filter(note => {
      const textMatch = note.text.toLowerCase().includes(filter.toLowerCase());
      const tagMatch = note.tag.toLowerCase().includes(filter.toLowerCase());
      return textMatch || tagMatch;
    });

    if (filteredNotes.length === 0) {
      notesList.innerHTML = '<p>No notes found.</p>';
      return;
    }

    filteredNotes.forEach((note, index) => {
      const noteItem = document.createElement('div');
      noteItem.className = 'note-item';

      const noteContent = document.createElement('div');
      noteContent.className = 'note-text';
      noteContent.textContent = note.text;

      const noteTag = document.createElement('span');
      noteTag.className = 'note-tag';
      noteTag.textContent = note.tag;

      const noteActions = document.createElement('div');
      noteActions.className = 'note-actions';

      const editBtn = document.createElement('button');
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.title = 'Edit note';
      editBtn.addEventListener('click', () => {
        editNote(index);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.title = 'Delete note';
      deleteBtn.addEventListener('click', () => {
        deleteNote(index);
      });

      noteActions.appendChild(editBtn);
      noteActions.appendChild(deleteBtn);

      noteItem.appendChild(noteContent);
      if (note.tag) {
        noteItem.appendChild(noteTag);
      }
      noteItem.appendChild(noteActions);

      notesList.appendChild(noteItem);
    });
  }

  function addNote(text, tag) {
    notes.push({ text, tag });
    saveNotes();
    renderNotes(searchInput.value);
  }

  function editNote(index) {
    const note = notes[index];
    const newText = prompt('Edit note text:', note.text);
    if (newText === null) return; // Cancelled
    const newTag = prompt('Edit note tag:', note.tag);
    if (newTag === null) return; // Cancelled

    notes[index] = { text: newText.trim(), tag: newTag.trim() };
    saveNotes();
    renderNotes(searchInput.value);
  }

  function deleteNote(index) {
    if (confirm('Are you sure you want to delete this note?')) {
      notes.splice(index, 1);
      saveNotes();
      renderNotes(searchInput.value);
    }
  }

  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = noteTextInput.value.trim();
    const tag = noteTagInput.value.trim();

    if (!text) {
      alert('Please enter a note.');
      return;
    }

    addNote(text, tag);
    noteTextInput.value = '';
    noteTagInput.value = '';
  });

  searchInput.addEventListener('input', () => {
    renderNotes(searchInput.value);
  });

  // Initial render
  renderNotes();
});
