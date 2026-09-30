import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRegistrationHandler } from './registrations.js';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const handler = createRegistrationHandler();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

const server = createServer((req, res) => {
  handler(req, res, async () => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!['GET', 'HEAD'].includes(req.method) || pathname.startsWith('/api/')) {
        res.writeHead(404); res.end(); return;
      }
      let file = resolve(root, `.${pathname}`);
      if (file !== resolve(root) && !file.startsWith(`${resolve(root)}${sep}`)) {
        res.writeHead(403); res.end(); return;
      }
      if (!extname(file)) file = resolve(root, 'index.html');
      const content = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch {
      res.writeHead(404); res.end('Not found. Run npm run build before npm start.');
    }
  });
});
server.requestTimeout = 20000;
server.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => {
  console.log(`Campus+ running at http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`);
});
