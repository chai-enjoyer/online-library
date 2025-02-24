document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.getElementById('books-container');
    const token = localStorage.getItem('token');

    // Show loading state
    booksContainer.innerHTML = '<p class="text-center col-12">Loading books...</p>';

    async function fetchBooks() {
      try {
        if (!token) {
          booksContainer.innerHTML = '<p class="text-center col-12">Please <a href="/login">log in</a> to view books.</p>';
          return;
        }

        const res = await fetch('/books', {
          headers: { 'Authorization': 'Bearer ' + token },
        });
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const books = await res.json();
        booksContainer.innerHTML = books.length > 0 ? books.map(book => `
          <div class="col-md-4 mb-4">
            <div class="card book-card h-100 border-primary">
              <div class="card-body">
                <h5 class="card-title text-primary"><i class="fas fa-book"></i> ${book.title}</h5>
                <p class="card-text"><i class="fas fa-user"></i> By ${book.authors.join(', ')}</p>
                <p class="card-text"><i class="fas fa-tag"></i> ${book.categories.join(', ')}</p>
                <p class="card-text rating-stars">${'★'.repeat(Math.round(book.avgRating))} (${book.ratingCount} ratings)</p>
                <a href="/book/${book.isbn}" class="btn btn-primary"><i class="fas fa-eye"></i> View Details</a>
              </div>
            </div>
          </div>
        `).join('') : '<p class="text-center col-12">No books available.</p>';
      } catch (error) {
        booksContainer.innerHTML = '<p class="text-danger text-center col-12">Error loading books: ' + error.message + '</p>';
        console.error('Fetch books error:', error);
      }
    }

    fetchBooks();
  });
