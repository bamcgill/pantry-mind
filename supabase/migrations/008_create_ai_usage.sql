CREATE TABLE IF NOT EXISTS ai_usage (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id    UUID         REFERENCES receipts(id),
  household_id  UUID         REFERENCES households(id),
  model         VARCHAR(100) NOT NULL,
  input_tokens  INT          NOT NULL DEFAULT 0,
  output_tokens INT          NOT NULL DEFAULT 0,
  duration_ms   INT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_usage_household_id ON ai_usage(household_id);
CREATE INDEX idx_ai_usage_created_at   ON ai_usage(created_at);
