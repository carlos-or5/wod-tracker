# WOD Tracker

Una aplicación para registrar y analizar entrenamientos de CrossFit (WOD - Workout of the Day).

## Características

- ✅ Crear WODs con fecha, título y descripción
- ✅ Gestionar múltiples WODs por día
- ✅ Ver detalles de cada WOD
- ✅ Estadísticas de ejercicios
- ✅ Base de datos PostgreSQL (Neon)

## Requisitos

- Node.js 18+
- npm
- PostgreSQL database (Neon recomendado)

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env.local`:

```
DATABASE_URL=postgresql://user:password@host/dbname
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm start` - Inicia servidor de producción
- `npm run lint` - Linting
- `npm run migrate:db` - Ejecutar migraciones de BD

## Stack Tecnológico

- **Frontend**: Next.js 16.2.4, React 19, TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Database**: PostgreSQL via Neon
- **Framework**: App Router (Next.js 16)

## Estructura

```
app/              - Next.js app directory
  api/           - API routes
  components/    - React components
  page.tsx       - Home page
  create/        - Create WOD page
  wod/[id]/      - WOD detail page
  stats/         - Statistics page

src/
  lib/           - Utilities (db.ts)
  services/      - Business logic (wod.service.ts)

db/               - Database scripts (schema.sql)
```

## API Routes

- `GET /` - Home (lista de WODs)
- `GET /create` - Página de crear WOD
- `GET /wod/[id]` - Detalles del WOD
- `GET /stats` - Estadísticas
- `POST /api/wod/create` - Crear nuevo WOD
- `POST /api/wod/confirm-analysis` - Confirmar análisis de WOD
- `GET /api/wod/[id]` - Obtener WOD con detalles
- `GET /api/stats/exercises` - Estadísticas de ejercicios

