"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { PlaceholderImage } from "@/components/placeholders/PlaceholderImage";
import { createClient } from "@/lib/supabase/client";
import { CROP_CATALOG } from "@/constants/crops";
import { getCropDisplay } from "@/hooks/useGarden";
import type { Crop, Zone } from "@/types/garden";

async function fetchCropDetail(cropId: string) {
  const supabase = createClient()!;
  const { data: crop, error } = await supabase
    .from("crops")
    .select("*")
    .eq("id", cropId)
    .single();

  if (error) throw error;

  const { data: zone } = await supabase
    .from("zones")
    .select("*")
    .eq("id", crop.zone_id)
    .single();

  return { crop: crop as Crop, zone: zone as Zone };
}

export default function CultureDetailPage() {
  const params = useParams();
  const cropId = params.cropId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["crop", cropId],
    queryFn: () => fetchCropDetail(cropId),
  });

  if (isLoading) {
    return <p className="text-sm text-[#3D3229]/60">Chargement…</p>;
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[#D9534F]">Culture introuvable.</p>
        <Link href="/potager" className="text-sm text-[#4A7C59] underline">
          ← Retour au potager
        </Link>
      </div>
    );
  }

  const { crop, zone } = data;
  const catalog = CROP_CATALOG.find((c) => c.id === crop.catalog_id);
  const display = getCropDisplay({ ...zone, crop });

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

      <div className="space-y-3 rounded-2xl bg-white/80 p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-[#2D5A3D]">
          {display?.name ?? crop.custom_name}
        </h1>
        <dl className="space-y-2 text-sm">
          <Row label="Zone" value={zone.name} />
          <Row label="Surface" value={`${zone.width}×${zone.height} unités`} />
          <Row label="Variété" value={crop.variety ?? "—"} />
          <Row label="Semis" value={crop.sow_date ?? "—"} />
          <Row label="Plantation" value={crop.plant_date ?? "—"} />
          <Row label="Quantité" value={crop.quantity?.toString() ?? "—"} />
        </dl>
        {crop.notes && (
          <div className="border-t border-[#E8DFD0] pt-3">
            <p className="text-xs font-medium text-[#3D3229]/60">Notes</p>
            <p className="text-sm">{crop.notes}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-[#3D3229]/50">
        Édition complète (variété, dates, notes) — prochaine itération
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#3D3229]/60">{label}</dt>
      <dd className="font-medium text-[#3D3229]">{value}</dd>
    </div>
  );
}
