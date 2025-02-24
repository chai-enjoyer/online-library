// In book.js, after fetching book details, add buttons for update/delete if the user is the creator
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const isbn = window.location.pathname.split('/book/')[1];
  if (!isbn) {
    document.querySelector('.card-body').innerHTML = '<p class="text-danger">No book ISBN provided.</p>';
    return;
  }

  try {
    const res = await fetch(`/books/${isbn}`, {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
    });
    if (!res.ok) {
      const errorData = await res.json();
      document.querySelector('.card-body').innerHTML = `<p class="text-danger">${errorData.message || 'Error loading book details'}</p>`;
      return;
    }
    const book = await res.json();
    document.getElementById('book-title').textContent = book.title || 'Unknown Title';
    document.getElementById('book-authors').textContent = `By ${book.authors?.join(', ') || 'Unknown Author'}`;
    document.getElementById('book-categories').textContent = `Categories: ${book.categories?.join(', ') || 'Unknown'}`;
    document.getElementById('book-isbn').textContent = `ISBN: ${book.isbn || 'N/A'}`;
    document.getElementById('book-pageCount').textContent = `Pages: ${book.pageCount || 'N/A'}`;
    document.getElementById('book-publishedDate').textContent = book.publishedDate ? `Published: ${new Date(book.publishedDate).toLocaleDateString()}` : '';
    document.getElementById('book-shortDescription').textContent = book.shortDescription || 'No short description available.';
    document.getElementById('book-longDescription').textContent = book.longDescription || 'No long description available.';
    document.getElementById('book-added-by').textContent = `Added by: ${book.addedBy?.username || 'Unknown'}`;
    document.getElementById('book-rating').innerHTML = `Average Rating: <span class="rating-stars">${'★'.repeat(Math.round(book.avgRating || 0))} (${book.ratingCount || 0} ratings)</span>`;
    document.getElementById('book-thumbnail').src = book.thumbnailUrl || 'https://via.placeholder.com/200';

    // Check if the logged-in user is the book creator or admin
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload (simplified, use jwt-decode in production)
      if (decoded.id === book.addedBy?._id?.toString() || decoded.role === 'admin') {
        // Add update and delete buttons
        document.querySelector('.card-body').innerHTML += `
          <div class="mt-3">
            <button class="btn btn-warning me-2" onclick="updateBook('${book.isbn}')"><i class="fas fa-edit"></i> Update</button>
            <button class="btn btn-danger" onclick="deleteBook('${book.isbn}')"><i class="fas fa-trash"></i> Delete</button>
          </div>
        `;
      }
    }
  } catch (error) {
    document.querySelector('.card-body').innerHTML = '<p class="text-danger">Error loading book details. Please try again.</p>';
    console.error('Book fetch error:', error);
  }
});

async function addToReadingList() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const isbn = window.location.pathname.split('/book/')[1];
  const status = document.getElementById('status-select').value;
  try {
    const res = await fetch('/books/reading-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ isbn, status }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || 'Added to reading list!');
    } else {
      alert(data.message || 'Failed to add to reading list.');
    }
  } catch (error) {
    alert('Error adding to reading list: ' + error.message);
    console.error('Add to reading list error:', error);
  }
}

async function rateBook() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const isbn = window.location.pathname.split('/book/')[1];
  const rating = parseInt(document.getElementById('rating-select').value);
  if (rating === 0) return;
  try {
    const res = await fetch('/books/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ isbn, rating }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to rate book.');
    }
  } catch (error) {
    alert('Error rating book.');
    console.error('Rate book error:', error);
  }
}

async function updateBook(isbn) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const title = prompt('Enter new title:', document.getElementById('book-title').textContent) || document.getElementById('book-title').textContent;
  const authors = prompt('Enter new authors (comma-separated):', document.getElementById('book-authors').textContent.replace('By ', ''))?.split(',').map(a => a.trim()) || document.getElementById('book-authors').textContent.replace('By ', '').split(',').map(a => a.trim());
  const categories = prompt('Enter new categories (comma-separated):', document.getElementById('book-categories').textContent.replace('Categories: ', ''))?.split(',').map(c => c.trim()) || document.getElementById('book-categories').textContent.replace('Categories: ', '').split(',').map(c => c.trim());
  const pageCount = parseInt(prompt('Enter new page count:', document.getElementById('book-pageCount').textContent.replace('Pages: ', ''))) || parseInt(document.getElementById('book-pageCount').textContent.replace('Pages: ', ''));
  const publishedDate = prompt('Enter new published date (YYYY-MM-DD):', document.getElementById('book-publishedDate').textContent.replace('Published: ', '')) || document.getElementById('book-publishedDate').textContent.replace('Published: ', '');
  const shortDescription = prompt('Enter new short description:', document.getElementById('book-shortDescription').textContent) || document.getElementById('book-shortDescription').textContent;
  const longDescription = prompt('Enter new long description:', document.getElementById('book-longDescription').textContent) || document.getElementById('book-longDescription').textContent;
  const thumbnailUrl = prompt('Enter new thumbnail URL:', document.getElementById('book-thumbnail').src) || document.getElementById('book-thumbnail').src;

  try {
    const res = await fetch(`/books/${isbn}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ title, authors, categories, isbn, pageCount, publishedDate, shortDescription, longDescription, thumbnailUrl }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to update book.');
    }
  } catch (error) {
    alert('Error updating book: ' + error.message);
    console.error('Update book error:', error);
  }
}

async function deleteBook(isbn) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  if (!confirm('Are you sure you want to delete this book?')) return;

  try {
    const res = await fetch(`/books/${isbn}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (res.ok) {
      window.location.href = '/';
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to delete book.');
    }
  } catch (error) {
    alert('Error deleting book: ' + error.message);
    console.error('Delete book error:', error);
  }
}