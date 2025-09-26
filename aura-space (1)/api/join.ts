import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJson, methodNotAllowed } from "./_utils";
import { store } from "../server/routes/store";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "POST") {
    try {
      const body = await readJson<{ joinCode: string; displayName: string }>(req);
      const result = store.joinClass((body.joinCode||"").toUpperCase(), body.displayName);
      return sendJson(res, 201, result);
    } catch (e: any) {
      return sendJson(res, 400, { error: e.message || "Invalid class code" });
    }
  }
  return methodNotAllowed(res, ["POST"]);
}
