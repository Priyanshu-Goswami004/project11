import { Assignment, SchoolClass, UserProfile } from "@shared/api";

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function code() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

class Store {
  classes = new Map<string, SchoolClass>();
  users = new Map<string, UserProfile>();
  assignments = new Map<string, Assignment>();

  createClass(name: string, grade: string): SchoolClass {
    const c: SchoolClass = { id: id(), name, grade, joinCode: code(), createdAt: Date.now() };
    this.classes.set(c.id, c);
    return c;
  }

  listClasses(): SchoolClass[] {
    return Array.from(this.classes.values()).sort((a,b)=>b.createdAt-a.createdAt);
  }

  joinClass(joinCode: string, displayName: string) {
    const cls = this.listClasses().find(c => c.joinCode === joinCode);
    if (!cls) throw new Error("Invalid class code");
    const user: UserProfile = { id: id(), role: "student", displayName, classId: cls.id, createdAt: Date.now(), xp: 0, streak: 0 };
    this.users.set(user.id, user);
    return { user, class: cls };
  }

  createAssignment(classId: string, tasks: Assignment["tasks"], due: number): Assignment {
    const a: Assignment = { id: id(), classId, tasks, due, createdAt: Date.now() };
    this.assignments.set(a.id, a);
    return a;
  }

  listAssignments(classId?: string): Assignment[] {
    const all = Array.from(this.assignments.values());
    return (classId ? all.filter(a=>a.classId===classId) : all).sort((a,b)=>b.createdAt-a.createdAt);
  }

  updateScore(userId: string, xpDelta: number, streakDelta = 0): UserProfile {
    const u = this.users.get(userId);
    if (!u) throw new Error("User not found");
    u.xp = Math.max(0, u.xp + xpDelta);
    u.streak = Math.max(0, u.streak + streakDelta);
    this.users.set(u.id, u);
    return u;
  }

  leaderboard(classId: string) {
    const entries = Array.from(this.users.values()).filter(u=>u.classId===classId)
      .map(u=>({ userId: u.id, displayName: u.displayName, xp: u.xp, streak: u.streak }))
      .sort((a,b)=> (b.xp - a.xp) || (b.streak - a.streak));
    return { classId, leaderboard: entries, updatedAt: Date.now() };
  }
}

export const store = new Store();

// Seed data for demo
const demoClass = store.createClass("Waste Week – 7B", "7");
const s1 = store.joinClass(demoClass.joinCode, "Aarav").user;
const s2 = store.joinClass(demoClass.joinCode, "Simran").user;
store.updateScore(s1.id, 120, 2);
store.updateScore(s2.id, 90, 1);
store.createAssignment(demoClass.id, [{ type: "game", gameId: "segregation", level: 3 }], Date.now()+3*24*3600*1000);
