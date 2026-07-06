import Link from "next/link";

export default function ProfilPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#2D5A3D]">Profil</h1>
        <p className="text-sm text-[#3D3229]/70">Mode invité</p>
      </header>

      <div className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7BAE7F] text-xl font-bold text-white">
          ?
        </div>
        <div>
          <p className="font-semibold text-[#3D3229]">Jardinier invité</p>
          <p className="text-sm text-[#3D3229]/60">Aucun compte créé</p>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/auth/register"
          className="block w-full rounded-xl bg-[#4A7C59] px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Créer un compte
        </Link>
        <Link
          href="/auth/login"
          className="block w-full rounded-xl border border-[#4A7C59] px-4 py-3 text-center text-sm font-semibold text-[#4A7C59]"
        >
          Se connecter
        </Link>
      </div>

      <p className="text-xs text-[#3D3229]/50">
        Auth Supabase (anonyme + email) — Sprint 1 en cours
      </p>
    </div>
  );
}
