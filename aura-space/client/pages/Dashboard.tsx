import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, GraduationCap, Users2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Assignment, SchoolClass } from "@shared/api";

export default function Dashboard() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh(classId?: string) {
    const cls = await api.listClasses();
    setClasses(cls.classes);
    const first = classId ?? cls.classes[0]?.id;
    const asg = await api.listAssignments(first);
    setAssignments(asg.assignments);
  }

  useEffect(() => {
    refresh().catch(()=>{});
  }, []);

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-50">Teacher/Admin Dashboard</h1>
        <p className="mt-2 text-emerald-800/80 dark:text-emerald-200/70 max-w-2xl">Manage classes, assign quests, and track progress. This demo stores data in-memory on the server.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card icon={<Users2 className="text-emerald-600" />} title="Create Class" desc={<CreateClass onCreated={(c)=>refresh(c.id)} />} />
        <Card icon={<ClipboardList className="text-emerald-600" />} title="Create Quest" desc={<CreateAssignment classes={classes} onCreated={(c)=>refresh(c)} />} />
        <Card icon={<GraduationCap className="text-emerald-600" />} title="Your Classes" desc={<ClassesList classes={classes} />} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-emerald-900 dark:text-emerald-50">Assignments</h2>
        <div className="mt-3 grid gap-3">
          {assignments.map(a=> (
            <div key={a.id} className="rounded-xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-emerald-900 dark:text-emerald-50">Class: {classes.find(c=>c.id===a.classId)?.name ?? a.classId}</p>
                  <p className="text-sm text-emerald-800/80 dark:text-emerald-200/70">Tasks: {a.tasks.map(t=> t.type==="game"? `${t.gameId} L${t.level}`: `quiz ${t.quizId}`).join(", ")}</p>
                </div>
                <div className="text-sm text-emerald-900/80 dark:text-emerald-100/80">Due: {new Date(a.due).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
          {assignments.length===0 && <p className="text-sm text-emerald-800/80 dark:text-emerald-200/70">No assignments yet.</p>}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700"><a href="#deploy">Read deploy tips</a></Button>
        <Button variant="outline" asChild><a href="#architecture">See architecture</a></Button>
        <Button variant="ghost" asChild><a href="/">Back to Home</a></Button>
      </div>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-emerald-100 grid place-items-center">{icon}</div>
        <div className="flex-1">
          <p className="font-semibold text-emerald-900 dark:text-emerald-50">{title}</p>
          <div className="text-sm mt-2 text-emerald-800/80 dark:text-emerald-200/70">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function CreateClass({ onCreated }: { onCreated: (c: SchoolClass)=>void }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function submit() {
    setLoading(true); setError(null);
    try {
      const c = await api.createClass({ name: name.trim(), grade: grade.trim() });
      onCreated(c);
      setName(""); setGrade("");
    } catch (e: any) {
      setError(e.message?.slice(0,200) ?? "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <Label htmlFor="cls-name">Class name</Label>
        <Input id="cls-name" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Waste Week – 7B" />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="cls-grade">Grade</Label>
        <Input id="cls-grade" value={grade} onChange={e=>setGrade(e.target.value)} placeholder="e.g. 7" />
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <Button disabled={loading || name.trim().length<2 || grade.trim().length<1} onClick={submit}>{loading?"Creating...":"Create"}</Button>
    </div>
  );
}

function CreateAssignment({ classes, onCreated }: { classes: SchoolClass[]; onCreated: (classId: string)=>void }) {
  const [classId, setClassId] = useState<string>(classes[0]?.id ?? "");
  const [game, setGame] = useState<"segregation"|"river"|"recycling"|"compost"|"ar-tree">("segregation");
  const [level, setLevel] = useState(1);
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if (classes[0]?.id) setClassId(classes[0].id); }, [classes]);

  async function submit() {
    setLoading(true);
    try {
      await api.createAssignment({ classId, tasks: [{ type: "game", gameId: game, level }], due: Date.now() + days*24*3600*1000 });
      onCreated(classId);
    } finally { setLoading(false); }
  }

  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <Label>Class</Label>
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
          <SelectContent>
            {classes.map(c=> <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label>Game</Label>
        <Select value={game} onValueChange={(v)=>setGame(v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="segregation">Segregation Sorter</SelectItem>
            <SelectItem value="river">River Rescue</SelectItem>
            <SelectItem value="recycling">Recycling Plant Tycoon</SelectItem>
            <SelectItem value="compost">Compost Lab</SelectItem>
            <SelectItem value="ar-tree">AR Tree Planting</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label>Level</Label>
        <Input type="number" min={1} max={10} value={level} onChange={e=>setLevel(parseInt(e.target.value||"1"))} />
      </div>
      <div className="grid gap-1">
        <Label>Due (days from now)</Label>
        <Input type="number" min={1} max={30} value={days} onChange={e=>setDays(parseInt(e.target.value||"3"))} />
      </div>
      <Button disabled={loading || !classId} onClick={submit}>{loading?"Creating...":"Assign"}</Button>
    </div>
  );
}

function ClassesList({ classes }: { classes: SchoolClass[] }) {
  if (classes.length===0) return <p className="text-sm">No classes yet.</p>;
  return (
    <div className="grid gap-2">
      {classes.map(c=> (
        <div key={c.id} className="rounded-lg border border-emerald-100/70 dark:border-emerald-900 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-50">{c.name}</p>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70">Grade {c.grade} • Code: <b>{c.joinCode}</b></p>
            </div>
            <div className="text-xs text-emerald-700/70">Created {new Date(c.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
