# BuildSync Backend & Database Layer

This is the backend API and database foundation for the **BuildSync Property Management Platform**.

## Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security & Validation:** bcryptjs, jsonwebtoken, zod, cors, dotenv

---

## Directory Structure
```
backend/
├── src/
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Route controller logic (Phase 2+)
│   ├── middleware/      # Auth, error, and validation middleware
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer (Phase 2+)
│   ├── validators/      # Zod request validation schemas (Phase 2+)
│   ├── utils/           # Helper utilities
│   └── server.js        # Express application entry point
├── prisma/
│   ├── schema.prisma    # Complete 17-model PostgreSQL schema
│   └── seed.js          # Database seed script
├── .env.example         # Environment template
├── package.json
└── README.md
```

---

## Setup & Running

### 1. Install Dependencies
```bash
cd backend
npm.cmd install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your PostgreSQL connection string:
```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/buildsync_db?schema=public"
PORT=3001
JWT_SECRET="your_jwt_secret"
```

### 3. Generate Prisma Client
```bash
npm.cmd run prisma:generate
```

### 4. Run Migrations
```bash
npm.cmd run prisma:migrate
```

### 5. Seed the Database
```bash
npm.cmd run seed
```

### 6. Start the Server
```bash
npm.cmd start
```
The server will start on `http://localhost:3001`.

---

## Health Check Endpoint
- **URL:** `GET /api/health`
- **Response:**
```json
{
  "success": true,
  "message": "BuildSync API is running"
}
```
