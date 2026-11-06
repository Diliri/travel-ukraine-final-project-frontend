# «Подорожуй Україною» Travel Ukraine

A Ukrainian-language travel community where people can discover destinations across Ukraine, read travel stories, and share their own experiences.

This repository contains the **frontend** of the project, built with **Next.js (App Router), React, and TypeScript**. It communicates with a **separate backend API** for authentication, users, categories, and stories.

## Features

- **Explore travel stories:** browse published stories, view individual articles, and filter by category.
- **Discover travellers:** view a list of community members and their public profiles.
- **User accounts:** register, sign in, sign out, and manage your profile.
- **Write and manage stories:** create stories and access editing flows from an authenticated account.
- **Save stories:** bookmark stories and find saved content in your profile.
- **Personal profile:** edit account details, manage an avatar, and change your password.
- **Responsive UI:** navigation, modals, carousels, loading states, and toast notifications.

Some features depend on the backend service and the user's authentication state.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | CSS Modules, modern-normalize |
| Server-state management | TanStack Query |
| Client-side state | Zustand |
| HTTP | Axios, Fetch API, Next.js Route Handlers |
| Forms and validation | Formik, Yup |
| UI utilities | Swiper, React Icons, React Hot Toast, iziToast |
| Quality tools | ESLint, Prettier |

## Requirements

- **Node.js:** a release compatible with Next.js 16 (Node.js 20.9 or newer).
- **npm:** included with Node.js.
- **A running backend server** that implements the API endpoints used by this frontend.

> The backend is **not included** in this repository. Running the frontend alone will not make authentication, story data, or profile features fully operational.

## Getting started

1. Clone the repository and open the project directory:

   ```bash
   git clone <YOUR-REPOSITORY-URL>
   cd travel-ukraine-fronted-preview
   ```

   Replace the URL and directory name if your repository is named differently.

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a `.env.local` file in the project root:

   ```dotenv
   BACKEND_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

   - `BACKEND_URL` is the **backend server origin** used by Next.js server code and API proxies. Point it to your actual backend, not the frontend.
   - `NEXT_PUBLIC_API_URL` is the **frontend origin** used by the browser-side Axios client to call the local Next.js `/api` routes.
   - `API_URL` is an optional fallback referenced in `app/api/api.ts`; setting `BACKEND_URL` explicitly is recommended.

   The example assumes the backend runs on port `3000` and this frontend runs on port `4000`. Update the values for your environment. Do not commit local configuration containing secrets.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open **http://localhost:4000**.

> **Port note:** unlike the default Next.js starter template, this project's `dev` script explicitly uses port **4000**. Its `start` script uses Next.js defaults unless a port is supplied.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port `4000` |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server (default port `3000`) |
| `npm run lint` | Run ESLint |

To serve the production build on port 4000:

```bash
npm run build
npm run start -- --port 4000
```

Set `NEXT_PUBLIC_API_URL` to the deployed frontend origin **before building** for production. Configure the backend URL and cookie settings appropriately for your deployment.

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/stories` | Browse travel stories |
| `/stories/[id]` | Story details |
| `/travellers` | Community traveller directory |
| `/travellers/[travellerId]` | Public traveller profile |
| `/login` | Sign in |
| `/register` | Create an account |
| `/profile` | Personal profile area |
| `/profile/own` | Own stories |
| `/profile/saved` | Saved stories |
| `/profile/edit` | Edit profile |
| `/stories/new` | Create a story |
| `/stories/[id]/edit` | Edit an existing story |

The archive also includes `/travelers` routes (single **l**) alongside `/travellers` (double **l**). The documented community pages use `/travellers`; retain or review the alternate paths according to your routing requirements.

## Project structure

```text
.
├── app/
│   ├── (auth)/             # Login and registration pages
│   ├── (main)/             # Home, stories, travellers, profile
│   ├── api/                # Next.js API routes / backend proxies
│   ├── providers/          # Application providers
│   ├── layout.tsx          # Root application layout
│   └── globals.css         # Global styles
├── components/             # Reusable UI and feature components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/                # HTTP clients and request helpers
│   ├── store/              # Zustand stores
│   └── validation/         # Form validation schemas
├── types/                  # Shared TypeScript types
├── public/                 # Static assets
├── proxy.ts                # Session handling and route protection
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript settings
```

Next.js route-group folder names such as `(auth)` and `(main)` organize the source code without appearing in public URLs.

## Backend integration and authentication

The frontend uses two API layers:

1. **Client-side requests** typically go to the frontend's own `/api/...` endpoints through `lib/api/`.
2. **Next.js server routes and server-rendered pages** communicate with the separate backend defined by `BACKEND_URL`.

Authentication uses cookies and session-handling logic in `proxy.ts`. The project includes Next.js route handlers for login, registration, logout, token refresh, user data, stories, favourites/saved stories, and categories. The backend must expose compatible routes and response shapes; this repository does not define the backend implementation.

If lists fail to load or login does not work, check that the backend is running, `BACKEND_URL` is correct, the required backend endpoints exist, and the cookies are accepted in your browser/deployment environment.

## Development notes

- This is a **frontend repository**, not a full-stack deployment bundle.
- Some source files and route variations appear to be placeholders or in-progress features; check behaviour before treating all UI flows as production-ready.
- The archive does not define a dedicated automated `test` script in `package.json`.
- Image hosts allowed in `next.config.ts` include Cloudinary, Unsplash, and project-specific asset domains. Additional external image hosts may require updating `images.remotePatterns`.
- Avoid placing access tokens, credentials, or backend secrets in `NEXT_PUBLIC_*` variables: these values may be exposed to the browser.

## Contributing

Contributions and improvements are welcome. Create a feature branch, keep changes focused, run `npm run lint` and `npm run build`, then open a pull request with a short description of the changes.

## License

No license file was identified in the provided archive. Check with the repository maintainers before reusing or redistributing its code.
