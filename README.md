# Issue Tracker 

A modern, full-stack issue tracking application built with React, TypeScript, Node.js, Express, and PostgreSQL. This project demonstrates clean architecture, type safety, and professional development practices.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [Future Improvements](#future-improvements)

## ✨ Features

- **Complete CRUD Operations**: Create, read, update, and delete issues
- **Real-time Status Management**: Track issues through open, in-progress, and closed states
- **Responsive UI**: Clean, modern interface built with React and Tailwind CSS
- **Type-Safe**: End-to-end TypeScript implementation
- **RESTful API**: Well-structured API following REST conventions
- **Database Migrations**: Prisma ORM for type-safe database operations
- **Health Checks**: Built-in endpoint for monitoring service health

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM and migrations
- **PostgreSQL** - Relational database

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for database)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd sensoteq-issue-tracker
```

### 2. Database Setup

Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

This will start PostgreSQL on port `5332` with the following credentials:
- **Username**: `root`
- **Password**: `root`
- **Database**: `bank`

Verify the database is running:
```bash
docker ps
```

### 3. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Generate Prisma client:
```bash
npx prisma generate --schema=./src/prisma/schema.prisma
```

Run database migrations:
```bash
npx prisma migrate dev --schema=./src/prisma/schema.prisma --name init
```

Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 4. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```bash
VITE_API_BASE=http://localhost:3000/api
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 5. Verify Installation

- Visit `http://localhost:3000/health` - Should return `{"status": "ok"}`
- Visit `http://localhost:5173` - Should display the Issue Tracker UI
- Try creating a new issue to verify end-to-end functionality

## 📁 Project Structure
```
sensoteq-issue-tracker/
├── frontend/
│   ├── src/
│   │   ├── component/
│   │   │   └── IssueTracker.tsx    # Main UI component
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── issue.controller.ts  # Request handlers
│   │   ├── services/
│   │   │   └── issue.service.ts     # Business logic
│   │   ├── repositories/
│   │   │   └── issue.repository.ts  # Data access layer
│   │   ├── routes/
│   │   │   └── issue.routes.ts      # API routes
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   └── prisma.ts            # Prisma client
│   │   ├── app.ts                   # Express app setup
│   │   └── index.ts                 # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml               # PostgreSQL container
└── README.md
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Get All Issues
```http
GET /issues
```
Returns an array of all issues ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Bug in login",
    "description": "Users cannot log in with valid credentials",
    "status": "open",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

#### Get Issue by ID
```http
GET /issues/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Bug in login",
  "description": "Users cannot log in with valid credentials",
  "status": "open",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

#### Create Issue
```http
POST /issues
```

**Request Body:**
```json
{
  "title": "New issue title",
  "description": "Detailed description of the issue",
  "status": "open"
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "title": "New issue title",
  "description": "Detailed description of the issue",
  "status": "open",
  "created_at": "2025-01-15T11:00:00Z",
  "updated_at": "2025-01-15T11:00:00Z"
}
```

#### Update Issue
```http
PUT /issues/:id
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress"
}
```

**Response:** `200 OK`

#### Delete Issue
```http
DELETE /issues/:id
```

**Response:** `200 OK`
```json
{
  "message": "Issue deleted"
}
```

### Status Values
- `open` - Newly created or unassigned issues
- `in-progress` - Issues currently being worked on
- `closed` - Resolved or completed issues

## 🎯 Design Decisions

### Architecture

**Layered Architecture**
I implemented a clean separation of concerns with three distinct layers:

- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic and orchestration
- **Repositories**: Manage data access and database operations

This approach provides maintainability, testability, and clear boundaries between layers.

**Why this matters**: As the application grows, you can modify database logic without touching business rules, or change business logic without affecting API contracts.

### Database Design

**PostgreSQL with Prisma ORM**

I chose PostgreSQL for its reliability, ACID compliance, and excellent support for relational data. Prisma was selected for:

- Type-safe database queries
- Automatic migration generation
- Built-in connection pooling
- Excellent TypeScript integration

**Schema Design:**
```prisma
model Issue {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  status      String   @default("open")
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}
```

