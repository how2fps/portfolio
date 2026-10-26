# Finn's portfolio

A responsive portfolio with a Codex-inspired workspace: projects in a sidebar, details in the centre, useful links on the right, and a project search at the bottom. It uses plain HTML, CSS, and JavaScript with no dependencies or build step.

## Start locally

From this folder, run:

```sh
node server.mjs
```

Open **http://localhost:3000** and leave the server running. Saving HTML, CSS, JavaScript, or images refreshes the browser automatically. No server restart or manual browser refresh is needed for those files. Stop the server with **Ctrl+C**.

If you were running an older version of the server before live reload was added, stop it and run the command above once. Changes to `server.mjs` itself still require restarting the server.

You can also use `npm run dev`. If PowerShell blocks `npm.ps1`, use `npm.cmd run dev` or the direct Node command above; no execution policy change is needed.

## Edit the portfolio

- `index.html`: the main portfolio workspace.
- `workspace.css`: workspace layout, colors, and responsive navigation.
- `workspace.js`: project navigation, local keyword search, and detail views. Search matches existing project content; it does not use an AI service.
- **Recent chats** at the bottom of the sidebar reopens the six most recently viewed projects, pages, and searches. History is stored locally in the visitor's browser and survives refreshes.
- `overview.html`: the traditional portfolio and the source of the project names, descriptions, links, technologies, and biography used by the workspace. Edit project content here; the workspace reads it automatically.
- `style.css`: the traditional overview's colors, typography, and layouts.
- `index.js`: image previews on the overview page.
- `pictures/optimized/`: small WebP images used by the page. Original images are preserved in `pictures/`.
- `pictures/sproutteach/`: eleven reconstructed app screenshots and small WebP thumbnails.
- `pictures/envogue/`: nine Envogue / Envorya POS screenshots and thumbnails. Both galleries use responsive main images and lazy-loaded thumbnails.

All eight projects appear in the workspace sidebar and remain available in the overview. SproutTeach includes an eleven-screen walkthrough, separate frontend and backend technology descriptions, and both source repository links. Envorya POS (the Envogue app and API) now has a nine-screen walkthrough and separate frontend/backend explanations. Both it and Enbyte Systems link to the supplied product website.

SproutTeach's stack descriptions were checked against the local `teaching-app` and `teaching-app-backend` source. The frontend uses React/TypeScript, Vite, Tailwind CSS, Radix UI, TanStack Query, Axios, React Hook Form, Zod, Konva, dnd-kit, Socket.IO and jsPDF. The backend uses Node/Express/TypeScript, MySQL, Redis with Lua and Pub/Sub, Socket.IO, Passport for Google/Microsoft sign-in, Cloudflare R2 via the S3 SDK, and Docker.

The screenshots were rendered from a separate local reconstruction of the original frontend using sample classroom data. The hosted service is offline; attendance, scores and names shown are demonstrations rather than usage metrics. Images were not redesigned or generated. The optimized screenshots and thumbnails are included in this repository; the local reconstruction tools are maintained separately.

Envogue / Envorya descriptions were checked against the local `envouge-app` and `envogue-api` code. The frontend uses React/TypeScript, Vite/PWA, React Router, Tailwind CSS, Flowbite, Material UI, i18next, Axios, Chart.js, jsPDF, spreadsheet exports and ZXing. The backend is JavaScript/CommonJS on Node/Express with the native MongoDB driver, transactional payment records and shared calculations, JWT/bcrypt, Firebase Storage, Pusher, Mailjet and Vercel scheduled routes. It records payments confirmed by staff; the description does not imply a payment gateway or bank transfer service.

The Envogue screenshots show the original frontend running with local fixtures. Customer identities, schedules, stock and sales figures are fictional, and no production database or external service was used. The nine optimized screenshots and thumbnails are included in this repository. The existing Envorya title and project URL are retained because Envogue and Envorya coexist in the app's source and branding.

Other descriptions use supplied details, Enbyte Systems' public product information, and existing screenshots. Add specific contributions and measured outcomes when available.

The GitHub profile comes from this repository's existing remote. Add your preferred email, LinkedIn profile, and résumé link when ready.

## Publish

Deploy `index.html`, `workspace.css`, `workspace.js`, `overview.html`, `style.css`, `index.js`, `favicon.svg`, `pictures/optimized/`, `pictures/sproutteach/`, and `pictures/envogue/` to any static website host. Keep `overview.html` alongside the workspace: it supplies the project content and provides the alternate layout and no-JavaScript fallback.

The development server is only for local preview. It injects the live reload connection into served HTML, so the deployed files have no live reload code or dependencies.
