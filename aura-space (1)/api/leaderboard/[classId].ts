import type { IncomingMessage, ServerResponse } from "http";
import { sendJson } from "../_utils";
import { store } from "../../server/routes/store";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.statusCode = 405; res.end("Method Not Allowed"); return;
  }
  const match = (req.url || "").match(/\/api\/leaderboard\/(.*)/);
  const classId = match?.[1] || "";
  const data = store.leaderboard(classId);
  return sendJson(res, 200, data);
}
