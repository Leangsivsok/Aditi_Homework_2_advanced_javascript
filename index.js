// ================= DOM ELEMENTS =================
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const tagInput = document.getElementById("tags");
const addTagBtn = document.getElementById("addTagBtn");
const tagContainer = document.getElementById("tagContainer");

const notesContainer = document.getElementById("notes");

const searchInput = document.getElementById("searchInput");
const tagFilter = document.getElementById("tagFilter");

// ================= TAG MANAGER (CLOSURE) =================
const createTagManager = () => {
  let tags = [];

  const addTag = (tag) => {
    if (!tags.includes(tag)) tags.push(tag);
  };

  const removeTag = (index) => {
    tags.splice(index, 1);
  };

  const getTags = () => [...tags];

  const clearTags = () => {
    tags = [];
  };

  return { addTag, removeTag, getTags, clearTags };
};

const tagManager = createTagManager();

// ================= NOTES MANAGER (CLOSURE) =================
const createNotesManager = () => {
  let notes = [];

  const addNote = (title, content, tags) => {
    notes.push({
      id: Date.now(),
      title,
      content,
      tags
    });
  };

  const deleteNote = (id) => {
    notes = notes.filter(note => note.id !== id);
  };

  const getNotes = () => [...notes];

  return { addNote, deleteNote, getNotes };
};

const notesManager = createNotesManager();

// ================= ADD TAG =================
addTagBtn.addEventListener("click", () => {
  const tagValue = tagInput.value.trim();
  if (!tagValue) return;

  tagManager.addTag(tagValue);
  renderTags();
  tagInput.value = "";
});

// ================= RENDER TAGS =================
const renderTags = () => {
  tagContainer.innerHTML = "";

  tagManager.getTags().forEach((tag, index) => {
    const tagEl = document.createElement("span");

    tagEl.className =
      "bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2";

    tagEl.innerHTML = `
      ${tag}
      <button data-index="${index}" class="text-red-500 font-bold">×</button>
    `;

    tagContainer.appendChild(tagEl);
  });
};

// ================= REMOVE TAG =================
tagContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    tagManager.removeTag(e.target.dataset.index);
    renderTags();
  }
});

// ================= ADD NOTE =================
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const tags = tagManager.getTags();

  if (!title || !content) return;

  notesManager.addNote(title, content, tags);

  noteForm.reset();
  tagManager.clearTags();
  renderTags();

  updateTagFilter();
  renderNotes();
});

// ================= SEARCH + FILTER =================
const getFilteredNotes = () => {
  const searchText = searchInput.value.toLowerCase();
  const selectedTag = tagFilter.value;

  return notesManager.getNotes().filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchText));

    const matchesTag =
      selectedTag === "all" || note.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });
};

// ================= RENDER NOTES (WITH TRASH ICON) =================
const renderNotes = () => {
  notesContainer.innerHTML = "";

  getFilteredNotes().forEach(note => {
    const noteEl = document.createElement("div");

    noteEl.className =
      "bg-white border rounded-lg p-4 shadow-sm relative";

    const tagsHTML = note.tags
      .map(tag =>
        `<span class="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs">${tag}</span>`
      )
      .join("");

    noteEl.innerHTML = `
      <button 
        data-id="${note.id}"
        class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
        title="Delete note"
      >
        <i class="fa-solid fa-trash"></i>
      </button>

      <h3 class="text-lg font-semibold mb-1">${note.title}</h3>
      <p class="text-gray-700 mb-3">${note.content}</p>
      <div class="flex flex-wrap gap-2">${tagsHTML}</div>
    `;

    notesContainer.appendChild(noteEl);
  });
};

// ================= DELETE NOTE (FIXED) =================
notesContainer.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest("button");

  if (!deleteBtn || !deleteBtn.dataset.id) return;

  const noteId = Number(deleteBtn.dataset.id);

  notesManager.deleteNote(noteId);
  updateTagFilter();
  renderNotes();
});

// ================= TAG FILTER DROPDOWN =================
const updateTagFilter = () => {
  const allTags = new Set();

  notesManager.getNotes().forEach(note =>
    note.tags.forEach(tag => allTags.add(tag))
  );

  tagFilter.innerHTML = `<option value="all">All Tags</option>`;

  [...allTags].forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
};


searchInput.addEventListener("input", renderNotes);
tagFilter.addEventListener("change", renderNotes);
