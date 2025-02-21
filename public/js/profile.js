document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const usernameEl = document.getElementById('username');
    const emailEl = document.getElementById('email');
    const readingListEl = document.getElementById('reading-list');
    const addBookForm = document.getElementById('add-book-form');
    const addBookError = document.getElementById('add-book-error');

    usernameEl.textContent = 'Loading profile...';
    emailEl.textContent = '';
    readingListEl.innerHTML = '<li class="list-group-item">Loading reading list...</li>';

    if (!token) {
      usernameEl.textContent = 'Not Logged In';
      emailEl.textContent = 'Please log in to view your profile.';
      readingListEl.innerHTML = '<li class="list-group-item">Log in to see your reading list.</li>';
      return;
    }

    async function fetchProfileWithRetry(url, options, maxRetries = 3, delay = 1000) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, options);
          if (response.status === 401) {
            console.error(`JWT token invalid at attempt ${attempt} for ${url}`);
            localStorage.removeItem('token');
            window.location.href = '/login';
            return null;
          }
          if (response.status === 404) {
            console.error(`Not Found at attempt ${attempt} for ${url}: ${response.statusText}`);
          }
          if (!response.ok) {
            throw new Error(`Attempt ${attempt} failed: ${response.statusText}`);
          }
          return response;
        } catch (error) {
          console.error(`Fetch attempt ${attempt} failed for ${url}:`, error);
          if (attempt === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
      return null;
    }

    try {
      const profileRes = await fetchProfileWithRetry('/users/profile', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!profileRes) throw new Error('Failed to fetch profile after retries');
      const profile = await profileRes.json();
      usernameEl.textContent = `${profile.username}'s Profile`;
      emailEl.textContent = `Email: ${profile.email}`;

      const readingList = profile.readingList || [];
      if (readingList.length === 0) {
        readingListEl.innerHTML = '<li class="list-group-item">No items in reading list.</li>';
      } else {
        const readingListWithDetails = await Promise.all(
          readingList.map(async (item) => {
            try {
              const bookRes = await fetch(`/books/${item.isbn}`, {
                headers: { 'Authorization': 'Bearer ' + token },
              });
              if (!bookRes.ok) throw new Error('Book not found');
              const book = await bookRes.json();
              return {
                isbn: item.isbn,
                status: item.status,
                // addedAt: item.addedAt ? new Date(item.addedAt.$date.$numberLong || item.addedAt).toLocaleDateString() : 'Unknown',
                book: book || { title: 'Unknown', authors: ['Unknown'], isbn: item.isbn }
              };
            } catch (error) {
              console.error(`Error fetching book for ISBN ${item.isbn}:`, error);
              return {
                isbn: item.isbn,
                status: item.status,
                addedAt: item.addedAt ? new Date(item.addedAt.$date.$numberLong || item.addedAt).toLocaleDateString() : 'Unknown',
                book: { title: 'Unknown', authors: ['Unknown'], isbn: item.isbn }
              };
            }
          })
        );

        readingListEl.innerHTML = readingListWithDetails.length > 0 ?
          readingListWithDetails.map(item => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span><i class="fas fa-book"></i> ${item.book.title} by ${item.book.authors.join(', ')} (ISBN: ${item.isbn}) - ${item.status}</span>
              <button class="btn btn-sm btn-primary" onclick="showBookDetails('${item.isbn}')">View Details</button>
            </li>
          `).join('') : '<li class="list-group-item">No items in reading list.</li>';
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      usernameEl.textContent = 'Error loading profile';
      emailEl.textContent = `Error: ${error.message}`;
      readingListEl.innerHTML = '<li class="list-group-item text-danger">Failed to load reading list: ' + error.message + '</li>';
    }

    window.showBookDetails = async (isbn) => {
      try {
        const bookRes = await fetch(`/books/${isbn}`, {
          headers: { 'Authorization': 'Bearer ' + token },
        });
        if (!bookRes.ok) throw new Error('Book not found');
        const book = await bookRes.json();
        alert(`Book Details:\nTitle: ${book.title}\nAuthors: ${book.authors.join(', ')}\nISBN: ${book.isbn}`);
      } catch (error) {
        alert('Error loading book details: ' + error.message);
      }
    };

    if (addBookForm) {
      addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('book-title').value;
        const authors = document.getElementById('book-authors').value.split(',').map(a => a.trim());
        const categories = document.getElementById('book-categories').value.split(',').map(c => c.trim());
        const isbn = document.getElementById('book-isbn').value;
        const pageCount = parseInt(document.getElementById('book-pageCount').value);
        const publishedDate = document.getElementById('book-publishedDate').value || null;
        const shortDescription = document.getElementById('book-shortDescription').value;
        const longDescription = document.getElementById('book-longDescription').value;
        const thumbnailUrl = document.getElementById('book-thumbnailUrl').value;
        addBookError.style.display = 'none';
        if (!token) {
          addBookError.textContent = 'Please log in to add a book.';
          addBookError.style.display = 'block';
          return;
        }
        try {
          const res = await fetch('/books', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ authors, categories, isbn, longDescription, pageCount, publishedDate, shortDescription, thumbnailUrl, title }),
          });
          if (res.ok) {
            addBookForm.reset();
            alert('Book added successfully!');
          } else {
            const data = await res.json();
            addBookError.textContent = data.message;
            addBookError.style.display = 'block';
          }
        } catch (error) {
          addBookError.textContent = 'Failed to add book: ' + error.message;
          addBookError.style.display = 'block';
        }
      });
    }
  });
