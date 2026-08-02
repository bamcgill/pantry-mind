// ─────────────────────────────────────────────
// PantryMind — Colour tokens
// All colours defined once here.
// ─────────────────────────────────────────────

export const colours = {
  // Backgrounds
  bg:       '#f7f6f2',
  surface:  '#ffffff',
  surface2: '#f0ede6',

  // Text
  text:     '#1a1a18',
  textMid:  '#4a4a46',
  textDim:  '#8a8a84',

  // Brand
  gold:     '#c9a84c',
  goldDim:  'rgba(201,168,76,0.12)',
  goldMid:  'rgba(201,168,76,0.3)',

  // Location colours
  fridge:   '#2d6a4f',
  freezer:  '#1d6fa4',
  cupboard: '#8b5e3c',

  // Semantic
  success:  '#2d6a4f',
  warning:  '#fb923c',
  danger:   '#ef4444',

  // Borders
  border:       'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.15)',
} as const

export type ColourKey = keyof typeof colours
