CREATE TABLE IF NOT EXISTS users (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id  UUID         NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_household_id ON users(household_id);
CREATE INDEX idx_users_email        ON users(email);
