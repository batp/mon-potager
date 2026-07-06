export interface Garden {
  id: string;
  user_id: string;
  name: string;
  grid_width: number;
  grid_height: number;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  id: string;
  garden_id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  created_at: string;
}

export interface Crop {
  id: string;
  zone_id: string;
  catalog_id: number | null;
  custom_name: string | null;
  variety: string | null;
  sow_date: string | null;
  plant_date: string | null;
  quantity: number | null;
  notes: string | null;
  status: string;
}

export type GardenTool = "select" | "add" | "move" | "resize" | "delete";

export interface ZoneWithCrop extends Zone {
  crop?: Crop | null;
}
