"use client";

import { useParams } from "next/navigation";
import { CropDetailForm } from "@/components/garden/CropDetailForm";

export default function CultureDetailPage() {
  const params = useParams();
  const cropId = params.cropId as string;

  return <CropDetailForm cropId={cropId} />;
}
