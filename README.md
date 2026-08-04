# MONARCH Clothing Store

A branded e-commerce React app with a storefront and a full admin panel. Built with **React 18**, **Vite 5**, **Redux Toolkit**, **React Router 6**, **Sass** and **Firebase (Firestore)**.

> Previously the "Clothing Store v1" demo project (Zero to Mastery course). Rebuilt and rebranded with an admin panel, product management, checkout and live order tracking.

## Features

### Storefront
- Branded landing page with hero banner and category grid
- Shop All page grouping products by category
- Category pages with product cards (lazy-loaded images, hover "Add to cart")
- Cart / minicart with quantity controls and running totals
- **Checkout form** — when a customer places an order it is saved to Firestore and appears instantly in the Admin panel

### Admin panel (`/admin`)
- Simple password gate (default password: `admin123`, override with `VITE_ADMIN_PASSWORD`)
- **Dashboard** — total products, total orders, pending orders and revenue stats, plus recent orders
- **Products** — add, edit and delete products (name, category, price, image URL, description)
- **Orders** — view customer + address details, change order status (pending / shipped / delivered / cancelled) and delete orders

### Robustness (no more white screen)
- Firebase is initialized defensively (wrapped in try/catch) — if it is not configured the shop falls back to built-in seed data, so the site always renders
- Global React Error Boundary with a friendly fallback instead of a blank page
- Product & order data is blacklisted from Redux-persist so it always comes fresh from Firestore

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The dev server runs at http://localhost:5173/.

## Connecting your own Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Add a **Web App** and copy its credentials
3. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

4. In Firestore create two collections:
   - `products` → document fields: `name`, `category`, `price`, `imageUrl`, `description`, `createdAt`
   - `orders` → document fields: `customer` (object with `name`, `email`, `phone`, `address`), `items` (array of `{name, price, quantity, imageUrl}`), `total`, `status`, `createdAt`

5. Allow read/write access for your web app (for development you can use the Firestore test rules) and reload the site.

When Firebase is connected:
- Products added in Admin appear in the shop
- Orders placed in the shop checkout appear in Admin in real time

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest suite |

## Tech stack

- Node v18+
- Vite 5 + @vitejs/plugin-react
- React + react-dom 18
- React Router v6
- Redux Toolkit + redux-persist + reselect
- Sass
- Firebase 10 (Firestore)
