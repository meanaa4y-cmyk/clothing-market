# Linen House

A React storefront demo for "Linen House" — a linen & printed-suiting boutique. Built with [Vite](https://vitejs.dev/) + React.

Converted from a static HTML/CSS/JS prototype into a componentized React app, with real product photography added for the Wraps, Footwear, and Bags categories.

## Features

- Rotating hero slideshow and announcement bar
- Category filtering (Unstitched, Ready to Wear, Luxury Pret, Men, Accessories) with "View All" pagination
- Product grid with sale/new tags and quick "Add to Cart"
- Working search (live results, click to jump to that category)
- Slide-out cart drawer with quantity controls
- Checkout modal with a mock order-confirmation flow
- **Firebase Auth** — sign up / log in with email & password
- **Admin dashboard** (`/admin`) — add, edit, delete, and browse every product; changes
  sync live to the storefront via Firestore
- Optional product image upload straight to Firebase Storage
- Responsive layout, mobile nav drawer
- Toast notifications

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Firebase config (see below)
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → create a database (start in test mode for local dev,
   then lock it down — see rules below).
4. **Storage** → enable it (used for admin product-image uploads).
5. Project Settings → General → Your apps → copy the config values into `.env`
   (see `.env.example` for the exact variable names).
6. Set `VITE_ADMIN_EMAILS` in `.env` to a comma-separated list of the emails
   that should be able to reach `/admin`. Sign up with one of those emails
   (via `/signup`) to get admin access.

### Suggested Firestore rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // tighten to your admin UID/claims for production
    }
  }
}
```

### Suggested Storage rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

> The `.env` in this repo is git-ignored — never commit real Firebase keys.
> `.env.example` documents the shape without real values.

## Using the admin dashboard

1. Sign up at `/signup` with an email listed in `VITE_ADMIN_EMAILS`.
2. You'll be redirected to the store; click the 👤 icon (or go to `/admin`).
3. First time in, Firestore has no products yet, so the storefront shows the
   built-in demo catalog. Click **"Seed Demo Catalog"** in the admin dashboard
   to copy that demo catalog into Firestore as real, editable documents — or
   just click **"+ Add Product"** to start fresh.
4. Add/edit/delete products from the table. Every change appears on the live
   storefront immediately (Firestore realtime sync).

### Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/    UI components (Header, Hero, ProductGrid, CartDrawer, ...)
  hooks/         useCart, useToast
  data/          catalog.js — product catalog config + generator
  index.css      global styles (ported from the original design)
  App.jsx        top-level layout & state wiring
public/
  images/        local product photography (bags, shoes, wraps)
```

## Product images

Most catalog photography is pulled live from Pexels. A subset of categories
(**Bags**, **Footwear**, **Wraps**) use local photos bundled in
`public/images/`, wired up in `src/data/catalog.js` via `local:` paths.

## Deploying to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

To host it live, connect the repo to [Vercel](https://vercel.com), [Netlify](https://netlify.com), or run `npm run build` and publish the `dist/` folder to GitHub Pages.

## Project structure (updated)

```
src/
  components/    UI components (Header, Hero, ProductGrid, CartDrawer, SearchOverlay, ...)
  context/       AuthContext — Firebase auth state, signup/login/logout
  hooks/         useCart, useToast
  data/          catalog.js (demo catalog generator) + productsStore.js (Firestore CRUD)
  pages/         StorePage, Login, Signup, Admin
  firebase.js    Firebase app/auth/db/storage init (reads from .env)
  index.css      global styles
  App.jsx        route definitions
public/
  images/        local product photography (bags, shoes, wraps)
```

## Tech stack

- React 19 + React Router
- Vite
- Firebase (Auth, Firestore, Storage)
- Plain CSS (no framework) — design tokens live in `:root` in `index.css`
