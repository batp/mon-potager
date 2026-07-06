"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholders/PlaceholderImage";
import { CROP_CATALOG } from "@/constants/crops";
import { getCropDisplay } from "@/hooks/useGarden";
import { useCrop } from "@/hooks/useCrop";
import { cn } from "@/lib/utils";
import type { Crop, Zone } from "@/types/garden";

const VARIETY_HINTS: Record<string, string[]> = {
  tomate: ["Cœur de bœuf", "Cerise", "Roma", "Green Zebra"],
  carotte: ["Nantaise", "Touchon", "De Colmar"],
  courgette: ["Verte non coureuse", "Ronde de Nice", "Grise de Albanie"],
  salade: ["Batavia", "Feuille de chêne", "Romaine"],
  fraise: ["Gariguette", "Mara des bois", "Charlotte"],
};

interface CropDetailFormProps {
  cropId: string;
}

export function CropDetailForm({ cropId }: CropDetailFormProps) {
  const router = useRouter();
  const { crop, zone, isLoading, error, updateCrop, deleteCrop } =
    useCrop(cropId);

  if (isLoading) {
    return <p className="text-sm text-[#3D3229]/60">Chargement…</p>;
  }

  if (error || !crop || !zone) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[#D9534F]">Culture introuvable.</p>
        <Link href="/potager" className="text-sm text-[#4A7C59] underline">
          ← Retour au potager
        </Link>
      </div>
    );
  }

  return (
    <CropEditor
      crop={crop}
      zone={zone}
      saving={updateCrop.isPending}
      deleting={deleteCrop.isPending}
      saveError={updateCrop.error as Error | null}
      onSave={(updates) => updateCrop.mutateAsync(updates)}
      onDelete={async () => {
        if (!confirm("Retirer cette culture de la zone ?")) return;
        await deleteCrop.mutateAsync();
      }}
      onSaved={() => router.refresh()}
    />
  );
}

function CropEditor({
  crop,
  zone,
  saving,
  deleting,
  saveError,
  onSave,
  onDelete,
  onSaved,
}: {
  crop: Crop;
  zone: Zone;
  saving: boolean;
  deleting: boolean;
  saveError: Error | null;
  onSave: (updates: {
    variety: string | null;
    sow_date: string | null;
    plant_date: string | null;
    quantity: number | null;
    notes: string | null;
  }) => Promise<unknown>;
  onDelete: () => Promise<void>;
  onSaved: () => void;
}) {
  const catalog = CROP_CATALOG.find((c) => c.id === crop.catalog_id);
  const display = getCropDisplay({ ...zone, crop });
  const varietyHints =
    (catalog && VARIETY_HINTS[catalog.slug]) ?? [];

  const [variety, setVariety] = useState(crop.variety ?? "");
  const [sowDate, setSowDate] = useState(crop.sow_date ?? "");
  const [plantDate, setPlantDate] = useState(crop.plant_date ?? "");
  const [quantity, setQuantity] = useState(
    crop.quantity != null ? String(crop.quantity) : "",
  );
  const [notes, setNotes] = useState(crop.notes ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setFeedback(null);

    const parsedQty = quantity.trim() === "" ? null : Number(quantity);
    if (parsedQty != null && (!Number.isFinite(parsedQty) || parsedQty < 1)) {
      setLocalError("La quantité doit être un nombre entier ≥ 1");
      return;
    }

    try {
      await onSave({
        variety: variety.trim() || null,
        sow_date: sowDate || null,
        plant_date: plantDate || null,
        quantity: parsedQty,
        notes: notes.trim() || null,
      });
      setFeedback("Enregistré");
      onSaved();
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  const errorMessage = localError ?? saveError?.message;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/potager" className="text-sm text-[#4A7C59] underline">
        ← Mon potager
      </Link>

      <PlaceholderImage
        type="crop"
        name={display?.name ?? "Culture"}
        emoji={display?.emoji ?? catalog?.emoji ?? "🌱"}
        size="lg"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1 rounded-2xl bg-white/80 p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-[#2D5A3D]">
            {display?.name ?? crop.custom_name}
          </h1>
          <p className="text-sm text-[#3D3229]/60">
            Zone {zone.name} · {zone.width}×{zone.height} unités
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-[#7BAE7F]/40 bg-white/90 p-4">
          <Field label="Variété">
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="Ex. Cœur de bœuf"
              className="w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
            />
            {varietyHints.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {varietyHints.map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => setVariety(hint)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                      variety === hint
                        ? "border-[#4A7C59] bg-[#7BAE7F]/25 text-[#2D5A3D]"
                        : "border-[#E8DFD0] bg-[#F5F0E8] text-[#3D3229] hover:bg-[#E8DFD0]/60",
                    )}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date de semis">
              <input
                type="date"
                value={sowDate}
                onChange={(e) => setSowDate(e.target.value)}
                className="w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Date de plantation">
              <input
                type="date"
                value={plantDate}
                min={sowDate || undefined}
                onChange={(e) => setPlantDate(e.target.value)}
                className="w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label="Quantité (plants)">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex. 6"
              className="w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Observations, arrosage, exposition…"
              className="w-full resize-y rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
            />
            <p className="mt-1 text-right text-xs text-[#3D3229]/50">
              {notes.length}/2000
            </p>
          </Field>
        </div>

        {errorMessage && (
          <p className="rounded-xl bg-[#D9534F]/10 px-3 py-2 text-sm text-[#D9534F]">
            {errorMessage}
          </p>
        )}

        {feedback && (
          <p className="rounded-xl bg-[#7BAE7F]/20 px-3 py-2 text-sm text-[#2D5A3D]">
            {feedback}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving || deleting}
            className="rounded-xl bg-[#4A7C59] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            disabled={saving || deleting}
            onClick={() => void onDelete()}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-[#D9534F]/40 px-4 py-2.5 text-sm font-medium text-[#D9534F]",
              "hover:bg-[#D9534F]/10 disabled:opacity-50",
            )}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            {deleting ? "Suppression…" : "Retirer la culture"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[#3D3229]/70">
        {label}
      </span>
      {children}
    </label>
  );
}
