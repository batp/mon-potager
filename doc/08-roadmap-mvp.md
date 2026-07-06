# 08 — Roadmap & MVP

## 1. Stratégie de découpage

**Méthode :** MoSCoW + sprints de 2 semaines (6 sprints sur 3 mois)

```
Mois 1 ────────── Mois 2 ────────── Mois 3
[Fondations]      [Cœur métier]      [Social & Polish]
 S1-S2              S3-S4              S5-S6
```

---

## 2. Priorisation MoSCoW

### Must Have (MVP indispensable)

- [x] Mode invité + création compte
- [x] Builder potager (grille, zones, drag & drop)
- [x] Catalogue cultures (30+) + fiche détail
- [x] Calendrier mensuel + tâches du jour
- [x] Tâches auto-générées + manuelles
- [x] **PWA installable** (manifest + service worker + icônes)
- [x] Responsive mobile-first (desktop + tablette + mobile)
- [x] Rappels in-app (badge calendrier, liste du jour)
- [x] Navigation 5 onglets
- [x] Design system de base + placeholders identifiés
- [x] i18n français

### Should Have (MVP souhaitable)

- [ ] **Web Push** rappels calendrier (opt-in)
- [ ] **Offline lecture seule** (potager + calendrier en cache)
- [ ] Bandeau « Installer l'app » (Android + instructions iOS)
- [ ] Fil communautaire (posts, likes, commentaires)
- [ ] Messagerie 1-to-1
- [ ] Profil utilisateur éditable
- [ ] Tutoriel premier lancement
- [ ] Suggestions dates selon zone climatique
- [ ] Signalement contenu

### Could Have (si le temps le permet)

- [ ] Export image du potager
- [ ] Conseil du jour (contenu éditorial)
- [ ] Animation d'accueil (CSS simple)

### Won't Have (MVP — phases ultérieures)

- Applications natives iOS / Android (stores)
- Notifications push natives APNs/FCM
- Troc & don
- Gardiennage & services
- Groupes thématiques
- Abonnement premium (paiement)
- Connexion Google/Apple
- Intégration météo
- Illustrations finales (remplacement placeholders)

---

## 3. Planning détaillé par sprint

### Sprint 1 — Fondations (S1-S2, semaines 1-2)

| Tâche | Estimation | Responsable |
|-------|------------|-------------|
| Setup monorepo (Next.js PWA + Supabase) | 1 j | Dev |
| Config Serwist (SW + manifest + icônes placeholder) | 1 j | Dev |
| Schéma DB + migrations + RLS | 2 j | Dev |
| Auth anonyme + email/password | 2 j | Dev |
| Design system + composant `PlaceholderImage` | 2 j | Dev |
| Set placeholders (30 cultures, icônes Lucide) | 1 j | Dev |
| Navigation App Router (5 sections) | 1 j | Dev |
| Écran Accueil (statique) | 1 j | Dev |
| CI/CD GitHub Actions + Vercel | 1 j | Dev |

**Livrable S1 :** PWA navigable (installable), auth, accueil, placeholders, DB prête

---

### Sprint 2 — Builder potager (S3-S4, semaines 3-4)

| Tâche | Estimation | Responsable |
|-------|------------|-------------|
| Grille interactive (rendu + zoom) — @dnd-kit | 3 j | Dev |
| CRUD zones (ajouter, déplacer, resize, supprimer) | 3 j | Dev |
| Assignation culture à une zone | 2 j | Dev |
| Catalogue cultures (seed data 30+) | 1 j | Dev |
| Écran détail culture (CRUD) | 2 j | Dev |
| Sync Supabase (gardens, zones, crops) | 2 j | Dev |
| Illustrations cultures (placeholders emoji + badge) | 0.5 j | Dev |

**Livrable S2 :** Potager fonctionnel de bout en bout

---

### Sprint 3 — Calendrier & notifications (S5-S6, semaines 5-6)

| Tâche | Estimation | Responsable |
|-------|------------|-------------|
| Vue calendrier mensuel | 2 j | Dev |
| Liste tâches du jour + badge navigation | 1 j | Dev |
| Edge Function generate-tasks | 2 j | Dev |
| CRUD tâches manuelles | 1 j | Dev |
| Marquer tâche terminée + animation CSS | 1 j | Dev |
| Indicateur tâches sur accueil | 0.5 j | Dev |
| Web Push rappels (VAPID + Edge Function + SW) | 2 j | Dev |
| Cache offline lecture (IndexedDB persist) | 1.5 j | Dev |
| Tutoriel premier lancement | 1 j | Dev |

**Livrable S3 :** Calendrier + Web Push + consultation offline

---

### Sprint 4 — Communauté & messagerie (S7-S8, semaines 7-8)

