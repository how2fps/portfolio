# Finn’s portfolio

A static portfolio built with HTML, CSS and JavaScript. No dependencies or build step are required.

## Preview

Open this folder in VS Code, right-click `index.html` and choose **Open with Live Server**. Saved changes refresh automatically at http://127.0.0.1:5500.

Alternatively, run `node server.mjs` and open http://localhost:3000.

## Edit

- `index.html`: workspace structure and navigation.
- `workspace.css`: layout, responsive styles and proportional image presentation.
- `workspace.js`: project navigation, screenshot galleries, local search and fixed sidebar links.
- `theme.js`: Moonlight/Sunshine theme selection, restored before styles load and remembered locally.
- `command-palette.js`: Ctrl+K / Cmd+K quick switcher for projects, pages, profile links and themes. Use arrow keys and Enter; Escape closes the native modal. The caption shortcut also opens it.
- `portfolio-data.js`: all eight project descriptions, technology explanations, screenshots and biography. Edit this file to change project content.
- `pictures/`: project images and thumbnails.

The overview page and focus-only search shortcuts have been removed. Search remains available in the bottom input. Ctrl+K (Cmd+K on Mac) opens the command palette.

kNow’s explanations were checked against the local Android Java source and Gradle dependencies. Its seven reconstructed screen previews follow the Android XML layouts and bundled drawable assets: explore, place search, profile, story viewer, story publishing, custom map creation and profile editing. Names, counts, place results, map artwork and illustrated media are sample content. These are code-based reconstructions, not emulator captures. No Firebase data is accessed. Sources and qualifications are recorded in `pictures/know/provenance.json`; `tools/render-know.cjs` regenerates the SVG and WebP files using the local source tree and bundled Sharp library.

SproutTeach and Envorya POS retain their screenshot walkthroughs and frontend/backend explanations. Their demo screenshots use sample data.

## Added project stories

- **InvMngr**: Temasek Polytechnic full-stack project, with eight browser screenshots of the original Angular frontend using fictional in-memory API data. The temporary checkout changes only the API provider and initial demo session; no original templates or styles were redesigned. Frontend commit `2f8eb2e3d6daaf0f529416de9ecebe64ce137856`; API commit `61d3a794b8cea45835a6ecbb9385df7499d1d74c`. `tools/inventory-screenshot-fixtures.ts` records the sample data provider. `tmp/` checkouts, dependencies and captures are ignored by Git.
- **SutDoki**: source-based explanations of scenes, character state, choices, text scheduling and sound. The existing image leads a six-image gallery; five curated previews use the original artwork and scene text with a sample player name. These are explicitly labelled reconstructions. `tools/render-project-stories.cjs` renders the curated views from `tmp/sutdoki-scenes.json`, extracted from the local Python source.
- **Pic’A’Pixel**: the DTI poster, its concept visualisations and LED prototype photo support the Arduino, React, Firestore and serial-bridge explanations. The original PDF is included in `pictures/picapixel/`. The four-cell prototype mapping is distinguished from the proposed full ceiling. Design testing and planned improvements are attributed to the poster.

## Publish

Deploy `index.html`, `portfolio-data.js`, `workspace.js`, `theme.js`, `command-palette.js`, `workspace.css`, `favicon.svg` and `pictures/` to GitHub Pages or another static host. No Node server is needed in production.
