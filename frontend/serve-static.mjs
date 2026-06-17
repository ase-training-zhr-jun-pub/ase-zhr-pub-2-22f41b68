/**
 * Minimaler, abhängigkeitsfreier Static-Server für den Produktions-Build.
 *
 * Hintergrund: Hinter dem Crucible-Reverse-Proxy
 * (…/proxy/4200/) funktioniert der Angular-Dev-Server nicht zuverlässig,
 * weil Vite absolute Asset-URLs (/@vite/client, /main.js) erzeugt, die das
 * Pfad-Präfix des Proxys umgehen. Der Produktions-Build nutzt dagegen einen
 * relativen Base-Href (./) und – zusammen mit Hash-Routing – braucht es
 * serverseitig kein Route-Fallback. Dieser Server liefert die statischen
 * Dateien aus und bindet an 0.0.0.0, damit der Proxy ihn erreicht.
 *
 *   node serve-static.mjs            # Port 4200
 *   PORT=8080 node serve-static.mjs  # anderer Port
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), 'dist', 'calvin', 'browser');
const PORT = Number(process.env.PORT ?? 4200);
const HOST = process.env.HOST ?? '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json; charset=utf-8',
};

async function sendFile(res, path) {
  const body = await readFile(path);
  res.writeHead(200, { 'Content-Type': MIME[extname(path)] ?? 'application/octet-stream' });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    // Pfad-Traversal verhindern; auf ROOT begrenzen.
    const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
    let filePath = join(ROOT, safe);

    let info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) {
      filePath = join(filePath, 'index.html');
      info = await stat(filePath).catch(() => null);
    }

    if (info?.isFile()) {
      await sendFile(res, filePath);
      return;
    }
    // Unbekannter Pfad -> index.html (SPA-Sicherheitsnetz; bei Hash-Routing
    // wird dieser Fall i. d. R. gar nicht erst erreicht).
    await sendFile(res, join(ROOT, 'index.html'));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 – ' + (err instanceof Error ? err.message : 'Fehler'));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Calvin (statisch) läuft auf http://${HOST}:${PORT}/  ->  ${ROOT}`);
});