| Tâche | Estimation | Responsable |
|-------|------------|-------------|
| Fil d'actualité (lecture + pagination) | 2 j | Dev |
| Créer un post (texte + photos) | 2 j | Dev |
| Likes + commentaires | 2 j | Dev |
| Upload images (Storage + compression) | 1 j | Dev |
| Messagerie 1-to-1 (Realtime) | 3 j | Dev |
| Profil utilisateur (édition) | 1 j | Dev |
| Signalement contenu | 1 j | Dev |

**Livrable S4 :** Fonctionnalités sociales opérationnelles

---

### Sprint 5 — Polish & conformité (S9-S10, semaines 9-10)

| Tâche | Estimation | Responsable |
|-------|------------|-------------|
| Conversion invité → compte | 1 j | Dev |
| Suppression compte (RGPD) | 1 j | Dev |
| Politique de confidentialité in-app | 0.5 j | Dev |
| Tests E2E parcours critiques (Playwright) | 2 j | Dev |
| Corrections bugs + performance | 2 j | Dev |
| Intégration Sentry | 0.5 j | Dev |
| Tests utilisateurs (5 personnes) | 2 j | QA |
| Ajustements UX post-tests | 2 j | Dev |

**Livrable S5 :** App stable, testée, conforme

---

### Sprint 6 — Déploiement & lancement (S11-S12, semaines 11-12)

| Tâche | Estimation | Responsable |
|-------|------------|-------------|
| Configuration domaine + Vercel production | 0.5 j | Dev |
| Page landing / SEO basique (meta, og:image placeholder) | 1 j | Dev |
| Tests cross-browser (Chrome, Firefox, Safari, Edge) | 1 j | QA |
| Tests PWA installable (Android Chrome + iOS Safari) | 1 j | QA |
| Audit Lighthouse PWA (score ≥ 80) | 0.5 j | Dev |
| Mise en production URL publique | 0.5 j | Dev |
| Monitoring post-lancement (Sentry, Vercel Analytics) | ongoing | Dev |

**Livrable S6 :** PWA en production, installable, URL publique HTTPS

---

## 4. Jalons (milestones)

| Jalon | Date cible | Critère |
|-------|------------|---------|
| M1 — Fondations | Semaine 2 | PWA installable + auth + placeholders |
| M2 — Potager | Semaine 4 | Builder fonctionnel (souris + touch) |
| M3 — Calendrier | Semaine 6 | Web Push + offline lecture |
| M4 — Social | Semaine 8 | Fil + messagerie |
| M5 — Beta | Semaine 10 | URL staging, 20 testeurs |
| M6 — Launch | Semaine 12 | URL production publique |

---

## 5. Roadmap post-MVP

### Phase 2 — Q4 2026 (3 mois)

- **Application mobile native** (Expo React Native, App Store + Google Play)
- Notifications push natives
- Remplacement progressif des placeholders par illustrations finales
- Troc & don (annonces géolocalisées)
- Gardiennage & services
- Connexion Google + Apple Sign-In
- Abonnement premium (RevenueCat ou Stripe)

### Phase 3 — Q1 2027 (3 mois)

- Groupes thématiques
- Intégration météo (OpenWeatherMap)
- Mode hors-ligne complet
- Export PDF du potager
- Traduction anglaise + néerlandais (BE)

### Phase 4 — Q2 2027 (3 mois)

- Associations de plants (compagnonnage)
- Journal de récolte avec statistiques
- Widget iOS / Android
- Version tablette optimisée
- API publique partenaires (pépinières)

---

## 6. Risques et mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Builder trop complexe pour 3 mois | Moyenne | Élevé | MVP grille simple, pas de rotation 3D |
| Review Apple rejetée | N/A (MVP web) | — | — |
| Performance drag & drop web | Moyenne | Moyen | Tests précoces desktop + mobile web |
| Placeholders perçus comme « brouillon » | Moyenne | Moyen | Badge visible + bandeau staging + communication beta |
| Développeur seul surchargé | Élevée | Élevé | Couper Should → Could, focus Must |
| Supabase tier gratuit insuffisant | Faible | Faible | Upgrade Pro à 25 €/mois si besoin |

---

## 7. Definition of Done (DoD)

Une user story est « Done » quand :

- [ ] Code mergé sur `main` via PR
- [ ] Tests unitaires passent (couverture ≥ 60 % sur la logique métier)
- [ ] Pas de régression lint
- [ ] Testé sur Chrome, Firefox, Safari, Edge (desktop + mobile web)
- [ ] Critères d'acceptation validés
- [ ] Pas de crash Sentry nouveau
- [ ] UI conforme à la maquette (tolérance ±4 pt)
