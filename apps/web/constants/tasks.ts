import type { TaskType } from "@/types/task";

export const TASK_TYPE_META: Record<
  TaskType,
  { label: string; emoji: string }
> = {
  sowing: { label: "Semis", emoji: "🌱" },
  planting: { label: "Plantation", emoji: "🪴" },
  watering: { label: "Arrosage", emoji: "💧" },
  mulching: { label: "Paillage", emoji: "🌿" },
  soil_work: { label: "Travail du sol", emoji: "🔧" },
  harvesting: { label: "Récolte", emoji: "🧺" },
  custom: { label: "Personnalisé", emoji: "📌" },
};

export const TASK_TYPE_OPTIONS = (
  Object.entries(TASK_TYPE_META) as [TaskType, { label: string; emoji: string }][]
).map(([value, meta]) => ({ value, ...meta }));
