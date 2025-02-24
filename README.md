# Online Library

## Overview
An online library application where users can register, log in, manage their book collections, add books to a reading list, rate books, search for books, update their profiles, and delete books from their reading list. Admins have additional privileges to manage all users and books, while regular users can only update or delete their own books.

## Setup Instructions

### Clone the Repository:
```bash
git clone https://github.com/chai-enjoyer/online-library.git
cd online-library
```

### Install Dependencies:
```bash
npm install
```

### Configure Environment Variables:
Create a `.env` file in the root directory with the following content:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/online-library
# OR for MongoDB Atlas (recommended for deployment):
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/online-library?retryWrites=true&w=majority
JWT_SECRET=your-very-secret-key
```
- Replace `MONGO_URI` with your MongoDB connection string (local MongoDB or MongoDB Atlas for cloud hosting).
- Use a strong, unique `JWT_SECRET`.

### Ensure MongoDB Is Running:
- For local MongoDB, start MongoDB locally (e.g., `mongod` on the command line).
- For MongoDB Atlas, configure your cluster and ensure the connection string is correct.

### Start the Server:
```bash
npm start
```
Or use `npm run dev` for development with automatic restarting:
```bash
npm install --save-dev nodemon
```
Then update `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Seed the Database (Optional):
Use the provided `seed.js` script to populate the database with sample users, books, ratings, and reading lists:
```bash
node seed.js
```

## Project Overview
### Purpose
A web-based library system designed to help users track and manage books, with features for reading lists, ratings, searching, and user profiles, enhanced with role-based access control (RBAC) for admins and users.

### Key Features:
- **User authentication** (register, login) with JWT and encrypted passwords using bcryptjs.
- **Book management** (create, read, update, delete) with RBAC: users manage their own books, while admins manage all books.
- **Reading list management** (add, view, update status, delete) to track reading progress.
- **Rating system** allowing users to rate books (1-5 stars).
- **Search functionality** with filters (title, author, category) for books.
- **Profile management** (update username, email, password).
- **Responsive frontend** built with HTML, CSS (Bootstrap), and JavaScript, interacting with a RESTful API.

### Target Audience
Libraries, book enthusiasts, or educational institutions seeking a digital book management solution.

## Tech Stack
### Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (jsonwebtoken)
- Password hashing (bcryptjs)
- Input validation (joi)
- CORS support (cors)

### Frontend:
- HTML5
- CSS3 (Bootstrap 5.3, Font Awesome)
- Vanilla JavaScript with Fetch API

## API Documentation

### Authentication
- **POST** `/auth/register` - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Password: min 8 chars, 1 number, 1 special char
- **POST** `/auth/login` - Login and get JWT
  - Body: `{ "email": "string", "password": "string" }`

### User Management
- **GET** `/users/profile` - Get user profile (requires JWT)
- **PUT** `/users/profile` - Update user profile (requires JWT)
- **GET** `/users/all` - Get all users (admin only)
- **PUT** `/users/:id` - Update a user (admin only)
- **DELETE** `/users/:id` - Delete a user (admin only)

### Books
- **POST** `/books` - Create a book (requires JWT)
  - Body: `{ "authors": ["string"], "categories": ["string"], "isbn": "string", "longDescription": "string", "pageCount": number, "publishedDate": "date", "shortDescription": "string", "status": "PUBLISH|UNPUBLISH", "thumbnailUrl": "string", "title": "string" }`
- **GET** `/books` - Get all books or search with query
  - Query: `?title=string&author=string&category=string`
- **GET** `/books/:id` - Get a book by ID
- **PUT** `/books/:id` - Update a book (admin only)
- **DELETE** `/books/:id` - Delete a book (admin only)
- **POST** `/books/reading-list` - Add to reading list (requires JWT)
  - Body: `{ "bookId": "string", "status": "to-read|reading|completed" }`
- **GET** `/books/reading-list` - Get user's reading list (requires JWT)
- **POST** `/books/rate` - Rate a book (requires JWT)
  - Body: `{ "bookId": "string", "rating": number (1-5) }`

## Project Structure
```
/config         # Database and environment configurations (database.js, env.js)
/controllers   # Business logic for routes (authController.js, bookController.js, userController.js)
/middleware    # Authentication, validation, and error handling (auth.js, errorHandler.js, validate.js)
/models        # Mongoose schemas for MongoDB (Book.js, Rating.js, ReadingList.js, User.js)
/public        # Static files (HTML, CSS, JavaScript) for the frontend (admin.html, book.html, index.html, etc.)
/routes        # API endpoints (authRoutes.js, bookRoutes.js, userRoutes.js)
/js            # Client-side JavaScript (admin.js, auth.js, book.js, main.js, profile.js, search.js)
seed.js        # Script to seed the database with sample data
server.js      # Entry point for the Express server
.env           # Environment variables (not committed to GitHub, use .gitignore)
.gitignore     # Excludes sensitive or unnecessary files (e.g., node_modules/, .env)
package.json   # Project metadata, dependencies, and scripts
```
