export function assertOnline() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error(
      "Connexion requise — vos données locales restent consultables hors ligne.",
    );
  }
}

export function isOnline() {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}
