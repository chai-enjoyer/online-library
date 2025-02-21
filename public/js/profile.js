document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const profileRes = await fetch('/users/profile', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!profileRes.ok) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    const profile = await profileRes.json();
    document.getElementById('username').textContent = `${profile.username}'s Profile`;
    document.getElementById('email').textContent = `Email: ${profile.email}`;

    const listRes = await fetch('/books/reading-list', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!listRes.ok) throw new Error('Failed to fetch reading list');
    const readingList = await listRes.json();
    const readingListContainer = document.getElementById('reading-list');
    readingListContainer.innerHTML = readingList.length > 0 ?
      readingList.map(item => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span><i class="fas fa-book"></i> ${item.bookId.title} by ${item.bookId.authors.join(', ')} - ${item.status}</span>
        </li>
      `).join('') : '<li class="list-group-item">No items in reading list.</li>';
  } catch (error) {
    console.error('Profile fetch error:', error);
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  const addBookForm = document.getElementById('add-book-form');
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
      const errorDiv = document.getElementById('add-book-error');
      errorDiv.style.display = 'none';
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
          errorDiv.textContent = data.message;
          errorDiv.style.display = 'block';
        }
      } catch (error) {
        errorDiv.textContent = 'Failed to add book. Please try again.';
        errorDiv.style.display = 'block';
      }
    });
  }
});
