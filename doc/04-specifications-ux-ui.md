# 04 — Spécifications UX/UI

## 1. Principes de design

| Principe | Application |
|----------|-------------|
| **Chaleureux** | Couleurs terre, illustrations main levée, ton bienveillant |
| **Simple** | Max 3 actions par écran, navigation prévisible |
| **Motivant** | Micro-animations (coccinelle, pousse de plante), feedback positif |
| **Utile** | Chaque écran répond à une action concrète du jardinier |
| **Accessible** | Contrastes AA, zones tactiles 44 pt, labels VoiceOver |

---

## 2. Design system

### 2.1 Palette de couleurs

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-500` | `#4A7C59` | Boutons principaux, liens |
| `primary-300` | `#7BAE7F` | Fonds légers, badges |
| `primary-700` | `#2D5A3D` | Headers, texte sur fond clair |
| `secondary-500` | `#D4A574` | Accents chaleureux, CTA secondaires |
| `earth-100` | `#F5F0E8` | Fond principal (beige crème) |
| `earth-200` | `#E8DFD0` | Cartes, zones potager |
| `earth-800` | `#3D3229` | Texte principal |
| `accent-red` | `#D94F4F` | Tomates, alertes douces |
| `accent-orange` | `#E8A838` | Carottes, notifications |
| `accent-yellow` | `#F2D06B` | Soleil, highlights |
| `success` | `#5CB85C` | Tâche terminée |
| `error` | `#D9534F` | Erreurs |
| `white` | `#FFFFFF` | Cartes, modales |

### 2.2 Typographie

| Style | Police | Taille | Poids |
|-------|--------|--------|-------|
| H1 — Titre page | Nunito | 28 sp | Bold (700) |
| H2 — Section | Nunito | 22 sp | SemiBold (600) |
| H3 — Carte | Nunito | 18 sp | SemiBold (600) |
| Body | Nunito | 16 sp | Regular (400) |
| Caption | Nunito | 14 sp | Regular (400) |
| Label bouton | Nunito | 16 sp | SemiBold (600) |

### 2.3 Espacements & grille

- Grille de base : **8 pt**
- Marges écran : **16 pt** (24 pt sur tablette)
- Rayon des cartes : **16 pt**
- Rayon des boutons : **12 pt** (pilule pour CTA principaux)
- Ombre cartes : `0 2px 8px rgba(61, 50, 41, 0.08)`

### 2.4 Composants UI

| Composant | Variantes | Notes |
|-----------|-----------|-------|
| `Button` | primary, secondary, ghost, icon | Illustration optionnelle |
| `Card` | default, elevated, outlined | Fond earth-100 |
| `Tile` | home shortcut (4 icônes illustrées) | 2×2 grille accueil |
| `BottomNav` | 5 onglets | Icônes illustrées + label |
| `FAB` | + vert | Contextuel par écran |
| `GardenGrid` | cellules carrées | Drag & drop zones |
| `CropCard` | illustration + nom + surface | Liste et détail |
| `TaskItem` | icône type + label + checkbox | Swipe to complete |
| `PostCard` | avatar + texte + photos + actions | Fil communauté |
| `Calendar` | mois + indicateurs points | Style doux, coins arrondis |
| `Input` | text, date, textarea | Bordure primary-300 focus |
| `Avatar` | rond, illustré par défaut | Upload photo optionnel |
| `Badge` | culture, statut, premium | Pill shape |
| `InstallPrompt` | banner, modal-ios | Bandeau PWA + instructions Safari |
| `Modal` | confirmation, formulaire | Fond semi-transparent |
| `EmptyState` | illustration + texte + CTA | Ex. potager vide |

---

## 3. Écrans clés (wireframes textuels)

### 3.1 Accueil

```
┌────────────────────────────────┐
│  ☀️  Bonjour Marie !           │
│  [Illustration jardinier]      │
│                                │
│  ┌──────────┐  ┌──────────┐   │
│  │🌱 Potager│  │📅 Calend.│   │
│  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐   │
│  │👥 Commun.│  │🔄 Troc   │   │
│  └──────────┘  └──────────┘   │
│                                │
│  ┌─ Conseil du jour ─────────┐ │
│  │ Pensez à pailler vos      │ │
│  │ tomates avant les chaleurs│ │
│  └───────────────────────────┘ │
│                                │
│ [Accueil][Potager][📅][👥][👤] │
└────────────────────────────────┘
```

**Interactions :**
- Tuiles → navigation vers section
- Troc grisé avec badge « Bientôt » en MVP
- Bandeau compte si mode invité

### 3.2 Mon Potager (builder)

