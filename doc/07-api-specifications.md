# 07 — Spécifications API

## 1. Vue d'ensemble

L'application utilise principalement le **client Supabase JS** qui expose les opérations CRUD via PostgREST. Les Edge Functions couvrent les cas métier complexes.

**Base URL :** `https://<project-ref>.supabase.co`
**Auth :** Bearer JWT (header `Authorization`)
**Format :** JSON

---

## 2. Authentification

### POST /auth/v1/signup (anonyme)

```json
// Request
{ "data": {} }

// Response 200
{
  "access_token": "eyJ...",
  "refresh_token": "...",
  "user": { "id": "uuid", "is_anonymous": true }
}
```

### POST /auth/v1/signup (email)

```json
// Request
{
  "email": "marie@example.com",
  "password": "securePassword123",
  "data": { "username": "marie_jardin" }
}
```

### POST /auth/v1/token?grant_type=password (login)

```json
// Request
{ "email": "marie@example.com", "password": "securePassword123" }
```

### POST /auth/v1/user/convert (invité → compte)

Migration des données de l'utilisateur anonyme vers le nouveau compte.

---

## 3. Endpoints REST (PostgREST)

### 3.1 Profils

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/profiles?id=eq.{id}` | Lire un profil |
| PATCH | `/rest/v1/profiles?id=eq.{id}` | Modifier son profil |
| DELETE | `/rest/v1/profiles?id=eq.{id}` | Supprimer son compte |

### 3.2 Potagers

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/gardens?user_id=eq.{uid}` | Lister ses potagers |
| POST | `/rest/v1/gardens` | Créer un potager |
| PATCH | `/rest/v1/gardens?id=eq.{id}` | Modifier un potager |
| DELETE | `/rest/v1/gardens?id=eq.{id}` | Supprimer un potager |

**Créer un potager :**
```json
// POST /rest/v1/gardens
{
  "name": "Mon balcon",
  "grid_width": 6,
  "grid_height": 4
}

// Response 201
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Mon balcon",
  "grid_width": 6,
  "grid_height": 4,
  "created_at": "2026-07-06T10:00:00Z"
}
```

### 3.3 Zones

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/zones?garden_id=eq.{gid}` | Zones d'un potager |
| POST | `/rest/v1/zones` | Ajouter une zone |
| PATCH | `/rest/v1/zones?id=eq.{id}` | Déplacer/redimensionner |
| DELETE | `/rest/v1/zones?id=eq.{id}` | Supprimer une zone |

### 3.4 Cultures

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/crops?zone_id=eq.{zid}` | Cultures d'une zone |
| POST | `/rest/v1/crops` | Ajouter une culture |
| PATCH | `/rest/v1/crops?id=eq.{id}` | Modifier une culture |
| DELETE | `/rest/v1/crops?id=eq.{id}` | Supprimer (soft delete) |
| GET | `/rest/v1/crop_catalog` | Catalogue de référence |

**Ajouter une culture :**
```json
// POST /rest/v1/crops
{
  "zone_id": "uuid",
  "catalog_id": 1,
  "variety": "Cœur de bœuf",
  "plant_date": "2026-05-15",
  "sow_date": "2026-04-01",
  "quantity": 6
}
```

### 3.5 Tâches (calendrier)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/tasks?user_id=eq.{uid}&due_date=gte.{start}&due_date=lte.{end}` | Tâches par période |
| POST | `/rest/v1/tasks` | Créer une tâche manuelle |
| PATCH | `/rest/v1/tasks?id=eq.{id}` | Modifier / marquer terminée |
| DELETE | `/rest/v1/tasks?id=eq.{id}` | Supprimer une tâche |

**Marquer terminée :**
```json
// PATCH /rest/v1/tasks?id=eq.{id}
{ "completed_at": "2026-07-06T08:30:00Z" }
```

### 3.6 Communauté

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/posts?order=created_at.desc&limit=20&offset=0` | Fil paginé |
| POST | `/rest/v1/posts` | Publier un post |
| DELETE | `/rest/v1/posts?id=eq.{id}` | Supprimer son post |
| POST | `/rest/v1/post_likes` | Liker |
| DELETE | `/rest/v1/post_likes?post_id=eq.{pid}&user_id=eq.{uid}` | Unliker |
| GET | `/rest/v1/comments?post_id=eq.{pid}` | Commentaires |
| POST | `/rest/v1/comments` | Commenter |
| POST | `/rest/v1/reports` | Signaler |

### 3.7 Messagerie

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/conversations` | Mes conversations |
| POST | `/rest/v1/conversations` | Démarrer une conversation |
| GET | `/rest/v1/messages?conversation_id=eq.{cid}&order=created_at` | Messages |
| POST | `/rest/v1/messages` | Envoyer un message |

**Realtime subscription :**
```javascript
supabase
  .channel(`messages:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe();
```

---

## 4. Edge Functions

### 4.1 `generate-tasks`

**Déclencheur :** Appelé après création/modification d'une culture

```typescript
// POST /functions/v1/generate-tasks
// Body: { crop_id: "uuid" }

// Logique :
// 1. Lire crop + catalog.task_templates
// 2. Calculer dates à partir de plant_date/sow_date
// 3. Insérer tasks pour le user_id
// 4. Retourner les tâches créées
```

### 4.2 `send-push-notifications`

**Déclencheur :** Cron quotidien (06:00 UTC)

```typescript
// Logique :
// 1. SELECT tasks WHERE due_date = CURRENT_DATE AND completed_at IS NULL
// 2. JOIN push_tokens pour chaque user
// 3. Envoyer via expo-server-sdk
// 4. Logger les envois
```

### 4.3 `upload-image`

**Déclencheur :** Avant upload post/avatar

```typescript
// POST /functions/v1/upload-image
// Body: FormData (file)
// Response: { url: "https://...supabase.co/storage/..." }
// Logique : resize max 1200px, compress quality 80%
```

### 4.4 `convert-anonymous-user`

**Déclencheur :** Inscription depuis mode invité

```typescript
// POST /functions/v1/convert-anonymous-user
// Body: { email, password, username }
// Logique :
// 1. Créer compte email
// 2. Transférer gardens, tasks, posts de l'UID anonyme
// 3. Supprimer session anonyme
```

---

## 5. Storage (Supabase)

| Bucket | Accès | Taille max | Types |
|--------|-------|------------|-------|
| `avatars` | Public read, owner write | 2 Mo | jpg, png, webp |
| `posts` | Public read, owner write | 5 Mo/fichier | jpg, png, webp |
| `gardens` | Owner only | 2 Mo | jpg, png (export) |

**Convention de nommage :** `{user_id}/{timestamp}_{random}.{ext}`

---

## 6. Codes d'erreur

| Code | Signification | Action client |
|------|---------------|---------------|
| 400 | Validation échouée | Afficher message utilisateur |
| 401 | Non authentifié | Rediriger vers login |
| 403 | RLS violation | Message « Accès refusé » |
| 404 | Ressource introuvable | Retour écran précédent |
| 409 | Conflit (username pris) | Suggérer alternative |
| 413 | Image trop grande | Proposer compression |
| 429 | Rate limit | Retry après délai |
| 500 | Erreur serveur | Message générique + Sentry |

---

## 7. Pagination

```
GET /rest/v1/posts?order=created_at.desc&limit=20&offset=0
Header: Prefer: count=exact

Response Header: Content-Range: 0-19/156
```

---

## 8. Webhooks (futur)

| Événement | Usage |
|-----------|-------|
| `user.created` | Analytics, email bienvenue |
| `post.reported` | Notification modérateur |
| `subscription.activated` | Activer premium (Stripe) |
