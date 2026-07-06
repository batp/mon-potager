"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { buildTasksForCrop } from "@/lib/tasks/generateTasks";
import type { Crop } from "@/types/garden";
import type { NewTask, Task } from "@/types/task";

function monthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchTasks(userId: string, range: { start: string; end: string }) {
  const supabase = createClient()!;
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .gte("due_date", range.start)
    .lte("due_date", range.end)
    .order("due_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Task[];
}

async function fetchPendingCount(userId: string) {
  const supabase = createClient()!;
  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("completed_at", null)
    .lte("due_date", todayIso());

  if (error) throw error;
  return count ?? 0;
}

export function usePendingTaskCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tasks", "pending-count", user?.id],
    queryFn: () => fetchPendingCount(user!.id),
    enabled: !!user,
    refetchInterval: 60_000,
  });
}

export function useTasks(viewMonth: Date) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const range = monthRange(viewMonth);
  const queryKey = ["tasks", user?.id, range.start, range.end];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTasks(user!.id, range),
    enabled: !!user,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["tasks", "pending-count", user?.id] });
  };

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const supabase = createClient()!;
      const { error } = await supabase
        .from("tasks")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const uncompleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const supabase = createClient()!;
      const { error } = await supabase
        .from("tasks")
        .update({ completed_at: null })
        .eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const addTask = useMutation({
    mutationFn: async (task: NewTask) => {
      const supabase = createClient()!;
      const { error } = await supabase.from("tasks").insert({
        ...task,
        user_id: user!.id,
        description: task.description ?? null,
        crop_id: task.crop_id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const supabase = createClient()!;
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: invalidateAll,
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    completeTask,
    uncompleteTask,
    addTask,
    deleteTask,
  };
}

export async function syncTasksForCrop(
  userId: string,
  crop: Crop,
  cropName: string,
) {
  const supabase = createClient()!;
  const catalogRow = crop.catalog_id
    ? await supabase
        .from("crop_catalog")
        .select("days_to_harvest")
        .eq("id", crop.catalog_id)
        .maybeSingle()
    : { data: null };

  const daysToHarvest = catalogRow.data?.days_to_harvest ?? null;

  await supabase
    .from("tasks")
    .delete()
    .eq("crop_id", crop.id)
    .is("completed_at", null);

  const planned = buildTasksForCrop({
    cropId: crop.id,
    cropName,
    sowDate: crop.sow_date,
    plantDate: crop.plant_date,
    daysToHarvest,
  });

  if (planned.length === 0) return;

  const { error } = await supabase.from("tasks").insert(
    planned.map((t) => ({
      ...t,
      user_id: userId,
      description: null,
    })),
  );

  if (error) throw error;
}
