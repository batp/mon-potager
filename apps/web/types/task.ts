export type TaskType =
  | "sowing"
  | "planting"
  | "watering"
  | "mulching"
  | "soil_work"
  | "harvesting"
  | "custom";

export interface Task {
  id: string;
  user_id: string;
  crop_id: string | null;
  type: TaskType;
  title: string;
  description: string | null;
  due_date: string;
  completed_at: string | null;
  is_recurring: boolean;
  created_at: string;
}

export interface NewTask {
  type: TaskType;
  title: string;
  due_date: string;
  description?: string;
  crop_id?: string | null;
}