```
┌────────────────────────────────┐
│ ← Mon Potager    [⚙️] [📤]    │
│                                │
│  ┌────────────────────────┐   │
│  │ ┌─────┐ ┌──────┐      │   │
│  │ │Tomate│ │Salade│      │   │
│  │ │ 4m² │ │ 2m²  │      │   │
│  │ └─────┘ └──────┘      │   │
│  │ ┌──────────┐ ┌───┐    │   │
│  │ │ Courgette│ │🌿 │    │   │
│  │ └──────────┘ └───┘    │   │
│  └────────────────────────┘   │
│                                │
│ [➕Ajouter][↔️Déplacer][📐][🗑️] │
│                                │
│ [Accueil][Potager][📅][👥][👤] │
└────────────────────────────────┘
```

**Interactions :**
- Tap zone → fiche culture
- Long press → mode édition
- Barre d'outils : Ajouter, Déplacer, Redimensionner, Supprimer
- Pinch to zoom sur la grille (mobile web)
- Scroll molette + drag souris (desktop)

### 3.3 Détail Culture

```
┌────────────────────────────────┐
│ ← Tomates                      │
│                                │
│   [Illustration tomate]        │
│                                │
│  Zone : Carré Nord (4 m²)      │
│  Variété : Cœur de bœuf        │
│  Plantation : 15/05/2026       │
│  Semis : 01/04/2026            │
│  Quantité : 6 plants           │
│                                │
│  📝 Notes                      │
│  ┌────────────────────────┐   │
│  │ Tuteur installé le...  │   │
│  └────────────────────────┘   │
│                                │
│  [Modifier]  [Supprimer]       │
└────────────────────────────────┘
```

### 3.4 Calendrier

```
┌────────────────────────────────┐
│        Juillet 2026            │
│  L  M  M  J  V  S  D          │
│        1  2  3  4  5  6       │
│  7  8  9 10 11 12 13          │
│ 14 15 16 17 18 19 20          │
│ 21 22 23 24 25 26 27          │
│ 28 29 30 31                   │
│                                │
│  Aujourd'hui — 6 juillet       │
│  ┌────────────────────────┐   │
│  │💧 Arrosage — Tomates   ☐│   │
│  │🌿 Paillage — Courgettes☐│   │
│  │🔧 Travail du sol       ☐│   │
│  └────────────────────────┘   │
│                          [+]   │
│ [Accueil][Potager][📅][👥][👤] │
└────────────────────────────────┘
```

### 3.5 Communauté

```
┌────────────────────────────────┐
│  Communauté                    │
│  [Fil d'actualité] [Groupes*]  │
│                                │
│  ┌─ Conseil du jour ─────────┐ │
│  │ 🐝 Attirez les pollinisat.│ │
│  └───────────────────────────┘ │
│                                │
│  ┌────────────────────────┐   │
│  │ 👩 Marie · il y a 2h    │   │
│  │ Première récolte ! 🎉   │   │
│  │ [photo radis]           │   │
│  │ ❤️ 12    💬 3           │   │
│  └────────────────────────┘   │
│                          [+]   │
│ [Accueil][Potager][📅][👥][👤] │
└────────────────────────────────┘
```
*Groupes grisé MVP

---

## 4. Parcours utilisateur critiques

### 4.1 First Time User Experience (FTUE)

```
Première visite → Page d'accueil → Bandeau « Créez votre potager »
    → Tutoriel 3 slides → Première zone → Première culture
    → « Bravo ! 🎉 » → Calendrier auto-généré
    → Bandeau « Créez un compte pour sauvegarder »
```

**Durée cible :** < 5 minutes jusqu'au premier potager fonctionnel

### 4.3 Retour utilisateur quotidien (PWA installée)

```
Web Push matin → Tap notification → Calendrier (tâches du jour)
    → Cocher tâches → Retour accueil
```

### 4.4 Installation PWA (mobile)

```
2e visite sur mobile → Bandeau « Installer Mon Potager »
    → Android : prompt natif beforeinstallprompt
    → iOS Safari : modal instructions (Partager → Sur l'écran d'accueil)
    → App ouverte en standalone (sans barre d'URL)
```

---

## 5. Animations & micro-interactions

| Interaction | Animation | Durée |
|-------------|-----------|-------|
| Tâche terminée | Coccinelle s'envole + check vert | 600 ms |
| Ajout zone | Zone apparaît avec effet « pousse » | 400 ms |
| Navigation onglet | Fade + slide léger | 250 ms |
| Pull to refresh | Plante qui s'étire | 800 ms |
| Like post | Cœur qui grossit + particules | 300 ms |
| Chargement | Illustration arrosoir qui bascule | Loop |

---

## 6. Responsive & adaptatif (web)

