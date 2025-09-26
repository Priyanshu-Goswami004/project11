import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJson, methodNotAllowed } from "./_utils";
import { store } from "../server/routes/store";

function getQuery(req: IncomingMessage) {
  try {
    const url = new URL(req.url || "", "http://localhost");
    return Object.fromEntries(url.searchParams.entries());
  } catch {
    return {} as Record<string, string>;
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "GET") {
    const q = getQuery(req);
    const list = store.listAssignments(q.classId);
    return sendJson(res, 200, { assignments: list });
  }
  if (req.method === "POST") {
    try {
      const body = await readJson<{ classId: string; tasks: any[]; due: number }>(req);
      const a = store.createAssignment(body.classId, body.tasks as any, body.due);
      return sendJson(res, 201, a);
    } catch (e: any) {
      return sendJson(res, 400, { error: e.message || "Bad Request" });
    }
  }
  return methodNotAllowed(res, ["GET", "POST"]);
}
