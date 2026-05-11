# Recipes API

REST API for managing culinary recipes — built with Node.js, TypeScript and Express following Clean Architecture principles.

![TypeScript](https://img.shields.io/badge/TypeScript-4.7-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-2-4479A1?style=flat&logo=mysql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-tested-C21325?style=flat&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## About

Recipes API centralizes and persists culinary recipes with passwordless authentication (magic link via email), photo uploads, ingredient composition, tags and favorites.

**Current status:** `in development`

## Features

- Passwordless authentication via magic link (no passwords)
- Create, read and delete recipes with ingredients and preparation steps
- Smart search by name (partial match with relevance ranking), ingredient, tags and prep time
- Recipe photo upload with automatic primary photo promotion on deletion
- Favorites system per authenticated user
- Global tag catalog with per-user uniqueness

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 4.7 |
| Framework | Express 4 |
| Database | MySQL (mysql2) |
| Auth | JWT + Magic Link (Nodemailer) |
| Upload | Multer (local storage) |
| Tests | Jest + ts-jest |
| Dev server | ts-node-dev |

## Prerequisites

- Node.js 18+
- MySQL database
- SMTP server (e.g. Gmail with App Password)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/RafVFG/recipe-api.git
cd recipe-api

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database, SMTP and JWT credentials

# 4. Run database migrations
# Execute the SQL files in /migrations in order against your MySQL database
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Database
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=recipes

# Server
HOST=localhost
PORT=3000

# URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3333   # Used in magic link emails

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=

# SMTP — for Gmail: enable 2FA and create an App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

## Usage

```bash
# Development (with hot reload)
npm run dev

# Run tests
npm test
```

The API will be available at `http://localhost:3000/api`.

## Project Structure

```
src/
├── entities/           # Domain interfaces and types
├── use-cases/          # Business rules, framework-agnostic
├── repositories/       # MySQL queries per aggregate
├── adapters/
│   ├── controllers/    # HTTP → use-case → HTTP translation
│   └── factories/      # Manual dependency injection (DI)
└── main/
    ├── routes/         # Express route definitions (loaded dynamically)
    ├── config/         # Middlewares, DB connection, upload, email
    └── index.ts        # Entry point
```

**Key patterns:** Clean Architecture · Repository · Factory · Adapter

## API Reference

Base URL: `http://localhost:3000/api`

Authentication header (protected routes): `Authorization: Bearer <jwt>`

---

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/request` | No | Request a magic link to the provided email |
| GET | `/auth/verify?token=<hash>` | No | Validate magic link token, returns JWT |

**Auth flow:**
1. `POST /auth/request` with `{ "email": "..." }` → magic link sent to inbox
2. Click the link → redirected to frontend with `?token=<hash>`
3. Frontend calls `GET /auth/verify?token=<hash>` → receives `{ "token": "<jwt>" }`
4. Use JWT as `Bearer` token for all protected routes

---

### Recipes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/recipes` | No | List recipes with optional filters |
| GET | `/recipe/:id` | No | Get recipe by ID |
| POST | `/create-or-update-recipe` | Yes | Create or update a recipe |
| DELETE | `/recipe/:id` | Yes | Delete a recipe |

**GET /recipes — query params (all optional):**

| Param | Type | Example | Behavior |
|---|---|---|---|
| `name` | string | `?name=frang` | Partial case-insensitive search; results ranked by relevance (exact → prefix → contains) |
| `ingredient` | string | `?ingredient=tomate` | Recipes containing that ingredient |
| `tags` | string | `?tags=almoco,rapido` | Recipes that have **all** given tags (AND) |
| `prepTime` | number | `?prepTime=30` | Exact match in minutes |

**POST /create-or-update-recipe body:**
```json
{
  "id": 1,
  "name": "Bolo de Cenoura",
  "description": "...",
  "directions": ["Mix everything", "Bake at 180°C"],
  "prepTime": 30,
  "yields": 8,
  "tags": ["vegano", "rapido"],
  "ingredients": [{ "name": "cenoura", "amount": "2 unidades" }]
}
```
> Omit `id` to create; include `id` to update. Tags are resolved by name with `findOrCreate` (lowercased).

---

### Photos

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/recipe/:idRecipe/photo` | Yes | Upload a photo (`multipart/form-data`, field `photo` + `isPrimary`) |
| DELETE | `/recipe/:idRecipe/photo/:photoId` | Yes | Delete a photo; auto-promotes next photo as primary |

---

### Ingredients

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/ingredients` | No | List all ingredients |
| POST | `/ingredient` | Yes | Create or update an ingredient |
| DELETE | `/ingredient/:id` | Yes | Delete an ingredient |

---

### Units

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/units` | No | List all measurement units |
| POST | `/unit` | Yes | Create or update a unit |
| DELETE | `/unit/:id` | Yes | Delete a unit |

---

### Tags

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/tags` | No | List all tags ordered by name |
| DELETE | `/tag/:id` | Yes | Delete a tag (only the creator can delete) |

---

### Favorites

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/user/favorites` | Yes | Save a recipe as favorite (idempotent) |
| DELETE | `/user/favorites/:idRecipe` | Yes | Remove a recipe from favorites |
| GET | `/user/favorites` | Yes | List authenticated user's favorites (alphabetical) |

**GET /user/favorites response:**
```json
[
  {
    "id": 42,
    "name": "Bolo de cenoura",
    "prepTime": 45,
    "primaryPhoto": "/uploads/foto.jpg",
    "tags": ["sobremesa", "vegano"]
  }
]
```

---

### Static files

```
GET /uploads/<filename>   # Serve uploaded photos
```

## Tests

```bash
npm test
```

84 tests covering: auth middleware, magic link use-cases, recipes, tags, photo deletion, favorites (save/remove/list) and their controllers.

## License

MIT
