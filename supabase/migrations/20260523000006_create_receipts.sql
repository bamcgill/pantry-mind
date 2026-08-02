CREATE TYPE receipt_status AS ENUM ('pending', 'parsed', 'confirmed', 'failed', 'rejected');

CREATE TABLE IF NOT EXISTS receipts (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID           NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  uploaded_by   UUID           REFERENCES users(id),
  image_url     TEXT           NOT NULL,
  parsed_raw    JSONB,
  status        receipt_status NOT NULL DEFAULT 'pending',
  item_count    INT,
  confirmed_at  TIMESTAMPTZ,
  confirmed_by  UUID           REFERENCES users(id),
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_receipts_household_id ON receipts(household_id);
CREATE INDEX idx_receipts_status       ON receipts(status);
