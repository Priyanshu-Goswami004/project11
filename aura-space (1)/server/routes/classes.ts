import { RequestHandler } from "express";
import { z } from "zod";
import { store } from "./store";
import {
  CreateAssignmentRequest,
  CreateClassRequest,
  JoinClassRequest,
  ScoreUpdateRequest,
} from "@shared/api";

export const listClasses: RequestHandler = (_req, res) => {
  res.json({ classes: store.listClasses() });
};

export const createClass: RequestHandler = (req, res) => {
  const body = z.object({ name: z.string().min(2), grade: z.string().min(1) }).parse(req.body as CreateClassRequest);
  const cls = store.createClass(body.name, body.grade);
  res.status(201).json(cls);
};

export const joinClass: RequestHandler = (req, res) => {
  const body = z.object({ joinCode: z.string().min(4), displayName: z.string().min(2).max(24) }).parse(req.body as JoinClassRequest);
  try {
    const result = store.joinClass(body.joinCode, body.displayName);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const createAssignment: RequestHandler = (req, res) => {
  const body = z.object({
    classId: z.string(),
    tasks: z.array(z.union([
      z.object({ type: z.literal("game"), gameId: z.enum(["segregation","river","recycling","compost","ar-tree"]), level: z.number().int().min(1) }),
      z.object({ type: z.literal("quiz"), quizId: z.string() })
    ])).min(1),
    due: z.number().int(),
  }).parse(req.body as CreateAssignmentRequest);
  const a = store.createAssignment(body.classId, body.tasks, body.due);
  res.status(201).json(a);
};

export const listAssignments: RequestHandler = (req, res) => {
  const classId = req.query.classId as string | undefined;
  res.json({ assignments: store.listAssignments(classId) });
};

export const leaderboard: RequestHandler = (req, res) => {
  const classId = req.params.classId as string;
  res.json(store.leaderboard(classId));
};

export const scoreUpdate: RequestHandler = (req, res) => {
  const body = z.object({ userId: z.string(), xpDelta: z.number(), streakDelta: z.number().optional() }).parse(req.body as ScoreUpdateRequest);
  try {
    const user = store.updateScore(body.userId, body.xpDelta, body.streakDelta ?? 0);
    res.json({ user });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
