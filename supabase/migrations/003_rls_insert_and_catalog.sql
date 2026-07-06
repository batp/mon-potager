-- Politiques INSERT explicites + lecture catalogue public

-- Profiles (insert pour trigger / création manuelle)
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Gardens
DROP POLICY IF EXISTS "gardens_owner" ON gardens;
CREATE POLICY "gardens_select" ON gardens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "gardens_insert" ON gardens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gardens_update" ON gardens FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "gardens_delete" ON gardens FOR DELETE USING (auth.uid() = user_id);

-- Zones
DROP POLICY IF EXISTS "zones_owner" ON zones;
CREATE POLICY "zones_all" ON zones FOR ALL
  USING (garden_id IN (SELECT id FROM gardens WHERE user_id = auth.uid()))
  WITH CHECK (garden_id IN (SELECT id FROM gardens WHERE user_id = auth.uid()));

-- Crops
DROP POLICY IF EXISTS "crops_owner" ON crops;
CREATE POLICY "crops_all" ON crops FOR ALL
  USING (zone_id IN (
    SELECT z.id FROM zones z JOIN gardens g ON z.garden_id = g.id WHERE g.user_id = auth.uid()
  ))
  WITH CHECK (zone_id IN (
    SELECT z.id FROM zones z JOIN gardens g ON z.garden_id = g.id WHERE g.user_id = auth.uid()
  ));

-- Catalogue lecture publique (authentifié)
ALTER TABLE crop_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crop_catalog_read" ON crop_catalog FOR SELECT TO authenticated USING (true);

-- Seed catalogue (idempotent via ON CONFLICT sur name_fr si index unique - use insert where not exists)
INSERT INTO crop_catalog (name_fr, category, spacing_cm, days_to_germinate, days_to_harvest)
SELECT * FROM (VALUES
  ('Tomate', 'legume', 50, 7, 90),
  ('Courgette', 'legume', 80, 7, 60),
  ('Carotte', 'legume', 5, 14, 75),
  ('Salade', 'legume', 25, 7, 45),
  ('Haricot', 'legume', 30, 7, 55),
  ('Basilic', 'aromate', 20, 7, 40),
  ('Fraise', 'fruit', 30, 14, 90),
  ('Radis', 'legume', 3, 4, 30)
) AS v(name_fr, category, spacing_cm, days_to_germinate, days_to_harvest)
WHERE NOT EXISTS (SELECT 1 FROM crop_catalog LIMIT 1);
