document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const id = window.location.pathname.split('/').pop();
  try {
    const res = await fetch('/books/' + id, {
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

  const id = window.location.pathname.split('/').pop();
  const status = document.getElementById('status-select').value;
  try {
    const res = await fetch('/books/reading-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ bookId: id, status }),
    });
    if (res.ok) {
      alert('Added to reading list!');
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to add to reading list.');
    }
  } catch (error) {
    alert('Error adding to reading list.');
    console.error('Add to reading list error:', error);
  }
}

async function rateBook() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const id = window.location.pathname.split('/').pop();
  const rating = parseInt(document.getElementById('rating-select').value);
  if (rating === 0) return;
  try {
    const res = await fetch('/books/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ bookId: id, rating }),
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
