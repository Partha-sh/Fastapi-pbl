# PixShare Frontend

This repo now includes a complete React frontend for the existing PixShare FastAPI backend without changing any backend routes, files, or folder structure.

## Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- React Router v7
- TanStack Query
- Axios
- React Hook Form
- Zod
- Framer Motion
- Lucide React
- Sonner toasts

## What the frontend uses

Only these existing backend endpoints are consumed:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /users/me`
- `PUT /users/me`
- `GET /users/{username}`
- `POST /posts`
- `GET /posts`
- `GET /posts/{id}`
- `DELETE /posts/{id}`

## Notes about backend-aware behavior

- The backend does not currently expose CORS middleware, so the Vite dev server proxies API requests to the backend.
- Login uses the backend's OAuth form contract, which expects the email to be sent as the `username` field.
- Profile photo updates use a hosted image URL because the backend does not expose a dedicated profile image upload endpoint.
- The profile page builds a user's post list by reading the paginated feed endpoint, since there is no user-specific posts route.
- No mock data or invented endpoints are used anywhere in the UI.

## Frontend setup

1. Install frontend dependencies:

```bash
npm install
```

2. Add a frontend env value if you want to override the default backend URL:

```bash
cp .env.example .env
```

Set:

```bash
VITE_BACKEND_URL=http://127.0.0.1:8000
```

If you already use a root `.env` for FastAPI, just add the `VITE_BACKEND_URL` line to that existing file instead of replacing anything.

3. Start the frontend:

```bash
npm run dev
```

The Vite app runs at `http://127.0.0.1:5173/` by default.

## Backend run reminder

The frontend assumes your FastAPI API is already running locally. One common local command is:

```bash
uv run uvicorn app.main:app --reload
```

If you use a different command in your environment, keep using that.

## Production build

```bash
npm run build
```

## Frontend structure

```text
src/
  api/
  assets/
  components/
    common/
    layout/
    post/
    profile/
    ui/
  hooks/
  layouts/
  pages/
    Login/
    Register/
    Feed/
    CreatePost/
    Profile/
    EditProfile/
    NotFound/
  routes/
  services/
  types/
  utils/
```

## Delivered pages

- Login
- Register
- Feed
- Create Post
- Profile
- Edit Profile
- 404
