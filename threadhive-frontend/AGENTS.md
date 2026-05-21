## Project Context

ThreadHive frontend — React 19 SPA with full JWT authentication, React Router 7 routing, and a service-layer API pattern. Built with Vite. Styling via Bootstrap 5 + react-bootstrap + plain CSS files.

## Build & Run

```bash
npm install
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Serve production build locally
npm run lint     # ESLint check
```

Backend must be running at `http://localhost:3000` for API calls to work.

## Architecture

```
threadhive-frontend/
├── index.html
├── vite.config.js        # Vite + Vitest config (jsdom, globals: true)
├── src/
│   ├── main.jsx          # createRoot → <StrictMode><AuthProvider><App/>>
│   ├── App.jsx           # React Router routes; catch-all redirects to /home
│   ├── api/
│   │   └── apiClient.js  # Fetch wrapper — auto-injects Authorization header
│   ├── config/
│   │   └── apiConfig.js  # All API endpoint constants (AUTH_API, THREAD_API, etc.)
│   ├── context/
│   │   └── AuthContext.jsx  # AuthProvider + useAuth() hook; token+user in localStorage
│   ├── services/
│   │   ├── authService.js        # login(), register()
│   │   ├── threadService.js      # fetchRecentThreads(), createThread(), etc.
│   │   ├── commentService.js     # Comment API calls
│   │   └── subredditService.js   # Subreddit API calls
│   ├── components/
│   │   ├── Header/               # Header.jsx — nav links + login/logout
│   │   ├── Footer/               # Footer.jsx
│   │   ├── Forms/
│   │   │   └── CreateThreadForm.jsx
│   │   ├── PrivateRoute/         # Route guard (checks localStorage.token)
│   │   ├── Shared/
│   │   │   └── VoteButtons.jsx
│   │   └── ThreadList/
│   │       ├── ThreadCard.jsx
│   │       └── ThreadList.jsx
│   └── pages/
│       ├── Auth/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Auth.css          # Shared by Login + Register
│       └── User/
│           ├── Home.jsx          # Main feed
│           └── ThreadPage.jsx    # Thread detail + comments
└── tests/
    ├── setup.js          # @testing-library/jest-dom setup
    └── *.test.jsx
```

## Routing

Uses `react-router-dom` v7 with `<BrowserRouter>` wrapping `<Routes>` in `App.jsx`.
- Public routes: `/login`, `/register`
- Protected routes wrapped in `<PrivateRoute>`: `/home`, `/thread/:id`, `/profile`
- Catch-all `<Route path="*">` redirects to `/home`

## Authentication

- `AuthContext.jsx` provides `{ token, user, loginUser(), logout(), updateUser() }`
- `loginUser(token, user)` stores both in `localStorage` and React state
- `logout()` clears `localStorage` and resets state
- `PrivateRoute` reads `localStorage.token` directly (avoids Context init race condition)
- All API calls must go through `apiClient.js` so the JWT is auto-injected

## Service Layer

All API calls live in `src/services/`. Components call services; never call `fetch` directly in a component.

```js
// Correct pattern
import { fetchRecentThreads } from '../services/threadService';
const threads = await fetchRecentThreads();

// Wrong — do NOT call fetch directly in components
const res = await fetch('/api/threads');
```

API endpoint strings come from `src/config/apiConfig.js` — never hardcode URLs.

## Component Conventions

- Functional components with default exports
- Props destructured in function signature
- State: `useState` for local state; `useAuth()` for auth state
- Controlled forms: `value` + `onChange` on every input
- Co-located CSS: plain `.css` files imported as side-effects (`import "./Component.css"`)
- **Not** CSS Modules — use plain CSS imports
- Bootstrap 5 / react-bootstrap components for UI; prefer bootstrap utilities over custom CSS

## Styling with Bootstrap

1. Use react-bootstrap components: `Card`, `Button`, `Badge`, `Form`, `Container`, `Row`, `Col`
2. Prefer bootstrap utility classes: `d-flex`, `justify-content-*`, `gap-*`, `mb-3`, `fw-bold`
3. Do NOT add inline styles unless unavoidable
4. Shared styles live in nearest common parent directory (e.g., `Auth.css` for login + register)

## Error Handling

`src/utils/handleApiError.js` (and `src/services/utils/handleApiError.js`) — extracts message from API error responses. Use this in service catch blocks; surface the message to the user in the component.

## Testing

Framework: Vitest + React Testing Library + jsdom

```js
// vite.config.js test config:
test: { globals: true, environment: 'jsdom', setupFiles: './tests/setup.js' }
```

Patterns:
- `render(...)`, `screen.getBy*`, `userEvent.type/click`
- Inputs need matching `htmlFor`/`id` for `getByLabelText`
- Structure: `describe('Component') → describe('feature') → it('behavior')`
- Run: `npm run dev` is not needed for tests; just run `npx vitest` or add `"test": "vitest run"` to package.json

## What to Avoid

- Calling `fetch` directly in components — use `apiClient.js`
- Hardcoding API URLs — use `apiConfig.js` constants
- CSS Modules (not in use here)
- Class components
- `react-router-dom` v5/v6 patterns (this project uses v7 API)
- Adding state management libraries (Context API is sufficient)
- `var` declarations
