# JordanList - Sistema de Gestión de Niños de Iglesia

Sistema de gestión de niños con sistema de puntos para actividades de iglesia. Los datos persisten en PostgreSQL usando Docker y Drizzle ORM para prevenir inyecciones SQL.

## Estructura del Proyecto

```
JordanList/
├── backend/              # API REST con Express
│   ├── routes/          # Rutas de la API
│   ├── services/        # Lógica de negocio
│   ├── libs/            # Base de datos con Drizzle ORM
│   ├── schemas/         # Esquemas de Drizzle y validación
│   ├── init.sql         # Script de inicialización de BD
│   └── server.js        # Servidor principal
├── frontend/            # SPA con React + Vite + Tailwind
│   └── src/
│       ├── components/  # Componentes reutilizables
│       ├── api/        # Servicios de API
│       ├── pages/      # Páginas de la aplicación
│       ├── layouts/    # Layouts
│       ├── config/     # Configuración
│       ├── hooks/      # Custom hooks
│       └── utils/      # Utilidades
└── docker-compose.yaml  # Configuración de Docker
```

## Tecnologías

- **Backend**: Node.js + Express (JavaScript)
- **ORM**: Drizzle ORM (prevención de inyección SQL)
- **Frontend**: React (JavaScript) + Vite + SWC + Tailwind CSS
- **Base de datos**: PostgreSQL 15
- **Administrador BD**: pgAdmin 4
- **Contenedores**: Docker + Docker Compose
- **Arquitectura**: Cliente-Servidor con API REST + SPA
- **Patrón Backend**: MVC

## Sistema de Puntos

| Actividad | Puntos |
|-----------|--------|
| Traer la biblia | +2 |
| Versículo memorizado | +2 |
| Participación | +1 |
| Búsqueda rápida | +2 |
| Traer un amigo | +5 |
| Responder preguntas | +1 |
| Asistencia puntual | +1 |
| Realizar una oración | +1 |

## Instalación

### Prerrequisitos

- Node.js 18+ instalado
- Docker y Docker Compose instalados

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd JordanList
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env` (ya existe uno por defecto):

```bash
cp .env.example .env
```

Puedes modificar las credenciales si lo deseas.

### 3. Iniciar la base de datos con Docker

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en `http://localhost:5432`
- pgAdmin en `http://localhost:5050`

**Acceso a pgAdmin:**
- URL: `http://localhost:5050`
- Email: `admin@jordanlist.com` (configurable en `.env`)
- Password: `admin123` (configurable en `.env`)

**Para conectar pgAdmin a PostgreSQL:**
1. Click derecho en "Servers" > "Register" > "Server"
2. En la pestaña "General", nombre: `JordanList`
3. En la pestaña "Connection":
   - Host: `postgres` (nombre del contenedor)
   - Port: `5432`
   - Database: `jordanlist_db`
   - Username: `jordanlist`
   - Password: `jordanlist123`

### 4. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 5. Iniciar el backend

```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

### 6. Instalar dependencias del frontend

En otra terminal:

```bash
cd frontend
npm install
```

### 7. Iniciar el frontend

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## Uso

1. Asegúrate de que Docker esté corriendo
2. Inicia la base de datos: `docker-compose up -d`
3. Inicia el backend: `cd backend && npm start`
4. Inicia el frontend: `cd frontend && npm run dev`
5. Accede a `http://localhost:3000`
6. Agrega niños usando el formulario
7. Haz clic en los botones de actividades para agregar puntos
8. El total se calcula automáticamente y persiste en la base de datos

## API Endpoints

### Niños

- `GET /api/ninos` - Obtener todos los niños
- `GET /api/ninos/:id` - Obtener niño por ID
- `POST /api/ninos` - Crear nuevo niño
  - Body: `{ "nombre": "Juan", "apellido": "Pérez", "edad": 10 }`
- `PUT /api/ninos/:id` - Actualizar niño
  - Body: `{ "nombre": "Juan", "apellido": "Pérez", "edad": 11 }`
- `DELETE /api/ninos/:id` - Eliminar niño

### Puntos

- `POST /api/ninos/:id/puntos` - Agregar puntos a una actividad
  - Body: `{ "actividad": "traerBiblia" }`

**Actividades disponibles:**
- `traerBiblia`
- `versiculoMemorizado`
- `participacion`
- `busquedaRapida`
- `traerAmigo`
- `responderPreguntas`
- `asistenciaPuntual`
- `realizarOracion`

## Comandos Docker Útiles

```bash
# Iniciar contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v

# Ver estado de contenedores
docker-compose ps
```

## Estructura de la Base de Datos

### Tabla `ninos`
- `id` (SERIAL PRIMARY KEY)
- `nombre` (VARCHAR)
- `apellido` (VARCHAR)
- `edad` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabla `puntos`
- `id` (SERIAL PRIMARY KEY)
- `nino_id` (INTEGER FK)
- `traer_biblia` (INTEGER)
- `versiculo_memorizado` (INTEGER)
- `participacion` (INTEGER)
- `busqueda_rapida` (INTEGER)
- `traer_amigo` (INTEGER)
- `responder_preguntas` (INTEGER)
- `asistencia_puntual` (INTEGER)
- `realizar_oracion` (INTEGER)
- `total` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Seguridad

### Drizzle ORM

El proyecto utiliza **Drizzle ORM** para todas las interacciones con la base de datos, lo que previene inyecciones SQL mediante:

- Queries parametrizadas automáticamente
- Validación de tipos en tiempo de ejecución
- API type-safe para construcción de queries
- Escapado automático de valores

Ejemplo de uso seguro:
```javascript
// ❌ INSEGURO (SQL directo)
const result = await pool.query(`SELECT * FROM ninos WHERE id = ${id}`);

// ✅ SEGURO (Drizzle ORM)
const result = await db.select().from(ninos).where(eq(ninos.id, id));
```

### Variables de Entorno

El proyecto usa archivos `.env` para configuración. **NUNCA** subas el archivo `.env` a GitHub. El archivo `.env.example` muestra las variables necesarias sin valores sensibles.

## Características Técnicas

### Backend
- **MVC Pattern**: Separación clara de rutas, servicios y modelos
- **Drizzle ORM**: ORM ligero y type-safe para PostgreSQL
- **Express**: Framework minimalista para APIs REST
- **CORS**: Configurado para desarrollo local
- **Error Handling**: Manejo de errores en todas las rutas

### Frontend
- **Vite**: Build tool ultrarrápido con HMR
- **SWC**: Compilador de JavaScript/TypeScript escrito en Rust
- **Tailwind CSS**: Framework CSS utility-first
- **Custom Hooks**: Lógica reutilizable con `useNinos`
- **Component Architecture**: Componentes modulares y reutilizables

## Próximas mejoras sugeridas

- Autenticación y autorización con JWT
- Reportes y estadísticas por fecha/período
- Historial de puntos con timestamps detallados
- Exportación de datos a Excel/PDF
- Validaciones más robustas (Zod o Yup)
- Interfaz de edición inline de niños
- Sistema de recompensas por niveles de puntos
- Gráficos de progreso con Chart.js
- Modo offline con Service Workers
- Tests unitarios y de integración

## Contribución

Este proyecto está diseñado para ser usado y modificado libremente. Siéntete libre de:
- Hacer fork del proyecto
- Agregar nuevas funcionalidades
- Mejorar el diseño
- Reportar bugs
- Sugerir mejoras

## Licencia

Este proyecto es de código abierto y está disponible para uso personal y comunitario.

---

**Desarrollado con fines educativos y comunitarios**
