"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Rnd } from "react-rnd";
import { Plus, Trash2, Move, MousePointer2, Maximize2 } from "lucide-react";
import { useGarden, getCropDisplay } from "@/hooks/useGarden";
import { CROP_CATALOG } from "@/constants/crops";
import { cn } from "@/lib/utils";
import type { Garden, GardenTool, ZoneWithCrop } from "@/types/garden";

const CELL = 44;

function zonesCollide(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function canPlaceZone(
  zone: ZoneWithCrop,
  x: number,
  y: number,
  width: number,
  height: number,
  zones: ZoneWithCrop[],
  garden: Garden,
) {
  if (x < 0 || y < 0 || width < 1 || height < 1) return false;
  if (x + width > garden.grid_width) return false;
  if (y + height > garden.grid_height) return false;

  const candidate = { x, y, width, height };
  return !zones.some(
    (z) => z.id !== zone.id && zonesCollide(candidate, z),
  );
}

export function GardenBuilder() {
  const {
    garden,
    zones,
    isLoading,
    error,
    addZone,
    updateZone,
    deleteZone,
    assignCrop,
  } = useGarden();

  const [tool, setTool] = useState<GardenTool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const selected = zones.find((z) => z.id === selectedId) ?? null;

  const applyGeometry = useCallback(
    async (
      zone: ZoneWithCrop,
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      if (!garden) return false;

      const nx = Math.round(x);
      const ny = Math.round(y);
      const nw = Math.round(width);
      const nh = Math.round(height);

      if (
        nx === zone.x &&
        ny === zone.y &&
        nw === zone.width &&
        nh === zone.height
      ) {
        return true;
      }

      if (!canPlaceZone(zone, nx, ny, nw, nh, zones, garden)) {
        setHint("Impossible ici (bord ou chevauchement)");
        return false;
      }

      try {
        await updateZone.mutateAsync({
          zoneId: zone.id,
          updates: { x: nx, y: ny, width: nw, height: nh },
        });
        setHint(null);
        return true;
      } catch (e) {
        setHint((e as Error).message);
        return false;
      }
    },
    [garden, zones, updateZone],
  );

  const placeZone = useCallback(
    async (zone: ZoneWithCrop, x: number, y: number) =>
      applyGeometry(zone, x, y, zone.width, zone.height),
    [applyGeometry],
  );

  const resizeZone = useCallback(
    async (zone: ZoneWithCrop, width: number, height: number) =>
      applyGeometry(zone, zone.x, zone.y, width, height),
    [applyGeometry],
  );

  if (isLoading) {
    return <p className="text-sm text-[#3D3229]/60">Chargement du potager…</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#D9534F]/30 bg-[#D9534F]/10 p-4 text-sm">
        Erreur : {(error as Error).message}
      </div>
    );
  }

  if (!garden) return null;

  const handleAddZone = async () => {
    try {
      const created = await addZone.mutateAsync();
      setSelectedId(created.id);
      setTool("select");
      setHint(null);
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !confirm("Supprimer cette zone et sa culture ?")) return;
    await deleteZone.mutateAsync(selectedId);
    setSelectedId(null);
  };

  const selectZoneForTool = (nextTool: GardenTool) => {
    if (!selectedId && zones.length > 0) {
      setSelectedId(zones[zones.length - 1].id);
    }
    setTool(nextTool);
  };

  const gridW = garden.grid_width * CELL;
  const gridH = garden.grid_height * CELL;
  const isMoveMode = tool === "move";
  const isResizeMode = tool === "resize";

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-[#2D5A3D]">{garden.name}</h1>
        <p className="text-sm text-[#3D3229]/70">
          {garden.grid_width}×{garden.grid_height} unités · {zones.length} zone
          {zones.length > 1 ? "s" : ""}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <ToolButton
          active={tool === "select"}
          onClick={() => setTool("select")}
          icon={MousePointer2}
          label="Sélectionner"
        />
        <ToolButton
          active={false}
          onClick={handleAddZone}
          icon={Plus}
          label="Ajouter"
          loading={addZone.isPending}
        />
        <ToolButton
          active={isMoveMode}
          onClick={() => selectZoneForTool("move")}
          icon={Move}
          label="Déplacer"
        />
        <ToolButton
          active={isResizeMode}
          onClick={() => selectZoneForTool("resize")}
          icon={Maximize2}
          label="Redimensionner"
        />
        <ToolButton
          active={false}
          onClick={handleDelete}
          icon={Trash2}
          label="Supprimer"
          disabled={!selectedId}
          variant="danger"
        />
      </div>

      {isMoveMode && (
        <p className="rounded-xl bg-[#7BAE7F]/15 px-3 py-2 text-sm text-[#2D5A3D]">
          Mode déplacer : glissez une zone sur la grille, ou utilisez les flèches
          ci-dessous.
        </p>
      )}

      {isResizeMode && (
        <p className="rounded-xl bg-[#7BAE7F]/15 px-3 py-2 text-sm text-[#2D5A3D]">
          Mode redimensionner : tirez la poignée en bas à droite, ou utilisez les
          boutons +/− ci-dessous.
        </p>
      )}

      {hint && (
        <p className="rounded-xl bg-[#E8A838]/20 px-3 py-2 text-sm text-[#3D3229]">
          {hint}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[#E8DFD0] bg-white/80 p-4 shadow-sm">
        <div
          className="relative mx-auto rounded-xl border-2 border-[#D4A574]/40 bg-[#F5F0E8]"
          style={{ width: gridW, height: gridH, minWidth: gridW }}
        >
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${garden.grid_width}, ${CELL}px)`,
              gridTemplateRows: `repeat(${garden.grid_height}, ${CELL}px)`,
            }}
          >
            {Array.from({ length: garden.grid_width * garden.grid_height }).map(
              (_, i) => (
                <div
                  key={i}
                  className="border border-[#E8DFD0]/60"
                  style={{ width: CELL, height: CELL }}
                />
              ),
            )}
          </div>

          {zones.map((zone) => (
            <ZoneBlock
              key={zone.id}
              zone={zone}
              garden={garden}
              cell={CELL}
              isSelected={zone.id === selectedId}
              isMoveMode={isMoveMode}
              isResizeMode={isResizeMode && zone.id === selectedId}
              onSelect={() => setSelectedId(zone.id)}
              onMoveEnd={(x, y) => placeZone(zone, x, y)}
              onResizeEnd={(x, y, w, h) =>
                applyGeometry(zone, x, y, w, h)
              }
            />
          ))}
        </div>
      </div>

      {selected && (
        <ZoneEditor
          zone={selected}
          garden={garden}
          onMove={(dx, dy) =>
            placeZone(selected, selected.x + dx, selected.y + dy)
          }
          onResize={(width, height) =>
            resizeZone(selected, width, height)
          }
          onRename={(name) =>
            updateZone.mutate({ zoneId: selected.id, updates: { name } })
          }
          onAssignCrop={(catalogId, nameFr) =>
            assignCrop.mutate({ zoneId: selected.id, catalogId, nameFr })
          }
          busy={updateZone.isPending}
        />
      )}

      {selected?.crop && (
        <Link
          href={`/potager/culture/${selected.crop.id}`}
          className="inline-flex text-sm font-medium text-[#4A7C59] underline"
        >
          Voir la fiche culture →
        </Link>
      )}
    </div>
  );
}

function ZoneBlock({
  zone,
  garden,
  cell,
  isSelected,
  isMoveMode,
  isResizeMode,
  onSelect,
  onMoveEnd,
  onResizeEnd,
}: {
  zone: ZoneWithCrop;
  garden: Garden;
  cell: number;
  isSelected: boolean;
  isMoveMode: boolean;
  isResizeMode: boolean;
  onSelect: () => void;
  onMoveEnd: (x: number, y: number) => Promise<boolean>;
  onResizeEnd: (x: number, y: number, w: number, h: number) => Promise<boolean>;
}) {
  const crop = getCropDisplay(zone);
  const [reset, setReset] = useState(0);
  const maxW = (garden.grid_width - zone.x) * cell;
  const maxH = (garden.grid_height - zone.y) * cell;

  const snapBack = () => setReset((n) => n + 1);

  return (
    <Rnd
      key={`${zone.id}-${reset}-${zone.x}-${zone.y}-${zone.width}-${zone.height}`}
      position={{ x: zone.x * cell, y: zone.y * cell }}
      size={{ width: zone.width * cell, height: zone.height * cell }}
      bounds="parent"
      dragGrid={[cell, cell]}
      resizeGrid={[cell, cell]}
      minWidth={cell}
      minHeight={cell}
      maxWidth={maxW}
      maxHeight={maxH}
      disableDragging={!isMoveMode}
      enableResizing={
        isResizeMode
          ? {
              top: false,
              right: false,
              bottom: false,
              left: false,
              topRight: false,
              bottomLeft: false,
              topLeft: false,
              bottomRight: true,
            }
          : false
      }
      onDragStart={onSelect}
      onResizeStart={onSelect}
      onDragStop={(_e, data) => {
        void onMoveEnd(
          Math.round(data.x / cell),
          Math.round(data.y / cell),
        ).then((ok) => {
          if (!ok) snapBack();
        });
      }}
      onResizeStop={(_e, _dir, ref, _delta, position) => {
        void onResizeEnd(
          Math.round(position.x / cell),
          Math.round(position.y / cell),
          Math.round(ref.offsetWidth / cell),
          Math.round(ref.offsetHeight / cell),
        ).then((ok) => {
          if (!ok) snapBack();
        });
      }}
      style={{ zIndex: isSelected ? 10 : 1 }}
      className={cn(
        isMoveMode && "cursor-grab active:cursor-grabbing",
        isResizeMode && isSelected && "cursor-se-resize",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-lg border-2 p-1 text-center select-none",
          isSelected
            ? "border-[#2D5A3D] shadow-md ring-2 ring-[#4A7C59]/40"
            : "border-white/80 hover:shadow",
        )}
        style={{ backgroundColor: zone.color }}
      >
        {crop && (
          <span className="pointer-events-none text-lg leading-none" aria-hidden>
            {crop.emoji}
          </span>
        )}
        <span className="pointer-events-none line-clamp-2 text-[10px] font-semibold leading-tight text-[#3D3229]">
          {crop?.name ?? zone.name}
        </span>
      </div>
    </Rnd>
  );
}

function ToolButton({
  active,
  onClick,
  icon: Icon,
  label,
  loading,
  disabled,
  variant = "default",
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40",
        variant === "danger"
          ? "border border-[#D9534F]/40 text-[#D9534F] hover:bg-[#D9534F]/10"
          : active
            ? "bg-[#4A7C59] text-white"
            : "border border-[#E8DFD0] bg-white text-[#3D3229] hover:bg-[#E8DFD0]/50",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {loading ? "…" : label}
    </button>
  );
}

function ZoneEditor({
  zone,
  garden,
  onMove,
  onResize,
  onRename,
  onAssignCrop,
  busy,
}: {
  zone: ZoneWithCrop;
  garden: Garden;
  onMove: (dx: number, dy: number) => void;
  onResize: (width: number, height: number) => void;
  onRename: (name: string) => void;
  onAssignCrop: (catalogId: number, nameFr: string) => void;
  busy?: boolean;
}) {
  const crop = getCropDisplay(zone);
  const maxWidth = garden.grid_width - zone.x;
  const maxHeight = garden.grid_height - zone.y;

  const changeWidth = (delta: number) => {
    const next = Math.min(maxWidth, Math.max(1, zone.width + delta));
    onResize(next, zone.height);
  };

  const changeHeight = (delta: number) => {
    const next = Math.min(maxHeight, Math.max(1, zone.height + delta));
    onResize(zone.width, next);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#7BAE7F]/40 bg-white/90 p-4">
      <p className="text-sm font-semibold text-[#2D5A3D]">
        Zone · {zone.width}×{zone.height} unités · position ({zone.x}, {zone.y})
      </p>

      <div>
        <p className="mb-2 text-xs font-medium text-[#3D3229]/70">Déplacer</p>
        <div className="inline-grid grid-cols-3 gap-1">
          <div />
          <MoveArrow label="↑" disabled={busy} onClick={() => onMove(0, -1)} />
          <div />
          <MoveArrow label="←" disabled={busy} onClick={() => onMove(-1, 0)} />
          <div className="flex h-10 w-10 items-center justify-center text-xs text-[#3D3229]/40">
            {busy ? "…" : "·"}
          </div>
          <MoveArrow label="→" disabled={busy} onClick={() => onMove(1, 0)} />
          <div />
          <MoveArrow label="↓" disabled={busy} onClick={() => onMove(0, 1)} />
          <div />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-[#3D3229]/70">
          Redimensionner
        </p>
        <div className="flex flex-wrap gap-4">
          <SizeStepper
            label="Largeur"
            value={zone.width}
            min={1}
            max={maxWidth}
            disabled={busy}
            onDecrease={() => changeWidth(-1)}
            onIncrease={() => changeWidth(1)}
          />
          <SizeStepper
            label="Hauteur"
            value={zone.height}
            min={1}
            max={maxHeight}
            disabled={busy}
            onDecrease={() => changeHeight(-1)}
            onIncrease={() => changeHeight(1)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-[#3D3229]/70">
          Nom de la zone
        </label>
        <input
          type="text"
          defaultValue={zone.name}
          onBlur={(e) => onRename(e.target.value)}
          className="w-full rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-[#3D3229]/70">
          Culture
        </label>
        <div className="grid max-h-40 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {CROP_CATALOG.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAssignCrop(item.id, item.nameFr)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-2 text-xs transition-colors",
                zone.crop?.catalog_id === item.id
                  ? "border-[#4A7C59] bg-[#7BAE7F]/20"
                  : "border-[#E8DFD0] hover:bg-[#F5F0E8]",
              )}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="line-clamp-2 text-center leading-tight">
                {item.nameFr}
              </span>
            </button>
          ))}
        </div>
        {crop && (
          <p className="mt-2 text-xs text-[#3D3229]/60">
            Actuel : {crop.emoji} {crop.name}
          </p>
        )}
      </div>
    </div>
  );
}

function SizeStepper({
  label,
  value,
  min,
  max,
  disabled,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-xs font-medium text-[#3D3229]/70">{label}</span>
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={onDecrease}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8DFD0] bg-[#F5F0E8] text-lg font-bold hover:bg-[#E8DFD0] disabled:opacity-40"
        aria-label={`Réduire ${label.toLowerCase()}`}
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold text-[#2D5A3D]">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={onIncrease}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8DFD0] bg-[#F5F0E8] text-lg font-bold hover:bg-[#E8DFD0] disabled:opacity-40"
        aria-label={`Augmenter ${label.toLowerCase()}`}
      >
        +
      </button>
    </div>
  );
}

function MoveArrow({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8DFD0] bg-[#F5F0E8] text-lg font-bold hover:bg-[#E8DFD0] disabled:opacity-40"
    >
      {label}
    </button>
  );
}
