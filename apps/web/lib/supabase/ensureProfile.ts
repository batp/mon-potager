import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Garantit qu'une ligne profiles existe pour l'utilisateur Auth.
 * Nécessaire car les users créés manuellement avant le trigger 002
 * n'ont pas de profil → FK gardens.user_id échoue.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<void> {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return;

  const username =
    (user.user_metadata?.username as string | undefined) ??
    user.email?.split("@")[0] ??
    `jardinier_${user.id.slice(0, 8)}`;

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    username,
  });

  // Conflit = profil créé entre-temps (race)
  if (insertError && insertError.code !== "23505") {
    throw insertError;
  }
}
