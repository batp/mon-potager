import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-[#2D5A3D]">Créer un compte</h1>
      <p className="text-sm text-[#3D3229]/70">
        Inscription + migration invité — à implémenter Sprint 1.
      </p>
      <Link href="/profil" className="text-sm text-[#4A7C59] underline">
        Retour au profil
      </Link>
    </div>
  );
}
