# 10 — Conformité, sécurité & RGPD

## 1. Cadre réglementaire applicable

| Réglementation | Applicabilité | Action requise |
|----------------|---------------|----------------|
| **RGPD** (UE) | Oui — utilisateurs FR, BE, UE | Conformité complète |
| **Loi 25** (Québec) | Oui — si utilisateurs CA francophones | Principes similaires RGPD |
| **LCEN** (France) | Oui — hébergement contenu utilisateur | Modération, identifié éditeur |
| **Apple App Store Guidelines** | Phase 2 (app mobile) | Privacy nutrition labels, UGC modération |
| **Google Play Policies** | Phase 2 (app mobile) | Data safety form, permissions justifiées |
| **ePrivacy** | Oui — cookies/traceurs | Bandeau consentement si analytics |
| **DSA** (Digital Services Act) | Oui — plateforme UGC (> 45M users : non, mais bonnes pratiques) | Point de contact, modération |

---

## 2. Données personnelles collectées

| Donnée | Finalité | Base légale | Durée conservation | Obligatoire |
|--------|----------|-------------|-------------------|-------------|
| Email | Authentification, communication | Contrat | Durée du compte + 30j | Non (invité) |
| Mot de passe (hashé) | Authentification | Contrat | Durée du compte | Non |
| Pseudo | Identification communauté | Contrat | Durée du compte | Oui (si compte) |
| Avatar (photo) | Profil public | Consentement | Durée du compte | Non |
| Ville/région | Suggestions climatiques, proximité | Intérêt légitime | Durée du compte | Non |
| Géolocalisation précise | Troc, gardiennage (Phase 2) | Consentement explicite | Session | Non |
| Données potager | Fonctionnalité cœur | Contrat | Durée du compte | Oui |
| Posts/commentaires | Fonctionnalité sociale | Contrat | Durée du compte | Non |
| Messages privés | Messagerie | Contrat | Durée du compte | Non |
| Token push / Web Push | Notifications (Phase 2) | Consentement | Durée du compte | Non |
| Logs techniques | Sécurité, debug | Intérêt légitime | 90 jours | Automatique |
| Données analytics | Amélioration produit | Consentement | 13 mois | Non |

---

## 3. Droits des utilisateurs (RGPD)

| Droit | Implémentation | Échéance |
|-------|----------------|----------|
| **Accès** (Art. 15) | Export JSON depuis profil → « Télécharger mes données » | MVP |
| **Rectification** (Art. 16) | Édition profil, cultures, posts | MVP |
| **Effacement** (Art. 17) | Suppression compte + cascade 30j | MVP |
| **Portabilité** (Art. 20) | Export JSON structuré | MVP |
| **Opposition** (Art. 21) | Opt-out analytics, notifications | MVP |
| **Limitation** (Art. 18) | Gel du compte (manuel, support) | Post-MVP |
| **Retrait consentement** | Toggle géoloc, notifications, analytics | MVP |

### Parcours suppression de compte

```
Profil → Paramètres → « Supprimer mon compte »
    → Avertissement (données perdues après 30j)
    → Option « Exporter mes données » (JSON)
    → Confirmation (saisie « SUPPRIMER »)
    → Compte désactivé immédiatement
    → Suppression définitive après 30 jours (cron)
    → Email de confirmation
```

---

## 4. Documents légaux requis

| Document | Statut | Responsable |
|----------|--------|-------------|
| Politique de confidentialité | À rédiger | Porteur projet + avocat (recommandé) |
| Conditions Générales d'Utilisation (CGU) | À rédiger | Porteur projet + avocat |
| Mentions légales | À rédiger | Porteur projet |
| Politique cookies/traceurs | À rédiger (si analytics) | Porteur projet |

**Emplacement in-app :** Profil → Paramètres → Section « Légal »

---

## 5. Sécurité technique

### 5.1 Mesures implémentées

