# 📚 Online Library

## 📝 Overview
An **Online Library** application where users can:
- 📖 Manage their book collections
- 📚 Add books to a reading list
- ⭐ Rate books
- 🔍 Search for books
- ✏️ Update their profiles
- ❌ Delete books from their reading list

Admins have additional privileges to **manage all users and books**, while regular users can only modify or delete their own books.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/chai-enjoyer/online-library.git
cd online-library
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory with the following content:
```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/online-library
# OR for MongoDB Atlas (recommended for deployment):
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/online-library?retryWrites=true&w=majority
JWT_SECRET=your-very-secret-key
```
🔹 Replace `MONGO_URI` with your **MongoDB connection string** (local or cloud).
🔹 Use a **strong, unique** `JWT_SECRET`.

### 4️⃣ Ensure MongoDB Is Running
- **For local MongoDB**: Start it with `mongod`
- **For MongoDB Atlas**: Configure your cluster & ensure the connection string is correct.

### 5️⃣ Start the Server
```bash
npm start
```
For development (with automatic restarting):
```bash
npm install --save-dev nodemon
```
Update `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
Then, run:
```bash
npm run dev
```

### 6️⃣ Seed the Database (Optional)
To populate the database with sample users, books, ratings, and reading lists:
```bash
node seed.js
```

---

## 🎯 Project Overview
### 🎯 Purpose
A **web-based library system** designed for book lovers, libraries, and educational institutions to track and manage books efficiently. Includes role-based access control (RBAC) for **admins** and **users**.

### 🔑 Key Features
✅ **User Authentication** (Register/Login) with **JWT** & encrypted passwords (**bcryptjs**).
✅ **Book Management** (CRUD operations) with **RBAC**:
   - Users manage **their own books**
   - Admins manage **all books**
✅ **Reading List Management** (Add, View, Update, Delete status).
✅ **Rating System** ⭐⭐⭐⭐⭐ (1-5 stars).
✅ **Search Books** by **Title, Author, Category**.
✅ **Profile Management** (Update username, email, password).
✅ **Responsive UI** using **HTML, CSS (Bootstrap), and JavaScript**.

### 🎯 Target Audience
📖 **Libraries**
📚 **Book Enthusiasts**
🏫 **Educational Institutions**

---

## 🛠️ Tech Stack
### 🖥️ Backend
- **Node.js** (JavaScript runtime)
- **Express.js** (Web framework)
- **MongoDB** (Database, with **Mongoose** ORM)
- **JWT** (Authentication: `jsonwebtoken`)
- **bcryptjs** (Password hashing)
- **joi** (Input validation)
- **cors** (CORS support)

### 🌐 Frontend
- **HTML5**
- **CSS3** (Bootstrap 5.3, Font Awesome)
- **Vanilla JavaScript** (with Fetch API)

---

## 📖 API Documentation
### 🔑 Authentication
- **POST** `/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
  - Password: **min 8 chars, 1 number, 1 special char**

- **POST** `/auth/login` - Login and get JWT
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### 👤 User Management
- **GET** `/users/profile` - Get user profile (requires JWT)
- **PUT** `/users/profile` - Update user profile (requires JWT)
- **GET** `/users/all` - Get all users (**Admin only**)
- **PUT** `/users/:id` - Update a user (**Admin only**)
- **DELETE** `/users/:id` - Delete a user (**Admin only**)

### 📚 Books
- **POST** `/books` - Create a book (requires JWT)
  ```json
  {
    "title": "string",
    "authors": ["string"],
    "categories": ["string"],
    "isbn": "string",
    "pageCount": number,
    "publishedDate": "date",
    "shortDescription": "string",
    "longDescription": "string",
    "status": "PUBLISH|UNPUBLISH",
    "thumbnailUrl": "string"
  }
  ```
- **GET** `/books` - Get all books or search
  ```
  ?title=string&author=string&category=string
  ```
- **GET** `/books/:id` - Get a book by ID
- **PUT** `/books/:id` - Update a book (**Admin only**)
- **DELETE** `/books/:id` - Delete a book (**Admin only**)

### 📌 Reading List & Ratings
- **POST** `/books/reading-list` - Add to reading list (requires JWT)
  ```json
  {
    "bookId": "string",
    "status": "to-read|reading|completed"
  }
  ```
- **GET** `/books/reading-list` - Get user's reading list (requires JWT)
- **POST** `/books/rate` - Rate a book (requires JWT)
  ```json
  {
    "bookId": "string",
    "rating": 1-5
  }
  ```

---

## 📁 Project Structure
```
/config        # Database & environment configs
/controllers   # Business logic (auth, books, users)
/middleware    # Authentication & validation
/models        # Mongoose schemas (User, Book, Rating, etc.)
/public        # Static files (HTML, CSS, JS)
/routes        # API routes
/js            # Frontend scripts
seed.js        # Seed database with sample data
server.js      # Express server entry point
.env           # Environment variables (ignored by Git)
.gitignore     # Excludes sensitive/unnecessary files
package.json   # Project metadata & dependencies
```

---

## 🎯 Final Notes
🔥 **Contributions are welcome!** Feel free to fork, improve, and submit a PR.
💡 **Suggestions?** Open an issue and let's discuss improvements!
💻 **Happy Coding!** 🚀
