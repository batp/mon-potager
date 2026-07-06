"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { assertOnline } from "@/lib/network";
import { ensureProfile } from "@/lib/supabase/ensureProfile";
import { CROP_CATALOG } from "@/constants/crops";
import type { Crop, Garden, Zone, ZoneWithCrop } from "@/types/garden";

const DEFAULT_GARDEN = {
  name: "Mon potager",
  grid_width: 10,
  grid_height: 8,
};

const ZONE_COLORS = ["#7BAE7F", "#D4A574", "#F2D06B", "#7BAE7F", "#E8A838"];

function normalizeZone(zone: Zone): Zone {
  return {
    ...zone,
    x: Number(zone.x),
    y: Number(zone.y),
    width: Number(zone.width),
    height: Number(zone.height),
  };
}

async function fetchGardenData(userId: string) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase non configuré");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.id !== userId) {
    throw new Error("Session utilisateur invalide");
  }

  await ensureProfile(supabase, user);

  let { data: gardens, error } = await supabase
    .from("gardens")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) throw error;

  let garden = gardens?.[0] as Garden | undefined;

  if (!garden) {
    const { data: created, error: createError } = await supabase
      .from("gardens")
      .insert({ ...DEFAULT_GARDEN, user_id: userId })
      .select()
      .single();

    if (createError) throw createError;
    garden = created as Garden;
  }

  const { data: zones, error: zonesError } = await supabase
    .from("zones")
    .select("*")
    .eq("garden_id", garden.id)
    .order("created_at", { ascending: true });

  if (zonesError) throw zonesError;

  const zoneIds = (zones ?? []).map((z) => z.id);
  let crops: Crop[] = [];

  if (zoneIds.length > 0) {
    const { data: cropsData, error: cropsError } = await supabase
      .from("crops")
      .select("*")
      .in("zone_id", zoneIds)
      .eq("status", "active");

    if (cropsError) throw cropsError;
    crops = (cropsData ?? []) as Crop[];
  }

  const zonesWithCrops: ZoneWithCrop[] = (zones ?? []).map((zone) => {
    const normalized = normalizeZone(zone as Zone);
    return {
      ...normalized,
      crop: crops.find((c) => c.zone_id === normalized.id) ?? null,
    };
  });

  return { garden: garden as Garden, zones: zonesWithCrops };
}

function findFreeSlot(
  zones: ZoneWithCrop[],
  gridWidth: number,
  gridHeight: number,
  w = 2,
  h = 2,
) {
  for (let y = 0; y <= gridHeight - h; y++) {
    for (let x = 0; x <= gridWidth - w; x++) {
      const collision = zones.some(
        (z) =>
          x < z.x + z.width &&
          x + w > z.x &&
          y < z.y + z.height &&
          y + h > z.y,
      );
      if (!collision) return { x, y };
    }
  }
  return null;
}

export function useGarden() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["garden", user?.id];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchGardenData(user!.id),
    enabled: !!user,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addZone = useMutation({
    mutationFn: async () => {
      assertOnline();
      const supabase = createClient()!;
      const garden = query.data!.garden;
      const zones = query.data!.zones;
      const slot = findFreeSlot(zones, garden.grid_width, garden.grid_height);
      if (!slot) throw new Error("Plus de place sur la grille");

      const color = ZONE_COLORS[zones.length % ZONE_COLORS.length];
      const { data, error } = await supabase
        .from("zones")
        .insert({
          garden_id: garden.id,
          name: `Zone ${zones.length + 1}`,
          x: slot.x,
          y: slot.y,
          width: 2,
          height: 2,
          color,
        })
        .select()
        .single();

      if (error) throw error;
      return normalizeZone(data as Zone);
    },
    onSuccess: (created) => {
      const previous = queryClient.getQueryData<{
        garden: Garden;
        zones: ZoneWithCrop[];
      }>(queryKey);

      if (previous) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          zones: [...previous.zones, { ...created, crop: null }],
        });
      }
    },
  });

  const updateZone = useMutation({
    mutationFn: async ({
      zoneId,
      updates,
    }: {
      zoneId: string;
      updates: Partial<Pick<Zone, "name" | "x" | "y" | "width" | "height" | "color">>;
    }) => {
      assertOnline();
      const supabase = createClient()!;
      const payload = { ...updates };
      if (payload.x !== undefined) payload.x = Number(payload.x);
      if (payload.y !== undefined) payload.y = Number(payload.y);
      if (payload.width !== undefined) payload.width = Number(payload.width);
      if (payload.height !== undefined) payload.height = Number(payload.height);

      const { data, error } = await supabase
        .from("zones")
        .update(payload)
        .eq("id", zoneId)
        .select()
        .single();
      if (error) throw error;
      return normalizeZone(data as Zone);
    },
    onMutate: async ({ zoneId, updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{
        garden: Garden;
        zones: ZoneWithCrop[];
      }>(queryKey);

      const normalizedUpdates = { ...updates };
      if (normalizedUpdates.x !== undefined) {
        normalizedUpdates.x = Number(normalizedUpdates.x);
      }
      if (normalizedUpdates.y !== undefined) {
        normalizedUpdates.y = Number(normalizedUpdates.y);
      }
      if (normalizedUpdates.width !== undefined) {
        normalizedUpdates.width = Number(normalizedUpdates.width);
      }
      if (normalizedUpdates.height !== undefined) {
        normalizedUpdates.height = Number(normalizedUpdates.height);
      }

      if (previous) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          zones: previous.zones.map((z) =>
            z.id === zoneId ? { ...z, ...normalizedUpdates } : z,
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (data) => {
      const previous = queryClient.getQueryData<{
        garden: Garden;
        zones: ZoneWithCrop[];
      }>(queryKey);
      if (previous) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          zones: previous.zones.map((z) =>
            z.id === data.id ? { ...z, ...data } : z,
          ),
        });
      }
    },
  });

  const deleteZone = useMutation({
    mutationFn: async (zoneId: string) => {
      assertOnline();
      const supabase = createClient()!;
      const { error } = await supabase.from("zones").delete().eq("id", zoneId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const assignCrop = useMutation({
    mutationFn: async ({
      zoneId,
      catalogId,
      nameFr,
    }: {
      zoneId: string;
      catalogId: number;
      nameFr: string;
    }) => {
      assertOnline();
      const supabase = createClient()!;
      const zone = query.data?.zones.find((z) => z.id === zoneId);
      const catalogItem = CROP_CATALOG.find((c) => c.id === catalogId);

      if (zone?.crop) {
        const { error } = await supabase
          .from("crops")
          .update({
            catalog_id: catalogId,
            custom_name: catalogItem?.nameFr ?? nameFr,
          })
          .eq("id", zone.crop.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("crops").insert({
          zone_id: zoneId,
          catalog_id: catalogId,
          custom_name: catalogItem?.nameFr ?? nameFr,
          quantity: 1,
          status: "active",
        });
        if (error) throw error;
      }
    },
    onSuccess: invalidate,
  });

  return {
    garden: query.data?.garden,
    zones: query.data?.zones ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addZone,
    updateZone,
    deleteZone,
    assignCrop,
    refetch: query.refetch,
  };
}

export function getCropDisplay(zone: ZoneWithCrop) {
  if (!zone.crop) return null;
  const fromCatalog = CROP_CATALOG.find((c) => c.id === zone.crop?.catalog_id);
  return {
    name: fromCatalog?.nameFr ?? zone.crop.custom_name ?? "Culture",
    emoji: fromCatalog?.emoji ?? "🌱",
  };
}
