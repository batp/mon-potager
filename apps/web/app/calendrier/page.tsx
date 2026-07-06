import { Calendar } from "lucide-react";

export default function CalendrierPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#2D5A3D]">Calendrier</h1>
        <p className="text-sm text-[#3D3229]/70">Juillet 2026</p>
      </header>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-[#2D5A3D]">
          Aujourd&apos;hui
        </p>
        <ul className="space-y-2">
          {[
            { icon: "💧", label: "Arrosage — Tomates" },
            { icon: "🌿", label: "Paillage — Courgettes" },
            { icon: "🔧", label: "Travail du sol" },
          ].map((task) => (
            <li
              key={task.label}
              className="flex items-center gap-3 rounded-xl border border-[#E8DFD0] px-3 py-2"
            >
              <span aria-hidden>{task.icon}</span>
              <span className="flex-1 text-sm">{task.label}</span>
              <input type="checkbox" aria-label={`Marquer ${task.label} comme fait`} />
            </li>
          ))}
        </ul>
      </div>

      <p className="flex items-center gap-2 text-xs text-[#3D3229]/60">
        <Calendar className="h-4 w-4" aria-hidden />
        Calendrier complet et tâches auto-générées — Sprint 3
      </p>
    </div>
  );
}
