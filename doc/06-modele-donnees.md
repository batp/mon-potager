# 06 — Modèle de données

## 1. Diagramme entité-relation

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   profiles   │       │   gardens    │       │    zones     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK, FK)  │──1:N─▶│ id (PK)      │──1:N─▶│ id (PK)      │
│ username     │       │ user_id (FK) │       │ garden_id(FK)│
│ avatar_url   │       │ name         │       │ name         │
│ bio          │       │ grid_width   │       │ x, y         │
│ city         │       │ grid_height  │       │ width, height│
│ region       │       │ created_at   │       │ color        │
│ climate_zone │       └──────────────┘       └──────┬───────┘
│ is_premium   │                                     │ 1:1
│ created_at   │                                     ▼
└──────┬───────┘                              ┌──────────────┐
       │                                      │    crops     │
       │                                      ├──────────────┤
       │                                      │ id (PK)      │
       │                                      │ zone_id (FK) │
       │                                      │ catalog_id   │
       │                                      │ variety      │
       │                                      │ sow_date     │
       │                                      │ plant_date   │
       │                                      │ quantity     │
       │                                      │ notes        │
       │                                      │ status       │
       │                                      └──────┬───────┘
       │                                             │ 1:N
       │                                             ▼
       │                                      ┌──────────────┐
       │                                      │    tasks     │
       │                                      ├──────────────┤
       │                                      │ id (PK)      │
       │                                      │ user_id (FK) │
       │                                      │ crop_id (FK?)│
       │                                      │ type         │
       │                                      │ title        │
       │                                      │ due_date     │
       │                                      │ completed_at │
       │                                      │ is_recurring │
       │                                      └──────────────┘
       │
       │ 1:N   ┌──────────────┐       ┌──────────────┐
       ├──────▶│    posts     │──1:N─▶│  comments    │
       │       ├──────────────┤       ├──────────────┤
       │       │ id (PK)      │       │ id (PK)      │
       │       │ user_id (FK) │       │ post_id (FK) │
       │       │ content      │       │ user_id (FK) │
       │       │ images[]     │       │ content      │
       │       │ likes_count  │       │ created_at   │
       │       │ created_at   │       └──────────────┘
       │       └──────────────┘
       │
       │       ┌──────────────┐       ┌──────────────┐
       │       │ conversations│──1:N─▶│   messages   │
       │       ├──────────────┤       ├──────────────┤
       │       │ id (PK)      │       │ id (PK)      │
       │       │ participant_a│       │ conv_id (FK) │
       │       │ participant_b│       │ sender_id    │
       │       │ updated_at   │       │ content      │
       │       └──────────────┘       │ read_at      │
       │                              │ created_at   │
       │                              └──────────────┘
       │
       │       ┌──────────────┐
       │       │ crop_catalog │  (table de référence, seed)
       │       ├──────────────┤
       │       │ id (PK)      │
       │       │ name_fr      │
       │       │ category     │
       │       │ illustration │
       │       │ spacing_cm   │
       │       │ days_to_harv │
       │       │ task_template│
       │       └──────────────┘
       │
       │       ┌──────────────┐       ┌──────────────┐
       │       │   listings   │       │  sit_requests│  (Phase 2)
       │       │  (troc P2)   │       │ (gardiennage)│
       │       └──────────────┘       └──────────────┘
       │
       │       ┌──────────────┐
       └──────▶│ push_tokens  │
               ├──────────────┤
               │ user_id (FK) │
               │ token        │
               │ platform     │
               └──────────────┘
```

---

## 2. Schéma SQL (PostgreSQL / Supabase)

```sql
-- ============================================
-- PROFILES (extension de auth.users)
-- ============================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  avatar_url  TEXT,
  bio         TEXT CHECK (char_length(bio) <= 280),
  city        TEXT,
  region      TEXT,
  climate_zone TEXT CHECK (climate_zone IN ('oceanic','continental','mediterranean','northern'))
                DEFAULT 'oceanic',
  is_premium  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- GARDENS
-- ============================================
CREATE TABLE gardens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL CHECK (char_length(name) <= 100),
  grid_width  INT NOT NULL CHECK (grid_width BETWEEN 4 AND 20),
  grid_height INT NOT NULL CHECK (grid_height BETWEEN 4 AND 20),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_gardens_user ON gardens(user_id);

-- ============================================
-- ZONES (planches dans le potager)
-- ============================================
CREATE TABLE zones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garden_id   UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  x           INT NOT NULL CHECK (x >= 0),
  y           INT NOT NULL CHECK (y >= 0),
  width       INT NOT NULL CHECK (width >= 1),
  height      INT NOT NULL CHECK (height >= 1),
  color       TEXT DEFAULT '#7BAE7F',
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_zones_garden ON zones(garden_id);

