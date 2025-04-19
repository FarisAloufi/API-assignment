document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('resultsContainer');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const emptyState = document.getElementById('emptyState');
  const noResults = document.getElementById('noResults');
  const errorMessage = document.getElementById('errorMessage');

  // Initial state
  emptyState.style.display = 'flex';
  loadingIndicator.style.display = 'none';
  noResults.style.display = 'none';
  resultsContainer.style.display = 'none';
  errorMessage.style.display = 'none';

  // Search function
  async function searchUniversities() {
    const searchTerm = searchInput.value.trim();

    // Validate input
    if (searchTerm.length < 3) {
      showError('Please enter at least 3 characters');
      return;
    }

    // Clear previous state
    resetSearchState();
    loadingIndicator.style.display = 'flex';

    try {
      // Using reliable CORS proxy
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`http://universities.hipolabs.com/search?name=${searchTerm}`)}`);

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const universities = JSON.parse(data.contents);

      // Process results
      loadingIndicator.style.display = 'none';

      if (universities.length === 0) {
        noResults.style.display = 'flex';
      } else {
        displayResults(universities);
      }

    } catch (error) {
      loadingIndicator.style.display = 'none';
      showError('Failed to fetch data. Please try again later.');
      console.error('Search error:', error);
    }
  }

  // Display results
  function displayResults(universities) {
    const tableBody = document.getElementById('resultsTableBody');
    tableBody.innerHTML = '';

    universities.forEach(university => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>
          <div class="university-name">${university.name}</div>
        </td>
        <td>
          <div class="location-info">
            <span class="country">${university.country}</span>
            ${university['state-province'] ?
        `<span class="state">${university['state-province']}</span>` : ''}
          </div>
        </td>
        <td>
          ${university.web_pages.length > 0 ?
        `<a href="${university.web_pages[0]}" class="website-link" target="_blank">
              Visit
            </a>` :
        '<span class="no-website">-</span>'}
        </td>
      `;

      tableBody.appendChild(row);
    });

    resultsContainer.style.display = 'block';
  }

  // Helper functions
  function resetSearchState() {
    emptyState.style.display = 'none';
    noResults.style.display = 'none';
    resultsContainer.style.display = 'none';
    errorMessage.style.display = 'none';
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  // Event listeners
  searchBtn.addEventListener('click', searchUniversities);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchUniversities();
  });

  // Focus search input on page load
  searchInput.focus();
});
