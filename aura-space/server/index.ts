import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as classes from "./routes/classes";

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

  // EcoQuest API
  app.get("/api/classes", classes.listClasses);
  app.post("/api/classes", classes.createClass);
  app.post("/api/join", classes.joinClass);
  app.get("/api/assignments", classes.listAssignments);
  app.post("/api/assignments", classes.createAssignment);
  app.get("/api/leaderboard/:classId", classes.leaderboard);
  app.post("/api/score", classes.scoreUpdate);

  return app;
}
