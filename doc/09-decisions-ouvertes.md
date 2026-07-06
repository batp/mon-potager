# 09 — Décisions & questions ouvertes

## 1. Décisions validées

| # | Date | Décision | Contexte | Décideur |
|---|------|----------|----------|----------|
| D-01 | 2026-07-06 | MVP en 3 mois, équipe 1-2 devs | Contrainte budget/temps | Porteur projet |
| D-02 | 2026-07-06 | Zone francophonie au lancement | Marché cible | Porteur projet |
| D-03 | 2026-07-06 | Modèle freemium | Monétisation | Porteur projet |
| D-04 | 2026-07-06 | Mode invité prioritaire | Réduire friction onboarding | Porteur projet |
| D-05 | 2026-07-06 | Stack Supabase (backend) | Recommandation technique | Équipe technique |
| D-06 | 2026-07-06 | Français uniquement en MVP | i18n prête pour extension | Équipe technique |
| D-07 | 2026-07-06 | **MVP = PWA web** (installable, responsive) | Tests proches du mobile réel | Porteur projet |
| D-08 | 2026-07-06 | **Placeholders temporaires identifiés** | Pas de budget illustrations au lancement | Porteur projet |
| D-09 | 2026-07-06 | Stack frontend Next.js 15 + Tailwind | Adaptation au pivot web | Équipe technique |
| D-10 | 2026-07-06 | Apps mobiles natives → Phase 2 | Expo React Native reporté | Équipe technique |
| D-11 | 2026-07-06 | **MVP = PWA** (installable, offline basique, Web Push) | Tests en conditions proches du mobile réel | Porteur projet |

---

## 2. Questions ouvertes — À trancher

### 🔴 Bloquantes (avant Sprint 1)

| # | Question | Options | Impact | Recommandation |
|---|----------|---------|--------|----------------|
| Q-01 | **Nom de domaine et identité légale ?** | SAS, auto-entrepreneur, association | RGPD, facturation, URL publique | Réserver domaine dès Sprint 1 |
| ~~Q-02~~ | ~~Budget illustrations ?~~ | — | — | **Tranché : placeholders MVP (D-08)** |
| Q-03 | **Hébergement Supabase : région ?** | EU (Francfort), EU (Paris si dispo) | RGPD, latence | EU Francfort (rgpd-compliant) |
| ~~Q-04~~ | ~~Comptes développeur Apple/Google ?~~ | — | — | **Reporté Phase 2 (mobile natif)** |

### 🟡 Importantes (avant Sprint 3)

| # | Question | Options | Impact | Recommandation |
|---|----------|---------|--------|----------------|
| Q-05 | **Tarif premium ?** | 3,99 / 4,99 / 6,99 €/mois | Revenus, conversion | 4,99 €/mois (phase 2) |
| Q-06 | **Limite potagers gratuits ?** | 1 / 2 / 3 | Freemium balance | 1 potager, 10 cultures |
| Q-07 | **Modération communauté ?** | Manuelle, auto (filtre mots), hybride | Coût ops, sécurité | Hybride : filtre auto + review manuelle signalements |
| Q-08 | **Contenu « Conseil du jour » ?** | Éditorial interne, API externe, communauté | Coût contenu | Éditorial interne, 30 conseils pré-écrits |
| Q-09 | **Données de référence cultures ?** | Compiler soi-même, licence (Gardenize), partenariat pépinière | Qualité données | Compiler + validation jardinier expert |

### 🟢 Secondaires (post-MVP)

| # | Question | Options | Impact |
|---|----------|---------|--------|
| Q-10 | Partenariats (pépinières, AMAP, LPO) ? | Oui / Non / Plus tard | Acquisition |
| Q-11 | Gamification (badges, streaks) ? | Oui / Non | Engagement |
| Q-12 | Carte interactive pour le troc ? | Mapbox / Google Maps / Liste | Coût, UX |
| Q-13 | Chatbot conseil jardinage (IA) ? | Oui / Non | Coût API, valeur |
| Q-14 | Version tablette dédiée ou responsive ? | Responsive seul / Layout tablette | Effort design |
| Q-15 | Open source partiel ? | Oui / Non | Communauté dev |

---

## 3. Questions complémentaires à poser au porteur de projet

### Business & produit

1. Avez-vous un nom de domaine réservé (ex. `monpotager.app`) ?
2. Existe-t-il déjà une communauté (réseaux sociaux, newsletter) à migrer ?
3. Quel est le budget total alloué (dev + design + infra + marketing) ?
4. Y a-t-il un jardinier expert / botaniste dans l'équipe pour valider le catalogue ?
5. Souhaitez-vous une landing page web en parallèle du MVP ?

### Technique

6. Avez-vous des préférences d'hébergeur (OVH, Scaleway, Supabase cloud) ?
7. Faut-il prévoir une console d'administration (modération, stats) ?
8. Quel niveau de analytics souhaitez-vous (Matomo, PostHog, Firebase Analytics) ?
9. L'app doit-elle fonctionner sans connexion internet (mode offline) ?
10. Y a-t-il des intégrations tierces prévues (météo, paiement, carte) ?

### Design & contenu

11. Avez-vous déjà un illustrateur ou des assets graphiques ?
12. Le personnage « jardinier » de l'accueil a-t-il un nom/identité (mascotte) ?
13. Faut-il prévoir un ton humoristique ou strictement informatif ?
14. Souhaitez-vous des vidéos tutorielles intégrées ?

### Légal & conformité

15. Êtes-vous assujetti RGPD (entreprise UE) ?
16. Faut-il une CGU/CGV rédigées par un avocat ?
17. L'app cible-t-elle des mineurs (COPPA, consentement parental) ?
18. Comment gérer la responsabilité sur les conseils communautaires (disclaimer) ?

---

## 4. Hypothèses actives

Ces hypothèses guident les specs en l'absence de réponse. Elles seront mises à jour dès validation.

| # | Hypothèse | Confiance |
|---|-----------|-----------|
| H-01 | L'utilisateur cible a un smartphone récent (≤ 3 ans) | Élevée |
| H-02 | Le français est suffisant pour le lancement francophone | Élevée |
| H-03 | Le mode invité convertit 15-20 % en comptes créés | Moyenne |
| H-04 | Le builder grille 2D est plus intuitif qu'une liste pour les débutants | Élevée |
| H-05 | Les notifications push sont acceptées par ≥ 60 % des utilisateurs | Moyenne |
| H-06 | Le troc géolocalisé sera la 2e fonctionnalité la plus demandée | Moyenne |
| H-07 | Un seul développeur peut livrer le MVP Must en 10 semaines | Moyenne |

---

## 5. Log des changements

| Date | Changement | Auteur |
|------|------------|--------|
| 2026-07-06 | Création initiale de la documentation | Agent IA |
| 2026-07-06 | **Pivot PWA** (web installable, responsive conservé) | Porteur projet |

---

## 6. Prochaines validations attendues

- [ ] **Q-01, Q-03** : avant démarrage Sprint 1 (semaine 1)
- [ ] **Q-05 à Q-09** : avant Sprint 3 (semaine 5)
- [ ] Wireframes validés : avant Sprint 2 (semaine 3)
- [ ] Catalogue cultures validé par expert : avant Sprint 2 (semaine 3)
