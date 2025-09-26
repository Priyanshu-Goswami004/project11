import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leaf, Trophy, Trees } from "lucide-react";
import { JoinClassDialog } from "@/components/JoinClassDialog";

export function SiteHeader() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-emerald-950/60 border-b border-emerald-100/70 dark:border-emerald-900">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-lime-500 grid place-items-center text-white shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-emerald-900 dark:text-emerald-50">
              EcoQuest Punjab
            </span>
            <span className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
              SIH25009 – Gamified Learning
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <HeaderLink to="/" label="Home" />
          <HeaderLink to="/dashboard" label="Teacher Dashboard" />
          <a
            href="#deploy"
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-200 dark:hover:text-white"
          >
            Deploy Tips
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <a href="#live" className="gap-2">
              <Trophy /> Leaderboards
            </a>
          </Button>
          <JoinClassDialog />
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link to="/dashboard" className="gap-2">
              <Trees /> Teacher Portal
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "transition-colors",
          isActive
            ? "text-emerald-900 dark:text-emerald-50 font-semibold"
            : "text-emerald-700 hover:text-emerald-900 dark:text-emerald-200 dark:hover:text-white",
        )
      }
      end
    >
      {label}
    </NavLink>
  );
}
