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

export function createServer() {
  const app = express();

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

  // Determine spa directory path
  // In Vercel, dist/spa is bundled with the function, relative to __dirname
  // __dirname = /var/task/dist/server (or similar in Vercel)
  // So we need to go up two levels: /var/task/dist/server -> /var/task/dist -> /var/task/dist/spa
  const possiblePaths = [
    path.join(__dirname, "../spa"),           // If dist/server -> dist/spa
    path.join(__dirname, "../../dist/spa"),   // Fallback path
    path.join(process.cwd(), "dist/spa"),     // Dev mode
  ];

  let spaDir = possiblePaths[0];

  // Find which path actually exists
  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      spaDir = dir;
      console.log(`✓ Using SPA directory: ${dir}`);
      break;
    }
  }

  // Serve static files
  app.use(express.static(spaDir, { maxAge: "1h" }));

  // SPA fallback: serve index.html for non-API routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(spaDir, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`index.html not found at: ${indexPath}`);
      res.status(404).json({
        error: "Not found",
        attempted: indexPath
      });
    }
  });

  return app;
}
