import type { NewTask } from "@/types/task";

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function buildTasksForCrop({
  cropId,
  cropName,
  sowDate,
  plantDate,
  daysToHarvest,
}: {
  cropId: string;
  cropName: string;
  sowDate: string | null;
  plantDate: string | null;
  daysToHarvest?: number | null;
}): NewTask[] {
  const tasks: NewTask[] = [];

  if (sowDate) {
    tasks.push({
      type: "sowing",
      title: `Semis — ${cropName}`,
      due_date: sowDate,
      crop_id: cropId,
    });
  }

  if (plantDate) {
    tasks.push({
      type: "planting",
      title: `Plantation — ${cropName}`,
      due_date: plantDate,
      crop_id: cropId,
    });

    if (daysToHarvest && daysToHarvest > 0) {
      tasks.push({
        type: "harvesting",
        title: `Récolte estimée — ${cropName}`,
        due_date: addDays(plantDate, daysToHarvest),
        crop_id: cropId,
      });
    }
  }

  return tasks;
}
