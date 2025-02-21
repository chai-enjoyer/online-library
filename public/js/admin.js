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
      if (!profileRes.ok) throw new Error('Unauthorized');
      const profile = await profileRes.json();
      if (profile.role !== 'admin') {
        window.location.href = '/';
        return;
      }

      const usersRes = await fetch('/users/all', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      const users = await usersRes.json();
      const usersTable = document.getElementById('users-table');
      usersTable.innerHTML = users.length > 0 ? users.map(user => `
        <tr>
          <td>${user.username || 'N/A'}</td>
          <td>${user.email || 'N/A'}</td>
          <td>${user.role || 'N/A'}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" onclick="editUser('${user._id}', '${user.username}', '${user.email}', '${user.role}')"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')"><i class="fas fa-trash"></i> Delete</button>
          </td>
        </tr>
      `).join('') : '<tr><td colspan="4" class="text-center">No users found.</td></tr>';

      const booksRes = await fetch('/books', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (!booksRes.ok) throw new Error('Failed to fetch books');
      const books = await booksRes.json();
      const booksTable = document.getElementById('books-table');
      booksTable.innerHTML = books.length > 0 ? books.map(book => `
        <tr>
          <td>${book.title || 'N/A'}</td>
          <td>${book.authors?.join(', ') || 'N/A'}</td>
          <td>${book.isbn || 'N/A'}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" onclick="editBook('${book.isbn}', '${book.title}', '${book.authors.join(',')}', '${book.categories.join(',')}', '${book.isbn}', '${book.longDescription || ''}', '${book.pageCount}', '${book.publishedDate || ''}', '${book.shortDescription || ''}', '${book.thumbnailUrl || ''}')"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteBook('${book.isbn}')"><i class="fas fa-trash"></i> Delete</button>
          </td>
        </tr>
      `).join('') : '<tr><td colspan="4" class="text-center">No books found.</td></tr>';
    } catch (error) {
      console.error('Admin fetch error:', error);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  });

  async function editUser(id, currentUsername, currentEmail, currentRole) {
    const username = prompt('Enter new username:', currentUsername) || currentUsername;
    const email = prompt('Enter new email:', currentEmail) || currentEmail;
    const role = prompt('Enter new role (user/admin):', currentRole) || currentRole;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ username, email, role }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update user.');
      }
    } catch (error) {
      alert('Error updating user.');
      console.error('Edit user error:', error);
    }
  }

  async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete user.');
      }
    } catch (error) {
      alert('Error deleting user.');
      console.error('Delete user error:', error);
    }
  }

  async function editBook(isbn, currentTitle, currentAuthors, currentCategories, currentIsbn, currentLongDescription, currentPageCount, currentPublishedDate, currentShortDescription, currentThumbnailUrl) {
    const title = prompt('Enter new title:', currentTitle) || currentTitle;
    const authors = prompt('Enter new authors (comma-separated):', currentAuthors)?.split(',').map(a => a.trim()) || currentAuthors.split(',').map(a => a.trim());
    const categories = prompt('Enter new categories (comma-separated):', currentCategories)?.split(',').map(c => c.trim()) || currentCategories.split(',').map(c => c.trim());
    const isbnNew = prompt('Enter new ISBN:', currentIsbn) || currentIsbn;
    const longDescription = prompt('Enter new long description:', currentLongDescription) || currentLongDescription;
    const pageCount = parseInt(prompt('Enter new page count:', currentPageCount)) || currentPageCount;
    const publishedDate = prompt('Enter new published date (YYYY-MM-DD):', currentPublishedDate) || currentPublishedDate;
    const shortDescription = prompt('Enter new short description:', currentShortDescription) || currentShortDescription;
    const thumbnailUrl = prompt('Enter new thumbnail URL:', currentThumbnailUrl) || currentThumbnailUrl;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/books/${isbn}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ title, authors, categories, isbn: isbnNew, longDescription, pageCount, publishedDate, shortDescription, thumbnailUrl }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update book.');
      }
    } catch (error) {
      alert('Error updating book.');
      console.error('Edit book error:', error);
    }
  }

  async function deleteBook(isbn) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/books/${isbn}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token },
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete book.');
      }
    } catch (error) {
      alert('Error deleting book.');
      console.error('Delete book error:', error);
    }
  }
