"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { Crop, Zone } from "@/types/garden";

export interface CropUpdates {
  variety?: string | null;
  sow_date?: string | null;
  plant_date?: string | null;
  quantity?: number | null;
  notes?: string | null;
}

function normalizeCrop(crop: Crop): Crop {
  return {
    ...crop,
    quantity: crop.quantity != null ? Number(crop.quantity) : null,
  };
}

async function fetchCropDetail(cropId: string) {
  const supabase = createClient()!;
  const { data: crop, error } = await supabase
    .from("crops")
    .select("*")
    .eq("id", cropId)
    .eq("status", "active")
    .single();

  if (error) throw error;

  const { data: zone, error: zoneError } = await supabase
    .from("zones")
    .select("*")
    .eq("id", crop.zone_id)
    .single();

  if (zoneError) throw zoneError;

  return {
    crop: normalizeCrop(crop as Crop),
    zone: zone as Zone,
  };
}

export function validateCropUpdates(updates: CropUpdates): string | null {
  const { sow_date, plant_date, quantity, notes } = updates;

  if (quantity != null && quantity < 1) {
    return "La quantité doit être au moins 1";
  }

  if (notes && notes.length > 2000) {
    return "Les notes ne peuvent pas dépasser 2000 caractères";
  }

  if (sow_date && plant_date && plant_date < sow_date) {
    return "La date de plantation doit être après la date de semis";
  }

  return null;
}

export function useCrop(cropId: string) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryKey = ["crop", cropId];
  const gardenKey = ["garden", user?.id];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchCropDetail(cropId),
    enabled: !!cropId,
  });

  const invalidateRelated = () => {
    queryClient.invalidateQueries({ queryKey });
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: gardenKey });
    }
  };

  const updateCrop = useMutation({
    mutationFn: async (updates: CropUpdates) => {
      const validationError = validateCropUpdates(updates);
      if (validationError) throw new Error(validationError);

      const supabase = createClient()!;
      const payload = {
        ...updates,
        variety: updates.variety?.trim() || null,
        notes: updates.notes?.trim() || null,
        quantity: updates.quantity ?? null,
      };

      const { data, error } = await supabase
        .from("crops")
        .update(payload)
        .eq("id", cropId)
        .select()
        .single();

      if (error) throw error;
      return normalizeCrop(data as Crop);
    },
    onSuccess: (data) => {
      const previous = queryClient.getQueryData<{
        crop: Crop;
        zone: Zone;
      }>(queryKey);

      if (previous) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          crop: data,
        });
      }

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: gardenKey });
      }
    },
  });

  const deleteCrop = useMutation({
    mutationFn: async () => {
      const supabase = createClient()!;
      const { error } = await supabase
        .from("crops")
        .update({ status: "deleted" })
        .eq("id", cropId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateRelated();
      router.push("/potager");
    },
  });

  return {
    crop: query.data?.crop,
    zone: query.data?.zone,
    isLoading: query.isLoading,
    error: query.error,
    updateCrop,
    deleteCrop,
  };
}
