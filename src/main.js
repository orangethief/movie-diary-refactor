import { API_KEY } from '../config.js';
import { createMovieCard, debounce } from './shared.js';

// get current page from URL parameters
const searchParams = new URLSearchParams(window.location.search);
const currentPage = parseInt(searchParams.get('page') || '1');

// set up API request
const url = `https://api.themoviedb.org/3/movie/popular?page=${currentPage}`;
const headers = {
    'Authorization': `Bearer ${API_KEY}`,
}

// get DOM elements
const searchBar = document.querySelector('input');
const resultDiv = document.getElementById('grid-search-results');
const currentPageEl = document.getElementById('currentPage');
const maxPagesEl = document.getElementById('maxPages');
const trendingDiv = document.getElementById('movie-card');


resultDiv.classList.add('hidden');

let maxPages = 1;
currentPageEl.innerText = currentPage;

// fetch popular movies
fetch(url, { headers })
    .then(response => {
        if(!response.ok) throw new Error ('Sorry. Something went wrong.');
        return response.json();
    })
    .then(data => {
        console.log(data);
        maxPages = data.total_pages;
        updatePagination();
        data.results.forEach(movie => {
            const templateDiv = createMovieCard(movie);
            document.getElementById('movie-card').appendChild(templateDiv);
        });
    })
    .catch(error => console.error(error));

// set up search functionality
searchBar.addEventListener('input', debounce(handleSearch, 700));

async function handleSearch(event) {
    const query = event.target.value.trim();
    console.log(query);
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`

    if (query.length === 0) {
        resultDiv.classList.add('hidden');
        trendingDiv.classList.remove('hidden');
        resultDiv.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(searchUrl, { headers });
        const data = await response.json();
        console.log(data);
        displayResults(data);
    } catch (error) {
        console.error('Error fetching results:', error);
    }
}

function displayResults(data) {
    resultDiv.innerHTML = '';

    resultDiv.classList.remove('hidden');
    trendingDiv.classList.add('hidden');
    if (data.results && data.results.length > 0) {
      data.results.forEach(movie => {
            const templateDiv = createMovieCard(movie);
            resultDiv.appendChild(templateDiv);
        });
    } else {
        resultDiv.textContent = "No results found.";
    }
}

// update pagination
function updatePagination() {
  maxPagesEl.innerText = maxPages;
  const navEl = document.getElementById('pagination');
  navEl.innerHTML = ''; // Clear existing pagination

  const paginationItems = [
      { text: '<<', page: 1, ariaLabel: 'First page' },
      { text: '<', page: currentPage - 1, ariaLabel: 'Previous page' },
      { text: currentPage.toString(), page: currentPage, current: true, ariaLabel: `Page ${currentPage}` },
      { text: '>', page: currentPage + 1, ariaLabel: 'Next page' },
      { text: '>>', page: maxPages, ariaLabel: 'Last page' }
  ];

  paginationItems.forEach(item => {
      const el = createPaginationElement(item);
      navEl.appendChild(el);
  });
}

function createPaginationElement({ text, page, current, ariaLabel }) {
    const el = document.createElement('a');
    el.classList.add(
        'relative', 'inline-flex', 'items-center', 'px-4', 'py-2', 'text-sm', 'font-medium',
        'rounded-md', 'transition-colors', 'duration-300', 'focus:outline-none', 'focus:ring-2',
        'focus:ring-offset-2', 'focus:ring-indigo-500'
    );

    if (current) {
        el.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-pink-500', 'text-white');
        el.setAttribute('aria-current', 'page');
    } else if (page > 0 && page <= maxPages) {
        el.classList.add('bg-gray-800', 'text-gray-300', 'hover:bg-gray-700', 'hover:text-white');
        el.href = `${window.location.origin}${window.location.pathname}?page=${page}`;
    } else {
        el.classList.add('bg-gray-600', 'text-gray-400', 'cursor-not-allowed');
    }

    el.innerHTML = `<span class="sr-only">${ariaLabel}</span>${text}`;
    el.setAttribute('aria-label', ariaLabel);

    return el;
}

    // add pagination elements
    navEl.appendChild(createPageElement('&lt;&lt;', 1, ['relative', 'inline-flex', 'items-center', 'rounded-l-md', 'px-2', 'py-2', 'text-gray-400', 'ring-1', 'ring-inset', 'ring-gray-300', 'hover:bg-gray-50', 'focus:z-20', 'focus:outline-offset-0']));
    navEl.appendChild(createPageElement('&lt;', currentPage - 1, ['relative', 'inline-flex', 'items-center', 'px-2', 'py-2', 'text-gray-400', 'ring-1', 'ring-inset', 'ring-gray-300', 'hover:bg-gray-50', 'focus:z-20', 'focus:outline-offset-0']));

    const pageEl = createPageElement(currentPage, currentPage, ['relative', 'z-10', 'inline-flex', 'items-center', 'bg-indigo-600', 'px-4', 'py-2', 'text-sm', 'font-semibold', 'text-white', 'focus:z-20', 'focus-visible:outline', 'focus-visible:outline-2', 'focus-visible:outline-offset-2', 'focus-visible:outline-indigo-600']);
    pageEl.ariaCurrent = 'page';
    navEl.appendChild(pageEl);

    navEl.appendChild(createPageElement('&gt;', currentPage + 1, ['relative', 'inline-flex', 'items-center', 'px-2', 'py-2', 'text-gray-400', 'ring-1', 'ring-inset', 'ring-gray-300', 'hover:bg-gray-50', 'focus:z-20', 'focus:outline-offset-0']));
    navEl.appendChild(createPageElement('&gt;&gt;', maxPages, ['relative', 'inline-flex', 'items-center', 'rounded-r-md', 'px-2', 'py-2', 'text-gray-400', 'ring-1', 'ring-inset', 'ring-gray-300', 'hover:bg-gray-50', 'focus:z-20', 'focus:outline-offset-0']));
