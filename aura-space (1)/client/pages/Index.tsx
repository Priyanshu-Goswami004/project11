import { Button } from "@/components/ui/button";
import { ArrowRight, Scan, Badge, BrainCircuit, Leaf, ShieldCheck, Sparkles, Trophy } from "lucide-react";

export default function Index() {
  return (
    <div>
      <Hero />
      <Highlights />
      <LiveLeaderboard />
      <MiniGames />
      <Architecture />
      <Mvp />
      <DeployTips />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="absolute top-1/3 -left-12 h-80 w-80 rounded-full bg-lime-300/30 blur-3xl" />
      </div>
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              Govt. of Punjab • SIH25009
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-950">
              Gamified Environmental Education for Schools
            </h1>
            <p className="mt-4 text-emerald-800/80 max-w-xl">
              Learn waste management, pollution control, and tree plantation through mini‑games, AR saplings, quizzes, and class contests. Leaderboards, badges, and weekly quests keep students engaged.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <a href="#minigames" className="gap-2">
                  Play the vision <ArrowRight />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard">Teacher Dashboard</a>
              </Button>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-emerald-900/80">
              <li className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" /> Privacy‑friendly, class‑code login</li>
              <li className="flex items-center gap-2"><Sparkles className="text-emerald-600" /> AR Tree planting (beta)</li>
              <li className="flex items-center gap-2"><Trophy className="text-emerald-600" /> Class leaderboards & badges</li>
              <li className="flex items-center gap-2"><BrainCircuit className="text-emerald-600" /> Adaptive difficulty & mastery</li>
            </ul>
          </div>
          <div className="relative">
            <div className="mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-100 bg-white/60 shadow-xl backdrop-blur">
              <div className="h-full w-full grid place-items-center p-6">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#84cc16" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="300" height="200" fill="#ecfdf5" />
                  <circle cx="60" cy="140" r="35" fill="url(#g)" opacity="0.9" />
                  <circle cx="130" cy="120" r="50" fill="url(#g)" opacity="0.6" />
                  <circle cx="210" cy="140" r="65" fill="url(#g)" opacity="0.35" />
                  <g>
                    <rect x="40" y="155" width="40" height="12" rx="6" fill="#065f46" opacity="0.7" />
                    <rect x="110" y="150" width="50" height="17" rx="8.5" fill="#065f46" opacity="0.7" />
                    <rect x="200" y="145" width="80" height="22" rx="11" fill="#065f46" opacity="0.7" />
                  </g>
                  <g>
                    <rect x="190" y="30" width="30" height="20" rx="4" fill="#10b981" />
                    <rect x="225" y="30" width="30" height="20" rx="4" fill="#34d399" />
                    <rect x="260" y="30" width="30" height="20" rx="4" fill="#a7f3d0" />
                  </g>
                  <text x="20" y="40" fill="#065f46" fontWeight="700" fontSize="14">Segregation • River • AR Tree</text>
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 rounded-full bg-emerald-600 text-white text-xs px-3 py-1 shadow">
              Punjab‑ready • EN/HI/PA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";
import type { LeaderboardEntry, SchoolClass } from "@shared/api";

function LiveLeaderboard() {
  const { profile } = useProfile();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    api.listClasses().then(r=>setClasses(r.classes));
  }, []);

  useEffect(() => {
    const cid = profile?.classId ?? classes[0]?.id ?? null;
    setClassId(cid ?? null);
  }, [profile?.classId, classes]);

  useEffect(() => {
    if (!classId) return;
    api.leaderboard(classId).then(r=>setEntries(r.leaderboard)).catch(()=>setEntries([]));
  }, [classId]);

  return (
    <section id="live" className="py-12 md:py-16 border-t border-emerald-100/70 dark:border-emerald-900">
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-950">Live class leaderboard</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="cls" className="text-sm text-emerald-900/80 dark:text-emerald-100/80">Class</label>
            <select id="cls" className="rounded-md border border-emerald-200 bg-white/70 dark:bg-emerald-950/40 px-2 py-1"
              value={classId ?? ""} onChange={e=>setClassId(e.target.value)}>
              <option value="" disabled>Select</option>
              {classes.map(c=> <option key={c.id} value={c.id}>{c.name} (Code: {c.joinCode})</option>)}
            </select>
            {profile?.id && profile.classId===classId && (
              <button onClick={async()=>{ await api.score({ userId: profile.id!, xpDelta: 10 }); const r = await api.leaderboard(classId!); setEntries(r.leaderboard); }}
                className="ml-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-sm text-emerald-800 hover:bg-emerald-100">
                +10 XP (demo)
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          {entries.length===0 && (
            <p className="text-sm text-emerald-800/80 dark:text-emerald-200/70">No entries yet. Join a class and start playing to earn XP!</p>
          )}
          {entries.map((e, i) => (
            <div key={e.userId} className="flex items-center justify-between rounded-xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 grid place-items-center font-semibold text-emerald-700">{i+1}</div>
                <div className="font-medium text-emerald-900 dark:text-emerald-50">{e.displayName}</div>
              </div>
              <div className="text-sm text-emerald-900/80 dark:text-emerald-100/80">XP: <b>{e.xp}</b> · Streak: <b>{e.streak}</b></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const items = [
    { icon: <Leaf className="text-emerald-600" />, title: "Curriculum‑aligned", desc: "NCERT/Punjab board terms with micro‑lessons and quick quizzes." },
    { icon: <Trophy className="text-emerald-600" />, title: "Fair motivation", desc: "XP, streaks, and cosmetic rewards—no pay‑to‑win." },
    { icon: <Badge className="text-emerald-600" />, title: "Badges & Leaderboards", desc: "Class‑first boards, school‑wide optional with normalization." },
    { icon: <Scan className="text-emerald-600" />, title: "AR/VR mini‑games", desc: "AR Tree planting; optional Cardboard tour for demo wow‑factor." },
  ];
  return (
    <section className="py-12 md:py-16 border-t border-emerald-100/70 dark:border-emerald-900" id="leaderboards">
      <div className="container grid gap-6 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-6 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 grid place-items-center mb-3">{it.icon}</div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-50">{it.title}</p>
            <p className="text-sm mt-1 text-emerald-800/80 dark:text-emerald-200/70">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniGames() {
  const games = [
    { title: "Waste Segregation Sorter", desc: "Swipe items into Dry/Wet/E‑waste/Medical bins; combos for streaks.", points: ["Penalty for wrong disposal", "Trick items & belt speed", "+10/−5 scoring"] },
    { title: "River Rescue", desc: "Clean pollutants, deploy booms, place wetlands; keep WQI above threshold.", points: ["Point vs non‑point sources", "Upstream factories & storms", "Budget constraints"] },
    { title: "Recycling Plant Tycoon", desc: "Build lines and manage capacity; learn lifecycle and contamination.", points: ["Supplier contracts", "Audits & diversion targets", "Systems thinking"] },
    { title: "Compost Lab", desc: "Balance greens/browns, moisture & aeration to accelerate composting.", points: ["Seasonal inputs", "Pest & odour control", "Methane avoidance"] },
    { title: "AR Tree Planting (Signature)", desc: "Place a sapling in real space; daily care for growth and bonuses.", points: ["Local species focus", "Soft anti‑cheat checks", "Fallback to non‑AR"] },
  ];
  return (
    <section className="py-16" id="minigames">
      <div className="container">
        <h2 className="text-3xl font-extrabold tracking-tight text-emerald-950">Mini‑games that teach</h2>
        <p className="mt-2 text-emerald-800/80 max-w-2xl">Arcade fun with real learning outcomes. Designed for classes 5–10 with adaptive difficulty and mastery per concept.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <article key={g.title} className="rounded-2xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-6 shadow-sm">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-50">{g.title}</h3>
              <p className="text-sm mt-1 text-emerald-800/80 dark:text-emerald-200/70">{g.desc}</p>
              <ul className="mt-3 space-y-1 text-sm text-emerald-900/80 dark:text-emerald-100/80 list-disc list-inside">
                {g.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section className="py-16 border-t border-emerald-100/70 dark:border-emerald-900" id="architecture">
      <div className="container grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-950">Clean, practical architecture</h2>
          <ul className="mt-4 space-y-3 text-emerald-900/80 dark:text-emerald-100/80">
            <li className="flex items-start gap-3"><span className="mt-1">📱</span><p><b>Mobile (Students)</b>: Flutter/React Native shell + Unity mini‑games via Unity‑as‑a‑Library; AR Foundation for ARCore/ARKit.</p></li>
            <li className="flex items-start gap-3"><span className="mt-1">🖥️</span><p><b>Web (Teachers/Admin)</b>: React/Vite dashboard with Tailwind + Recharts.</p></li>
            <li className="flex items-start gap-3"><span className="mt-1">☁️</span><p><b>Firebase</b>: Auth, Firestore, Functions, Storage, Remote Config, FCM. Serverless and school‑friendly.</p></li>
            <li className="flex items-start gap-3"><span className="mt-1">🛡️</span><p><b>Privacy</b>: Anonymous student login via class code; teacher email/password; strict rules.</p></li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700"><a href="#deploy">Deployment tips</a></Button>
            <Button variant="outline" asChild><a href="/dashboard">Open dashboard</a></Button>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-6 shadow-sm">
          <Diagram />
        </div>
      </div>
    </section>
  );
}

function Diagram() {
  return (
    <div className="grid gap-4 text-sm">
      <div className="rounded-lg border border-emerald-200 p-3 bg-emerald-50/60">Mobile App (Flutter/RN) ↔ Unity Mini‑games + AR Foundation</div>
      <div className="rounded-lg border border-emerald-200 p-3 bg-emerald-50/60">Teacher Dashboard (React/Vite + Tailwind)</div>
      <div className="rounded-lg border border-emerald-200 p-3 bg-emerald-50/60">Firebase: Auth • Firestore • Functions • Storage • Remote Config • FCM</div>
      <div className="rounded-lg border border-emerald-200 p-3 bg-emerald-50/60">Analytics: DAU/WAU • Streaks • Mastery</div>
    </div>
  );
}

function Mvp() {
  const items = [
    "Core app shell (auth, class join, hub, profile)",
    "2 mini‑games (Segregation Sorter + River Rescue) with 3 levels",
    "Micro‑lessons + quizzes (EN/HI/PA)",
    "Teacher dashboard (classes, quests, basic analytics)",
    "Leaderboards + badges (weekly reset)",
    "AR Tree beta: sapling with 3 growth steps + daily check‑in",
    "Remote Config: flip Green Week multiplier live",
  ];
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-extrabold tracking-tight text-emerald-950">MVP scope (judge‑ready)</h2>
        <ul className="mt-4 grid gap-2 md:grid-cols-2 text-emerald-900/80 dark:text-emerald-100/80 list-disc list-inside">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DeployTips() {
  return (
    <section className="py-16 border-t border-emerald-100/70 dark:border-emerald-900" id="deploy">
      <div className="container">
        <h2 className="text-3xl font-extrabold tracking-tight text-emerald-950">Free deployment tips</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-5">
            <p className="font-semibold text-emerald-900 dark:text-emerald-50">Netlify (recommended)</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-emerald-900/80 dark:text-emerald-100/80">
              <li>Click “Open MCP popover” then connect Netlify MCP</li>
              <li>Build command: pnpm build • Output: dist/spa</li>
              <li>Server: use netlify/functions/api.ts for SSR endpoints</li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-5">
            <p className="font-semibold text-emerald-900 dark:text-emerald-50">Vercel</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-emerald-900/80 dark:text-emerald-100/80">
              <li>Connect Vercel MCP in the MCP popover</li>
              <li>Framework: Vite • Build: pnpm build</li>
              <li>Preview branches auto‑deploy; great for demos</li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-100/70 dark:border-emerald-900 bg-white/70 dark:bg-emerald-950/40 p-5">
            <p className="font-semibold text-emerald-900 dark:text-emerald-50">Firebase setup</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-emerald-900/80 dark:text-emerald-100/80">
              <li>Auth: email/password (teachers) + anonymous (students)</li>
              <li>Firestore: users, classes, progress, assignments</li>
              <li>Functions: score aggregation, weekly reset, anti‑cheat</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-xs text-emerald-800/80 dark:text-emerald-200/70">Tip: You can also share the Open Preview for quick demo links (not production‑grade).</p>
      </div>
    </section>
  );
}
