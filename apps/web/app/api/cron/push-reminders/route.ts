import { NextResponse } from "next/server";
import { sendWebPush } from "@/lib/push/send";
import { createAdminClient } from "@/lib/supabase/admin";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  return request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY manquant" },
      { status: 500 },
    );
  }

  const today = todayIso();

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("user_id, title")
    .is("completed_at", null)
    .eq("due_date", today);

  if (tasksError) {
    return NextResponse.json({ error: tasksError.message }, { status: 500 });
  }

  const countByUser = new Map<string, number>();
  for (const task of tasks ?? []) {
    countByUser.set(task.user_id, (countByUser.get(task.user_id) ?? 0) + 1);
  }

  if (countByUser.size === 0) {
    return NextResponse.json({ sent: 0, users: 0 });
  }

  const userIds = [...countByUser.keys()];
  const { data: tokens, error: tokensError } = await supabase
    .from("push_tokens")
    .select("id, user_id, token")
    .in("user_id", userIds);

  if (tokensError) {
    return NextResponse.json({ error: tokensError.message }, { status: 500 });
  }

  let sent = 0;
  const expiredIds: string[] = [];

  for (const row of tokens ?? []) {
    const count = countByUser.get(row.user_id) ?? 0;
    if (count === 0) continue;

    const body =
      count === 1
        ? "1 tâche à faire aujourd'hui dans votre potager"
        : `${count} tâches à faire aujourd'hui dans votre potager`;

    try {
      const result = await sendWebPush(row.token, {
        title: "Mon Potager — Calendrier",
        body,
        url: "/calendrier",
      });

      if (result.ok) {
        sent += 1;
      } else if (result.expired) {
        expiredIds.push(row.id);
      }
    } catch {
      // Token invalide ou erreur réseau — on continue pour les autres
    }
  }

  if (expiredIds.length > 0) {
    await supabase.from("push_tokens").delete().in("id", expiredIds);
  }

  return NextResponse.json({
    sent,
    users: countByUser.size,
    expired: expiredIds.length,
  });
}
