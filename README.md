# User-Article Mongo Nest

A RESTful API built with [NestJS](https://nestjs.com/), [MongoDB](https://www.mongodb.com/), and [Mongoose](https://mongoosejs.com/) for managing users and articles, featuring JWT authentication and Google OAuth2 login.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Articles](#articles)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration and retrieval
- Article CRUD operations
- JWT authentication for protected routes
- Google OAuth2 login
- Role-based access control (Author, Admin)
- Input validation using class-validator
- MongoDB integration via Mongoose
- E2E and unit testing with Jest and Supertest

---

## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** JWT, Google OAuth2 (Passport.js)
- **Validation:** class-validator, class-transformer
- **Testing:** Jest, Supertest

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) running locally or remotely

### Installation

```bash
git clone https://github.com/vhmvdrezv/user-article-mongo-nest.git
cd user-article-mongo-nest
npm install
```

### Environment Variables

Create a `.env` file in the root directory and set the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Note:** You can obtain Google OAuth credentials from Google Cloud Console.

### Running the App

```bash
# Development
npm run start:dev
```

The server will start on `http://localhost:3000` by default.

---

## API Endpoints

### Authentication

- `GET /auth/google/login` - Redirects to Google OAuth2 login
- `GET /auth/google/callback` - Handles Google OAuth2 callback and returns a JWT access token

### Users

- `POST /users` - Create a new user
  
  **Body:**
  ```json
  {
    "email": "user@example.com",
    "fullname": "User Name"
  }
  ```

- `GET /users` - Retrieve all users
- `GET /users/:id` - Retrieve a user by ID

### Articles

- `POST /articles` - Create a new article (**Protected:** Requires JWT)
  
  **Body:**
  ```json
  {
    "title": "Article Title",
    "content": "Article content..."
  }
  ```

- `GET /articles` - Retrieve all articles
- `GET /articles/:id` - Retrieve an article by ID
- `PATCH /articles/:id` - Update an article (**Protected:** Requires JWT)
  
  **Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content..."
  }
  ```

- `DELETE /articles/:id` - Delete an article (**Protected:** Requires JWT. Only the author or an admin can delete)

---

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── articles/
│   ├── articles.controller.ts
│   ├── articles.module.ts
│   ├── articles.service.ts
│   ├── dto/
│   └── schemas/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── strategies/
├── common/
│   └── enums/
└── users/
    ├── users.controller.ts
    ├── users.module.ts
    ├── users.service.ts
    ├── dto/
    └── schemas/
test/
└── app.e2e-spec.ts
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request