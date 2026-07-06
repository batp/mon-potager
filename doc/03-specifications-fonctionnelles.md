# 03 — Spécifications fonctionnelles

## 1. User Story Map

```
Découvrir → Créer son potager → Suivre ses cultures → Planifier → Partager → Échanger
    │              │                    │                │           │          │
 Accueil      Builder visuel       Fiche culture     Calendrier    Fil       Troc (P2)
 Onboarding   Ajouter zone         Variété/dates     Rappels       Posts     Gardiennage (P2)
 Mode invité  Déplacer/resize      Notes             Tâches        Messages
```

---

## 2. Épopées (Epics) et User Stories

### Epic E1 — Onboarding & Authentification

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| US-1.1 | En tant qu'**invité**, je veux **utiliser l'app sans compte** afin de **tester rapidement** | • L'app démarre sans écran de login • Un bandeau invite à créer un compte • Données stockées localement + cloud anonyme | Must |
| US-1.2 | En tant qu'**invité**, je veux **créer un compte** afin de **sauvegarder mes données** | • Formulaire email/mdp • Migration automatique des données invité • Email de confirmation | Must |
| US-1.3 | En tant qu'**utilisateur**, je veux **me connecter** afin de **retrouver mon potager** | • Login email/mdp • Gestion erreurs (mdp incorrect, compte inexistant) • Token persistant | Must |
| US-1.4 | En tant qu'**utilisateur**, je veux **modifier mon profil** afin de **me présenter à la communauté** | • Pseudo, avatar (upload), bio (280 car.), ville/région • Preview avant sauvegarde | Should |
| US-1.5 | En tant qu'**utilisateur**, je veux **supprimer mon compte** afin d'**exercer mon droit RGPD** | • Confirmation double • Suppression données < 30 jours • Export données avant suppression | Must |

### Epic E2 — Builder de potager

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| US-2.1 | En tant que **jardinier**, je veux **créer un potager avec une grille** afin de **visualiser mon espace** | • Saisie nom + dimensions (largeur × longueur en unités ou mètres) • Grille affichée en vue de dessus • Grille min 4×4, max 20×20 (gratuit : 12×12) | Must |
| US-2.2 | En tant que **jardinier**, je veux **ajouter une zone** afin de **délimiter une planche** | • Tap sur « Ajouter » puis dessin rectangle sur grille • Couleur auto ou choisie • Label éditable | Must |
| US-2.3 | En tant que **jardinier**, je veux **déplacer et redimensionner une zone** afin d'**ajuster mon plan** | • Mode « Déplacer » : drag zone • Mode « Redimensionner » : poignées • Collision détectée (warning) | Must |
| US-2.4 | En tant que **jardinier**, je veux **supprimer une zone** afin de **corriger mon plan** | • Confirmation si culture assignée • Suppression cascade de la culture liée | Must |
| US-2.5 | En tant que **jardinier**, je veux **assigner une culture à une zone** afin de **savoir quoi y pousse** | • Tap zone → choix culture dans catalogue • Illustration visible sur la zone • Surface calculée affichée | Must |
| US-2.6 | En tant que **jardinier**, je veux **voir la surface de chaque zone** afin de **planifier correctement** | • Affichage m² ou unités grille • Total surface utilisée / disponible | Should |

### Epic E3 — Gestion des cultures

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| US-3.1 | En tant que **jardinier**, je veux **consulter la fiche d'une culture** afin de **suivre ses détails** | • Écran détail : illustration, nom, variété, zone, dates, quantité, notes • Navigation depuis potager ou liste | Must |
| US-3.2 | En tant que **jardinier**, je veux **renseigner la variété et les dates** afin de **planifier mon calendrier** | • Champs : variété (texte libre + suggestions), date semis, date plantation, quantité • Validation dates cohérentes | Must |
| US-3.3 | En tant que **jardinier**, je veux **ajouter des notes** afin de **garder un journal** | • Champ texte libre (max 2000 car.) • Horodatage dernière modification | Must |
| US-3.4 | En tant que **jardinier**, je veux **parcourir un catalogue de cultures** afin de **choisir facilement** | • ≥ 30 cultures pré-remplies • Recherche par nom • Catégories : légumes, aromates, fruits, fleurs | Must |
| US-3.5 | En tant que **jardinier**, je veux **recevoir des suggestions de dates** selon ma région afin de **ne pas me tromper** | • Sélection zone climatique (Nord/ Sud / Océanique / Continental) • Dates pré-remplies modifiables | Should |

