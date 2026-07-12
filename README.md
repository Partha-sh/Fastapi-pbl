# PixShare - Cloud-Based Social Media Platform

PixShare is a modern cloud-native social media application built using **FastAPI**, **MongoDB Atlas**, **React**, **TypeScript**, and **ImageKit**. The project demonstrates authentication, cloud image storage, RESTful API design, secure JWT authorization, and modern frontend development.

Unlike a traditional CRUD application, PixShare focuses on building a production-style backend with scalable architecture and cloud integration.

---

## Features

- Secure JWT Authentication
- User Registration & Login
- Create Image Posts
- Cloud Image Upload using ImageKit
- Public Feed
- User Profiles
- Edit Profile
- Delete Own Posts
- Protected Routes
- Responsive Modern UI
- REST API Architecture
- MongoDB Atlas Integration
- Cloud Deployment

---

## Tech Stack

### Backend

- FastAPI
- Python
- Beanie ODM
- MongoDB Atlas
- JWT Authentication
- Passlib
- Python-JOSE
- ImageKit SDK
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- React Router
- React Query
- Axios
- Tailwind CSS
- Shadcn UI
- Framer Motion

### Cloud Services

- MongoDB Atlas
- ImageKit
- Render (Backend)
- Vercel (Frontend)

---

## Project Architecture

```
                React Frontend
                      │
                      │
                 Axios API Calls
                      │
                      ▼
              FastAPI REST Backend
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
 JWT Authentication MongoDB Atlas ImageKit Cloud
```

---

## Authentication Flow

```
User Login
     │
     ▼
FastAPI verifies credentials
     │
     ▼
Generate JWT Token
     │
     ▼
Store Token in Local Storage
     │
     ▼
Axios attaches Authorization Header
     │
     ▼
Protected API Access
```

---

## Folder Structure

```
PixShare
│
├── app
│   ├── routers
│   ├── services
│   ├── auth.py
│   ├── database.py
│   ├── dependencies.py
│   ├── models.py
│   └── main.py
│
├── src
│   ├── api
│   ├── components
│   ├── hooks
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── services
│   ├── types
│   └── utils
│
├── package.json
├── pyproject.toml
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|----------|----------------|
| POST | /auth/register |
| POST | /auth/login |
| GET | /auth/me |

### Users

| Method | Endpoint |
|----------|----------------|
| GET | /users/me |
| PUT | /users/me |

### Posts

| Method | Endpoint |
|----------|----------------|
| GET | /posts |
| POST | /posts |
| DELETE | /posts/{id} |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Partha-sh/Fastapi-pbl.git

cd Fastapi-pbl
```

---

### Backend Setup

```bash
python -m venv .venv

source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
uvicorn app.main:app --reload
```

---

### Frontend Setup

```bash
npm install

npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=

DATABASE_NAME=

SECRET_KEY=

IMAGEKIT_PUBLIC_KEY=

IMAGEKIT_PRIVATE_KEY=

IMAGEKIT_URL_ENDPOINT=
```

---

### Frontend (.env)

```env
VITE_BACKEND_URL=
```

---

## Security

- Password hashing using Passlib
- JWT based Authentication
- Protected API Routes
- Authorization Middleware
- Cloud Image Storage
- Secure Environment Variables
- CORS Configuration

---

## Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Image Storage

- ImageKit

---

## Future Improvements

- Search Users
- Like System
- Comments
- Follow / Unfollow Users
- Notifications
- Infinite Scrolling
- Real-Time Chat
- WebSockets
- Docker
- GitHub Actions CI/CD
- Redis Caching

---

## Learning Outcomes

This project provided hands-on experience with building and deploying a cloud-native full-stack application. Throughout the development process, concepts such as REST API design, JWT authentication, dependency injection, MongoDB integration using Beanie ODM, cloud image storage with ImageKit, React Query for server state management, protected routing, deployment on Render and Vercel, environment configuration, CORS handling, and production debugging were explored. The project also strengthened practical understanding of scalable backend architecture and real-world deployment workflows.

---

## Screenshots

_Add screenshots of Login, Feed, Profile, Create Post, and Swagger UI here._

---

## Author

**Partha Sharma**

B.Tech Computer Science Engineering

Backend Developer | Machine Learning Enthusiast

GitHub: https://github.com/Partha-sh
