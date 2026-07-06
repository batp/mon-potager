import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-[#2D5A3D]">Créer un compte</h1>

      <div className="rounded-2xl border border-[#E8DFD0] bg-white/80 p-4 text-sm text-[#3D3229]/80">
        <p className="font-semibold text-[#2D5A3D]">Phase de test</p>
        <p className="mt-2">
          Les comptes sont créés <strong>manuellement</strong> dans le dashboard
          Supabase (Authentication → Users). L&apos;inscription en ligne sera
          ajoutée plus tard.
        </p>
      </div>

      <p className="text-sm text-[#3D3229]/70">
        Voir le guide :{" "}
        <code className="rounded bg-[#E8DFD0]/50 px-1">doc/11-utilisateurs-test-supabase.md</code>
      </p>

      <Link
        href="/auth/login"
        className="block w-full rounded-xl bg-[#4A7C59] px-4 py-3 text-center text-sm font-semibold text-white"
      >
        Retour à la connexion
      </Link>
    </div>
  );
}
