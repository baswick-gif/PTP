#!/usr/bin/env node
// Local dev API server — routes /api/* to the same handler modules
// Vercel deploys as serverless functions, so `npm run dev` (Vite, for
// HMR) plus `npm run dev:api` (this, proxied by vite.config.js) gives
// you the whole app with a real Postgres-backed API without needing
// the Vercel CLI. Not used in production — Vercel's own zero-config
// /api routing takes over there.
//
// Usage:
//   DATABASE_URL=postgresql://... node api-server.js
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { parse } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.API_PORT || 3001;
const API_DIR = path.join(__dirname, 'api');

function findApiHandlerFile(pathname) {
  const rel = pathname.replace(/^\/api\//, '').replace(/\/$/, '');
  if (!rel || rel.includes('..')) return null;
  const file = path.join(API_DIR, rel + '.js');
  if (!file.startsWith(API_DIR) || !fs.existsSync(file)) return null;
  return file;
}

// Cache-busting query string forces a fresh import each request, so
// edits to api/*.js are picked up without restarting this process —
// the ESM equivalent of `delete require.cache[...]` in CommonJS.
async function loadHandler(file) {
  const mod = await import(pathToFileURL(file).href + '?update=' + Date.now());
  return mod.default;
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

function makeRes(res) {
  res.status = function (code) { this.statusCode = code; return this; };
  res.send = function (text) { this.end(text); return this; };
  return res;
}

const server = http.createServer(async (req, res) => {
  const parsed = parse(req.url, true);
  if (!parsed.pathname.startsWith('/api/')) {
    res.writeHead(404);
    return res.end('Not found');
  }

  const handlerFile = findApiHandlerFile(parsed.pathname);
  if (!handlerFile) {
    res.writeHead(404);
    return res.end('Not found');
  }

  const handler = await loadHandler(handlerFile);
  req.body = await readBody(req);
  req.query = parsed.query;
  makeRes(res);
  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).setHeader('content-type', 'application/json').send(JSON.stringify({ error: 'Server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`PT Pool API dev server on http://localhost:${PORT}`);
  if (!process.env.DATABASE_URL) console.warn('DATABASE_URL is not set — every /api/* call will fail.');
});
