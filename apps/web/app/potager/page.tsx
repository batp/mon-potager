import { PlaceholderImage } from "@/components/placeholders/PlaceholderImage";

export default function PotagerPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#2D5A3D]">Mon Potager</h1>
        <p className="text-sm text-[#3D3229]/70">
          Builder visuel — Sprint 2
        </p>
      </header>

      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D4A574] bg-white/60 p-8 text-center">
        <PlaceholderImage
          type="empty"
          name="Votre potager"
          emoji="🌱"
          size="lg"
        />
        <p className="mt-4 max-w-sm text-sm text-[#3D3229]/80">
          La grille interactive (zones, cultures, drag &amp; drop) sera
          disponible au Sprint 2.
        </p>
      </div>
    </div>
  );
}