**Trade-offs**: 
- Used `String` for status instead of an enum to allow easier future expansion
- Single table design is sufficient for the current scope but could be normalized with a separate `Status` table for larger applications

### API Design

**RESTful Conventions**

The API follows REST principles with:
- Resource-based URLs (`/api/issues`)
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Appropriate status codes (200, 201, 404, 500)
- JSON request/response format

**Why PUT over PATCH**: I chose PUT for updates as we're replacing the entire resource. In a production system, PATCH would be more appropriate for partial updates.

### Frontend Architecture

**Component-Based React**

- Single main component (`IssueTracker`) handles all CRUD operations
- State management with React hooks (`useState`, `useEffect`)
- Form handling with controlled components
- Responsive design with Tailwind utility classes

**Trade-offs**:
- Monolithic component for simplicity within 4-hour constraint
- In production, this would be split into smaller, reusable components (IssueList, IssueForm, IssueCard, etc.)

### Styling

**Tailwind CSS**

Chosen for:
- Rapid development with utility classes
- Consistent design system
- Small bundle size with purging
- No context switching between files

Alternative considered: CSS Modules for better component encapsulation, but Tailwind was faster for the time constraint.

### Development Experience

- **TypeScript**: End-to-end type safety reduces runtime errors
- **Hot Reload**: Vite (frontend) and ts-node-dev (backend) for instant feedback
- **Docker Compose**: Consistent database setup across environments
- **Environment Variables**: Configuration flexibility without code changes

## 🚧 Future Improvements

### With More Time, I Would Add:

#### High Priority

1. **User Authentication**
   - JWT-based authentication
   - User ownership of issues
   - Role-based access control

2. **Enhanced Validation**
   - Input validation with Zod or Yup
   - Field length constraints
   - Enum validation for status values

3. **Error Handling**
   - Global error handler middleware
   - Structured error responses
   - User-friendly error messages in UI

4. **Testing**
   - Unit tests for services and repositories
   - Integration tests for API endpoints
   - E2E tests with Playwright
   - React component tests with React Testing Library

#### Medium Priority

5. **Search and Filtering**
   - Full-text search on title/description
   - Filter by status, date range
   - Sorting capabilities

6. **Pagination**
   - Cursor-based pagination for large datasets
   - Configurable page size
   - Total count in responses

7. **UI Enhancements**
   - Loading states and skeletons
   - Optimistic updates
   - Toast notifications for actions
   - Confirmation dialogs for destructive actions
   - Animations and transitions

8. **Database Optimizations**
   - Indexes on frequently queried fields
   - Separate Status enum table
   - Audit trail for changes

#### Nice to Have

9. **Advanced Features**
   - Issue comments/discussion threads
   - File attachments
   - Issue relationships (blocks, depends on)
   - Activity timeline
   - Email notifications

10. **DevOps**
    - CI/CD pipeline (GitHub Actions)
    - Docker multi-stage builds for production
    - Environment-specific configs
    - Database backup strategy
    - Monitoring and logging (Sentry, LogRocket)

11. **Code Quality**
    - ESLint configuration
    - Prettier for code formatting
    - Husky pre-commit hooks
    - Conventional commits

12. **Documentation**
    - OpenAPI/Swagger documentation
    - Component documentation with Storybook
    - Architecture decision records (ADRs)

## 🐛 Known Limitations

- No input validation beyond basic checks
- No error boundaries in React
- Limited error feedback to users
- No confirmation for delete operations
- Status stored as string instead of enum
- Single monolithic frontend component

## 📝 Additional Notes

### Time Allocation

- **Database & Backend**: 2 hours
  - Schema design, Prisma setup
  - API endpoints, layered architecture
  - Error handling, testing manually

- **Frontend**: 1.5 hours
  - Component structure
  - CRUD operations UI
  - Styling with Tailwind

- **Documentation & Polish**: 0.5 hours
  - README creation
  - Code comments
  - Final testing

### Development Environment

This project was developed and tested on:
- macOS/Linux
- Node.js v20.x
- Docker Desktop 4.x

## 🤝 Contributing

This is an assessment project, but suggestions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT

---

**Built with ❤️ for Sensoteq Technical Assessment**
