# Mon Potager

> Cultiver, partager, s'entraider

MVP **PWA** (Next.js 15 + Serwist + Supabase) — projet **batp**.

**Dépôt :** [github.com/batp/mon-potager](https://github.com/batp/mon-potager)

## Démarrage rapide

```bash
# Terminal WSL
cd /home/batp/projects/mon-potager
cp .env.example apps/web/.env.local   # puis renseigner Supabase

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

- [x] Monorepo npm workspaces
- [x] Next.js 15 + Tailwind + Serwist (PWA)
- [x] Navigation 5 sections (responsive)
- [x] Design system + `PlaceholderImage`
- [x] Catalogue 30 cultures (emoji placeholders)
- [x] Migration SQL initiale
- [ ] Auth Supabase (anonyme + email)
- [ ] Connexion Supabase en local

## Tester la PWA sur mobile

1. `npm run build && npm run start` (HTTPS requis en prod ; Vercel OK)
2. En dev : Chrome DevTools → mode mobile
3. En prod : « Ajouter à l'écran d'accueil » (Android) ou Partager → Sur l'écran d'accueil (iOS Safari)
