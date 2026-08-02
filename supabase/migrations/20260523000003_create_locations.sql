CREATE TYPE location_type AS ENUM ('fridge', 'freezer', 'cupboard');

CREATE TABLE IF NOT EXISTS locations (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID          NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name          VARCHAR(255)  NOT NULL,
  type          location_type NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_locations_household_id ON locations(household_id);
