import { defineConfig } from 'vite';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    watch: {
      ignored: ['**/assets/**', '**/public/**', '**/*.pdf']
    }
  },
  plugins: [
    {
      name: 'api-contact-middleware',
      configureServer(server) {
        server.middlewares.use('/api/contact', (req, res) => {
          if (req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            });
            res.end();
            return;
          }

          if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
            return;
          }

          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body);
            } catch (e) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: 'Invalid JSON body' }));
              return;
            }

            // Mock Vercel response helper methods
            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            try {
              // Dynamically require and clear cache for hot-reloading contact handler
              const contactPath = require.resolve('./api/contact.js');
              delete require.cache[contactPath];
              const contactHandler = require('./api/contact.js');
              await contactHandler(req, res);
            } catch (err) {
              console.error('API Handler Error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
            }
          });
        });
      }
    }
  ]
});
