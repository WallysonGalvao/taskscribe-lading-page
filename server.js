const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

console.log('Starting Next.js server...');
console.log('Directory:', __dirname);
console.log('Port:', port);

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Serve static files from .next/static directly
      if (pathname.startsWith('/_next/static/')) {
        const filePath = path.join(__dirname, '.next', pathname.replace('/_next/', ''));
        
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          
          if (stat.isFile()) {
            // Set correct content type
            const ext = path.extname(filePath);
            const contentTypes = {
              '.js': 'application/javascript',
              '.css': 'text/css',
              '.woff': 'font/woff',
              '.woff2': 'font/woff2',
              '.json': 'application/json',
            };
            
            res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            return;
          }
        }
      }

      // Let Next.js handle everything else
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
}).catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
