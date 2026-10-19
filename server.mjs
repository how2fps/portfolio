import http from "node:http";
import { watch } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
};
const liveClients = new Set();
const liveReloadScript = `<script>
(() => {
    const updates = new EventSource('/__live-reload');
    updates.addEventListener('reload', () => location.reload());
    window.addEventListener('pagehide', () => updates.close(), { once: true });
    window.addEventListener('pageshow', (event) => { if (event.persisted) location.reload(); });
})();
</script>`;

const server = http.createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method not allowed");
        return;
    }

    try {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);

        if (pathname === "/__live-reload") {
            response.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-store",
                Connection: "keep-alive",
            });
            if (request.method === "HEAD") {
                response.end();
                return;
            }
            response.write("retry: 1000\n: connected\n\n");
            liveClients.add(response);
            response.on("close", () => liveClients.delete(response));
            return;
        }

        const filename = pathname === "/" ? "/index.html" : pathname;
        const filepath = path.resolve(root, `.${filename}`);
        const type = types[path.extname(filepath).toLowerCase()];

        if (!filepath.startsWith(root) || filename.split(/[\\/]/).some((part) => part.startsWith(".")) || !type) {
            response.writeHead(404);
            response.end("Not found");
            return;
        }

        let content = await readFile(filepath);
        if (path.extname(filepath).toLowerCase() === ".html") {
            const html = content.toString("utf8");
            content = Buffer.from(/<\/body>/i.test(html)
                ? html.replace(/<\/body>/i, `${liveReloadScript}</body>`)
                : html + liveReloadScript);
        }
        response.writeHead(200, { "Content-Type": type, "Content-Length": content.length, "Cache-Control": "no-cache" });
        response.end(request.method === "HEAD" ? undefined : content);
    } catch (error) {
        response.writeHead(error instanceof URIError ? 400 : 404);
        response.end(error instanceof URIError ? "Invalid URL" : "Not found");
    }
});

server.on("error", (error) => {
    console.error(error.code === "EADDRINUSE" ? `Port ${port} is already in use. Stop the other server or set PORT to a different number.` : error.message);
    process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
    let reloadTimer;
    const watcher = watch(root, { recursive: true }, (_event, filename) => {
        if (filename) {
            const parts = filename.split(/[\\/]/);
            if (parts.some((part) => part.startsWith(".") || part === "node_modules") || !types[path.extname(filename).toLowerCase()]) return;
        }
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
            for (const client of liveClients) client.write("event: reload\ndata: changed\n\n");
        }, 150);
    });
    watcher.on("error", (error) => console.error(`Live reload watcher: ${error.message}`));
    watcher.unref();
    server.on("close", () => {
        clearTimeout(reloadTimer);
        watcher.close();
    });
    console.log(`\n  Finn's portfolio\n  Local: http://localhost:${port}\n\n  Live reload is on. Save a page, stylesheet, script, or image to refresh the browser automatically.\n  Press Ctrl+C to stop.\n`);
});
