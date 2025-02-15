# StudySpace

StudySpace is a full-stack MERN web application that serves as a centralized, secure platform for students to store, manage, and share their academic materials. Users can create personalized collections containing assignments, exams, research papers, and notes. The app also integrates an AI-powered chatbot to provide academic insights based on user queries and optional uploaded files.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:**  
  - Secure email/password registration and login (JWT-based).  
  - Optional Google OAuth integration.

- **Collection & Item Management:**  
  - Create, read, update, and delete collections of academic materials.  
  - Organize items (assignments, exams, notes, etc.) within collections.
  - Public/private visibility options for collections.

- **File Uploads:**  
  - Local file uploads using Multer with dynamic folder creation and file type validation.

- **Search Functionality:**  
  - Search collections by name, description, tags, or owner details.

- **AI-Powered Chatbot:**  
  - Chat interface that accepts a text query and an optional file upload.  
  - The chatbot constructs a combined prompt (incorporating file content and the query) and uses the Vercel AI SDK (Google Gemini provider) to generate responses.  
  - Chat history is stored in the database.

- **Dockerized Deployment:**  
  - Entire application (backend, frontend, and database) containerized using Docker Compose.

## Tech Stack

- **Backend:**  
  - Node.js, Express, MongoDB, Multer, JWT, Vercel AI SDK (for Gemini integration)
- **Frontend:**  
  - React, React Router, Axios
- **Deployment:**  
  - Docker, Docker Compose

## Architecture

The application is designed in a modular fashion:
- **Models:** Define schemas for Users, Collections, Items, and Chatbot Messages.
- **Controllers:** Handle incoming HTTP requests, perform validation, and call services.
- **Services:** Encapsulate business logic (e.g., calling the Gemini API via the Vercel AI SDK).
- **Routes:** Map HTTP endpoints to controllers.
- **Middlewares:** Manage authentication, file uploads (via a custom Multer configuration), error handling, and input validation.

## Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/abdulbasit110/studyspace.git
   cd studyspace
   ```

2. **Backend Setup:**
   - Navigate to the `studyspacebackend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create an `uploads` folder in the backend directory (or let the app create it automatically).

## Environment Variables

Create a `.env` file in the `studyspacebackend` folder with the following variables (adjust values as needed):

```
MONGODB_URI=mongodb://mongo:27017/studyspace
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
FRONTEND_URL=http://localhost:3000
```

If you are using Google Gemini via the Vercel AI SDK, ensure you have the correct API key and that your provider settings are updated in your service layer.

## API Documentation

A Postman collection (`postman_collection.json`) is included to document all endpoints. Key endpoints include:

- **Auth:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- **Collections:**
  - `POST /api/collections`
  - `GET /api/collections`
  - `GET /api/collections/:id`
  - `PUT /api/collections/:id`
  - `DELETE /api/collections/:id`
  - `GET /api/collections/search/query?q=searchTerm`
- **Items:**
  - `POST /api/items`
  - `GET /api/items/collection/:collectionId`
  - `PUT /api/items/:id`
  - `DELETE /api/items/:id`
- **Files:**
  - `POST /api/files/upload`
- **Chatbot:**
  - `POST /api/chatbot/process`  
    (Accepts multipart/form-data with a `query` field and an optional `file` upload)
  - `GET /api/chatbot/conversation` (to fetch chat history)

## Usage

1. **Authentication:**  
   Users register and log in to receive a JWT token for subsequent API calls.

2. **Dashboard & Collections:**  
   Authenticated users can create and manage collections and items via the dashboard.

3. **File Uploads:**  
   Files are uploaded using Multer; the app ensures proper storage and validation based on allowed MIME types.

4. **Chatbot Interaction:**  
   - In the chatbot interface, users can enter a query and optionally attach a file.  
   - The backend reads the file (if provided), constructs a prompt, and calls Gemini via the Vercel AI SDK.  
   - Both the prompt and the generated response are stored in MongoDB.
   - The chatbot response is returned to the frontend for display.

## Docker Deployment

The entire application is containerized with Docker Compose.

1. **Build and Run Containers:**
   ```bash
   docker-compose up --build
   ```
2. **Access the App:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

The `docker-compose.yml` file sets up containers for the backend, frontend, and MongoDB.

## Contributing

Contributions are welcome! Please fork the repository and open a pull request with your changes. Ensure that your code follows the established modular structure and best practices.


