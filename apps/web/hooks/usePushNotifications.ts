"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  hasPushSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push/subscribe";
import { getVapidPublicKey, isPushSupported } from "@/lib/push/vapid";

export function usePushNotifications() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supported = isPushSupported();
  const configured = !!getVapidPublicKey();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setEnabled(await hasPushSubscription());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const enable = async () => {
    if (!user) return;
    setError(null);
    try {
      await subscribeToPush(user.id);
      setEnabled(true);
    } catch (e) {
      setError((e as Error).message);
      throw e;
    }
  };

  const disable = async () => {
    if (!user) return;
    setError(null);
    try {
      await unsubscribeFromPush(user.id);
      setEnabled(false);
    } catch (e) {
      setError((e as Error).message);
      throw e;
    }
  };

  return {
    supported,
    configured,
    enabled,
    loading,
    error,
    enable,
    disable,
    refresh,
  };
}
