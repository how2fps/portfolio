# Finn's portfolio

A minimal, responsive portfolio using plain HTML, CSS, and JavaScript. No dependencies or build step.

## Start locally

From this folder, run:

```sh
node server.mjs
```

Open **http://localhost:3000** and leave the server running. Saving HTML, CSS, JavaScript, or images refreshes the browser automatically. No server restart or manual browser refresh is needed for those files. Stop the server with **Ctrl+C**.

If you were running an older version of the server before live reload was added, stop it and run the command above once. Changes to `server.mjs` itself still require restarting the server.

You can also use `npm run dev`. If PowerShell blocks `npm.ps1`, use `npm.cmd run dev` or the direct Node command above; no execution policy change is needed.

## Edit the portfolio

- `index.html`: introduction, projects, biography, and links.
- `style.css`: colors, typography, spacing, and responsive layouts.
- `index.js`: accessible project image previews. The site and image links also work without JavaScript.
- `pictures/optimized/`: small WebP images used by the page. Original images are preserved in `pictures/`.

All eight projects use the same card layout. SproutTeach links to the supplied frontend and backend repositories. Enbyte Systems and Envorya POS have separate entries, both linked to the supplied Enbyte Systems website. The three new entries use lightweight typographic covers rather than unverified product screenshots.

Project descriptions use supplied details, Enbyte Systems' public product information, and what is visible in the existing screenshots. SproutTeach's repository contents could not be read through the connected GitHub tool, so its description stays limited to the confirmed frontend/backend structure. Add your specific contribution, tools, and results for each project when available. The education text avoids the old “year 2” reference so it does not go stale.

The GitHub profile comes from this repository's existing remote. Add your preferred email, LinkedIn profile, and résumé link when ready.

## Publish

Deploy `index.html`, `style.css`, `index.js`, `favicon.svg`, and `pictures/optimized/` to any static website host. The development server is only for local preview. It injects the live reload connection into served HTML, so the deployed files have no live reload code or dependencies.
