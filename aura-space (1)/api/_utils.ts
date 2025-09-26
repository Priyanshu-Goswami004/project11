import type { IncomingMessage, ServerResponse } from "http";

export async function readJson<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        if (!data) return resolve({} as T);
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export function sendJson(res: ServerResponse, status: number, body: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export function methodNotAllowed(res: ServerResponse, allowed: string[]) {
  res.statusCode = 405;
  res.setHeader("Allow", allowed.join(", "));
  res.end("Method Not Allowed");
}
