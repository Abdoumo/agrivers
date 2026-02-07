import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { handleDemo } from "./routes/demo";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine SPA directory path - works in both dev and production
const getSpaDir = () => {
  // In Vercel serverless, the structure is typically:
  // /var/task/dist/spa (files are included via includeFiles)
  // /var/task/dist/server/production.mjs (__dirname points here)
  const possiblePaths = [
    path.resolve(__dirname, "..", "spa"),           // dist/server -> dist/spa
    path.resolve(process.cwd(), "dist", "spa"),     // From root
    path.resolve(__dirname, "..", "..", "dist", "spa"), // Additional fallback
  ];

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, "index.html"))) {
      console.log(`✓ SPA directory found: ${dir}`);
      return dir;
    }
  }

  // If nothing found, default to most likely path (will error gracefully)
  console.warn(`⚠ SPA directory not found in: ${possiblePaths.join(", ")}`);
  return possiblePaths[0];
};

export function createServer() {
  const app = express();
  const spaDir = getSpaDir();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Serve static files from SPA directory
  app.use(express.static(spaDir, {
    maxAge: "1d",
    etag: false,
  }));

  // SPA fallback: serve index.html for any non-API routes
  app.use((_req, res) => {
    const indexPath = path.join(spaDir, "index.html");

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({
        error: "Not found",
        spaDir,
      });
    }
  });

  return app;
}
