# Mon Potager

> Cultiver, partager, s'entraider

MVP **PWA** (Next.js 15 + Serwist + Supabase) — projet **batp**.

**Dépôt :** [github.com/batp/mon-potager](https://github.com/batp/mon-potager)

## Démarrage rapide

```bash
# Terminal WSL
cd /home/batp/projects/mon-potager

# ⚠️ Next.js lit les variables dans apps/web/ (pas à la racine seule)
cp .env.example apps/web/.env.local
# ou si vous avez déjà .env à la racine :
# cp .env apps/web/.env.local

# Éditer apps/web/.env.local avec vos clés Supabase
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure

```
mon-potager/
├── doc/                 # Spécifications produit & technique
├── apps/web/            # PWA Next.js
├── packages/shared/     # (à venir) types partagés
└── supabase/migrations/ # Schéma PostgreSQL
```

## Documentation

Voir [doc/README.md](./doc/README.md)

## Sprint 1 — livré

- [x] Monorepo npm workspaces + GitHub
- [x] PWA Next.js 15 + Serwist
- [x] Auth comptes test Supabase + routes protégées
- [x] Navigation 5 sections responsive

## Sprint 2 — en cours

- [x] Builder potager (grille, zones, cultures)
- [x] Sync Supabase (gardens, zones, crops)
- [x] Fiche culture (lecture)
- [ ] Édition culture (variété, dates, notes)
- [ ] Redimensionnement zones

## Tester la PWA sur mobile

1. `npm run build && npm run start` (HTTPS requis en prod ; Vercel OK)
2. En dev : Chrome DevTools → mode mobile
3. En prod : « Ajouter à l'écran d'accueil » (Android) ou Partager → Sur l'écran d'accueil (iOS Safari)
