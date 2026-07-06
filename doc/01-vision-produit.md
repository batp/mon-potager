# 01 — Vision produit

## 1. Résumé exécutif

**Mon Potager** est l'application de référence pour tous les jardiniers — du débutant à l'expert. Elle permet de **créer visuellement son potager**, de **planifier et suivre ses cultures**, et de **rejoindre une communauté bienveillante** pour échanger, s'entraider et donner ses surplus.

**Tagline :** *Cultiver, partager, s'entraider*

**Promesse finale :** *Une application qui fait pousser les légumes… et les liens entre jardiniers !*

---

## 2. Problème adressé

| Problème | Impact |
|----------|--------|
| Difficulté à planifier un potager (espacement, calendrier, associations) | Pertes de récolte, frustration |
| Outils existants trop techniques ou peu visuels | Abandon des débutants |
| Surplus non valorisés | Gaspillage alimentaire |
| Isolement des jardiniers amateurs | Manque de conseils locaux et d'entraide |
| Absence lors des vacances | Potager abandonné |

---

## 3. Proposition de valeur

### Pour le jardinier amateur
- Créer son potager en quelques minutes grâce à un **builder visuel intuitif**
- Recevoir des **rappels personnalisés** (arrosage, semis, récolte)
- Apprendre via la **communauté** et les conseils entre pairs

### Pour le jardinier confirmé
- Gérer plusieurs zones/planches avec suivi détaillé des variétés
- Partager son expertise et organiser des **groupes thématiques**
- Proposer du **gardiennage** ou des services ponctuels

### Pour la communauté
- **Troc & don** de surplus à proximité
- **Messagerie** pour coordonner échanges et entraide
- Fil d'actualité bienveillant (pas de réseau social toxique)

---

## 4. Personas

### Persona 1 — Marie, 34 ans, débutante enthousiaste
- **Contexte :** Balcon + petit carré potager en banlieue (France)
- **Objectifs :** Ne pas rater ses premiers semis, savoir quand arroser
- **Frustrations :** Trop d'infos contradictoires sur internet
- **Usage :** 10 min/jour, surtout le soir
- **Fonctionnalités clés :** Builder, calendrier, conseils débutants

### Persona 2 — Pierre, 58 ans, jardinier expérimenté
- **Contexte :** Grand potager en province, membre d'une AMAP
- **Objectifs :** Optimiser ses rotations, donner ses surplus
- **Frustrations :** Apps trop simplistes, pas de vraie communauté locale
- **Usage :** 20 min, 3-4 fois par semaine
- **Fonctionnalités clés :** Suivi cultures, troc, groupes, gardiennage

### Persona 3 — Sophie, 42 ans, en vacances
- **Contexte :** Cherche quelqu'un pour arroser son potager 2 semaines
- **Objectifs :** Trouver une personne de confiance à proximité
- **Frustrations :** Pas d'outil dédié, dépend des groupes Facebook
- **Usage :** Ponctuel, besoin géolocalisé
- **Fonctionnalités clés :** Gardiennage, messagerie, avis

### Persona 4 — Invité anonyme (MVP)
- **Contexte :** Découvre l'app sans créer de compte
- **Objectifs :** Tester le builder et le calendrier
- **Contrainte :** Données locales, incitation à créer un compte pour sauvegarder

---

## 5. Piliers fonctionnels

```
┌─────────────────────────────────────────────────────────────┐
│                      MON POTAGER                            │
├──────────┬──────────┬──────────┬──────────┬───────────────┤
│  POTAGER │CALENDRIER│COMMUNAUTÉ│TROC/DON  │  GARDIENNAGE  │
│ (cœur)   │ (suivi)  │ (social) │(market)  │  (services)   │
├──────────┴──────────┴──────────┴──────────┴───────────────┤
│                    MESSAGERIE (transversal)                 │
└─────────────────────────────────────────────────────────────┘
```

| Pilier | Description | Priorité MVP |
|--------|-------------|--------------|
| Potager | Builder visuel, zones, cultures, suivi | **Must** |
| Calendrier | Tâches auto-générées + manuelles, rappels | **Must** |
| Communauté | Fil, groupes, Q&A | **Should** (version light) |
| Troc & Don | Annonces géolocalisées | **Could** (phase 2) |
| Gardiennage | Offres/demandes de services | **Could** (phase 2) |
| Messagerie | Chat privé | **Should** (basique) |

---

## 6. Identité visuelle

| Élément | Spécification |
|---------|---------------|
| Univers | Chaleureux, naturel, illustré, vivant |
| Style | Illustrations douces, main levée, colorées |
| Palette | Verts, beiges, ocres + touches rouge/orange/jaune |
| Typographie | Ronde, douce, lisible (ex. Nunito, Quicksand, ou custom) |
| Iconographie | Illustrée, cohérente, thème jardin |
| Éléments graphiques | Légumes, outils, abeilles, coccinelles, personnages sympathiques |

---

## 7. Indicateurs de succès (KPIs)

### MVP (3 mois post-lancement)
| KPI | Cible |
|-----|-------|
| Téléchargements | 1 000 |
| Potagers créés | 500 |
| Rétention J7 | 25 % |
| Cultures suivies | 2 000 |
| Posts communauté | 200 |

### 12 mois
| KPI | Cible |
|-----|-------|
| Utilisateurs actifs mensuels | 10 000 |
| Abonnés premium | 500 (5 %) |
| Annonces troc actives | 1 000/mois |
| Note stores | ≥ 4,2/5 |

---

## 8. Concurrence et différenciation

| Concurrent | Forces | Faiblesses | Notre avantage |
|------------|--------|------------|----------------|
| Planter (FR) | Calendrier lunaire, fiches | Pas de builder visuel | Builder + communauté |
| Gardenize | Suivi cultures | Interface austère, pas de social | UX illustrée + entraide |
| Facebook groupes | Communauté locale | Pas structuré, pas d'outil potager | Outil + social intégré |
| Leboncoin (don) | Audience large | Pas spécialisé jardin | Troc géolocalisé dédié |

**Différenciateur clé :** le **builder visuel de potager** couplé à une **communauté bienveillante** dans une seule app.

---

## 9. Modèle freemium (préliminaire)

| Fonctionnalité | Gratuit | Premium (~4,99 €/mois) |
|----------------|---------|------------------------|
| Potagers | 1 potager, 10 cultures max | Illimité |
| Calendrier & rappels | Basique | Avancé (météo, associations) |
| Builder | Standard | Export PDF, templates |
| Communauté | Lecture + 3 posts/mois | Illimité, groupes privés |
| Troc & gardiennage | 2 annonces actives | Illimité, mise en avant |
| Publicité | Légère (bannière) | Aucune |

*Tarifs à valider — voir [09-decisions-ouvertes.md](./09-decisions-ouvertes.md)*

---

## 10. Hypothèses à valider

1. Les débutants préfèrent un builder visuel à une liste de cultures
2. La géolocalisation est acceptée pour le troc (opt-in)
3. Le mode invité convertit ≥ 15 % vers un compte créé
4. La francophonie partage les mêmes calendriers de semis (avec nuances climatiques)
