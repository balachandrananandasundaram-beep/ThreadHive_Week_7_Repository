## Project Context

ThreadHive backend — Node.js, Express 5, MongoDB/Mongoose, JWT authentication. Full CRUD for threads, comments, subreddits, and voting. Uses ESM modules throughout.

## Build & Run

```bash
npm install
npm run dev        # nodemon main.js — hot reload (http://localhost:3000)
npm start          # node main.js — production
npm test           # vitest run (integration + unit tests; uses in-memory MongoDB)
npm run populate   # seed the database
npm run format     # prettier --write .
```

Entry flow: `main.js` → dotenv → `db.js` (Mongoose connect) → `server.js` → Express app in `src/app.js`.

## Architecture

```
threadhive-backend/
├── db.js               # connectToDB() / disconnectFromDB()
├── server.js           # startServer() / stopServer()
├── main.js             # Entry point
└── src/
    ├── app.js          # Express setup: CORS → body parsers → Helmet → rate-limit → routes → errorHandler
    ├── controllers/    # Thin: validate, call service, call next(err) on failure
    │   ├── authController.js
    │   ├── commentController.js
    │   ├── subredditController.js
    │   ├── threadController.js
    │   └── voteController.js
    ├── routes/         # authHandler applied per-route, not globally
    │   ├── auth.js     # POST /api/auth/register, POST /api/auth/login
    │   ├── comments.js
    │   ├── subreddits.js
    │   ├── threads.js
    │   └── votes.js
    ├── services/       # DB logic; throw createAppError() on failure
    │   ├── authService.js
    │   ├── commentService.js
    │   ├── subredditService.js
    │   ├── threadService.js
    │   └── voteService.js
    ├── models/         # Mongoose schemas
    │   ├── User.js     # name, email (unique), password (hashed)
    │   ├── Thread.js   # title, content, author (ref), subreddit (ref), upvotedBy[], downvotedBy[]
    │   ├── Comment.js  # body, author (ref), thread (ref), upvotedBy[], downvotedBy[]
    │   └── Subreddit.js
    ├── middleware/
    │   ├── authHandler.js    # Verifies JWT → attaches req.user → next()
    │   └── errorHandler.js   # Global error formatter
    ├── utils/
    │   └── createAppError.js # createAppError(message, statusCode) → Error with .statusCode
    └── scripts/
        └── populate_db.js    # Seed script
```

## Environment Variables

Required in `.env` (see `.env.example`):

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | HTTP port (default `3000`) |
| `JWT_SECRET` | Long random string for signing JWTs |
| `NODE_ENV` | `development` \| `production` |

Never hardcode connection strings or secrets.

## API Response Format

Success:
```json
{ "status": "success", "data": { ... } }
```

Error (from `errorHandler` middleware):
```json
{ "success": false, "message": "Error message" }
```

> `status: "success"` is a **string**, not `success: true`. Keep consistent.

## Authentication

- JWT Bearer token: `Authorization: Bearer <token>`
- `authHandler.js`: verifies token → attaches `req.user` → `next()`; returns `401` for missing/invalid/expired tokens
- JWT signed with `JWT_SECRET`, 7-day expiry
- Passwords hashed with bcryptjs in `authService.js`

## Error Handling Pattern

```js
// services — throw, don't respond
import { createAppError } from '../utils/createAppError.js';
throw createAppError('Not found', 404);

// controllers — delegate to middleware
export const getThread = async (req, res, next) => {
  try {
    const data = await threadService.fetchThreadById(req.params.id);
    res.json({ status: 'success', data });
  } catch (err) {
    next(err);  // always call next(err), never res.json() in catch
  }
};
```

Never expose stack traces to clients.

## Voting Logic

Thread and Comment models track votes via `upvotedBy[]` and `downvotedBy[]` arrays (user IDs). Vote services check membership before toggling to prevent duplicate votes.

## Code Style

- ESM (`import`/`export`) — `package.json` has `"type": "module"`; no `require()`
- ES6+: async/await, arrow functions, destructuring
- `prettier --write .` enforces formatting

## Testing

- **Framework**: Vitest + Supertest + `mongodb-memory-server` (no Atlas needed)
- **Setup**: `tests/setup.js` starts in-memory MongoDB; Vitest timeout is 60 s; `fileParallelism: false` for DB consistency
- **Structure**: `tests/integration/` (Supertest HTTP tests) + `tests/unit/` (service/controller/middleware tests)
- Mirror `src/` layout: `src/services/threadService.js` → `tests/unit/services/threadService.test.js`
- Each integration test file imports `../setup.js` and the Express `app`
- Use `beforeEach` to clear collections for test isolation

```js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import '../setup.js';
import app from '../../src/app.js';
```

## What to Avoid

- CommonJS (`require`/`module.exports`)
- Business logic in controllers — put it in services
- Skipping `next(err)` in controller catch blocks
- Hardcoded secrets or connection strings
- Sending raw Error objects or stack traces to clients
- Global state / global variables
- Missing `await` on Mongoose operations
