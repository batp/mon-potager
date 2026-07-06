-- Mon Potager — schéma initial
-- Voir doc/06-modele-donnees.md pour le dictionnaire complet

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

-- RLS (extrait — voir doc pour politiques complètes)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE gardens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gardens_owner" ON gardens FOR ALL USING (auth.uid() = user_id);

ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "zones_owner" ON zones FOR ALL
  USING (garden_id IN (SELECT id FROM gardens WHERE user_id = auth.uid()));

ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crops_owner" ON crops FOR ALL
  USING (zone_id IN (
    SELECT z.id FROM zones z JOIN gardens g ON z.garden_id = g.id WHERE g.user_id = auth.uid()
  ));

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_owner" ON tasks FOR ALL USING (auth.uid() = user_id);
