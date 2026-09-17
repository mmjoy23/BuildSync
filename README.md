# BuildSync - Property Management Platform

BuildSync is a modern property management platform featuring a React + Vite frontend and an Express + Prisma (PostgreSQL) backend API.

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18+ recommended
- **npm**: v9+
- **PostgreSQL**: v14+ (running locally or via Cloud instance)

---

## 🛠️ Step-by-Step Run Process

### 1. Backend Setup & Run

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL database credentials and configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/buildsync_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="1d"
   FRONTEND_URL="http://localhost:5173"
   ```

4. **Initialize Database & Seed Data:**
   Generate the Prisma Client, run migrations, and seed initial data:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

5. **Start the Backend Server:**
   ```bash
   npm run dev
   # OR
   npm start
   ```
   The backend API will run at: **`http://localhost:3001`**
   - Health check: `GET http://localhost:3001/api/health`

---

### 2. Frontend Setup & Run

1. **Open a new terminal window** in the project root directory.

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   The frontend app will run at: **`http://localhost:5173`**

4. *(Optional)* **Build for Production / Preview:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📁 Repository Structure

```
BuildSync/
├── backend/                   # Express.js & Prisma backend API
│   ├── prisma/                # Database schema (schema.prisma) & seed script
│   ├── src/                   # Server source code
│   │   ├── config/            # DB & env configs
│   │   ├── controllers/       # Controller handlers
│   │   ├── middleware/        # Auth & error handling middleware
│   │   ├── routes/            # Express routes
│   │   └── server.js          # App entry point
│   ├── .env.example           # Backend environment template
│   └── package.json
├── src/                       # React + Vite frontend source
│   ├── components/            # UI components
│   ├── context/               # React Context providers
│   ├── pages/                 # Application pages/views
│   ├── routes/                # Router configurations
│   ├── services/              # API interaction layer
│   ├── styles/                # Global & component styles
│   ├── App.jsx                # Main App component
│   └── main.jsx               # React entry point
├── index.html                 # Main HTML template
├── package.json               # Frontend package dependencies & scripts
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation
```

---

## ⚡ Summary of Scripts

### Root (Frontend)
- `npm run dev`: Start Vite development server (`http://localhost:5173`)
- `npm run build`: Build production assets into `dist/`
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run code linter (`oxlint`)

### Backend (`/backend`)
- `npm run dev` / `npm start`: Start Express server (`http://localhost:3001`)
- `npm run prisma:generate`: Generate Prisma Client
- `npm run prisma:migrate`: Apply database migrations
- `npm run seed`: Populate database with initial seed data
- `npm run test`: Run backend unit tests

