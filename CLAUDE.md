# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JordanList is a church kids management system with a points-based reward system. It uses a PostgreSQL database with Drizzle ORM for SQL injection prevention, Express backend, and React frontend with Vite.

## Development Commands

### Initial Setup

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp .env.example .env  # Edit if needed

# Start database
docker-compose up -d

# Check database is running
docker-compose ps
```

### Running the Application

```bash
# Terminal 1: Start backend (from backend/)
npm run dev        # Development with auto-reload
npm start          # Production mode

# Terminal 2: Start frontend (from frontend/)
npm run dev        # Runs on http://localhost:3000
```

### Backend Commands (from backend/)

```bash
npm start          # Start server (production)
npm run dev        # Start with nodemon (auto-reload)
```

Backend runs on `http://localhost:3001`.

### Frontend Commands (from frontend/)

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

Frontend runs on `http://localhost:3000`.

### Docker Commands

```bash
docker-compose up -d           # Start containers
docker-compose down            # Stop containers
docker-compose down -v         # Stop and remove volumes (deletes DB data)
docker-compose logs -f         # View logs
docker-compose ps              # Check container status
```

**pgAdmin Access:**
- URL: `http://localhost:5050`
- Email: `admin@jordanlist.com`
- Password: `admin123`

**Database Connection (in pgAdmin):**
- Host: `postgres` (container name)
- Port: `5432`
- Database: `jordanlist_db`
- Username: `jordanlist`
- Password: `jordanlist123`

## Architecture

### Backend Structure (MVC Pattern)

```
backend/
├── server.js              # Express app entry point
├── routes/               # Route handlers (controllers)
│   └── ninos.routes.js  # Ninos CRUD + points endpoints
├── services/            # Business logic layer
│   └── nino.service.js
├── libs/                # Database access layer
│   ├── database.js      # All DB operations using Drizzle
│   └── db.config.js     # Database connection config
├── schemas/             # Data schemas
│   ├── db.schema.js     # Drizzle table definitions + points values
│   └── nino.schema.js   # Validation schemas
└── init.sql             # Database initialization script
```

**Key Backend Patterns:**
- All database access goes through `libs/database.js`
- Drizzle ORM is used for ALL queries (never raw SQL strings)
- Routes delegate to services, services use database layer
- Points are stored as activity counts; total is calculated in DB using `sql` templates

### Frontend Structure (SPA)

```
frontend/src/
├── main.jsx             # React app entry point
├── App.jsx              # Root component (renders HomePage)
├── pages/               # Page components
│   └── HomePage.jsx     # Main application page
├── components/          # Reusable UI components
│   ├── NinosTable.jsx   # Table with points buttons
│   └── NinoForm.jsx     # Add/edit form
├── hooks/               # Custom React hooks
│   └── useNinos.js      # State management for ninos + CRUD
├── api/                 # API client layer
│   └── ninos.api.js     # Fetch calls to backend
├── config/              # Configuration
│   └── api.config.js    # API base URL
└── layouts/             # Page layouts
    └── MainLayout.jsx   # Main layout wrapper
```

**Key Frontend Patterns:**
- `useNinos` hook centralizes all state and API calls
- Components receive functions from `useNinos` (never call API directly)
- API calls are in `ninos.api.js` using fetch
- Data flows: API → useNinos → components

### Data Flow

```
User Action → Component → useNinos hook → ninos.api → Backend Route → Service → database.js → Drizzle ORM → PostgreSQL
```

### Database Schema

**Tables:**
- `ninos`: id, nombre, apellido, edad, created_at, updated_at
- `puntos`: id, nino_id (FK), traer_biblia, versiculo_memorizado, participacion, busqueda_rapida, traer_amigo, responder_preguntas, asistencia_puntual, realizar_oracion, total, created_at, updated_at

**Important:** `puntos` table stores **counts** of activities (how many times each activity was done), NOT the total points. The `total` column stores the calculated total points based on activity counts × point values.

### Points System

Defined in `backend/schemas/db.schema.js` as `puntosActividades`:

| Activity | Key | Points |
|----------|-----|--------|
| Traer la biblia | `traerBiblia` | 2 |
| Versículo memorizado | `versiculoMemorizado` | 2 |
| Participación | `participacion` | 1 |
| Búsqueda rápida | `busquedaRapida` | 2 |
| Traer un amigo | `traerAmigo` | 5 |
| Responder preguntas | `responderPreguntas` | 1 |
| Asistencia puntual | `asistenciaPuntual` | 1 |
| Realizar una oración | `realizarOracion` | 1 |

**Calculation Logic:**
- When adding points: increment activity count by 1, recalculate `total` using SQL formula
- Total = (count × points) for each activity, summed in database
- SQL calculation is in `database.js` `addPuntos` and `removePuntos` methods

## API Endpoints

**Base URL:** `http://localhost:3001/api`

### Ninos
- `GET /ninos` - Get all ninos with points
- `GET /ninos/:id` - Get single nino with points
- `POST /ninos` - Create nino
  - Body: `{ "nombre": "string", "apellido": "string", "edad": number }`
- `PUT /ninos/:id` - Update nino
  - Body: `{ "nombre": "string", "apellido": "string", "edad": number }`
- `DELETE /ninos/:id` - Delete nino (cascades to puntos)

### Points
- `POST /ninos/:id/puntos` - Add points to activity
  - Body: `{ "actividad": "traerBiblia" | "versiculoMemorizado" | ... }`
- `DELETE /ninos/:id/puntos` - Remove points from activity
  - Body: `{ "actividad": "traerBiblia" | "versiculoMemorizado" | ... }`

## Important Implementation Notes

### Security with Drizzle ORM

This project uses Drizzle ORM to prevent SQL injection. All queries MUST use Drizzle's API:

```javascript
// ❌ NEVER do this
const result = await pool.query(`SELECT * FROM ninos WHERE id = ${id}`);

// ✅ ALWAYS do this
const result = await db.select().from(ninos).where(eq(ninos.id, id));
```

### Database Operations

- All DB operations are in `backend/libs/database.js`
- Use `db.select()`, `db.insert()`, `db.update()`, `db.delete()` from Drizzle
- For dynamic SQL (like incrementing), use `sql` template literals from Drizzle
- IDs are always parsed as integers: `parseInt(id)`
- Use `eq()` helper for WHERE clauses

### Foreign Key Cascade

The `puntos` table has `onDelete: 'cascade'` - deleting a nino automatically deletes their puntos record.

### Frontend State Management

- The `useNinos` hook is the single source of truth for ninos data
- It provides: `ninos`, `loading`, `error`, and CRUD methods
- After mutations (create/update/delete/add points), it updates local state immediately
- Components should destructure what they need from `useNinos`

### Environment Variables

- Backend uses `.env` file (in root directory, NOT in backend/)
- Frontend can use `VITE_API_URL` but currently hardcoded in `config/api.config.js`
- Never commit `.env` file (it's in `.gitignore`)

## Technology Stack

- **Backend:** Node.js, Express, Drizzle ORM, pg (PostgreSQL driver)
- **Frontend:** React 19, Vite, SWC, Tailwind CSS 4
- **Database:** PostgreSQL 15 (Alpine)
- **Dev Tools:** nodemon, ESLint
- **Container:** Docker Compose (postgres + pgAdmin)
