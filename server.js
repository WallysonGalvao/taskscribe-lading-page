#!/usr/bin/env node

/**
 * TaskScribe Landing Page - Production Server
 * This file is used by Passenger on Hostinger
 */

// Force production mode
process.env.NODE_ENV = 'production';

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false; // Always production on Hostinger
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js app with explicit production mode
const app = next({ 
  dev,
  hostname,
  port,
  dir: __dirname,
});
const handle = app.getRequestHandler();

console.log("Starting TaskScribe LP server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("Directory:", __dirname);

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> TaskScribe LP ready on http://${hostname}:${port} (production)`);
      console.log(`> Process ID: ${process.pid}`);
    });
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
