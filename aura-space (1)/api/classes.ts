import type { IncomingMessage, ServerResponse } from "http";
import { sendJson, readJson, methodNotAllowed } from "./_utils";
import { store } from "../server/routes/store";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "GET") {
    return sendJson(res, 200, { classes: store.listClasses() });
  }
  if (req.method === "POST") {
    try {
      const body = await readJson<{ name: string; grade: string }>(req);
      const cls = store.createClass(body.name, body.grade);
      return sendJson(res, 201, cls);
    } catch (e: any) {
      return sendJson(res, 400, { error: e.message || "Bad Request" });
    }
  }
  return methodNotAllowed(res, ["GET", "POST"]);
}
