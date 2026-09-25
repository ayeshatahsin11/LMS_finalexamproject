# Pathway — Learning Management System

A full-stack MERN (MongoDB, Express, React/Next.js, Node.js) Learning Management
System built for the MERN Stack Development final project. Students browse and
enroll in courses, watch video lessons, and track their progress. Instructors
create and manage their own courses and lessons. Admins manage users, courses,
categories, the homepage banner, and reviews.

**Live demo:** [lms-finalexamproject.vercel.app](https://lms-finalexamproject.vercel.app)
**API base URL:** [lms-backend-n8nu.onrender.com](https://lms-backend-n8nu.onrender.com)

> Full endpoint reference: [`docs/API.md`](docs/API.md)

---

## Features

### Frontend
- User registration & login (JWT-based, role selection: student / instructor)
- Role-specific dashboards — Student, Instructor, and Admin
- Course listing with search, category filter, and level filter
- Course detail page with lessons, instructor info, and enrollment
- Video lesson player (YouTube embeds and direct video files)
- Per-lesson "mark as complete / undo" with a live, self-correcting progress bar
- User profile (edit info, change password)
- Fully responsive UI, built with Tailwind CSS
- Homepage: dynamic hero banner, category grid, popular-courses carousel,
  and a reviews marquee students/instructors can write into
- Form validation & inline error/success messaging throughout
- All admin management screens (users, courses, categories, banners, reviews)

### Backend
- RESTful API with Express.js
- JWT authentication & role-based authorization (student / instructor / admin)
- Full CRUD: courses, lessons, categories, homepage banners, reviews
- Enrollment & progress tracking that recalculates itself whenever a course's
  lesson list changes (adding/removing a lesson updates every enrolled
  student's percentage automatically, instead of going stale)
- Protected routes via middleware (`protect`, `authorizeRoles`)
- Server-side input validation and centralized error handling
- MongoDB + Mongoose, with ownership checks (an instructor can only edit
  their own courses) and referential-integrity guards (a user can't be
  hard-deleted while they still have courses/enrollments — the app
  prompts you to deactivate instead)
- Image & video uploads via Cloudinary (Multer, in-memory, streamed — no
  files ever touch the server's disk)
- Security: Helmet, rate limiting, bcrypt password hashing, CORS

---

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | Next.js (React), Tailwind CSS, Axios, lucide-react |
| Backend  | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth     | JSON Web Tokens (JWT), bcryptjs |
| Media    | Cloudinary, Multer |
| Hosting  | Vercel (frontend), Render (backend) |

---

## Project structure

```
LMS_finalexamproject/
├── backend/
│   ├── config/          # Database & Cloudinary connection setup
│   ├── controllers/      # Route handler logic
│   ├── middleware/       # Auth, role checks, file upload (multer)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express route definitions
│   ├── scripts/          # One-off DB seed scripts
│   └── index.js          # App entry point
│
└── frontend/
    └── src/
        ├── app/           # Next.js pages (App Router)
        ├── components/    # Reusable UI + admin/instructor management screens
        ├── context/       # AuthContext (global auth state)
        └── lib/           # Axios instance, shared hooks/constants
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [MongoDB](https://www.mongodb.com/) database (a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster works well)
- A free [Cloudinary](https://cloudinary.com/) account (for image/video uploads)

---

## Setup & installation

### 1. Clone the repository

```bash
git clone https://github.com/ayeshatahsin11/LMS_finalexamproject.git
cd LMS_finalexamproject
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5050
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

| Variable | Description |
|---|---|
| `PORT` | Port the API server runs on |
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify login tokens — any long random string |
| `CLIENT_URL` | The frontend's URL (used for CORS). Supports a comma-separated list if you ever deploy more than one frontend URL |
| `CLOUDINARY_*` | From your Cloudinary dashboard → API Keys |

Start the backend:

```bash
npm run dev      # with auto-restart (nodemon)
# or
npm start        # plain node
```

The API will be running at `http://localhost:5050`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

### 4. Seed starter data (optional but recommended)

The homepage's category grid and reviews marquee read from the database rather
than hardcoded content. Two scripts restore the original starter content:

```bash
cd backend
npm run seed:reviews       # 6 starter testimonials — no admin account needed
npm run seed:categories    # 6 starter categories — requires an admin account to exist first (see below)
```

### 5. Create your first admin account

There's no public "sign up as admin" option (by design — see [`docs/API.md`](docs/API.md)
for why). To get one:

1. Register a normal account from the app (`/register`) — it will be a `student` account.
2. Open your MongoDB database (e.g. MongoDB Atlas → Browse Collections, or
   [MongoDB Compass](https://www.mongodb.com/products/compass)) and find that
   user in the `users` collection.
3. Change its `role` field from `"student"` to `"admin"`, save.
4. Log out and back in on the site — you'll now land on the Admin Dashboard.

From there, that admin can promote/manage any other user directly from
`/admin/users` — no more manual database edits needed after the first one.

---

## User roles

| Role | Can do |
|---|---|
| **Student** | Browse/search courses, enroll, watch lessons, track & undo progress, write one review |
| **Instructor** | Everything a student can view, plus: create/edit/delete their own courses & lessons, see who's enrolled in their courses, write one review |
| **Admin** | Everything, plus: manage all users (roles, activate/deactivate, delete), manage all courses, manage categories, manage the homepage banner, moderate reviews |

---

## Deployment notes

- **Frontend (Vercel):** set `NEXT_PUBLIC_API_URL` to your deployed backend's
  `/api` URL in Vercel's Environment Variables.
- **Backend (Render):** set all the `backend/.env` variables above in Render's
  Environment tab. Make sure `CLIENT_URL` exactly matches your Vercel URL
  (no trailing slash) — a mismatch here is the most common cause of the
  frontend loading but no data ever showing up (CORS silently blocks every
  request).
- Both platforms auto-redeploy on push to the connected GitHub branch.

---

## Test credentials (for grading)

> These are seeded test accounts for evaluation purposes only — not real
> production credentials.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `456789` |

Log in with this account to access the Admin Dashboard (`/admin`) and its
management screens: Users, Courses, Categories, Homepage Banner, Reviews.
To test the Student/Instructor experience, register a new account from
`/register` and pick the relevant role.

---

## Author

Built by Ayesha Tahsin as the final project for the MERN Stack Development course.