### Epic E4 — Calendrier

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| US-4.1 | En tant que **jardinier**, je veux **voir un calendrier mensuel** afin de **visualiser mes tâches** | • Vue mois avec points/indicateurs sur les jours • Navigation mois précédent/suivant • Jour actuel mis en évidence | Must |
| US-4.2 | En tant que **jardinier**, je veux **voir la liste des tâches du jour** afin de **savoir quoi faire** | • Liste sous le calendrier • Icônes par type (arrosage, semis, paillage, récolte…) • Tap pour détail | Must |
| US-4.3 | En tant que **jardinier**, je veux que **des tâches soient auto-générées** à partir de mes cultures afin de **gagner du temps** | • Tâches créées à l'ajout d'une culture (semis J, plantation J+30, récolte estimée) • Règles configurables par culture | Must |
| US-4.4 | En tant que **jardinier**, je veux **ajouter une tâche manuelle** afin de **personnaliser mon planning** | • FAB « + » → formulaire (type, date, récurrence optionnelle, note) • Types prédéfinis illustrés | Must |
| US-4.5 | En tant que **jardinier**, je veux **être rappelé de mes tâches** afin de **ne pas oublier** | • Badge onglet Calendrier • Bandeau accueil • **Web Push** (opt-in PWA) si installée • Fallback in-app si refus • *(Phase 2 : push natif)* | Must |
| US-4.7 | En tant qu'**utilisateur mobile**, je veux **installer l'app sur mon écran d'accueil** afin d'y accéder comme une app native | • Manifest valide • Prompt install (Android) / instructions Safari (iOS) • `display: standalone` • Icône placeholder identifiable | Must |
| US-4.8 | En tant qu'**utilisateur**, je veux **consulter mon potager hors-ligne** afin de **voir mon plan sans réseau** | • Cache IndexedDB potager + calendrier • Bandeau « Mode hors-ligne » • Écriture bloquée avec message explicite | Should |
| US-4.6 | En tant que **jardinier**, je veux **marquer une tâche comme faite** afin de **suivre ma progression** | • Swipe ou checkbox • Tâche barrée / déplacée en « terminé » • Animation de validation satisfaisante | Must |

### Epic E5 — Communauté

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| US-5.1 | En tant que **membre**, je veux **voir un fil d'actualité** afin de **m'inspirer** | • Posts triés par date • Avatar + pseudo + date • Texte + jusqu'à 4 photos • Pagination infinie | Should |
| US-5.2 | En tant que **membre**, je veux **publier un post** afin de **partager ma réussite** | • Texte (max 500 car.) + photos (caméra ou galerie) • Compression auto • Publication < 5 s | Should |
| US-5.3 | En tant que **membre**, je veux **liker et commenter** afin d'**encourager les autres** | • Like toggle • Commentaires imbriqués (1 niveau) • Compteur visible | Should |
| US-5.4 | En tant que **membre**, je veux **signaler un contenu inapproprié** afin de **protéger la communauté** | • Bouton « Signaler » sur post/commentaire • Raisons prédéfinies • Notification admin | Must |

### Epic E6 — Messagerie

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| US-6.1 | En tant qu'**utilisateur**, je veux **envoyer un message privé** afin de **coordonner un échange** | • Liste conversations • Écran chat • Envoi texte • Indicateur « en ligne » optionnel | Should |
| US-6.2 | En tant qu'**utilisateur**, je veux **être notifié d'un nouveau message** afin de **répondre rapidement** | • Push notification • Badge sur icône messagerie • Son configurable | Should |

---

## 3. Cas d'utilisation détaillés

### CU-01 — Créer son premier potager (parcours débutant)

**Acteur :** Marie (invitée)
**Précondition :** App installée, premier lancement
**Scénario nominal :**

