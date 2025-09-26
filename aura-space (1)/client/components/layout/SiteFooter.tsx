export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-100/70 dark:border-emerald-900">
      <div className="container py-10 text-sm text-emerald-800/80 dark:text-emerald-200/70 grid gap-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-emerald-900 dark:text-emerald-50">EcoQuest Punjab</p>
          <p className="mt-2 max-w-sm">
            Gamified environmental education for schools—waste management, river
            health, tree plantation, and AR saplings.
          </p>
        </div>
        <div>
          <p className="font-semibold text-emerald-900 dark:text-emerald-50">MVP Scope</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Segregation Sorter + River Rescue</li>
            <li>AR Tree beta (3 growth steps)</li>
            <li>Leaderboards, badges, weekly reset</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-emerald-900 dark:text-emerald-50">Deploy</p>
          <ul className="mt-2 space-y-1">
            <li>Use Netlify or Vercel via MCP</li>
            <li>Connect Firebase for data</li>
            <li>Performance: lazy assets, offline</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-100/60 dark:border-emerald-900">
        <div className="container py-4 text-xs text-emerald-700/70 dark:text-emerald-300/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} EcoQuest Punjab</span>
          <span>Built with React • Tailwind • Vite</span>
        </div>
      </div>
    </footer>
  );
}