| Mesure | Détail |
|--------|--------|
| Chiffrement en transit | TLS 1.3 (HTTPS/WSS) |
| Chiffrement au repos | AES-256 (Supabase default) |
| Authentification | JWT + refresh token, Supabase Auth |
| Autorisation | Row Level Security (RLS) sur toutes les tables |
| Mots de passe | Hashés bcrypt (Supabase Auth) |
| Clés API | `anon` key côté client uniquement, `service_role` en Edge Functions |
| Upload fichiers | Validation MIME, taille max, scan (Supabase Storage) |
| Rate limiting | Configuré sur Supabase (100 req/s par IP) |
| Injection SQL | PostgREST paramétrisé (pas de SQL brut côté client) |
| XSS | Échappement React Native par défaut |

### 5.2 Mesures post-MVP

| Mesure | Priorité |
|--------|----------|
| Audit de sécurité externe | Phase 2 |
| 2FA pour les comptes | Phase 3 |
| Chiffrement E2E messagerie | Phase 3 (si demandé) |
| WAF (Web Application Firewall) | Si trafic > 100k MAU |
| Bug bounty program | Phase 4 |

---

## 6. Modération du contenu (UGC)

L'app héberge du contenu généré par les utilisateurs (posts, commentaires, messages, annonces).

### Processus de modération

```
Contenu publié → Filtre automatique (mots interdits)
    → Visible dans le fil
    → Utilisateur signale → Queue modération
    → Review humaine < 48h
    → Action : maintenir / supprimer / avertir / bannir
```

### Règles communautaires (résumé CGU)

- Pas de contenu illicite, haineux, ou discriminatoire
- Pas de spam ou publicité non autorisée
- Pas de fausses informations dangereuses (ex. pesticides interdits)
- Respect de la vie privée (pas de photos de tiers sans consentement)
- Les conseils jardinage sont partagés de bonne foi (disclaimer : pas de garantie)

---

## 7. Permissions navigateur (MVP web)

| Permission | Justification | Moment de demande | Obligatoire |
|------------|---------------|-------------------|-------------|
| **Notifications web (PWA)** | Rappels calendrier, messages | Au premier opt-in Web Push | Non |
| **Fichiers locaux** (`<input type="file">`) | Photos posts, avatar | À la première utilisation | Non |
| **Géolocalisation** | Troc proximité (Phase 2) | À la première recherche troc | Non |
| **Cookies** | Session auth, analytics | Bandeau consentement | Session auth : oui |

**Principe :** pas de demande de permission au chargement de la page.

---

## 8. Privacy Nutrition Labels (Apple) — Phase 2

*Reporté à la soumission App Store (application mobile native).*

---

## 9. Data Safety (Google Play) — Phase 2

*Reporté à la soumission Google Play (application mobile native).*

---

## 10. Sous-traitants (processors)

| Sous-traitant | Service | Localisation données | DPA signé |
|---------------|---------|---------------------|-----------|
| Supabase Inc. | BDD, Auth, Storage | EU (Francfort) | Oui (DPA standard) |
| Vercel Inc. | Hébergement web, CDN | EU/US | Oui (DPA standard) |
| Sentry | Error monitoring | US (EU option) | Oui (DPA standard) |
| Expo *(Phase 2)* | Build mobile, push | US/EU | À vérifier |

**Action :** Registre des traitements (Article 30 RGPD) à tenir à jour.

---

## 11. DPO & contact

| Rôle | Statut MVP | Contact |
|------|------------|---------|
| Responsable de traitement | Porteur projet (à désigner) | — |
| DPO | Non obligatoire (< 250 employés, pas de données sensibles) | — |
| Contact privacy | Email dédié requis | `privacy@monpotager.app` (à créer) |

---

## 12. Checklist conformité pré-lancement

- [ ] Politique de confidentialité rédigée et accessible in-app
- [ ] CGU rédigées et acceptées à l'inscription
- [ ] Mentions légales (éditeur, hébergeur)
- [ ] Registre des traitements complété
- [ ] DPA signés avec sous-traitants
- [ ] Parcours suppression de compte fonctionnel
- [ ] Export données fonctionnel
- [ ] Bandeau consentement cookies (si analytics)
- [ ] Filtre modération automatique actif
- [ ] Tests sécurité RLS (tentative accès données autrui)
- [ ] Pas de clé `service_role` dans le code client
- [ ] Bandeau « version beta » visible (placeholders)
