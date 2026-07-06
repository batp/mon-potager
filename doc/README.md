# Mon Potager — Documentation projet

> **Cultiver, partager, s'entraider**
>
> Application jardinage pour le grand public. **MVP : PWA** (Progressive Web App) responsive, installable sur mobile. Apps natives iOS/Android en Phase 2.

---

## Emplacement des fichiers

### Chemin officiel du projet

```
/home/batp/projects/mon-potager/doc/
```

Ce chemin est un **répertoire Linux (WSL)**. Si vous ne voyez pas les fichiers dans Cursor ou l'explorateur Windows, c'est normal : ils ne sont pas au même endroit qu'un chemin Windows classique.

| Environnement | Chemin valide |
|---------------|---------------|
| **WSL / Linux** (recommandé) | `/home/batp/projects/mon-potager/doc/` |
| **Windows via WSL** | `\\wsl$\Ubuntu\home\batp\projects\mon-potager\doc\` |
| **Copie Windows** (miroir) | `C:\Users\TOTO\projects\mon-potager\doc\` |

### Pourquoi les fichiers n'apparaissaient pas ?

Lors de la première création, les fichiers avaient été placés par erreur dans `C:\home\batp\...` (un dossier Windows qui **simule** le chemin Linux mais n'est **pas** `/home/batp/` dans WSL). Le vrai répertoire WSL existait mais était vide.

### Comment accéder aux fichiers

**Option A — Ouvrir le projet depuis WSL dans Cursor (recommandé) :**
```bash
# Dans un terminal WSL
cd /home/batp/projects/mon-potager
cursor .
```

**Option B — Depuis l'explorateur Windows :**
```
\\wsl$\Ubuntu\home\batp\projects\mon-potager\doc
```

**Option C — Ligne de commande WSL :**
```bash
wsl -e bash -c "ls -la /home/batp/projects/mon-potager/doc/"
```

---

## Méthodologie appliquée

| Phase | Méthode | Livrable |
|-------|---------|----------|
| Découverte | Analyse du pitch + personas | [01-vision-produit.md](./01-vision-produit.md) |
| Cadrage | Cahier des charges fonctionnel | [02-cahier-des-charges.md](./02-cahier-des-charges.md) |
| Spécification | User Story Mapping + critères d'acceptation (INVEST) | [03-specifications-fonctionnelles.md](./03-specifications-fonctionnelles.md) |
| Design | Design system + parcours UX | [04-specifications-ux-ui.md](./04-specifications-ux-ui.md) |
| Architecture | Modèle C4 + ADR (Architecture Decision Records) | [05-architecture-technique.md](./05-architecture-technique.md) |
| Données | Modèle entité-relation + dictionnaire | [06-modele-donnees.md](./06-modele-donnees.md) |
| API | Spécification REST OpenAPI (squelette) | [07-api-specifications.md](./07-api-specifications.md) |
| Planification | Roadmap MVP 3 mois (MoSCoW) | [08-roadmap-mvp.md](./08-roadmap-mvp.md) |
| Gouvernance | Décisions, questions ouvertes | [09-decisions-ouvertes.md](./09-decisions-ouvertes.md) |
| Conformité | RGPD, sécurité, stores | [10-conformite-securite-rgpd.md](./10-conformite-securite-rgpd.md) |
| Utilisateurs test | Comptes manuels Supabase | [11-utilisateurs-test-supabase.md](./11-utilisateurs-test-supabase.md) |

---

## Décisions stratégiques validées

| Sujet | Décision |
|-------|----------|
| Horizon | MVP en **3 mois**, équipe **1-2 développeurs** |
| Zone de lancement | **Francophonie** (FR, BE, CH, CA…) |
| Modèle économique | **Freemium** (gratuit + abonnement premium) |
| Authentification MVP | **Comptes de test manuels** Supabase + connexion email |
| **Canal MVP** | **PWA** (web installable, responsive mobile-first) |
| Stack frontend | **Next.js 15 + Serwist (PWA) + TypeScript + Tailwind** |
| Backend | **Supabase** |
| Assets graphiques | **Placeholders temporaires**, clairement identifiés |
| Mobile natif | **Phase 2** (Expo React Native) |

---

## Structure du dépôt cible

```
mon-potager/
├── doc/                         ← cette documentation
├── apps/
│   └── web/                     ← application Next.js PWA
│       ├── public/
│       │   ├── manifest.webmanifest
│       │   ├── icons/           ← icônes PWA (192, 512)
│       │   └── placeholders/
│       └── app/
│           └── sw.ts            ← Service Worker (Serwist)
├── packages/
│   └── shared/
├── supabase/
│   ├── migrations/
│   └── functions/
```

---

## Prochaines étapes

1. Valider les [questions ouvertes](./09-decisions-ouvertes.md)
2. Ouvrir le workspace depuis `/home/batp/projects/mon-potager`
3. Initialiser le monorepo Next.js PWA + Supabase
4. Démarrer le Sprint 1 (cf. [08-roadmap-mvp.md](./08-roadmap-mvp.md))

---

*Dernière mise à jour : 6 juillet 2026 — PWA MVP + chemins WSL corrigés*
