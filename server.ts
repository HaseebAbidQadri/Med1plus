// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { createServer as createViteServer } from 'vite';
// import apiRouter from './backend/routes';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// async function startServer() {
//   const app = express();
//   const PORT = 3000;

//   // Mount clean body parsers with spacious limit for base64 clinical photos/images
//   app.use(express.json({ limit: '50mb' }));
//   app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//   // Serve API routes FIRST
//   app.use('/api', apiRouter);

//   // Health probe
//   app.get('/api/health', (req, res) => {
//     res.json({ status: 'ok', time: new Date().toISOString() });
//   });

//   // Vite development vs production asset delivery middleware
//   if (process.env.NODE_ENV !== 'production') {
//     console.log('Starting MedOne+ Dev server with Vite middleware...');
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//       root: path.resolve(__dirname, 'frontend') // Set Vite root to frontend folder!
//     });
//     app.use(vite.middlewares);
//   } else {
//     console.log('Starting MedOne+ Production build static serving...');
//     const distPath = path.join(process.cwd(), 'frontend', 'dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   }

//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`MedOne+ Full-Stack Core Server running at http://0.0.0.0:${PORT}`);
//   });
// }

// startServer();




// import express from 'express';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { createServer as createViteServer } from 'vite';
// import apiRouter from './backend/routes';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function startServer() {
//   const app = express();
//   const PORT = 3000;

//   // Mount clean body parsers with spacious limit for base64 clinical photos/images
//   app.use(express.json({ limit: '50mb' }));
//   app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//   // Serve API routes FIRST
//   app.use('/api', apiRouter);

//   // Health probe
//   app.get('/api/health', (req, res) => {
//     res.json({ status: 'ok', time: new Date().toISOString() });
//   });

//   // Vite development vs production asset delivery middleware
//   if (process.env.NODE_ENV !== 'production') {
//     console.log('Starting MedOne+ Dev server with Vite middleware...');
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//      root: path.resolve(__dirname, 'frontend'), // Set Vite root to frontend folder!
//       configFile: path.resolve(__dirname, 'vite.config.ts') // Explicitly load the config from root!

//     });
//     app.use(vite.middlewares);

//     // Development SPA HTML Fallback
//     app.get('*', async (req, res, next) => {
//       const url = req.originalUrl;
//       try {
//         const templatePath = path.resolve(__dirname, 'frontend', 'index.html');
//         let template = fs.readFileSync(templatePath, 'utf-8');

//         // Transform the HTML template with Vite's plugin triggers (injects @vite/client, transforms scripts, etc.)
//         template = await vite.transformIndexHtml(url, template);

//         res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
//       } catch (err) {
//         vite.ssrFixStacktrace(err as Error);
//         next(err);
//       }
//     });
//   } else {
//     console.log('Starting MedOne+ Production build static serving...');
//     const distPath = path.join(process.cwd(), 'frontend', 'dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   }

//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`MedOne+ Full-Stack Core Server running at http://0.0.0.0:${PORT}`);
//   });
// }

// startServer();






import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import apiRouter from './backend/routes';
import { initializeDB } from './backend/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount clean body parsers with spacious limit for base64 clinical photos/images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve API routes FIRST
  app.use('/api', apiRouter);

  // Health probe
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite development vs production asset delivery middleware
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting MedOne+ Dev server with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.resolve(__dirname, 'frontend'), // Set Vite root to frontend folder!
      configFile: path.resolve(__dirname, 'vite.config.ts') // Explicitly load the config from root!
    });
    app.use(vite.middlewares);

    // Development SPA HTML Fallback
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, 'frontend', 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');

        // Transform the HTML template with Vite's plugin triggers (injects @vite/client, transforms scripts, etc.)
        template = await vite.transformIndexHtml(url, template);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    console.log('Starting MedOne+ Production build static serving...');
    const distPath = path.join(process.cwd(), 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`MedOne+ Full-Stack Core Server running at http://localhost:${PORT}`);
    console.log('[Server] Initializing database connection...');
    await initializeDB();
  });
}

startServer();
