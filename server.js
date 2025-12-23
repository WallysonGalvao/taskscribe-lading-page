/**
 * TaskScribe Landing Page - Hostinger Server
 *
 * Este arquivo é necessário para rodar Next.js na Hostinger
 * com Phusion Passenger. O Passenger espera um arquivo server.js
 * na raiz do projeto.
 *
 * IMPORTANTE: Este arquivo é commitado no repositório para que
 * não seja sobrescrito a cada deploy.
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Detecta ambiente de produção
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;

// Inicializa o app Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse a URL
      const parsedUrl = parse(req.url, true);

      // Adiciona headers de segurança
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("X-XSS-Protection", "1; mode=block");

      // Log para diagnóstico (desabilite em produção se não precisar)
      if (dev) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      }

      // Delega para o Next.js handler
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  })
    .once("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(
        `> TaskScribe Landing Page ready on http://${hostname}:${port}`
      );
      console.log(`> Environment: ${dev ? "development" : "production"}`);
    });
});
