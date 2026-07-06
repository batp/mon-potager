export type CropCategory = "legume" | "aromate" | "fruit" | "fleur";

export interface CropCatalogItem {
  id: number;
  slug: string;
  nameFr: string;
  category: CropCategory;
  emoji: string;
}

export const CROP_CATALOG: CropCatalogItem[] = [
  { id: 1, slug: "tomate", nameFr: "Tomate", category: "legume", emoji: "🍅" },
  { id: 2, slug: "courgette", nameFr: "Courgette", category: "legume", emoji: "🥒" },
  { id: 3, slug: "carotte", nameFr: "Carotte", category: "legume", emoji: "🥕" },
  { id: 4, slug: "salade", nameFr: "Salade", category: "legume", emoji: "🥬" },
  { id: 5, slug: "haricot", nameFr: "Haricot", category: "legume", emoji: "🫘" },
  { id: 6, slug: "poivron", nameFr: "Poivron", category: "legume", emoji: "🫑" },
  { id: 7, slug: "aubergine", nameFr: "Aubergine", category: "legume", emoji: "🍆" },
  { id: 8, slug: "epinard", nameFr: "Épinard", category: "legume", emoji: "🥬" },
  { id: 9, slug: "radis", nameFr: "Radis", category: "legume", emoji: "🔴" },
  { id: 10, slug: "navet", nameFr: "Navet", category: "legume", emoji: "🟣" },
  { id: 11, slug: "betterave", nameFr: "Betterave", category: "legume", emoji: "🟣" },
  { id: 12, slug: "poireau", nameFr: "Poireau", category: "legume", emoji: "🧅" },
  { id: 13, slug: "oignon", nameFr: "Oignon", category: "legume", emoji: "🧅" },
  { id: 14, slug: "ail", nameFr: "Ail", category: "legume", emoji: "🧄" },
  { id: 15, slug: "pomme-de-terre", nameFr: "Pomme de terre", category: "legume", emoji: "🥔" },
  { id: 16, slug: "concombre", nameFr: "Concombre", category: "legume", emoji: "🥒" },
  { id: 17, slug: "potiron", nameFr: "Potiron", category: "legume", emoji: "🎃" },
  { id: 18, slug: "chou", nameFr: "Chou", category: "legume", emoji: "🥬" },
  { id: 19, slug: "brocoli", nameFr: "Brocoli", category: "legume", emoji: "🥦" },
  { id: 20, slug: "fenouil", nameFr: "Fenouil", category: "legume", emoji: "🌿" },
  { id: 21, slug: "basilic", nameFr: "Basilic", category: "aromate", emoji: "🌿" },
  { id: 22, slug: "persil", nameFr: "Persil", category: "aromate", emoji: "🌿" },
  { id: 23, slug: "ciboulette", nameFr: "Ciboulette", category: "aromate", emoji: "🌿" },
  { id: 24, slug: "thym", nameFr: "Thym", category: "aromate", emoji: "🌿" },
  { id: 25, slug: "menthe", nameFr: "Menthe", category: "aromate", emoji: "🌿" },
  { id: 26, slug: "romarin", nameFr: "Romarin", category: "aromate", emoji: "🌿" },
  { id: 27, slug: "fraise", nameFr: "Fraise", category: "fruit", emoji: "🍓" },
  { id: 28, slug: "framboise", nameFr: "Framboise", category: "fruit", emoji: "🫐" },
  { id: 29, slug: "groseille", nameFr: "Groseille", category: "fruit", emoji: "🍒" },
  { id: 30, slug: "capucine", nameFr: "Capucine", category: "fleur", emoji: "🌼" },
];
