CREATE TYPE removal_reason AS ENUM ('consumed', 'removed', 'expired', 'wasted');

CREATE TABLE IF NOT EXISTS inventory_items (
  id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id   UUID           NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  product_id     UUID           NOT NULL REFERENCES products(id),
  location_id    UUID           NOT NULL REFERENCES locations(id),
  added_by       UUID           REFERENCES users(id),
  quantity       DECIMAL(10,3)  NOT NULL DEFAULT 1,
  unit           VARCHAR(50)    NOT NULL DEFAULT 'each',
  portion_count  INT,
  notes          TEXT,
  expires_at     DATE,
  added_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  removed_at     TIMESTAMPTZ,
  removal_reason removal_reason
);
CREATE INDEX idx_inventory_household_id ON inventory_items(household_id);
CREATE INDEX idx_inventory_product_id   ON inventory_items(product_id);
CREATE INDEX idx_inventory_location_id  ON inventory_items(location_id);
CREATE INDEX idx_inventory_removed_at   ON inventory_items(removed_at);
