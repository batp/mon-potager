# 11 — Utilisateurs de test Supabase (manuel)

> **Décision D-12** : pas d'auth anonyme ni d'inscription en ligne pour la phase de test.
> Les utilisateurs sont créés **manuellement** dans Supabase.

---

## 1. Principe

| Phase actuelle | Comportement app |
|----------------|------------------|
| **Test / dev** | Connexion email + mot de passe uniquement |
| **Comptes** | Créés à la main dans Supabase Dashboard |
| **Profils** | Table `profiles` liée à `auth.users` |
| **Plus tard** | Inscription en ligne, mode invité (D-04 reporté) |

---

## 2. Créer un utilisateur de test

### Étape A — Utilisateur Auth

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard) → votre projet
2. **Authentication → Users**
3. Cliquer **Add user → Create new user**
4. Renseigner :
   - **Email** : ex. `marie@test.monpotager.fr`
   - **Password** : mot de passe de test (min. 8 caractères)
   - **Auto Confirm User** : ✅ coché (évite la validation email)
5. **Create user**
6. Copier l'**UUID** de l'utilisateur créé (colonne `id`)

### Étape B — Profil applicatif

**Option A — Automatique (recommandé)**  
Exécuter `002_profile_trigger.sql` puis `004_backfill_profiles.sql` dans le SQL Editor.
Le trigger crée les futurs profils ; le backfill répare les users déjà créés.

**Option B — L'app le fait seule**  
Depuis la version récente, l'app appelle `ensureProfile` à la connexion et crée le profil si absent (nécessite la policy `profiles_insert` de `003`).

**Option C — Manuel**  
Insérer dans **Table Editor → profiles** :

| Champ | Exemple |
|-------|---------|
| `id` | UUID copié depuis Auth (obligatoire, même valeur) |
| `username` | `Marie` |
| `city` | `Lyon` |
| `region` | `Auvergne-Rhône-Alpes` |
| `climate_zone` | `continental` |
| `bio` | `Débutante en potager urbain` |

**SQL manuel (SQL Editor) :**

```sql
INSERT INTO profiles (id, username, city, region, climate_zone, bio)
VALUES (
  'UUID-DE-L-UTILISATEUR-AUTH',
  'Marie',
  'Lyon',
  'Auvergne-Rhône-Alpes',
  'continental',
  'Débutante en potager urbain'
);
```

---

## 3. Utilisateurs de test suggérés

| Email | Username | Profil | Usage |
|-------|----------|--------|-------|
| `marie@test.monpotager.fr` | Marie | Débutante, balcon | Parcours débutant |
| `pierre@test.monpotager.fr` | Pierre | Expert, grande parcelle | Builder avancé |
| `sophie@test.monpotager.fr` | Sophie | Ville, entraide | Communauté / messagerie |

Mot de passe : choisir un mot de passe commun de test en dev (ex. `TestPotager2026!`) — **jamais en production**.

---

## 4. Configurer l'app locale

```bash
cd /home/batp/projects/mon-potager
cp .env.example apps/web/.env.local
```

`apps/web/.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SHOW_PLACEHOLDER_BANNER=true
```

> **Important :** le fichier doit être dans `apps/web/.env.local`, pas seulement à la racine du monorepo. Next.js ne charge pas automatiquement un `.env` parent.

```bash
# Si vos clés sont dans .env à la racine :
cp .env apps/web/.env.local
npm run dev   # redémarrer le serveur après modification
```

1. Ouvrir http://localhost:3000
2. **Profil** → **Se connecter**
3. Email + mot de passe du compte créé dans Supabase
4. Accueil affiche « Bonjour Marie ! » si `username = Marie`

---

## 5. Auth Supabase à activer

**Authentication → Providers**

| Provider | Statut |
|----------|--------|
| Email | ✅ Activé |
| Confirm email | ❌ Désactivé en dev |
| Anonymous | ❌ Désactivé (phase test) |
| Google / Apple | ❌ Phase 2 |

**Authentication → URL Configuration**

| Champ | Valeur dev |
|-------|------------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/**` |

---

## 6. Trigger profil automatique (recommandé)

Exécuter `supabase/migrations/002_profile_trigger.sql` dans le SQL Editor.
À chaque nouvel utilisateur Auth, une ligne `profiles` est créée avec un username par défaut.

Ensuite, éditer le `username` dans Table Editor ou via SQL :

```sql
UPDATE profiles SET username = 'Marie', city = 'Lyon'
WHERE id = 'UUID-DE-L-UTILISATEUR';
```

---

## 7. Vérifications

- [ ] Utilisateur visible dans **Authentication → Users**
- [ ] Ligne correspondante dans **Table Editor → profiles** (même `id`)
- [ ] Connexion OK sur `/auth/login`
- [ ] Accueil personnalisé avec le `username`
- [ ] Profil affiche email + pseudo
- [ ] Déconnexion fonctionne

---

## 8. Dépannage

| Problème | Cause | Solution |
|----------|-------|----------|
| `Invalid login credentials` | Mauvais email/mdp | Vérifier dans Auth → Users |
| `Supabase non configuré` | `.env.local` manquant | Copier et renseigner les clés |
| Profil vide après login | Pas de ligne `profiles` | Exécuter `004_backfill_profiles.sql` ou se reconnecter (auto-fix app) |
| `gardens_user_id_fkey` | User Auth sans profil | Idem — profil obligatoire avant potager |
| `JWT expired` | Session expirée | Se reconnecter |
| RLS bloque la lecture profil | Policies manquantes | Vérifier migration `001` |

---

## 9. Évolution prévue

| Phase | Évolution auth |
|-------|----------------|
| **Actuel** | Comptes manuels Supabase |
| **Sprint 1+** | Inscription email en ligne |
| **Plus tard** | Mode invité anonyme (D-04) |
| **Phase 2** | Google / Apple Sign-In |

---

*Dernière mise à jour : 6 juillet 2026*
