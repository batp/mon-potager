"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TASK_TYPE_META, TASK_TYPE_OPTIONS } from "@/constants/tasks";
import { cn } from "@/lib/utils";
import type { NewTask, Task, TaskType } from "@/types/task";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function parseIso(iso: string) {
  return new Date(`${iso}T12:00:00`);
}

export function CalendarView() {
  const today = isoDate(new Date());
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showAdd, setShowAdd] = useState(false);

  const { tasks, isLoading, completeTask, uncompleteTask, addTask } =
    useTasks(viewMonth);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.due_date) ?? [];
      list.push(task);
      map.set(task.due_date, list);
    }
    return map;
  }, [tasks]);

  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const pendingToday = (tasksByDate.get(today) ?? []).filter(
    (t) => !t.completed_at,
  ).length;

  const grid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const shiftMonth = (delta: number) => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5A3D]">Calendrier</h1>
          <p className="text-sm text-[#3D3229]/70">
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            {pendingToday > 0 && (
              <span className="ml-2 rounded-full bg-[#E8A838] px-2 py-0.5 text-xs font-semibold text-[#3D3229]">
                {pendingToday} aujourd&apos;hui
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1 rounded-xl bg-[#4A7C59] px-3 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tâche
        </button>
      </header>

      {showAdd && (
        <AddTaskForm
          defaultDate={selectedDate}
          saving={addTask.isPending}
          onCancel={() => setShowAdd(false)}
          onSubmit={async (task) => {
            await addTask.mutateAsync(task);
            setShowAdd(false);
          }}
        />
      )}

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg border border-[#E8DFD0] p-2 hover:bg-[#F5F0E8]"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setViewMonth(now);
              setSelectedDate(isoDate(now));
            }}
            className="text-sm font-medium text-[#4A7C59] underline"
          >
            Aujourd&apos;hui
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg border border-[#E8DFD0] p-2 hover:bg-[#F5F0E8]"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#3D3229]/60">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {grid.map((cell) => {
            const dayTasks = tasksByDate.get(cell.iso) ?? [];
            const pending = dayTasks.filter((t) => !t.completed_at).length;
            const isSelected = cell.iso === selectedDate;
            const isToday = cell.iso === today;

            return (
              <button
                key={cell.iso}
                type="button"
                disabled={!cell.inMonth}
                onClick={() => cell.inMonth && setSelectedDate(cell.iso)}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors",
                  !cell.inMonth && "opacity-30",
                  isSelected
                    ? "bg-[#4A7C59] font-semibold text-white"
                    : isToday
                      ? "bg-[#7BAE7F]/25 font-semibold text-[#2D5A3D]"
                      : "hover:bg-[#F5F0E8]",
                )}
              >
                {cell.day}
                {pending > 0 && (
                  <span
                    className={cn(
                      "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                      isSelected ? "bg-white" : "bg-[#E8A838]",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-[#2D5A3D]">
          {selectedDate === today
            ? "Aujourd'hui"
            : parseIso(selectedDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
        </p>

        {isLoading ? (
          <p className="text-sm text-[#3D3229]/60">Chargement…</p>
        ) : selectedTasks.length === 0 ? (
          <p className="text-sm text-[#3D3229]/60">
            Aucune tâche pour ce jour.
          </p>
        ) : (
          <ul className="space-y-2">
            {selectedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                busy={completeTask.isPending || uncompleteTask.isPending}
                onToggle={() => {
                  if (task.completed_at) {
                    uncompleteTask.mutate(task.id);
                  } else {
                    completeTask.mutate(task.id);
                  }
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  busy,
  onToggle,
}: {
  task: Task;
  busy: boolean;
  onToggle: () => void;
}) {
  const meta = TASK_TYPE_META[task.type];
  const done = !!task.completed_at;

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl border border-[#E8DFD0] px-3 py-2",
        done && "opacity-60",
      )}
    >
      <span aria-hidden>{meta.emoji}</span>
      <span
        className={cn(
          "flex-1 text-sm",
          done && "text-[#3D3229]/50 line-through",
        )}
      >
        {task.title}
      </span>
      <input
        type="checkbox"
        checked={done}
        disabled={busy}
        onChange={onToggle}
        aria-label={`Marquer ${task.title} comme fait`}
        className="h-4 w-4 accent-[#4A7C59]"
      />
    </li>
  );
}

function AddTaskForm({
  defaultDate,
  saving,
  onCancel,
  onSubmit,
}: {
  defaultDate: string;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (task: NewTask) => Promise<void>;
}) {
  const [type, setType] = useState<TaskType>("custom");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(defaultDate);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Indiquez un titre");
      return;
    }
    setError(null);
    await onSubmit({ type, title: title.trim(), due_date: dueDate });
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-3 rounded-2xl border border-[#7BAE7F]/40 bg-white/90 p-4"
    >
      <p className="text-sm font-semibold text-[#2D5A3D]">Nouvelle tâche</p>

      <label className="block text-xs font-medium text-[#3D3229]/70">
        Type
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TaskType)}
          className="mt-1 w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
        >
          {TASK_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.emoji} {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-medium text-[#3D3229]/70">
        Titre
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex. Arrosage du balcon"
          className="mt-1 w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-xs font-medium text-[#3D3229]/70">
        Date
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
        />
      </label>

      {error && <p className="text-sm text-[#D9534F]">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#4A7C59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "…" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#E8DFD0] px-4 py-2 text-sm"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function buildMonthGrid(viewMonth: Date) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: { iso: string; day: number; inMonth: boolean }[] = [];

  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1);
    cells.push({ iso: isoDate(d), day: d.getDate(), inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    cells.push({ iso: isoDate(d), day, inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    const d = parseIso(last.iso);
    d.setDate(d.getDate() + 1);
    cells.push({ iso: isoDate(d), day: d.getDate(), inMonth: false });
  }

  return cells;
}
