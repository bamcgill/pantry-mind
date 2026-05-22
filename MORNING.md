# Monday Morning Checklist

Paste these commands one at a time. Confirm each works before moving to the next.

## 1. Clone the repo
```bash
git clone git@github.com:barry/pantry-mind.git
cd pantry-mind
```

## 2. Environment
```bash
cp .env.example .env
# Open .env in editor and fill in:
# - EXPO_PUBLIC_SUPABASE_URL
# - EXPO_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - ANTHROPIC_API_KEY
# - EXPO_PUBLIC_SENTRY_DSN
```

## 3. Create Expo app
```bash
npx create-expo-app@latest app --template blank-typescript
```

## 4. Install dependencies
```bash
cd app
npx expo install expo-router expo-image-picker expo-image-manipulator
npx expo install expo-camera expo-secure-store @supabase/supabase-js
npx expo install react-native-safe-area-context react-native-screens
npx expo install react-native-gesture-handler react-native-reanimated
npm install --save-dev typescript @types/react
cd ..
```

## 5. Copy source files into app
```bash
cp -r app-src/services app/services
cp -r app-src/theme    app/theme
cp -r app-src/hooks    app/hooks
```

## 6. Supabase project
- Go to supabase.com → New project
- Region: eu-west-2
- Save URL + keys to .env

## 7. Run migrations (Supabase SQL editor)
Run each file in order:
- supabase/migrations/001_create_households.sql
- supabase/migrations/002_create_users.sql
- supabase/migrations/003_create_locations.sql
- supabase/migrations/004_create_products.sql
- supabase/migrations/005_create_inventory_items.sql
- supabase/migrations/006_create_receipts.sql
- supabase/migrations/007_create_product_corrections.sql
- supabase/migrations/008_create_ai_usage.sql
- supabase/migrations/009_enable_rls.sql
- supabase/migrations/010_seed_functions.sql

## 8. Create storage bucket
- Supabase dashboard → Storage → New bucket
- Name: receipt-images
- Public: NO

## 9. Deploy Edge Function
```bash
supabase init
supabase login
supabase link --project-ref [your-project-ref]
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy parse-receipt
```

## 10. Start the app
```bash
cd app
npx expo start
# Press w for web browser
# Scan QR with Expo Go for phone
```

## Done when ✓
- [ ] App loads in browser
- [ ] Sign up creates a user in Supabase users table
- [ ] Three locations visible in locations table
- [ ] parse-receipt Edge Function deployed
