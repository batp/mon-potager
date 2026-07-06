import { createClient } from "@/lib/supabase/client";
import { getVapidPublicKey, isPushSupported, urlBase64ToUint8Array } from "@/lib/push/vapid";

export async function subscribeToPush(userId: string) {
  if (!isPushSupported()) {
    throw new Error("Les notifications ne sont pas supportées sur cet appareil");
  }

  const vapidKey = getVapidPublicKey();
  if (!vapidKey) {
    throw new Error("Web Push non configuré (clé VAPID manquante)");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission de notification refusée");
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }

  const supabase = createClient();
  if (!supabase) throw new Error("Supabase non configuré");

  const token = JSON.stringify(subscription);
  const { error } = await supabase.from("push_tokens").upsert(
    { user_id: userId, token, platform: "web" },
    { onConflict: "user_id,token" },
  );

  if (error) throw error;
  return subscription;
}

export async function unsubscribeFromPush(userId: string) {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const token = JSON.stringify(subscription);
    const supabase = createClient();
    if (supabase) {
      await supabase
        .from("push_tokens")
        .delete()
        .eq("user_id", userId)
        .eq("token", token);
    }
    await subscription.unsubscribe();
  }
}

export async function hasPushSubscription() {
  if (!isPushSupported()) return false;
  const registration = await navigator.serviceWorker.ready;
  const sub = await registration.pushManager.getSubscription();
  return !!sub && Notification.permission === "granted";
}
