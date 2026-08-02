ALTER TABLE households          ENABLE ROW LEVEL SECURITY;
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage            ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_household_id()
RETURNS UUID AS $$
  SELECT household_id FROM users
  WHERE id = auth.uid()
  LIMIT 1
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY household_isolation ON households
  USING (id = get_household_id());
CREATE POLICY household_isolation ON users
  USING (household_id = get_household_id());
CREATE POLICY household_isolation ON locations
  USING (household_id = get_household_id());
CREATE POLICY household_isolation ON inventory_items
  USING (household_id = get_household_id());
CREATE POLICY household_isolation ON receipts
  USING (household_id = get_household_id());
CREATE POLICY household_isolation ON product_corrections
  USING (household_id = get_household_id());
CREATE POLICY household_isolation ON ai_usage
  USING (household_id = get_household_id());

CREATE POLICY product_access ON products
  USING (
    household_id IS NULL
    OR household_id = get_household_id()
  );
