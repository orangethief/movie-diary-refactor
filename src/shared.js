// journal management functions
export function updateMovie(movie) {
    const journal = getJournal();
    if (!isInJournal(movie)) return;
    const index = journal.findIndex(entry => entry.id === movie.id);
    journal[index] = movie;
    updateJournal(journal);
  }
  
  export function addToJournal(movie) {
    const journal = getJournal();
    if (isInJournal(movie)) return;
    journal.push({ ...movie, notes: [] });
    updateJournal(journal);
  }
  
  export function removeFromJournal(movie) {
    const journal = getJournal();
    if (!isInJournal(movie)) return;
    const index = journal.findIndex(entry => entry.id === movie.id);
    journal.splice(index, 1);
    updateJournal(journal);
  }
  
  export function isInJournal(movie) {
    return getJournal().some(entry => movie.id === entry.id);
  }
  
  export function getJournal() {
    return JSON.parse(localStorage.getItem('journal') || '[]');
  }
  
  export function updateJournal(journal) {
    localStorage.setItem('journal', JSON.stringify(journal));
  }
  
  // note management functions
  export function showNotes(movie) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('movieTitle');
    const notesList = document.getElementById('movieNotes');
    const addNoteInput = document.getElementById('new-note');
    const addNoteBtn = document.getElementById('addNote');
  
    // update modal styling
    modal.classList.add('bg-gray-800', 'text-white', 'rounded-lg', 'shadow-xl', 'p-6', 'max-w-2xl', 'w-full');
  
    // style the title
    title.className = 'text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600';
    title.innerText = movie.original_title;
  
    // style the notes list
    notesList.className = 'space-y-2 mb-4';
    notesList.innerHTML = '';
    movie.notes.forEach(note => notesList.appendChild(createNote(note, movie)));
  
    // style the input and button
    addNoteInput.className = 'w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-2';
    addNoteBtn.className = 'w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300';
  
    addNoteInput.value = '';
    addNoteBtn.onclick = () => {
        const note = addNoteInput.value.trim();
        if (!note) return;
        const newNote = { uuid: crypto.randomUUID(), note, created_at: new Date().toISOString() };
        movie.notes.push(newNote);
        updateMovie(movie);
        notesList.appendChild(createNote(newNote, movie));
        addNoteInput.value = '';
    };
  
    modal.classList.remove("closing");
    modal.showModal();
    modal.classList.add("showing");
  
    const closeModal = () => {
        modal.classList.remove("showing");
        modal.classList.add("closing");
        modal.addEventListener("animationend", () => {
            modal.close();
            modal.classList.remove("closing");
        }, { once: true });
    };
  
    const closeModalTop = document.getElementById('closeModalTop');
    const closeModalBottom = document.getElementById('closeModalBottom');
  
    closeModalTop.className = 'absolute top-2 right-2 text-gray-500 hover:text-white transition duration-300';
    closeModalBottom.className = 'mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300';
  
    closeModalTop.onclick = closeModal;
    closeModalBottom.onclick = closeModal;
  }
  
  export function createNote(note, movie) {
    const noteEntry = document.createElement('div');
    noteEntry.className = 'bg-gray-700 rounded-lg p-3 flex justify-between items-center';
  
    const noteText = document.createElement('p');
    noteText.className = 'text-white';
    noteText.innerHTML = note.note;
  
    dayjs.extend(dayjs_plugin_relativeTime);
    const createdAt = dayjs(note.created_at);
    const createdAtEl = document.createElement('cite');
    createdAtEl.innerText = createdAt.fromNow();
    createdAtEl.classList.add('block', 'text-sm', 'text-gray-500', 'dark:text-gray-400');
    noteText.appendChild(createdAtEl);
  
    const removeNoteBtn = document.createElement('button');
    removeNoteBtn.type = 'button';
    removeNoteBtn.className = 'text-red-500 hover:text-red-700 transition duration-300';
    removeNoteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeNoteBtn.addEventListener('click', () => {
        const index = movie.notes.findIndex(n => n.uuid === note.uuid);
        movie.notes.splice(index, 1);
        noteEntry.remove();
        updateMovie(movie);
    });
  
    noteEntry.appendChild(noteText);
    noteEntry.appendChild(removeNoteBtn);
    return noteEntry;
  }
  
  // movie genres
  export const genres = [
    { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" }, { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" },
    { id: 36, name: "History" }, { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" }, { id: 878, name: "Sci-Fi" },
    { id: 10770, name: "TV Movie" }, { id: 53, name: "Thriller" }, { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ];
  
  // movie card creation
  export const createMovieCard = (movie, isDiary = false) => {
    const templateDiv = document.createElement('div');
    templateDiv.classList.add('bg-gray-800', 'rounded-lg', 'overflow-hidden', 'shadow-lg', 'movie-card');
  
    const poster = document.createElement('img');
    poster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://i.pinimg.com/originals/cd/23/c7/cd23c7a8d049049fd1b0ef281f0300cb.jpg";
    poster.classList.add('movie-poster');
    poster.alt = movie.original_title;
  
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('p-4');
  
    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.original_title.toUpperCase();
    movieTitle.classList.add('text-xl', 'font-semibold', 'mb-2', 'mt-1', 'ml-1', 'text-center', 'truncate');
  
    const descriptionP = document.createElement('p');
    descriptionP.classList.add('text-gray-400', 'mb-4', 'text-center');
    const genre = genres.find(x => x.id === movie.genre_ids[0]);
    descriptionP.textContent = `${movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown'} | ${genre?.name || 'Unknown'}`;
  
    // create a container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex', 'flex-col', 'space-y-2'); // Add vertical spacing between buttons
  
    templateDiv.append(poster, contentDiv);
    contentDiv.append(movieTitle, descriptionP, buttonContainer);
  
    if (isInJournal(movie)) {
        if (isDiary) {
            const showNotesBtn = createButton('Notes', 'fa-note-sticky', () => showNotes(movie));
            const removeFromDiaryBtn = createButton('Remove', 'fa-xmark', () => {
                removeFromJournal(movie);
                templateDiv.remove();
            });
            buttonContainer.append(showNotesBtn, removeFromDiaryBtn);
        }
    } else {
        const addToDiaryBtn = createButton('Add to Diary', 'fa-bookmark', () => {
            addToJournal(movie);
            addToDiaryBtn.remove();
        });
        buttonContainer.appendChild(addToDiaryBtn);
    }
  
    return templateDiv;
  };
  
  function createButton(text, iconClass, onClick) {
    const button = document.createElement('button');
    button.classList.add('gradient-border', 'w-full', 'mt-2'); // Added mt-2 for top margin
    const span = document.createElement('span');
    span.classList.add('flex', 'items-center', 'justify-center', 'gradient-border-span');
    span.innerHTML = `<i class="fas ${iconClass} mr-2"></i>${text}`;
    button.appendChild(span);
    button.addEventListener('click', onClick);
    return button;
  }
  
  // utility function to debounce the search input
  export const debounce = (func, wait) => {
      let timeout;
      return function(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
      };
  }
  