-- ============================================
-- CROP CATALOG (référentiel)
-- ============================================
CREATE TABLE crop_catalog (
  id              SERIAL PRIMARY KEY,
  name_fr         TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('legume','aromate','fruit','fleur')),
  illustration_url TEXT,
  spacing_cm      INT,
  days_to_germinate INT,
  days_to_harvest INT,
  task_templates  JSONB DEFAULT '[]'
);

-- ============================================
-- CROPS (cultures utilisateur)
-- ============================================
CREATE TABLE crops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id     UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  catalog_id  INT REFERENCES crop_catalog(id),
  custom_name TEXT,
  variety     TEXT,
  sow_date    DATE,
  plant_date  DATE,
  quantity    INT CHECK (quantity > 0),
  notes       TEXT CHECK (char_length(notes) <= 2000),
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','completed','deleted')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_crops_zone ON crops(zone_id);

-- ============================================
-- TASKS (calendrier)
-- ============================================
CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  crop_id       UUID REFERENCES crops(id) ON DELETE SET NULL,
  type          TEXT NOT NULL CHECK (type IN ('sowing','planting','watering','mulching','soil_work','harvesting','custom')),
  title         TEXT NOT NULL,
  description   TEXT,
  due_date      DATE NOT NULL,
  completed_at  TIMESTAMPTZ,
  is_recurring  BOOLEAN DEFAULT FALSE,
  recurrence    JSONB,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tasks_user_date ON tasks(user_id, due_date);

-- ============================================
-- POSTS (communauté)
-- ============================================
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 500),
  images      TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- ============================================
-- POST LIKES
-- ============================================
CREATE TABLE post_likes (
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- ============================================
-- COMMENTS
-- ============================================
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) <= 300),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id);

-- ============================================
-- CONVERSATIONS & MESSAGES
-- ============================================
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_b   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (participant_a, participant_b)
);

CREATE TABLE messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content           TEXT NOT NULL CHECK (char_length(content) <= 1000),
  read_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at);

-- ============================================
-- PUSH TOKENS
-- ============================================
CREATE TABLE push_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token       TEXT NOT NULL,
  platform    TEXT CHECK (platform IN ('ios','android')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, token)
);

-- ============================================
-- REPORTS (modération)
-- ============================================
CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  target_type TEXT NOT NULL CHECK (target_type IN ('post','comment','user')),
  target_id   UUID NOT NULL,
  reason      TEXT NOT NULL,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed')),
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Politiques RLS (Row Level Security)

```sql
-- Profiles : lecture publique, écriture propriétaire
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Gardens : propriétaire uniquement
ALTER TABLE gardens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own gardens" ON gardens FOR ALL USING (auth.uid() = user_id);

-- Zones : via garden ownership
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own zones" ON zones FOR ALL
  USING (garden_id IN (SELECT id FROM gardens WHERE user_id = auth.uid()));

-- Crops : via zone → garden ownership
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own crops" ON crops FOR ALL
  USING (zone_id IN (
    SELECT z.id FROM zones z JOIN gardens g ON z.garden_id = g.id WHERE g.user_id = auth.uid()
  ));

-- Tasks : propriétaire
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

-- Posts : lecture publique, écriture authentifiée
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Messages : participants uniquement
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON messages FOR SELECT
  USING (conversation_id IN (
    SELECT id FROM conversations WHERE participant_a = auth.uid() OR participant_b = auth.uid()
  ));
```

---

## 4. Dictionnaire de données

| Table | Champ | Type | Description |
|-------|-------|------|-------------|
| profiles | climate_zone | enum | Zone climatique pour suggestions de dates |
| gardens | grid_width/height | int | Dimensions de la grille en unités |
| zones | x, y, width, height | int | Position et taille sur la grille |
| crops | task_templates | jsonb | Modèle de tâches auto-générées |
| tasks | type | enum | Type de tâche jardinage |
| tasks | recurrence | jsonb | `{ "frequency": "weekly", "interval": 3 }` |
| posts | images | text[] | URLs Supabase Storage |
| crop_catalog | task_templates | jsonb | `[{"type":"watering","offset_days":7,"title":"Arrosage"}]` |

---

## 5. Volumétrie estimée (12 mois)

| Table | Volume estimé |
|-------|---------------|
| profiles | 10 000 |
| gardens | 15 000 |
| zones | 60 000 |
| crops | 80 000 |
| tasks | 500 000 |
| posts | 50 000 |
| messages | 200 000 |

Stockage images estimé : ~50 Go (compression incluse)
