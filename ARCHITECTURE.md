# ARCHITECTURE.md - JordanList v2

## 1. Estado Actual del Proyecto

### Entidades Existentes

| Tabla | Campos Clave | Propósito |
|-------|-------------|-----------|
| `users` | id, email, password (bcrypt), nombre, role (guest/admin), refreshToken | Autenticación y autorización |
| `ninos` | id, nombre, apellido, edad, created_at, updated_at | Registro de niños |
| `puntos` | id, nino_id (FK), 8 columnas de actividad, total (calculado), timestamps | Conteo de actividades y puntaje total |

### Stack Actual

- **Backend:** Express 4, Drizzle ORM 0.45, pg, bcryptjs, jsonwebtoken, cookie-parser
- **Frontend:** React 19, Vite 7, Tailwind CSS 4, React Router DOM 6, Lucide React
- **Database:** PostgreSQL 15 (Alpine) via Docker Compose
- **Auth:** JWT manual (access 15m + refresh 7d) en HTTP-only cookies
- **Roles:** guest (solo lectura), admin (CRUD completo)

### Endpoints Actuales

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/ninos
GET    /api/ninos/:id
POST   /api/ninos          (admin)
PUT    /api/ninos/:id       (admin)
DELETE /api/ninos/:id       (admin)
POST   /api/ninos/:id/puntos   (admin)
DELETE /api/ninos/:id/puntos   (admin)
```

### Limitaciones Actuales

1. No hay sistema de temporadas - los puntos se acumulan indefinidamente
2. No hay juegos ni gamificación interactiva
3. No hay lecturas bíblicas ni progreso de lectura
4. No hay badges ni recompensas visuales
5. No hay leaderboard en tiempo real
6. No hay portal de padres
7. Solo 2 roles (admin/guest), sin roles para líderes o padres
8. Frontend SPA sin SSR - peor SEO y carga inicial más lenta
9. Sin sistema de notificaciones
10. Sin auditoría de acciones

---

## 2. Nuevo Stack Tecnológico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| **Frontend** | Next.js 15 (App Router, RSC) | SSR, RSC, layouts anidados, mejor performance |
| **UI** | shadcn/ui + Tailwind CSS 4 | Componentes accesibles, tema personalizable, orientado a niños |
| **Backend API** | Hono | Ligero, tipado, edge-ready, middleware composable |
| **ORM** | Drizzle ORM (migración directa) | Ya lo usamos, zero overhead, SQL-like API |
| **Auth** | Better Auth | OAuth, sesiones, RBAC integrado, menos código manual |
| **Database** | PostgreSQL 15 (Supabase en producción) | Realtime subscriptions, Row Level Security, backups |
| **Realtime** | Supabase Realtime (WebSocket) | Leaderboard en vivo durante culto infantil |
| **Deploy** | Vercel (frontend) + Supabase (DB + API) | Zero-config, edge functions, preview deployments |

### Convenciones

- **TypeScript** en todo el proyecto (strict mode)
- **camelCase** en TypeScript/JavaScript
- **snake_case** en columnas de base de datos
- **kebab-case** en nombres de archivo y rutas
- Todos los endpoints requieren autenticación excepto `/auth/*`
- Nunca commitear sin pasar los tipos de TypeScript (`tsc --noEmit`)
- Los componentes de juegos deben tener loading state y error boundary

---

## 3. Schema de Base de Datos (Drizzle + PostgreSQL)

### Diagrama de Relaciones

```
users ─────────────── user_profiles
  │                        │
  │ (líder)                │ (padre → hijo)
  │                        │
  ├── seasons ◄──── scores ┤
  │                  │     │
  │           game_sessions │
  │                  │     │
  │                games   │
  │                        │
  ├── reading_progress     │
  │         │              │
  │      readings          │
  │                        │
  ├── badges_earned ◄── badges
  │
  └── audit_log
```

### Tablas

#### `roles`
Define los roles del sistema.

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,    -- 'admin', 'leader', 'parent', 'child'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `permissions`
Permisos granulares asignables a roles.

```sql
CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,   -- 'manage_children', 'view_scores', 'play_games'
  description TEXT
);
```

#### `role_permissions`
Tabla pivote roles <-> permisos.

```sql
CREATE TABLE role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
```

#### `users`
Usuarios del sistema (migración desde tabla actual).

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role_id INTEGER REFERENCES roles(id) NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_profiles`
Perfil extendido (para niños: edad, grado; para padres: teléfono, etc.).

```sql
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER,
  grade VARCHAR(50),             -- grado escolar
  phone VARCHAR(20),
  parent_id INTEGER REFERENCES users(id),  -- vínculo padre → hijo
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `seasons`
Temporadas para resetear puntos periódicamente.

```sql
CREATE TABLE seasons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,       -- 'Temporada Enero-Marzo 2026'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `readings`
Catálogo de lecturas bíblicas asignables.

```sql
CREATE TABLE readings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  bible_reference VARCHAR(100) NOT NULL,  -- 'Juan 3:16-21'
  content TEXT,
  difficulty VARCHAR(20) DEFAULT 'easy',  -- 'easy', 'medium', 'hard'
  points_value INTEGER DEFAULT 5,
  season_id INTEGER REFERENCES seasons(id),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `reading_progress`
Progreso de lectura por niño.

```sql
CREATE TABLE reading_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reading_id INTEGER REFERENCES readings(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'in_progress', 'completed'
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, reading_id)
);
```

#### `games`
Catálogo de juegos disponibles.

```sql
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,    -- 'trivia-biblica', 'busqueda-rapida'
  description TEXT,
  game_type VARCHAR(50) NOT NULL,       -- 'trivia', 'speed', 'memory', 'puzzle'
  config JSONB DEFAULT '{}',            -- configuración específica del juego
  points_per_correct INTEGER DEFAULT 1,
  max_points INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `game_sessions`
Sesiones de juego individuales.

```sql
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  season_id INTEGER REFERENCES seasons(id),
  score INTEGER DEFAULT 0,
  max_score INTEGER,
  duration_seconds INTEGER,
  answers JSONB DEFAULT '[]',           -- respuestas detalladas
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `scores`
Puntuación consolidada por niño, temporada y categoría.

```sql
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,        -- 'attendance', 'reading', 'game', 'activity'
  activity_key VARCHAR(100),            -- 'traer_biblia', 'trivia_session_42', etc.
  points INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  awarded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scores_user_season ON scores(user_id, season_id);
CREATE INDEX idx_scores_leaderboard ON scores(season_id, points DESC);
```

#### `badges`
Catálogo de insignias.

```sql
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB NOT NULL,              -- { "type": "total_points", "threshold": 100 }
  tier VARCHAR(20) DEFAULT 'bronze',    -- 'bronze', 'silver', 'gold', 'platinum'
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `badges_earned`
Badges obtenidos por cada niño.

```sql
CREATE TABLE badges_earned (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
  season_id INTEGER REFERENCES seasons(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id, season_id)
);
```

#### `audit_log`
Registro de acciones para transparencia.

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  actor_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,         -- 'score.add', 'user.create', 'season.close'
  target_type VARCHAR(50),              -- 'user', 'score', 'game_session'
  target_id INTEGER,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_action ON audit_log(action);
```

### Migración de Datos Existentes

```
users (actual)     → users (nuevo) + user_profiles
ninos (actual)     → users con role='child' + user_profiles (edad)
puntos (actual)    → scores (una fila por actividad, season_id=1 para temporada legacy)
```

---

## 4. Sistema RBAC (Role-Based Access Control)

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **admin** | Todo: gestionar usuarios, roles, temporadas, juegos, lecturas, scores, badges, ver auditoría |
| **leader** | Gestionar niños de su grupo, asignar puntos, crear lecturas, ver dashboard de actividad, exportar reportes |
| **parent** | Ver progreso de sus hijos, historial de puntos, badges ganados. Solo lectura |
| **child** | Jugar juegos, ver sus lecturas, ver su propio progreso, ver leaderboard público |

### Middleware de Permisos (Hono)

```typescript
// Ejemplo de uso en endpoints
app.get('/api/scores', auth(), requirePermission('view_scores'), handler)
app.post('/api/scores', auth(), requirePermission('manage_scores'), handler)
app.get('/api/games/:id/play', auth(), requirePermission('play_games'), handler)
```

---

## 5. API Endpoints (Hono)

### Auth (`/api/auth`)
```
POST   /register          -- Crear cuenta (público)
POST   /login             -- Iniciar sesión (público)
POST   /logout            -- Cerrar sesión
POST   /refresh           -- Renovar token
GET    /me                -- Usuario actual
POST   /forgot-password   -- Recuperar contraseña
POST   /reset-password    -- Resetear contraseña
```

### Users (`/api/users`)
```
GET    /                  -- Listar usuarios (admin, leader)
GET    /:id               -- Detalle de usuario
POST   /                  -- Crear usuario (admin)
PUT    /:id               -- Actualizar usuario (admin, leader para su grupo)
DELETE /:id               -- Eliminar usuario (admin)
GET    /:id/children      -- Hijos de un padre (parent, admin)
```

### Seasons (`/api/seasons`)
```
GET    /                  -- Listar temporadas
GET    /active            -- Temporada activa
POST   /                  -- Crear temporada (admin)
PUT    /:id               -- Actualizar temporada (admin)
POST   /:id/activate      -- Activar temporada (admin)
POST   /:id/close         -- Cerrar temporada (admin)
```

### Games (`/api/games`)
```
GET    /                  -- Listar juegos disponibles
GET    /:id               -- Detalle del juego
POST   /                  -- Crear juego (admin)
PUT    /:id               -- Actualizar juego (admin)
POST   /:id/play          -- Iniciar sesión de juego (child)
POST   /:id/submit        -- Enviar respuestas (child)
GET    /:id/leaderboard   -- Top scores del juego
```

### Readings (`/api/readings`)
```
GET    /                  -- Listar lecturas (filtrar por temporada)
GET    /:id               -- Detalle de lectura
POST   /                  -- Crear lectura (admin, leader)
PUT    /:id               -- Actualizar lectura (admin, leader)
DELETE /:id               -- Eliminar lectura (admin)
POST   /:id/complete      -- Marcar como completada (child)
GET    /progress           -- Progreso del usuario actual
```

### Scores (`/api/scores`)
```
GET    /                  -- Scores del usuario actual (o filtrar por user_id si admin)
POST   /                  -- Asignar puntos (admin, leader)
DELETE /:id               -- Revertir puntos (admin)
GET    /summary/:userId   -- Resumen por categoría
```

### Leaderboard (`/api/leaderboard`)
```
GET    /                  -- Leaderboard de temporada activa
GET    /season/:id        -- Leaderboard de temporada específica
WS     /realtime          -- WebSocket para actualizaciones en vivo
```

### Badges (`/api/badges`)
```
GET    /                  -- Catálogo de badges
GET    /earned            -- Badges del usuario actual
POST   /check             -- Evaluar y otorgar badges pendientes (admin, sistema)
```

---

## 6. Estructura de Carpetas (Monorepo)

```
jordan-kids/
├── apps/
│   └── web/                          # Next.js 15 App
│       ├── app/
│       │   ├── (auth)/               # Grupo de rutas públicas
│       │   │   ├── login/page.tsx
│       │   │   ├── register/page.tsx
│       │   │   └── layout.tsx
│       │   ├── (dashboard)/          # Grupo de rutas protegidas
│       │   │   ├── layout.tsx        # Sidebar + header por rol
│       │   │   ├── page.tsx          # Home/redirect por rol
│       │   │   ├── children/
│       │   │   │   ├── page.tsx      # Lista de niños (RSC)
│       │   │   │   └── [id]/page.tsx # Perfil del niño
│       │   │   ├── games/
│       │   │   │   ├── page.tsx      # Catálogo de juegos
│       │   │   │   └── [slug]/
│       │   │   │       └── play/page.tsx  # Juego interactivo (client)
│       │   │   ├── readings/
│       │   │   │   ├── page.tsx      # Biblioteca de lecturas (RSC)
│       │   │   │   └── [id]/page.tsx # Lectura individual
│       │   │   ├── leaderboard/
│       │   │   │   └── page.tsx      # Leaderboard (realtime)
│       │   │   ├── scores/
│       │   │   │   └── page.tsx      # Gestión de puntos (leader/admin)
│       │   │   ├── seasons/
│       │   │   │   └── page.tsx      # Gestión de temporadas (admin)
│       │   │   ├── reports/
│       │   │   │   └── page.tsx      # Dashboard + exportar (leader/admin)
│       │   │   └── settings/
│       │   │       └── page.tsx      # Configuración de cuenta
│       │   ├── api/
│       │   │   └── [...route]/route.ts  # Hono catch-all route handler
│       │   ├── layout.tsx            # Root layout
│       │   └── globals.css
│       ├── components/
│       │   ├── ui/                   # shadcn/ui components
│       │   ├── games/                # Componentes de juegos
│       │   │   ├── trivia-game.tsx
│       │   │   ├── speed-search.tsx
│       │   │   ├── memory-game.tsx
│       │   │   └── game-wrapper.tsx  # Error boundary + loading
│       │   ├── scores/
│       │   │   ├── score-table.tsx
│       │   │   ├── points-button.tsx
│       │   │   └── activity-picker.tsx
│       │   ├── readings/
│       │   │   ├── reading-card.tsx
│       │   │   └── progress-bar.tsx
│       │   ├── leaderboard/
│       │   │   ├── leaderboard-table.tsx
│       │   │   └── realtime-score.tsx
│       │   ├── badges/
│       │   │   ├── badge-card.tsx
│       │   │   └── badge-collection.tsx
│       │   └── layout/
│       │       ├── sidebar.tsx
│       │       ├── header.tsx
│       │       └── role-nav.tsx
│       ├── lib/
│       │   ├── auth.ts               # Better Auth config
│       │   ├── db.ts                 # Drizzle client
│       │   ├── supabase.ts           # Supabase client (realtime)
│       │   └── utils.ts              # Helpers (cn, formatters)
│       ├── hooks/
│       │   ├── use-realtime-scores.ts
│       │   ├── use-game-state.ts
│       │   └── use-timer.ts
│       ├── public/
│       │   ├── badges/               # Badge icons
│       │   └── sounds/               # Game sound effects
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── db/                           # Schema y migraciones compartidas
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── roles.ts
│   │   │   ├── seasons.ts
│   │   │   ├── games.ts
│   │   │   ├── readings.ts
│   │   │   ├── scores.ts
│   │   │   ├── badges.ts
│   │   │   ├── audit.ts
│   │   │   └── index.ts
│   │   ├── migrations/
│   │   ├── seed.ts                   # Datos iniciales (roles, permisos, badges)
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   └── shared/                       # Tipos y constantes compartidas
│       ├── types/
│       │   ├── api.ts
│       │   ├── game.ts
│       │   └── score.ts
│       ├── constants/
│       │   ├── activities.ts         # Definición de actividades y puntos
│       │   ├── permissions.ts
│       │   └── game-config.ts
│       └── package.json
│
├── docker-compose.yaml               # PostgreSQL + pgAdmin (dev)
├── .env.example
├── package.json                       # Workspace root
├── turbo.json                         # Turborepo config
├── tsconfig.base.json
├── CLAUDE.md
├── ARCHITECTURE.md
└── README.md
```

---

## 7. Sistema de Puntos Expandido

### Categorías de Puntos

| Categoría | Fuente | Puntos |
|-----------|--------|--------|
| **Asistencia** | Asistencia puntual | 1 |
| **Actividad** | Traer biblia (2), Versículo memorizado (2), Participación (1), Búsqueda rápida (2), Traer amigo (5), Responder preguntas (1), Realizar oración (1) |  |
| **Lectura** | Completar lectura asignada | 3-10 (según dificultad) |
| **Juego** | Score en trivia, speed search, memory, etc. | Variable (según juego) |
| **Badge bonus** | Desbloquear badge | 5-25 (según tier) |

### Cálculo de Leaderboard

```sql
SELECT
  u.id, u.name, up.avatar_url,
  SUM(s.points) as total_points,
  COUNT(DISTINCT be.badge_id) as badges_count
FROM users u
JOIN user_profiles up ON up.user_id = u.id
JOIN scores s ON s.user_id = u.id AND s.season_id = :active_season
LEFT JOIN badges_earned be ON be.user_id = u.id AND be.season_id = :active_season
WHERE u.role_id = (SELECT id FROM roles WHERE name = 'child')
GROUP BY u.id, u.name, up.avatar_url
ORDER BY total_points DESC;
```

---

## 8. Leaderboard en Tiempo Real

### Flujo

```
Niño gana puntos
  → API inserta en `scores`
  → Supabase Realtime detecta INSERT en `scores`
  → WebSocket broadcast a todos los clientes conectados
  → Componente React actualiza ranking con animación
```

### Implementación

- **Backend:** Supabase client escucha cambios en tabla `scores`
- **Frontend:** Hook `useRealtimeScores` se suscribe al canal de leaderboard
- **Proyección:** Página `/leaderboard` diseñada para pantalla grande en culto infantil
- **Animaciones:** Cambio de posición con Framer Motion, confetti en top 3

---

## 9. Juegos Interactivos

### Tipos de Juego

| Juego | Tipo | Descripción | Puntos |
|-------|------|-------------|--------|
| **Trivia Bíblica** | trivia | Preguntas de opción múltiple con timer | 1-3 por pregunta |
| **Búsqueda Rápida** | speed | Encontrar versículo en la biblia lo más rápido posible | Basado en tiempo |
| **Memoria Bíblica** | memory | Emparejar versículos con sus citas | 2 por par |
| **Rompecabezas** | puzzle | Ordenar versículo desordenado | 5 por completar |

### Flujo del Juego (Trivia)

```
1. Niño selecciona juego → GET /api/games/trivia-biblica
2. Inicia sesión → POST /api/games/:id/play → game_session.id
3. Recibe preguntas (del config JSONB o generadas)
4. Por cada respuesta:
   - UI muestra feedback inmediato (correcto/incorrecto)
   - Acumula score localmente
5. Al terminar → POST /api/games/:id/submit
   - Backend valida respuestas
   - Inserta score en `scores`
   - Evalúa badges
   - Retorna resultado + badges nuevos
6. UI muestra resumen: puntos ganados, posición en leaderboard, badges
```

---

## 10. Plan de Migración por Fases

### FASE 1: Arquitectura (esta fase)
- [x] Análisis del código actual
- [x] Mapeo de entidades existentes
- [x] ARCHITECTURE.md completo
- [ ] Actualizar CLAUDE.md con nuevo stack

### FASE 2: Backend
- [ ] Inicializar monorepo con Turborepo
- [ ] Package `db`: schema Drizzle completo en TypeScript
- [ ] Package `shared`: tipos y constantes
- [ ] App `web`: configurar Next.js 15 + Hono como API route handler
- [ ] Better Auth: setup con roles y permisos
- [ ] Endpoints CRUD: users, seasons, games, readings, scores, badges
- [ ] Middleware RBAC por endpoint
- [ ] WebSocket handler para leaderboard
- [ ] Migración de datos: script para mover users, ninos, puntos al nuevo schema
- [ ] Seed: roles, permisos, badges iniciales, temporada legacy

### FASE 3: Frontend
- [ ] Layout principal con navegación por rol
- [ ] Páginas RSC: biblioteca de lecturas, perfil del niño, leaderboard
- [ ] Componentes client: juego de trivia, timer, animaciones
- [ ] Dashboard de líderes: tabla de asistencia, gráficas, exportar reporte
- [ ] Portal de padres: progreso del hijo, historial
- [ ] Diseño orientado a niños: colorido, grande, accesible, gamificación

### FASE 4: UI/UX
- [ ] Flujo completo del juego de trivia
- [ ] Sistema de feedback visual: confetti, sonidos, celebración
- [ ] Componentes de progreso: barra de lectura, badges, nivel
- [ ] Pantalla de leaderboard animada para proyectar en culto

### FASE 5: Calidad
- [ ] Seguridad: niños no pueden ver datos de otros sin permiso
- [ ] Validación de rol en cada endpoint
- [ ] Performance: eliminar N+1, índices en FK
- [ ] Accesibilidad: WCAG AA mínimo para interfaz de niños

---

## 11. Decisiones Arquitecturales Clave

| Decisión | Razón |
|----------|-------|
| **Monorepo con Turborepo** | Schema y tipos compartidos entre API y frontend sin duplicación |
| **Hono dentro de Next.js API routes** | Un solo deploy, sin servidor separado, edge-compatible |
| **Better Auth sobre JWT manual** | Menos código, OAuth listo, sesiones seguras, RBAC integrado |
| **Scores como filas individuales (no columnas)** | Flexible para nuevas actividades sin alterar schema. Facilita queries por categoría y temporada |
| **JSONB para config de juegos** | Cada tipo de juego tiene config diferente, evita tablas extra |
| **Supabase Realtime sobre Socket.io** | Ya viene con la DB, zero config, reconexión automática |
| **Temporadas** | Reseteo limpio de puntos, histórico por período, motivación renovada |
| **Audit log** | Transparencia total para líderes y admins, trazabilidad de puntos |
