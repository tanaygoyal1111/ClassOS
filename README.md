<div align="center">

# ClassOS

### AI-Powered Assessment Platform for Educators

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](#)

**ClassOS** transforms the way educators create assessments. Upload your study material, configure question parameters, and let AI generate professionally structured question papers — in seconds, not hours.

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## Table of Contents

- [About](#about)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## About

ClassOS is a full-stack SaaS platform that empowers educators to automate assessment creation using large language models. It replaces the tedious, manual process of writing question papers with an intelligent system that understands context, maintains difficulty balance, and outputs print-ready documents.

**The Problem:** Teachers spend 3-5 hours per question paper — manually selecting questions, balancing difficulty, formatting sections, and ensuring syllabus coverage.

**The Solution:** ClassOS reduces this to under 60 seconds. Upload content → Configure parameters → Get a professional paper.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                       │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
                ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│      Next.js Frontend    │  │     Express.js Backend       │
│  ┌────────────────────┐  │  │  ┌────────────────────────┐  │
│  │  App Router (SSR)  │  │  │  │  REST API (v1)         │  │
│  │  NextAuth (JWT)    │  │  │  │  Document Parsing      │  │
│  │  API Routes        │  │  │  │  LLM Service (Groq)    │  │
│  │  Zustand Store     │  │  │  │  BullMQ Job Queue      │  │
│  │  Tailwind CSS 4    │  │  │  │  Multer (File Upload)  │  │
│  └────────────────────┘  │  │  └────────────────────────┘  │
│          :3000            │  │          :5000               │
└──────────┬───────────────┘  └──────────┬───────────────────┘
           │                             │
           ▼                             ▼
┌──────────────────────────────────────────────────────────────┐
│                      MongoDB Atlas                           │
│  Users · Assignments · LessonPlans · Rubrics · Concepts     │
└──────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Redis (Upstash / Local)                    │
│                    BullMQ Job Queue                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | Server-side rendering, API routes, app router |
| **Styling** | Tailwind CSS 4, Lucide Icons | Utility-first CSS, icon system |
| **State** | Zustand | Lightweight client-side state management |
| **Auth** | NextAuth v4, Google OAuth, MongoDB Adapter | Authentication, session management, JWT strategy |
| **Backend** | Express 5, TypeScript | REST API server, middleware pipeline |
| **AI/LLM** | Groq SDK (Llama 3.3 70B) | Question paper generation via LLM |
| **Database** | MongoDB Atlas, Mongoose 9 | Document database for all persistent data |
| **Queue** | BullMQ, Redis (Upstash) | Async job processing for LLM generation |
| **File Parsing** | Multer, pdf-parse, Mammoth | Upload and extract text from PDF/DOCX |
| **Validation** | Zod 4 | Runtime schema validation |
| **Export** | jsPDF, html-to-image | Client-side PDF generation and export |

---

## Features

### 🎯 Core Features
- **AI Question Paper Generation** — Upload study material (PDF/DOCX/text), configure parameters (subject, class, marks, question types), and generate a full paper via Llama 3.3 70B.
- **Smart Sectioning** — Auto-organizes questions into MCQs, Short Answer, and Long Answer sections with proper mark distribution.
- **Difficulty Balancing** — Intelligent mix of Easy, Moderate, and Hard questions based on configurable ratios.
- **PDF Export** — Download professionally formatted, print-ready question papers.

### 🧰 Educator Toolkit
- **Lesson Planner** — AI-generated lesson plans aligned to topics, duration, and learning objectives.
- **Rubric Creator** — Structured grading rubrics with criteria, levels, and descriptors.
- **Concept Simplifier** — Break down complex topics into student-friendly explanations.

### 📚 Library & Management
- **Unified Library** — Browse all saved assignments, lesson plans, rubrics, and concepts in one place with parallel data fetching.
- **Assignment CRUD** — Create, view, preview, and delete assignments with a multi-step wizard.
- **Classroom Groups** — Organize classes/sections for future assignment distribution.

### 🔒 Security & Auth
- **Google OAuth** — Seamless sign-in via NextAuth with MongoDB session adapter.
- **Route Guards** — Server-side middleware protects all authenticated routes.
- **Security Headers** — HSTS, CSP, X-Frame-Options, and CORS configured in production.

### 📱 Responsive Design
- **Mobile-First** — Dedicated `MobileHeader` and `MobileBottomNav` components.
- **Adaptive Layouts** — Sidebar collapses on mobile, full dashboard on desktop.

---

## Getting Started

### Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| Node.js | ≥ 18.x | ✅ |
| npm | ≥ 9.x | ✅ |
| MongoDB Atlas Account | — | ✅ |
| Google Cloud Console (OAuth) | — | ✅ |
| Redis (local or Upstash) | — | ✅ |
| Groq API Key | — | ✅ |

### Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories:

**`frontend/.env`**
```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/classos

# NextAuth
NEXTAUTH_SECRET=your-random-secret-string
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**`backend/.env`**
```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/classos

# Redis (Upstash or Local)
REDIS_URL=rediss://default:token@region.upstash.io:6379
# OR for local Redis:
# REDIS_HOST=127.0.0.1
# REDIS_PORT=6379

# Groq LLM
GROQ_API_KEY=gsk_your_groq_api_key

# Server
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/classos.git
cd classos

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running Locally

Open **two terminal windows**:

```bash
# Terminal 1 — Frontend (Next.js)
cd frontend
npm run dev
# → Running at http://localhost:3000

# Terminal 2 — Backend (Express)
cd backend
npm run dev
# → Running at http://localhost:5000
```

---

## Project Structure

```
classos/
├── frontend/                    # Next.js 16 Application
│   ├── public/                  # Static assets (SVGs, favicon)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── auth/       # NextAuth catch-all route
│   │   │   │   ├── assignments/# Assignment CRUD API
│   │   │   │   ├── toolkit/    # Lesson Plan, Rubric, Concept APIs
│   │   │   │   ├── library/    # Unified library fetch
│   │   │   │   ├── groups/     # Group management API
│   │   │   │   └── profile/    # User profile API
│   │   │   ├── dashboard/      # Main dashboard page
│   │   │   ├── assignments/    # Assignment pages (list, create, view, output)
│   │   │   ├── toolkit/        # Toolkit pages (lesson planner, rubric, concept)
│   │   │   ├── library/        # Unified library page
│   │   │   ├── groups/         # Classroom groups
│   │   │   ├── paper/          # Print-ready paper renderer
│   │   │   ├── login/          # Authentication page
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Landing / marketing page
│   │   ├── components/
│   │   │   ├── Sidebar.tsx     # Desktop sidebar navigation
│   │   │   ├── Topbar.tsx      # Desktop top bar
│   │   │   ├── MobileHeader.tsx# Mobile responsive header
│   │   │   ├── MobileBottomNav.tsx # Mobile bottom navigation
│   │   │   ├── CreateAssignment.tsx
│   │   │   ├── AssignmentCard.tsx
│   │   │   ├── StepOneBasics.tsx   # Multi-step form: Step 1
│   │   │   ├── StepTwoStructure.tsx# Multi-step form: Step 2
│   │   │   └── shared/         # Shared components (PaperRenderer)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Auth options, MongoDB/Mongoose connections
│   │   ├── models/             # Mongoose models (frontend API routes)
│   │   └── store/              # Zustand stores
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                     # Express.js API Server
│   ├── src/
│   │   ├── config/             # MongoDB + Redis connection configs
│   │   ├── controllers/        # Route handlers (document, generation, group)
│   │   ├── middlewares/        # Error handler, Multer upload
│   │   ├── models/             # Mongoose models (backend)
│   │   ├── queue/              # BullMQ assignment generation queue
│   │   ├── routes/             # Express route definitions
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # LLM service, parsing service
│   │   ├── utils/              # Prompt builder for LLM
│   │   └── server.ts           # Express app entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## API Reference

### Backend API (`/api/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/parse-document` | Upload and extract text from PDF/DOCX |
| `POST` | `/api/v1/generate` | Submit assignment generation job to queue |
| `GET` | `/api/v1/job-status/:jobId` | Poll job progress and retrieve results |
| `POST` | `/api/v1/groups` | Create a new classroom group |
| `GET` | `/api/v1/groups` | List all groups |
| `GET` | `/api/v1/groups/:id` | Get a specific group |

### Frontend API Routes (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `*` | `/api/auth/[...nextauth]` | NextAuth authentication handler |
| `GET/POST` | `/api/assignments` | List or create assignments |
| `GET/DELETE` | `/api/assignments/[id]` | Get or delete a specific assignment |
| `GET/POST` | `/api/toolkit/lesson-plan` | Generate a lesson plan |
| `POST` | `/api/toolkit/lesson-plan/save` | Save a lesson plan |
| `GET/POST` | `/api/toolkit/rubric-creator` | Generate a rubric |
| `POST` | `/api/toolkit/rubric-creator/save` | Save a rubric |
| `GET/POST` | `/api/toolkit/concept-simplifier` | Generate simplified concepts |
| `POST` | `/api/toolkit/concept-simplifier/save` | Save simplified concepts |
| `GET` | `/api/library` | Fetch all saved resources in parallel |
| `GET/PUT` | `/api/profile` | Get or update user profile |
| `GET/POST` | `/api/groups` | List or create groups |

---

## Deployment

### Recommended Stack

| Service | Platform | Why |
|---------|----------|-----|
| **Frontend** | [Vercel](https://vercel.com) | Zero-config Next.js deployments, edge network, automatic preview deploys |
| **Backend** | [Railway](https://railway.app) or [Render](https://render.com) | Always-on Node.js servers with persistent processes (required for BullMQ workers) |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) | Free tier (512 MB), automatic backups, global clusters |
| **Redis** | [Upstash](https://upstash.com) | Serverless Redis, free tier (10K commands/day), TLS built-in |

> **⚠️ Why NOT Vercel for the backend?**
> The Express backend uses BullMQ workers that must run as persistent, long-lived processes. Vercel's serverless functions have a max execution time of 60 seconds (Pro plan) and cannot maintain persistent Redis connections or background workers. Use Railway or Render instead.

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the frontend directory
cd frontend
vercel

# Set environment variables in Vercel Dashboard:
# MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL,
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_BACKEND_URL
```

### Backend Deployment (Railway)

```bash
# Connect your GitHub repo to Railway
# Set root directory to /backend
# Railway auto-detects Node.js and runs `npm start`

# Add a start script to backend/package.json:
# "start": "tsx src/server.ts"

# Set environment variables:
# MONGODB_URI, REDIS_URL, GROQ_API_KEY, PORT, CORS_ORIGIN
```

### Post-Deployment Checklist

- [ ] Set `NEXTAUTH_URL` to your production frontend URL (e.g., `https://classos.vercel.app`)
- [ ] Set `CORS_ORIGIN` to your production frontend URL
- [ ] Set `NEXT_PUBLIC_BACKEND_URL` to your production backend URL (e.g., `https://classos-api.up.railway.app`)
- [ ] Add production frontend URL to Google OAuth Authorized redirect URIs
- [ ] Verify MongoDB Atlas network access allows Railway/Render IPs (or set to `0.0.0.0/0`)
- [ ] Test the full flow: Login → Create Assignment → Generate → Export PDF

---

## Security

### CORS Policy
The backend enforces strict CORS that only allows requests from the configured frontend origin. No wildcard origins in production.

```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
```

### Security Headers (Next.js)
The frontend ships with hardened HTTP headers configured in `next.config.ts`:

| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | Restrictive policy allowing self, inline styles, and HTTPS images |

### Route Protection
- **Middleware-level guards** — `middleware.ts` intercepts all navigation. Unauthenticated users are redirected from protected routes. Authenticated users are redirected away from login.
- **API-level auth** — NextAuth sessions validated on all API routes via `getServerSession()`.

---

## Contributing

This is currently a private project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

This project is **proprietary** and not open-sourced. All rights reserved.

---

<div align="center">

**Built with ❤️ for educators, by educators.**

ClassOS © 2025. All rights reserved.

</div>
