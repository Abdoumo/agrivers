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

// Determine SPA directory - optimized for both local and Vercel environments
const getSpaDir = (): string => {
  // In local dev: __dirname = project_root/
  // In Vercel: __dirname = /var/task/dist/server, dist/spa is at /var/task/dist/spa

  const candidatePaths = [
    // Vercel production path
    path.resolve("/var/task/dist/spa"),
    // Local dev and fallback paths
    path.resolve(__dirname, "..", "spa"),
    path.resolve(process.cwd(), "dist", "spa"),
  ];

  for (const dir of candidatePaths) {
    const indexPath = path.join(dir, "index.html");
    try {
      if (fs.existsSync(dir) && fs.existsSync(indexPath)) {
        console.log(`✓ SPA directory: ${dir}`);
        return dir;
      }
    } catch (e) {
      // Continue to next path if access fails
    }
  }

  console.warn(`⚠ No SPA directory found. Checked: ${candidatePaths.join(", ")}`);
  return candidatePaths[0];
};

const spaDir = getSpaDir();

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

  // Serve static files
  if (fs.existsSync(spaDir)) {
    app.use(express.static(spaDir, {
      maxAge: "1d",
      etag: false,
    }));
  }

  // SPA fallback: serve index.html
  app.get("*", (_req, res) => {
    const indexPath = path.join(spaDir, "index.html");
    try {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: "index.html not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  return app;
}
