import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { handleDemo } from "./routes/demo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple potential paths for the SPA directory
function findSpaDir(): string {
  const possiblePaths = [
    path.join(__dirname, "../spa"),           // dist/server/../spa
    path.join(process.cwd(), "dist/spa"),     // Root-based
    path.join(__dirname, "../../dist/spa"),   // Up two levels
  ];

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      console.log(`✓ Found SPA directory: ${dir}`);
      return dir;
    }
  }

  console.warn(`⚠ SPA directory not found. Checked: ${possiblePaths.join(", ")}`);
  // Return the most likely path even if not found (for dev mode)
  return possiblePaths[0];
}

const spaDir = findSpaDir();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Serve static files from the SPA build
  app.use(express.static(spaDir, {
    maxAge: "1h",
    etag: false
  }));

  // SPA fallback: serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(spaDir, "index.html");

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`index.html not found at: ${indexPath}`);
      res.status(404).json({
        error: "Not found",
        spaDir: spaDir,
        cwd: process.cwd()
      });
    }
  });

  return app;
}
