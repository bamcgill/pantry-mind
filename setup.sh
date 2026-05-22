#!/bin/bash

# ─────────────────────────────────────────────
# PantryMind — Project Setup Script
# Run this once on the Mac Mini
# ─────────────────────────────────────────────

set -e

echo ""
echo "🍊 PantryMind project setup"
echo "─────────────────────────────"

# Check node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from nodejs.org first."
  exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found."
  exit 1
fi

echo "✓ Node $(node --version)"
echo "✓ npm $(npm --version)"
echo ""

# ── 1. Expo app
echo "→ Creating Expo app..."
npx create-expo-app@latest app --template blank-typescript
echo "✓ Expo app created"
echo ""

# ── 2. Install app dependencies
echo "→ Installing app dependencies..."
cd app
npx expo install \
  expo-router \
  expo-image-picker \
  expo-image-manipulator \
  expo-camera \
  expo-secure-store \
  @supabase/supabase-js \
  @sentry/react-native \
  react-native-safe-area-context \
  react-native-screens \
  react-native-gesture-handler \
  react-native-reanimated

npm install --save-dev @types/react @types/react-native typescript
cd ..
echo "✓ Dependencies installed"
echo ""

# ── 3. Supabase CLI check
if ! command -v supabase &> /dev/null; then
  echo "→ Installing Supabase CLI..."
  brew install supabase/tap/supabase
fi
echo "✓ Supabase CLI $(supabase --version)"

# ── 4. Git init
echo "→ Initialising git..."
git init
git add .
git commit -m "chore: initial project scaffold"
echo "✓ Git initialised"
echo ""

echo "─────────────────────────────"
echo "✓ Setup complete"
echo ""
echo "Next steps:"
echo "  1. cp .env.example .env"
echo "  2. Fill in .env with your keys"
echo "  3. cd supabase && supabase init"
echo "  4. Run migrations in Supabase SQL editor"
echo "  5. npx expo start"
echo ""
