# PantryMind

Know what you have. Know when it expires. Know what you can make.

## Project structure

```
pantry-mind/
├── app/                  # Expo app (React Native)
├── app-src/              # Source files to copy into app/
│   ├── services/         # Data layer — only place Supabase is imported
│   ├── theme/            # Design tokens
│   └── hooks/            # React hooks
├── supabase/
│   ├── functions/        # Edge Functions (server-side AI calls)
│   └── migrations/       # Pure SQL — runs on any Postgres host
├── packages/
│   └── types/            # Shared TypeScript types
├── .env.example          # Copy to .env and fill in keys
└── setup.sh              # Run once to scaffold the project
```

## First time setup

```bash
cp .env.example .env
# Fill in .env with your keys
bash setup.sh
```

## Running migrations

Run each file in /supabase/migrations/ in order
in the Supabase SQL editor.

## Key rules

- The app NEVER imports @supabase/supabase-js directly
- All Supabase access goes through services/
- ANTHROPIC_API_KEY lives in Edge Functions only
- All SQL is pure Postgres — no Supabase-specific syntax
- One migration per change — never edit existing migrations

## Brick status

- [x] Brick 1 — Know what you have (in build)
- [ ] Brick 2 — Know when it expires
- [ ] Brick 3 — Know what you can make
- [ ] Brick 4 — Know what to buy
