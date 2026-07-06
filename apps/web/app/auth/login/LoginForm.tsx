"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export function LoginForm() {
  const { signIn, configured } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const configError = searchParams.get("error") === "config";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    router.push(redirectTo.startsWith("/auth") ? "/" : redirectTo);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <p className="text-3xl" aria-hidden>
          🌱
        </p>
        <h1 className="text-2xl font-bold text-[#2D5A3D]">Mon Potager</h1>
        <p className="mt-1 text-sm text-[#3D3229]/70">
          Connectez-vous pour accéder à l&apos;application
        </p>
      </header>

      {(configError || !configured) && (
        <div className="rounded-xl border border-[#E8A838]/50 bg-[#E8A838]/10 p-3 text-sm text-[#3D3229]">
          Supabase non configuré. Copiez vos clés dans{" "}
          <code>apps/web/.env.local</code> puis redémarrez{" "}
          <code>npm run dev</code>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marie@test.monpotager.fr"
            className="w-full rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm outline-none focus:border-[#4A7C59]"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm outline-none focus:border-[#4A7C59]"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-[#D9534F]/10 px-3 py-2 text-sm text-[#D9534F]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !configured}
          className="w-full rounded-xl bg-[#4A7C59] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-xs text-[#3D3229]/60">
        Compte de test créé dans Supabase (Authentication → Users)
      </p>
    </div>
  );
}
