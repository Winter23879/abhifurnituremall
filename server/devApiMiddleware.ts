import type { ViteDevServer } from 'vite';
import productsHandler from '../api/products';
import ordersHandler from '../api/orders';
import visitsHandler from '../api/visits';
import swatchesHandler from '../api/swatches';

// Helper to parse JSON body from incoming Node.js IncomingMessage
function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Adapt Vercel-style (req, res) handler into Vite's Connect middleware
function adaptHandler(handler: any) {
  return async (req: any, res: any) => {
    // Polyfill res.status and res.json
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    };

    // Parse URL query
    const urlObj = new URL(req.url, 'http://localhost:3000');
    req.query = Object.fromEntries(urlObj.searchParams.entries());

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      req.body = await parseBody(req);
    } else {
      req.body = {};
    }

    try {
      await handler(req, res);
    } catch (err: any) {
      console.error('API Error:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
    }
  };
}

export function devApiPlugin() {
  return {
    name: 'dev-api-middleware',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/api/products')) {
          return adaptHandler(productsHandler)(req, res);
        }
        if (url.startsWith('/api/orders')) {
          return adaptHandler(ordersHandler)(req, res);
        }
        if (url.startsWith('/api/visits')) {
          return adaptHandler(visitsHandler)(req, res);
        }
        if (url.startsWith('/api/swatches')) {
          return adaptHandler(swatchesHandler)(req, res);
        }
        next();
      });
    },
  };
}