1. Marie voit l'écran d'accueil avec « Bonjour ! » et les 4 raccourcis
2. Elle tape sur « Mon potager »
3. Un tutoriel en 3 étapes s'affiche (skippable)
4. Elle nomme son potager « Mon balcon » (grille 6×4)
5. Elle ajoute une zone « Tomates » (2×2) via le bouton « Ajouter »
6. Elle sélectionne « Tomate » dans le catalogue, variété « Cœur de bœuf »
7. Elle renseigne date de plantation
8. Le calendrier génère automatiquement les tâches
9. Un bandeau propose de créer un compte pour sauvegarder

**Scénarios alternatifs :**
- 4a. Marie refuse le tutoriel → accès direct au builder
- 6a. Culture non trouvée → option « Autre » avec saisie libre

### CU-02 — Consulter et traiter les tâches du jour

**Acteur :** Pierre (utilisateur connecté)
**Précondition :** Potager avec cultures actives

1. Pierre ouvre l'onglet « Calendrier »
2. Il voit le mois en cours avec aujourd'hui surligné
3. Sous le calendrier : « Arrosage — Tomates », « Paillage — Courgettes »
4. Il coche « Arrosage — Tomates » comme terminé
5. Animation de validation (coccinelle qui s'envole)
6. La tâche disparaît de la liste du jour

### CU-03 — Publier sur le fil communautaire

**Acteur :** Marie (utilisatrice connectée)
**Précondition :** Compte créé, profil complété

1. Marie ouvre l'onglet « Communauté »
2. Elle tape sur le FAB « + »
3. Elle rédige « Première récolte de radis ! »
4. Elle ajoute une photo depuis la galerie
5. Elle publie
6. Le post apparaît en tête du fil avec son avatar

---

## 4. Règles métier

| ID | Règle |
|----|-------|
| RM-01 | Un potager gratuit est limité à 10 cultures actives |
| RM-02 | Un potager gratuit a une grille max de 12×12 unités |
| RM-03 | Les tâches auto-générées sont recalculées si la date de plantation change |
| RM-04 | Un invité peut utiliser l'app 30 jours avant incitation forte à créer un compte |
| RM-05 | Les posts communauté gratuits sont limités à 3/mois |
| RM-06 | La géolocalisation précise n'est jamais affichée publiquement (ville/région uniquement) |
| RM-07 | Un utilisateur ne peut avoir qu'une conversation active par paire |
| RM-08 | Les images uploadées sont compressées à max 1 Mo, redimensionnées à 1200 px |
| RM-09 | Le signalement de contenu déclenche une review sous 48 h |
| RM-10 | La suppression de compte est irréversible après 30 jours de grâce |

---

## 5. États et transitions

### Culture

```
[Brouillon] → (assignation zone) → [Active] → (date récolte passée) → [Terminée]
                                      ↓
                                 (suppression) → [Supprimée]
```

### Tâche calendrier

```
[À faire] → (marquer fait) → [Terminée]
    ↓
(annuler) → [Supprimée]
```

### Annonce troc (Phase 2)

```
[Brouillon] → (publier) → [Active] → (réservée) → [Terminée]
                              ↓
                         (expirée) → [Archivée]
```

---

## 6. Contenu éditorial (seed data)

### Catalogue cultures MVP (minimum 30)

| Catégorie | Cultures |
|-----------|----------|
| Légumes | Tomate, Courgette, Carotte, Salade, Haricot, Poivron, Aubergine, Épinard, Radis, Navet, Betterave, Poireau, Oignon, Ail, Pomme de terre, Concombre, Potiron, Chou, Brocoli, Fenouil |
| Aromates | Basilic, Persil, Ciboulette, Thym, Menthe, Romarin |
| Fruits | Fraise, Framboise, Groseille |
| Fleurs | Capucine, Souci, Lavande |

Chaque culture embarque : illustration, nom FR, espacement conseillé, durée germination, durée avant récolte, types de tâches associées.

---

## 7. Maillage des écrans (navigation)

```
                    ┌─────────────┐
                    │   Accueil   │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ Mon Potager │ │  Calendrier │ │ Communauté  │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │Détail       │ │Détail tâche │ │ Détail post │
    │Culture      │ │             │ │             │
    └─────────────┘ └─────────────┘ └─────────────┘

Barre de navigation basse : Accueil | Potager | Calendrier | Communauté | Profil
FAB contextuel : + (tâche, post, zone selon écran)
```
