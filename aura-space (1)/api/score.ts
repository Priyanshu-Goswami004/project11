import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJson, methodNotAllowed } from "./_utils";
import { store } from "../server/routes/store";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "POST") {
    try {
      const body = await readJson<{ userId: string; xpDelta: number; streakDelta?: number }>(req);
      const user = store.updateScore(body.userId, body.xpDelta, body.streakDelta || 0);
      return sendJson(res, 200, { user });
    } catch (e: any) {
      return sendJson(res, 400, { error: e.message || "Bad Request" });
    }
  }
  return methodNotAllowed(res, ["POST"]);
}
