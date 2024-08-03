// import necessary functions from shared module
import { isInJournal, getJournal, updateJournal, createMovieCard, debounce } from './shared.js';

// get reference to the movie grid container
const movieGrid = document.getElementById('movie-grid');

// retrieve the current journal data
const journal = getJournal();

// iterate through each movie in the journal
for (const movie of journal) {
    // create a movie card element for the current movie
    // the second parameter 'true' likely indicates this is for the journal view
    const div = createMovieCard(movie, true);

    // append the movie card to the grid
    movieGrid.appendChild(div);
}

const searchDiaryInput = document.getElementById('searchDiaryInput');

const handleSearch = (event) => {
  const query = event.target.value.trim();

  const cards = movieGrid.getElementsByClassName('movie-card');

  if (query.length === 0) {
    for (const card of cards) {
      card.classList.remove('hidden')
    }

    return;
  }

  for (const card of cards) {
    card.classList.add('hidden')
    const movieTitle = card.getElementsByTagName('h3')[0]?.textContent || '';
    if (movieTitle.toLowerCase().includes(query)) {
      card.classList.remove('hidden');
    }
  }

};

searchDiaryInput.addEventListener('input', debounce(handleSearch, 700));
