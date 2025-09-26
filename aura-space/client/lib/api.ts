import {
  Assignment,
  CreateAssignmentRequest,
  CreateAssignmentResponse,
  CreateClassRequest,
  CreateClassResponse,
  JoinClassRequest,
  JoinClassResponse,
  LeaderboardResponse,
  ListAssignmentsResponse,
  ListClassesResponse,
  ScoreUpdateRequest,
  ScoreUpdateResponse,
} from "@shared/api";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  listClasses: () => fetch("/api/classes").then(json<ListClassesResponse>),
  createClass: (body: CreateClassRequest) => fetch("/api/classes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json<CreateClassResponse>),
  joinClass: (body: JoinClassRequest) => fetch("/api/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json<JoinClassResponse>),
  listAssignments: (classId?: string) => fetch(`/api/assignments${classId?`?classId=${classId}`:``}`).then(json<ListAssignmentsResponse>),
  createAssignment: (body: CreateAssignmentRequest) => fetch("/api/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json<CreateAssignmentResponse>),
  leaderboard: (classId: string) => fetch(`/api/leaderboard/${classId}`).then(json<LeaderboardResponse>),
  score: (body: ScoreUpdateRequest) => fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json<ScoreUpdateResponse>),
};
