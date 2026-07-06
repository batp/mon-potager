import webpush from "web-push";

export interface PushMessage {
  title: string;
  body: string;
  url?: string;
}

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return true;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:hello@monpotager.app";

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
  return true;
}

export async function sendWebPush(
  subscriptionJson: string,
  message: PushMessage,
): Promise<{ ok: true } | { ok: false; expired: boolean }> {
  if (!ensureVapid()) {
    throw new Error("Web Push non configuré (clés VAPID manquantes)");
  }

  const subscription = JSON.parse(subscriptionJson) as webpush.PushSubscription;

  try {
    await webpush.sendNotification(subscription, JSON.stringify(message));
    return { ok: true };
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 404 || statusCode === 410) {
      return { ok: false, expired: true };
    }
    throw error;
  }
}
