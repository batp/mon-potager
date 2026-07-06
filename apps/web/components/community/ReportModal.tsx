"use client";

import { useState } from "react";
import { useFeed } from "@/hooks/useCommunity";
import { REPORT_REASONS, type ReportReason, type ReportTargetType } from "@/types/community";

export function ReportModal({
  targetType,
  targetId,
  onClose,
}: {
  targetType: ReportTargetType;
  targetId: string;
  onClose: () => void;
}) {
  const { reportContent } = useFeed();
  const [reason, setReason] = useState<ReportReason>(REPORT_REASONS[0]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      await reportContent.mutateAsync({ targetType, targetId, reason });
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#F5F0E8] p-5 shadow-xl">
        <h2 className="text-lg font-bold text-[#2D5A3D]">Signaler</h2>

        {done ? (
          <p className="mt-4 text-sm text-[#3D3229]/80">
            Merci — votre signalement sera examiné sous 48 h.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-[#3D3229]/70">
              Pourquoi signalez-vous ce contenu ?
            </p>
            <div className="mt-3 space-y-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                  {r}
                </label>
              ))}
            </div>
            {error && (
              <p className="mt-3 text-sm text-[#D9534F]">{error}</p>
            )}
          </>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-[#3D3229]/70"
          >
            {done ? "Fermer" : "Annuler"}
          </button>
          {!done && (
            <button
              type="button"
              disabled={reportContent.isPending}
              onClick={() => void submit()}
              className="rounded-xl bg-[#4A7C59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Envoyer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