| Breakpoint | Largeur | Comportement |
|------------|---------|--------------|
| Mobile | < 640 px | Navigation basse, colonne unique, builder plein écran |
| Tablette | 640–1024 px | Navigation basse ou latérale, grille potager élargie |
| Desktop | > 1024 px | Sidebar navigation gauche, builder centré large, panneau outils à droite |

**Cibles prioritaires MVP :** desktop (usage principal du builder) et mobile web (consultation calendrier, communauté).

---

## 7. Assets graphiques — Placeholders MVP

> **Décision validée :** placeholders temporaires, clairement identifiés. Pas d'illustrateur au lancement.

### 7.1 Politique des placeholders

Tout asset non final doit être **immédiatement reconnaissable** comme provisoire :

| Règle | Implémentation |
|-------|----------------|
| **Badge visible** | Composant `<PlaceholderBadge />` : pastille orange « Illustration à venir » sur chaque asset temporaire |
| **Style distinct** | Fond hachuré diagonal gris/vert pâle, bordure pointillée `2px dashed #D4A574` |
| **Nommage fichiers** | Préfixe `ph-` (ex. `ph-tomate.svg`, `ph-icon-arrosage.svg`) |
| **Inventaire** | Fichier `public/placeholders/README.md` listant chaque placeholder et son futur asset |
| **Accessibilité** | Attribut `alt="[Tomate] — illustration temporaire"` sur chaque image |
| **Mode dev** | Variable `NEXT_PUBLIC_SHOW_PLACEHOLDER_BANNER=true` affiche un bandeau global en staging |

### 7.2 Catalogue placeholders MVP

| Asset | Placeholder temporaire | Identification | Asset final (Phase 2) |
|-------|------------------------|----------------|----------------------|
| Cultures (×30) | Emoji + nom sur fond hachuré (ex. 🍅 Tomate) | Badge + `ph-{culture}.svg` | Illustration main levée |
| Icônes navigation (×5) | Lucide Icons (open source) | Couleur primary, label « icône temporaire » en dev | Icônes illustrées custom |
| Icônes tâches (×8) | Lucide Icons | Idem | Icônes illustrées |
| Illustration accueil | Silhouette jardinier SVG simple + texte « Bientôt illustré » | Badge centré | Illustration hero |
| Avatars par défaut | Initiales sur fond coloré (style GitHub) | Pas de badge (acceptable MVP) | Avatars illustrés |
| Empty states | Icône Lucide + message texte | Badge sous l'icône | Illustrations dédiées |
| Favicon | Emoji 🌱 sur fond vert | — | Logo final |
| Logo | Texte « Mon Potager » en Nunito | Sous-titre « beta » | Logo illustré |

### 7.3 Composant PlaceholderImage

```tsx
// Composant réutilisable — à implémenter en Sprint 1
<PlaceholderImage
  type="crop"           // crop | icon | hero | empty
  name="Tomate"
  emoji="🍅"
  showBadge={true}      // affiche « Illustration à venir »
/>
```

### 7.4 Règles de remplacement (Phase 2)

1. Chaque placeholder a un `id` unique dans l'inventaire
2. Le remplacement se fait fichier par fichier (pas de big-bang)
3. Supprimer le badge quand l'asset final est intégré
4. Test visuel de régression après chaque remplacement

---

## 8. Assets graphiques requis (inventaire complet)

| Asset | Quantité MVP | Format MVP (placeholder) | Format final (Phase 2) |
|-------|--------------|--------------------------|----------------------|
| Illustrations cultures | 30 | SVG placeholder (emoji + hachures) | SVG illustré |
| Icônes navigation | 5 | Lucide Icons | SVG custom |
| Icônes types de tâches | 8 | Lucide Icons | SVG custom |
| Illustration accueil | 1 | SVG silhouette + badge | SVG / Lottie |
| Avatar par défaut | 4 variantes | Initiales colorées | SVG illustré |
| Empty states | 4 | Lucide + texte + badge | SVG illustré |
| Favicon + icônes PWA | 192 + 512 px | PNG placeholder (emoji 🌱) |
| Logo | 1 | Texte typographique | SVG logo |

### 7.5 Écran offline

Page `/offline` dédiée : illustration placeholder + message « Pas de connexion — vos données locales sont disponibles » + bouton réessayer.

---

## 9. Checklist design avant développement

- [ ] Wireframes validés (5 écrans clés + responsive)
- [ ] Design tokens définis (couleurs, typo, espacements)
- [ ] Composant `PlaceholderImage` spécifié
- [ ] Inventaire `public/placeholders/README.md` créé
- [ ] Set Lucide Icons sélectionné pour navigation et tâches
- [ ] Tests utilisateurs sur prototype (5 personnes minimum)
- [ ] Validation accessibilité contrastes
