# 02 — Cahier des charges

## 1. Objet du document

Ce cahier des charges définit les exigences fonctionnelles et non-fonctionnelles de l'application **Mon Potager** — **MVP PWA** (Progressive Web App responsive et installable), en vue d'une livraison en 3 mois. Les apps natives iOS/Android sont reportées en Phase 2.

---

## 2. Périmètre

### 2.1 Inclus dans le MVP (PWA)

- **PWA installable** : `manifest.webmanifest`, service worker, icônes 192/512 px
- **Ajout à l'écran d'accueil** (Android « Installer » / iOS « Sur l'écran d'accueil »)
- Application **responsive** (desktop, tablette, mobile web) — mobile-first
- Navigateurs : Chrome, Firefox, Safari, Edge (versions récentes)
- Mode invité (sans compte) + création de compte optionnelle
- Builder visuel de potager (grille 2D, souris + tactile)
- Gestion des cultures (CRUD, fiches variétés)
- Calendrier de tâches avec rappels **in-app** + **Web Push** (opt-in)
- **Mode hors-ligne basique** : assets statiques + consultation potager/calendrier en lecture seule (cache)
- Fil communautaire simplifié (posts texte + photo)
- Messagerie 1-to-1 basique (temps réel si onglet ouvert)
- **Placeholders graphiques** temporaires, clairement identifiés
- Interface en français, architecture i18n prête
- Conformité RGPD de base
- Déploiement HTTPS (Vercel ou équivalent — **obligatoire pour PWA**)

### 2.2 Exclu du MVP (phases ultérieures)

- Applications natives iOS / Android (App Store, Google Play)
- Notifications push natives APNs / FCM (remplacées par Web Push en MVP)
- Troc & don complet (marketplace)
- Gardiennage & services
- Groupes thématiques avancés
- Paiement in-app (abonnement premium)
- Intégration météo
- Mode hors-ligne complet (écriture offline + sync background)
- Illustrations finales (remplacement des placeholders)

---

## 3. Exigences fonctionnelles

### EF-01 — Authentification & profil

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-01.1 | L'utilisateur peut utiliser l'app en mode invité sans inscription | Must |
| EF-01.2 | L'utilisateur peut créer un compte (email + mot de passe) | Must |
| EF-01.3 | Les données invité peuvent être migrées vers un compte créé | Must |
| EF-01.4 | L'utilisateur peut éditer son profil (pseudo, avatar, bio, localisation approximative) | Should |
| EF-01.5 | L'utilisateur peut supprimer son compte et ses données (RGPD) | Must |
| EF-01.6 | Connexion Google / Apple | Could (post-MVP) |

### EF-02 — Potager (builder visuel)

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-02.1 | L'utilisateur peut créer un potager avec nom et dimensions (grille) | Must |
| EF-02.2 | L'utilisateur peut ajouter des zones/planches sur la grille | Must |
| EF-02.3 | L'utilisateur peut redimensionner et déplacer une zone | Must |
| EF-02.4 | L'utilisateur peut supprimer une zone | Must |
| EF-02.5 | L'utilisateur peut assigner une culture à une zone | Must |
| EF-02.6 | L'utilisateur peut visualiser son potager en vue de dessus | Must |
| EF-02.7 | L'utilisateur peut créer plusieurs potagers (limité en gratuit) | Should |
| EF-02.8 | Export image du potager | Could |

### EF-03 — Cultures

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-03.1 | Catalogue de cultures pré-remplies (légumes, aromates, fruits) | Must |
| EF-03.2 | Fiche culture : nom, variété, dates semis/plantation, quantité, notes | Must |
| EF-03.3 | L'utilisateur peut éditer et supprimer une culture | Must |
| EF-03.4 | Illustration associée à chaque culture | Must |
| EF-03.5 | Suggestions de calendrier selon la culture et la zone géo | Should |
| EF-03.6 | Historique des récoltes | Could |

### EF-04 — Calendrier & rappels

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-04.1 | Vue calendrier mensuelle avec tâches du jour | Must |
| EF-04.2 | Tâches auto-générées à partir des cultures (semis, plantation, récolte) | Must |
| EF-04.3 | L'utilisateur peut ajouter des tâches manuelles (arrosage, paillage…) | Must |
| EF-04.4 | Notifications push pour les rappels | Must |
| EF-04.5 | Marquer une tâche comme terminée | Must |
| EF-04.6 | Types de tâches illustrés (icônes) | Should |

### EF-05 — Communauté

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-05.1 | Fil d'actualité avec posts (texte + 1-4 photos) | Should |
| EF-05.2 | Like et commentaire sur un post | Should |
| EF-05.3 | Section « Conseil du jour » (contenu éditorial) | Could |
| EF-05.4 | Groupes thématiques | Won't (MVP) |
| EF-05.5 | Modération basique (signalement) | Must |

### EF-06 — Messagerie

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-06.1 | Conversation 1-to-1 entre utilisateurs | Should |
| EF-06.2 | Notification de nouveau message | Should |
| EF-06.3 | Historique des messages | Should |

### EF-07 — Troc & Don (Phase 2)

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-07.1 | Publier une annonce (photo, catégorie, description) | Could |
| EF-07.2 | Recherche par proximité (géolocalisation) | Could |
| EF-07.3 | Filtres par catégorie (légumes, aromates, plants…) | Could |
| EF-07.4 | Marquer une annonce comme réservée/terminée | Could |

### EF-08 — Gardiennage (Phase 2)

| ID | Exigence | Priorité |
|----|----------|----------|
| EF-08.1 | Publier une demande ou offre de gardiennage | Could |
| EF-08.2 | Dates, type de service (arrosage, récolte…) | Could |
| EF-08.3 | Système de demande / acceptation | Could |

