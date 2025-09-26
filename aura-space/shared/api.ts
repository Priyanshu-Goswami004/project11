/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export type Role = "student" | "teacher";

export interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  joinCode: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  role: Role;
  displayName: string;
  classId: string | null;
  createdAt: number;
  xp: number;
  streak: number;
}

export interface AssignmentTaskGame {
  type: "game";
  gameId: "segregation" | "river" | "recycling" | "compost" | "ar-tree";
  level: number;
}
export interface AssignmentTaskQuiz {
  type: "quiz";
  quizId: string;
}
export type AssignmentTask = AssignmentTaskGame | AssignmentTaskQuiz;

export interface Assignment {
  id: string;
  classId: string;
  tasks: AssignmentTask[];
  due: number; // epoch ms
  createdAt: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  xp: number;
  streak: number;
}

export interface LeaderboardResponse {
  classId: string;
  leaderboard: LeaderboardEntry[];
  updatedAt: number;
}

export interface CreateClassRequest { name: string; grade: string }
export interface CreateClassResponse extends SchoolClass {}

export interface ListClassesResponse { classes: SchoolClass[] }

export interface JoinClassRequest { joinCode: string; displayName: string }
export interface JoinClassResponse { user: UserProfile; class: SchoolClass }

export interface CreateAssignmentRequest { classId: string; tasks: AssignmentTask[]; due: number }
export interface CreateAssignmentResponse extends Assignment {}
export interface ListAssignmentsResponse { assignments: Assignment[] }

export interface ScoreUpdateRequest { userId: string; xpDelta: number; streakDelta?: number }
export interface ScoreUpdateResponse { user: UserProfile }

/** Example response type for /api/demo */
export interface DemoResponse { message: string }
