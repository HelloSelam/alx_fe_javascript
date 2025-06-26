// ------------------------------
// Initialization from Local Storage
// ------------------------------
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Be yourself; everyone else is already taken.", category: "Life" },
];

let lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const categoryFilter = document.getElementById('categoryFilter');
const filteredQuotesContainer = document.getElementById('filteredQuotes');
const newQuoteBtn = document.getElementById('newQuote');

// ------------------------------
// Populate Categories in Filters
// ------------------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  // For the quote generator dropdown
  if (categorySelect) {
    categorySelect.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  // For the filter dropdown
  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="all">All Categories</option>` +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    // Restore last selected filter
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }
}

// ------------------------------
// Show Random Quote
// ------------------------------
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length > 0) {
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.textContent = `"${randomQuote.text}"`;
    sessionStorage.setItem('lastQuote', randomQuote.text);
  } else {
    quoteDisplay.textContent = 'No quotes available for this category.';
  }
}

// ------------------------------
// Add New Quote
// ------------------------------
function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();
  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both quote and category.');
  }
}

// ------------------------------
// Save Quotes and Category Filter to Local Storage
// ------------------------------
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ------------------------------
// Create Form Dynamically
// ------------------------------
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');

  const heading = document.createElement('h2');
  heading.textContent = 'Add a New Quote';

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// ------------------------------
// Export Quotes as JSON
// ------------------------------
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();

  URL.revokeObjectURL(url);
}

// ------------------------------
// Import Quotes from JSON
// ------------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    } catch (err) {
      alert('Error reading JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ------------------------------
// Filter Quotes by Category
// ------------------------------
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem('selectedCategory', selected);
  lastSelectedCategory = selected;

  let visibleQuotes = selected === 'all'
    ? quotes
    : quotes.filter(q => q.category === selected);

  // Clear and display
  filteredQuotesContainer.innerHTML = '';
  if (visibleQuotes.length > 0) {
    visibleQuotes.forEach(quote => {
      const p = document.createElement('p');
      p.textContent = `"${quote.text}" — ${quote.category}`;
      filteredQuotesContainer.appendChild(p);
    });
  } else {
    filteredQuotesContainer.textContent = 'No quotes found for this category.';
  }
}

// ------------------------------
// Load Last Viewed Quote from Session
// ------------------------------
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote && quoteDisplay) {
    quoteDisplay.textContent = `"${lastQuote}"`;
  }
}

// ------------------------------
// Event Listeners
// ------------------------------
newQuoteBtn?.addEventListener('click', showRandomQuote);

// ------------------------------
// Initialize App
// ------------------------------
populateCategories();
createAddQuoteForm();
loadLastViewedQuote();