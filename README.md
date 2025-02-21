# Online Library Website

## Setup Instructions
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Set up `.env` with your MongoDB Atlas URI
4. Start server: `npm start`
6. Open `http://localhost:3000` in your browser.


## Environment Variables
- `.env`:
PORT=3000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>

## API Documentation
### Authentication
- `POST /auth/register` - Register a new user
- Body: `{ "username": "string", "email": "string", "password": "string" }` (Password: min 8 chars, 1 number, 1 special char)
- `POST /auth/login` - Login and get JWT
- Body: `{ "email": "string", "password": "string" }`
### User Management
- `GET /users/profile` - Get user profile (requires JWT)
- `PUT /users/profile` - Update user profile (requires JWT)
- `GET /users/all` - Get all users (admin only)
- `PUT /users/:id` - Update a user (admin only)
- `DELETE /users/:id` - Delete a user (admin only)
### Books
- `POST /books` - Create a book (requires JWT)
- Body: `{ "authors": ["string"], "categories": ["string"], "isbn": "string", "longDescription": "string", "pageCount": number, "publishedDate": "date", "shortDescription": "string", "status": "PUBLISH|UNPUBLISH", "thumbnailUrl": "string", "title": "string" }`
- `GET /books` - Get all books or search with query
- Query: `?title=string&author=string&category=string`
- `GET /books/:id` - Get a book by ID
- `PUT /books/:id` - Update a book (admin only)
- `DELETE /books/:id` - Delete a book (admin only)
- `POST /books/reading-list` - Add to reading list (requires JWT)
- Body: `{ "bookId": "string", "status": "to-read|reading|completed" }`
- `GET /books/reading-list` - Get user's reading list (requires JWT)
- `POST /books/rate` - Rate a book (requires JWT)
- Body: `{ "bookId": "string", "rating": number (1-5) }`

## Notes
- Regular user passwords must be at least 8 characters long, include 1 number, and 1 special character.
