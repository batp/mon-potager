# 05 — Architecture technique

## 1. Décisions d'architecture (ADR)

### ADR-001 — Framework client (révisé)

**Décision :** **Next.js 15** (App Router) + TypeScript — **PWA responsive** (Serwist)

**Statut :** Remplace la décision initiale Expo (mobile natif), reportée en Phase 2.

**Contexte :** MVP en 3 mois, 1-2 développeurs. Le premier livrable est une **PWA installable**, testable sur mobile en conditions proches du réel.

**Alternatives évaluées :**

| Option | Pour | Contre | Score |
|--------|------|--------|-------|
| **Next.js** | React mature, routing intégré, déploiement Vercel trivial, SEO possible, responsive | Légèrement plus lourd que Vite seul | ⭐⭐⭐⭐⭐ |
| Vite + React SPA | Setup ultra-rapide | Routing, SSR, déploiement à configurer | ⭐⭐⭐⭐ |
| Expo (RN) | Mobile natif | Hors périmètre MVP web | ⭐ (Phase 2) |
| Flutter Web | UI riche | Écosystème web moins mature, builder complexe | ⭐⭐⭐ |

**Justification :** Next.js + Serwist permet une PWA installable (écran d'accueil mobile), avec cache offline et Web Push. Le builder visuel est réalisable avec `@dnd-kit/core`. Le code React sera réutilisable pour Expo (Phase 2).

---

### ADR-002 — Backend as a Service

**Décision :** Supabase (PostgreSQL + Auth + Storage + Realtime)

*(inchangé)*

**Justification :** Auth anonyme nativement, PostgreSQL relationnel, RLS, stockage images, Realtime pour messagerie. Tier gratuit suffisant pour le lancement web.

---

### ADR-003 — Gestion d'état

**Décision :** Zustand (état local) + TanStack Query (état serveur)

*(inchangé)*

---

### ADR-004 — Navigation & routing

**Décision :** Next.js App Router (file-based routing)

**Justification :** Convention over configuration, layouts partagés, compatible déploiement statique ou SSR selon besoin.

---

### ADR-005 — Stratégie PWA-first

**Décision :** MVP = **PWA** (web installable + responsive) ; mobile natif (iOS/Android) en Phase 2

| Phase | Canal | Cible |
|-------|-------|-------|
| **MVP (3 mois)** | **PWA** (HTTPS + manifest + service worker) | Navigateur + installation écran d'accueil |
| **Phase 2** | App native Expo | App Store + Google Play |
| **Phase 3** | Offline avancé + sync background | Écriture hors-ligne, sync différée |

**Implications MVP PWA :**
- HTTPS obligatoire (Vercel)
- Installable : icône sur écran d'accueil, `display: standalone` (sans barre d'URL)
- Tests mobile réalistes sans stores
- **Web Push** pour rappels calendrier (service worker + opt-in)
- Offline basique : cache shell app + données potager/calendrier en lecture seule (IndexedDB)
- Upload photos via `<input type="file">` (accept="image/*" capture sur mobile)
- Géolocalisation via `navigator.geolocation` (Phase 2 troc)

---

### ADR-007 — Implémentation PWA

**Décision :** **Serwist** (`@serwist/next`) pour le service worker Next.js 15

**Alternatives évaluées :**

| Option | Pour | Contre |
|--------|------|--------|
| **Serwist** | Maintenu, compatible App Router, Workbox sous le capot | Config initiale |
| next-pwa | Connu | Non maintenu, incompatible App Router |
| Workbox manuel | Contrôle total | Temps de dev |

**Composants PWA MVP :**

| Composant | Fichier / outil | Rôle |
|-----------|-----------------|------|
| Manifest | `public/manifest.webmanifest` | Nom, icônes, couleurs, `display: standalone` |
| Service Worker | `app/sw.ts` via Serwist | Cache assets, offline fallback, Web Push |
| Icônes | `public/icons/icon-192.png`, `icon-512.png` | Installation (placeholders acceptés) |
| Cache données | IndexedDB via TanStack Query `persistQueryClient` | Potager + calendrier offline lecture |
| Web Push | Service worker + VAPID keys + Edge Function cron | Rappels tâches du jour |

**Stratégie de cache (Serwist) :**

```
NetworkFirst  → API Supabase (données fraîches si online)
CacheFirst    → JS, CSS, fonts, placeholders SVG
StaleWhileRevalidate → pages statiques
OfflineFallback → /offline (page dédiée si pas de réseau)
```

---

### ADR-006 — Assets graphiques MVP

**Décision :** Placeholders temporaires, clairement identifiés

