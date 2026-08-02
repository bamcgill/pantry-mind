CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS products (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id     UUID          REFERENCES households(id) ON DELETE CASCADE,
  name             VARCHAR(255)  NOT NULL,
  brand            VARCHAR(255),
  category         VARCHAR(100),
  barcode          VARCHAR(50),
  default_location location_type,
  is_custom        BOOLEAN       NOT NULL DEFAULT FALSE,
  created_by       UUID          REFERENCES users(id),
  image_url        TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_products_household_id ON products(household_id);
CREATE INDEX idx_products_barcode      ON products(barcode);
CREATE INDEX idx_products_name_trgm    ON products USING GIN (name gin_trgm_ops);
