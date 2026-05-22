CREATE TABLE IF NOT EXISTS product_corrections (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id      UUID        NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
  household_id    UUID        NOT NULL REFERENCES households(id),
  product_id      UUID        REFERENCES products(id),
  field_corrected VARCHAR(50) NOT NULL,
  ai_value        TEXT,
  user_value      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_corrections_household_id ON product_corrections(household_id);
CREATE INDEX idx_corrections_product_id   ON product_corrections(product_id);