**Justification :** Pas de budget illustrations au lancement. Les placeholders permettent de développer et tester sans bloquer sur le design final. Voir [politique détaillée dans 04-specifications-ux-ui.md](./04-specifications-ux-ui.md#9-politique-des-placeholders-mvp).

---

## 2. Vue C4 — Niveau 1 (Contexte)

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│  Jardinier  │────────▶│ Mon Potager PWA  │────────▶│  Supabase   │
│(navigateur /│◀────────│ (Next.js+Serwist)│◀────────│  (Backend)  │
│ écran accueil)        └────────┬─────────┘         └──────┬──────┘
                                 │                            │
                        ┌────────▼─────────┐         ┌────────▼────────┐
                        │  Vercel / CDN    │         │  Supabase       │
                        │  (hébergement)   │         │  Storage (S3)   │
                        └──────────────────┘         └─────────────────┘
```

---

## 3. Vue C4 — Niveau 2 (Conteneurs)

```
┌─────────────────────────────────────────────────────────────┐
│              Application PWA (Next.js 15 + Serwist)            │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │   Pages    │  │ Components │  │  Services / Hooks      │ │
│  │ (App Router)│  │   (UI)     │  │  (API, Auth, Storage) │ │
│  └─────┬──────┘  └─────┬──────┘  └───────────┬────────────┘ │
│  ┌─────▼──────────────▼──────────────────────▼────────────┐ │
│  │         Service Worker (cache, offline, Web Push)       │ │
│  └─────────────────────────────────────────────────────────┘ │
│        └───────────────┼─────────────────────┘              │
│                        ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              State (Zustand + TanStack Query)           │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / WSS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Platform                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │   Auth   │  │ Database │  │ Storage  │  │  Realtime  │ │
│  │ (JWT)    │  │(Postgres)│  │ (images) │  │ (messages) │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘ │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Edge Functions                            │   │
│  │  • generate-tasks  • moderate  • web-push-reminders    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
*web-push-reminders : Should MVP PWA*

---

## 4. Stack technique détaillée

### Frontend web

| Couche | Technologie | Version cible |
|--------|-------------|---------------|
| Framework | Next.js (App Router) | 15.x |
| Langage | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Composants UI | Composants custom + shadcn/ui (optionnel) | Latest |
| Drag & Drop (builder) | @dnd-kit/core + @dnd-kit/sortable | Latest |
| État local | Zustand | 5.x |
| État serveur | TanStack Query | 5.x |
| Formulaires | React Hook Form + Zod | Latest |
| i18n | next-intl | Latest |
| Images | next/image + placeholders | — |
| PWA | Serwist (`@serwist/next`) | Latest |
| Offline cache | Serwist + TanStack Query persist (IndexedDB) | Latest |
| Web Push | Service Worker Push API + web-push (Edge Function) | Latest |
| Auth client | @supabase/ssr + @supabase/supabase-js | Latest |
| Tests | Vitest + React Testing Library | Latest |
| E2E | Playwright (optionnel MVP) | Latest |

### Backend (Supabase)

| Service | Usage |
|---------|-------|
| Auth | Anonyme + email/password, JWT |
| Database | PostgreSQL 15, RLS policies |
| Storage | Bucket `avatars`, `posts`, `gardens` |
| Realtime | Messagerie (subscriptions) |
| Edge Functions | Génération tâches, modération |

### DevOps & outils

| Outil | Usage |
|-------|-------|
| Git + GitHub | Versioning, CI/CD |
| Vercel | Hébergement web, preview deployments |
| GitHub Actions | Lint, test, build preview |
| Sentry | Error monitoring (frontend) |
| Figma | Design (placeholders en attendant) |

---

## 5. Structure du code web

```
apps/web/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Layout principal avec navigation
│   │   ├── page.tsx              # Accueil
│   │   ├── potager/
│   │   │   ├── page.tsx          # Mon Potager (builder)
│   │   │   └── [cropId]/page.tsx # Détail culture
│   │   ├── calendrier/
│   │   │   ├── page.tsx          # Calendrier
│   │   │   └── [taskId]/page.tsx # Détail tâche
│   │   ├── communaute/
│   │   │   ├── page.tsx          # Fil
│   │   │   └── [postId]/page.tsx # Détail post
│   │   ├── messages/
│   │   │   ├── page.tsx          # Liste conversations
│   │   │   └── [id]/page.tsx     # Chat
│   │   └── profil/
│   │       └── page.tsx          # Profil & paramètres
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── onboarding/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Design system
│   ├── placeholders/             # Composants placeholder identifiés
│   ├── garden/                   # Builder, zones, grille
│   ├── calendar/                 # Calendrier, tâches
│   ├── community/                # Posts, commentaires
│   └── shared/                   # Avatar, EmptyState, PlaceholderBadge…
├── hooks/
│   ├── useAuth.ts
│   ├── useGarden.ts
│   ├── useCalendar.ts
│   └── useCommunity.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Client browser
│   │   └── server.ts             # Client server (SSR)
│   └── utils.ts
├── stores/
│   ├── gardenStore.ts
│   └── settingsStore.ts
├── types/
│   └── index.ts
├── constants/
│   ├── colors.ts
│   ├── crops.ts
│   └── taskTypes.ts
├── public/
│   ├── manifest.webmanifest    # Manifest PWA
│   ├── icons/                  # icon-192.png, icon-512.png
│   └── placeholders/
│       ├── crops/
│       ├── icons/
│       └── README.md
├── app/
│   └── sw.ts                   # Service Worker (Serwist)
└── messages/
    └── fr.json                   # i18n
```

---

## 6. Flux de données clés

### 6.1 Synchronisation potager

```
[Builder UI] → gardenStore (Zustand, optimistic)
     ↓ debounce 2s
[TanStack Query mutation] → Supabase REST
     ↓
[PostgreSQL] → RLS check → upsert garden + zones + crops
     ↓
[Response] → invalidate query → UI sync
```

### 6.2 Rappels calendrier (MVP PWA)

```
[Cron Edge Function — 7h00] → tasks WHERE due_date = today
     ↓
[web-push] → subscriptions PWA (VAPID) → Service Worker
     ↓
[Notification système] → tap → deep link /calendrier
     ↓
[Fallback si pas d'opt-in] → badge in-app + bandeau accueil
```

*Push natives APNs/FCM reportées à Phase 2 (app Expo).*

### 6.3 Cache offline (lecture seule)

```
[Online] → TanStack Query fetch → IndexedDB persist (potager, tâches)
     ↓
[Offline] → lecture depuis IndexedDB → bandeau « Mode hors-ligne »
     ↓
[Écriture offline] → désactivée MVP (message « Connexion requise »)
```

### 6.4 Messagerie temps réel

```
[User A envoie message] → Supabase insert messages
     ↓
[Realtime subscription] → User B reçoit message (si onglet ouvert)
     ↓
[Badge messagerie] si messages non lus
```

---

## 7. Compatibilité navigateurs (MVP)

| Navigateur | Version min | Support |
|------------|-------------|---------|
| Chrome | 100+ | ✅ Complet |
| Firefox | 100+ | ✅ Complet |
| Safari | 15+ | ✅ Complet |
| Edge | 100+ | ✅ Complet |
| Safari iOS | 15+ | ✅ Responsive mobile |
| Chrome Android | 100+ | ✅ Responsive mobile |

**Approche :** Mobile-first responsive + PWA standalone. Le builder fonctionne à la souris (desktop) et au touch (mobile web / PWA installée).

**Test conditions réelles :** installer la PWA sur smartphone, tester builder tactile, Web Push, offline.

---

## 8. Sécurité architecture

| Couche | Mesure |
|--------|--------|
| Transport | TLS 1.3 (HTTPS) |
| Auth | JWT + refresh token, cookies httpOnly (Supabase SSR) |
| Autorisation | RLS policies par table |
| Storage | Buckets avec policies, signed URLs |
| Client | Uniquement `anon` key, jamais `service_role` |
| CSRF | Protection Next.js + Supabase SSR |
| XSS | React escaping + CSP headers |
| Données | Chiffrement at rest (Supabase) |

---

## 9. Environnements

| Env | Usage | Hébergement |
|-----|-------|-------------|
| `development` | Dev local (`localhost:3000`) | — |
| `staging` | Tests internes, recette | Vercel Preview |
| `production` | Utilisateurs publics | Vercel Production |

Variables d'environnement (`.env.local`) :
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 10. Estimation infra mensuelle

| Service | Coût MVP | Coût 10k MAU |
|---------|----------|--------------|
| Supabase Free → Pro | 0 € → 25 € | 25 € |
| Vercel Hobby → Pro | 0 € → 20 € | 20 € |
| Sentry | 0 € | 26 € |
| Nom de domaine | ~12 €/an | 12 €/an |
| **Total mensuel** | **~0 €** | **~71 €** |

*Pas de frais Apple/Google Developer en MVP web.*

---

## 11. Trajectoire vers le mobile (Phase 2)

Le code métier sera partagé dans `packages/shared/` pour faciliter la migration :

```
packages/shared/
├── types/          # Types TypeScript (gardens, crops, tasks…)
├── constants/      # Catalogue cultures, couleurs, règles métier
├── validators/     # Schémas Zod
└── i18n/           # Traductions FR
```

L'app Expo (Phase 2) réutilisera ces packages + la même API Supabase.
