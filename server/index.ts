import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";

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

  // Serve static files from dist/spa
  const spaPath = path.join(process.cwd(), "dist/spa");
  app.use(express.static(spaPath));

  // SPA fallback: serve index.html for all other routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(spaPath, "index.html"));
  });

  return app;
}
