# Kisaan Agro Store — React (Vite) Project

Original `client.html` and `admin.html` ko proper React + Vite project mein convert kiya gaya hai.

## Structure
- `src/pages/Client.jsx` → store front (route: `/`)
- `src/pages/Admin.jsx` → admin dashboard (route: `/admin`)
- `src/firebaseConfig.js` → shared Firebase config (dono pages isi se connect hote hain)
- `src/loadFirebase.js` → Firestore SDK loader

## Local run
```
npm install
npm run dev
```

## Vercel pe deploy
1. Is folder ko GitHub repo mein push karein (ya seedha Vercel CLI se: `vercel` command run karein is folder ke andar).
2. Vercel dashboard → "New Project" → apna repo import karein.
3. Framework preset: **Vite** (auto-detect ho jayega). Build command: `npm run build`, Output dir: `dist`.
4. Deploy karein.

Ek hi deployment se do links mil jayengi:
- Store: `https://your-project.vercel.app/`
- Admin: `https://your-project.vercel.app/admin`

Firebase config `src/firebaseConfig.js` mein already daala hua hai — agar change karna ho to sirf ek jagah edit karein, dono pages update ho jayenge.
