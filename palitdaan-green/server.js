// Lightweight Zero-Dependency SPA Server for Termux & Android Tablets
// Requires only Node.js (pkg install nodejs-lts on Termux)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
let PORT = parseInt(process.env.PORT || '5173', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Sanitize path to prevent directory traversal
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(DIST_DIR, safePath);

    // If path is a directory, point to index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // SPA fallback: if file does not exist or has no extension, serve index.html
    if (!fs.existsSync(filePath) || !path.extname(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`500 Server Error: ${err.message}`);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Internal Error');
  }
});

function startServer(portToTry) {
  server.listen(portToTry, '0.0.0.0', () => {
    console.log('===========================================================');
    console.log(`🌿 PalitDaan Green Server is live!`);
    console.log(`📱 Tablet / Localhost: http://localhost:${portToTry}`);
    console.log(`🌐 Local Network:     http://0.0.0.0:${portToTry}`);
    console.log('Press Ctrl + C to stop the server.');
    console.log('===========================================================');
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
    const nextPort = PORT === 5173 ? 8080 : PORT === 8080 ? 3000 : PORT + 1;
    console.warn(`Port ${PORT} not available (${err.code}). Trying port ${nextPort}...`);
    PORT = nextPort;
    startServer(PORT);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);
