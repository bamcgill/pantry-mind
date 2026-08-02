CREATE OR REPLACE FUNCTION seed_default_locations(p_household_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO locations (household_id, name, type) VALUES
    (p_household_id, 'Fridge',   'fridge'),
    (p_household_id, 'Freezer',  'freezer'),
    (p_household_id, 'Cupboard', 'cupboard');
END;
$$ LANGUAGE plpgsql;
