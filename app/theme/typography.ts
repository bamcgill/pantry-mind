// ─────────────────────────────────────────────
// PantryMind — Typography tokens
// DM Sans (UI) + IBM Plex Mono (data)
// ─────────────────────────────────────────────

export const typography = {
  fonts: {
    sans:  'DMSans_400Regular',
    sansMd: 'DMSans_500Medium',
    sansSb: 'DMSans_600SemiBold',
    mono:  'IBMPlexMono_400Regular',
    monoSb: 'IBMPlexMono_600SemiBold',
  },
  sizes: {
    xs:   10,
    sm:   12,
    base: 14,
    md:   15,
    lg:   16,
    xl:   20,
    xxl:  24,
    hero: 28,
  },
  lineHeights: {
    tight:  1.2,
    base:   1.5,
    loose:  1.7,
  },
  letterSpacing: {
    tight:  -0.3,
    normal: 0,
    wide:   0.5,
    wider:  1.5,
  }
} as const
