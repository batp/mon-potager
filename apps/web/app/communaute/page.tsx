import { PlaceholderImage } from "@/components/placeholders/PlaceholderImage";

export default function CommunautePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#2D5A3D]">Communauté</h1>
        <p className="text-sm text-[#3D3229]/70">Fil d&apos;actualité — Sprint 4</p>
      </header>

      <div className="rounded-2xl border border-[#7BAE7F]/40 bg-white/80 p-4">
        <p className="text-sm font-semibold text-[#2D5A3D]">Conseil du jour</p>
        <p className="mt-1 text-sm text-[#3D3229]/80">
          Attirez les pollinisateurs avec des fleurs compagnes.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#D4A574] bg-[#F5F0E8] p-8">
        <PlaceholderImage type="empty" name="Fil communautaire" emoji="👥" />
        <p className="mt-4 text-center text-sm text-[#3D3229]/70">
          Posts, likes et commentaires arrivent au Sprint 4.
        </p>
      </div>
    </div>
  );
}