---

## 4. Exigences non-fonctionnelles

### ENF-01 — Performance

| ID | Exigence | Cible |
|----|----------|-------|
| ENF-01.1 | Temps de lancement à froid | < 3 s |
| ENF-01.2 | Fluidité du builder (drag & drop) | 60 fps |
| ENF-01.3 | Temps de chargement du fil | < 2 s |
| ENF-01.4 | Taille de l'APK/IPA | < 50 Mo |

### ENF-02 — Disponibilité & scalabilité

| ID | Exigence | Cible |
|----|----------|-------|
| ENF-02.1 | Disponibilité API | 99,5 % |
| ENF-02.2 | Utilisateurs simultanés MVP | 500 |
| ENF-02.3 | Scalabilité | Horizontale via Supabase |

### ENF-03 — Sécurité

| ID | Exigence |
|----|----------|
| ENF-03.1 | HTTPS obligatoire |
| ENF-03.2 | Authentification JWT (Supabase Auth) |
| ENF-03.3 | Row Level Security (RLS) sur toutes les tables |
| ENF-03.4 | Chiffrement des données au repos |
| ENF-03.5 | Pas de données sensibles en clair côté client |
| ENF-03.6 | Rate limiting sur les endpoints publics |

### ENF-04 — Accessibilité

| ID | Exigence |
|----|----------|
| ENF-04.1 | Contrastes WCAG AA minimum |
| ENF-04.2 | Labels accessibles (ARIA), navigation clavier |
| ENF-04.3 | Tailles de police ajustables (respect navigateur/OS) |
| ENF-04.4 | Zones cliquables ≥ 44×44 px |

### ENF-05 — Compatibilité navigateurs

| ID | Exigence |
|----|----------|
| ENF-05.1 | Chrome, Firefox, Safari, Edge (2 dernières versions majeures) |
| ENF-05.2 | Safari iOS 15+, Chrome Android 100+ (responsive) |
| ENF-05.3 | Viewports 320 px → 1920 px |
| ENF-05.4 | Mode clair (mode sombre en phase 2) |
| ENF-05.5 | Fonctionnement dégradé si JavaScript désactivé (message explicite) |

### ENF-06 — Localisation

| ID | Exigence |
|----|----------|
| ENF-06.1 | Français par défaut |
| ENF-06.2 | Architecture i18n (fichiers de traduction) |
| ENF-06.3 | Formats date/heure selon locale |
| ENF-06.4 | Zones climatiques francophones configurables |

### ENF-07 — PWA & installation

| ID | Exigence | Priorité MVP |
|----|----------|--------------|
| ENF-07.1 | `manifest.webmanifest` valide (nom, icônes, theme_color, display: standalone) | Must |
| ENF-07.2 | Service worker enregistré (cache assets statiques) | Must |
| ENF-07.3 | Installable sur écran d'accueil mobile (critères Lighthouse PWA) | Must |
| ENF-07.4 | Bandeau / prompt « Installer l'app » (après 2e visite) | Should |
| ENF-07.5 | Fonctionnement dégradé hors-ligne (page offline + données cache) | Should |
| ENF-07.6 | Score Lighthouse PWA ≥ 80 | Should |

### ENF-08 — Notifications & rappels (MVP PWA)

| ID | Exigence | Priorité MVP |
|----|----------|--------------|
| ENF-08.1 | Badge calendrier (tâches du jour en attente) | Must |
| ENF-08.2 | Liste tâches du jour visible à l'ouverture | Must |
| ENF-08.3 | Indicateur visuel sur l'accueil (« 3 tâches aujourd'hui ») | Should |
| ENF-08.4 | **Web Push** pour rappels calendrier (opt-in, via service worker) | Should |
| ENF-08.5 | Email de rappel (Edge Function) | Could |
| ENF-08.6 | Push natives APNs/FCM | Phase 2 (app Expo) |

---

## 5. Contraintes techniques

| Contrainte | Détail |
|------------|--------|
| Équipe | 1-2 développeurs |
| Délai | 3 mois pour MVP |
| Budget infra | < 30 €/mois au lancement (Supabase + Vercel free tier) |
| Déploiement | Web (Vercel) — pas de stores en MVP |
| Assets | Placeholders temporaires identifiés (pas d'illustrateur) |
| RGPD | Applicable (utilisateurs UE + Canada) |

---

## 6. Livrables attendus

| Livrable | Échéance |
|----------|----------|
| Documentation (ce dossier) | S1 |
| Maquettes Figma (wireframes + placeholders) | S2 |
| MVP web fonctionnel (staging Vercel) | S10 |
| Mise en production (URL publique) | S12 |
| Documentation utilisateur (FAQ in-app) | S12 |

---

## 7. Critères d'acceptation globaux du MVP

- [ ] Un utilisateur invité peut créer un potager, ajouter 3 cultures et voir son calendrier
- [ ] Un utilisateur inscrit retrouve ses données après reconnexion (autre navigateur/appareil)
- [ ] Les tâches du jour sont visibles avec badge sur le calendrier
- [ ] Le fil communautaire permet de publier, liker et commenter
- [ ] La messagerie 1-to-1 fonctionne en temps réel (onglet ouvert)
- [ ] L'app est responsive (desktop + mobile web)
- [ ] La PWA est installable sur écran d'accueil (Android + iOS Safari)
- [ ] Le potager et le calendrier sont consultables hors-ligne (lecture seule)
- [ ] Les placeholders sont clairement identifiés comme temporaires
- [ ] Conformité RGPD : politique de confidentialité, suppression de compte, consentement cookies/traceurs
