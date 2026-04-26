// // theme.ts — Midnight Barbershop design system
// import { Dimensions } from 'react-native';

// export const { width: SCREEN_WIDTH } = Dimensions.get('window');

// export const C = {
//   bg:           '#0C0A0F',
//   bgElevated:   '#13101A',
//   surface:      '#1C1828',
//   card:         '#231F30',
//   cardBorder:   '#2E2840',

//   gold:         '#E9C84A',
//   goldLight:    '#F4DA75',
//   goldDim:      '#B89A2E',
//   goldMuted:    'rgba(233,200,74,0.10)',
//   goldBorder:   'rgba(233,200,74,0.25)',

//   text:         '#F0EBE3',
//   textSub:      '#9B8FA8',
//   textDim:      '#5C5270',

//   success:      '#34D399',
//   successMuted: 'rgba(52,211,153,0.14)',
//   error:        '#F87171',
//   errorMuted:   'rgba(248,113,113,0.14)',
//   blue:         '#60A5FA',
//   blueMuted:    'rgba(96,165,250,0.14)',

//   white:        '#FFFFFF',
//   border:       'rgba(255,255,255,0.06)',
// };

// export const G = {
//   bg:      ['#0C0A0F', '#13101A', '#1A1426'] as const,
//   gold:    ['#E9C84A', '#C9A830'] as const,
//   goldRev: ['#C9A830', '#E9C84A'] as const,
//   purple:  ['#4C1D95', '#7C3AED'] as const,
//   card:    ['#1C1828', '#231F30'] as const,
//   success: ['#047857', '#34D399'] as const,
//   share:   ['#1E3A8A', '#2563EB'] as const,
//   danger:  ['#7F1D1D', '#EF4444'] as const,
// };

// export const SHADOW = {
//   gold: {
//     shadowColor: '#E9C84A',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 12,
//   },
//   card: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   soft: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 3,
//   },
// };


// CHAT GPT CODE BELOW


// // theme.tsx — Minimal Apple-style Light Theme

// import { Dimensions, Platform } from 'react-native';

// const { width, height } = Dimensions.get('window');

// export const SCREEN = {
//   width,
//   height,
// };


// // 🎨 Colors (strict + minimal)
// export const C = {
//   // Backgrounds
//   bg: '#FFFFFF',
//   bgSecondary: '#F5F5F7',

//   // Surfaces
//   card: '#FFFFFF',
//   cardSoft: '#F9F9FB',
//   border: '#E5E5EA',

//   // Text
//   textPrimary: '#111111',
//   textSecondary: '#6B7280',
//   textMuted: '#9CA3AF',

//   // Accent (use VERY sparingly)
//   primary: '#111111',
//   accent: '#4F46E5',

//   // States
//   success: '#22C55E',
//   error: '#EF4444',

//   // Utility
//   white: '#FFFFFF',
//   black: '#000000',
// };


// // 📏 Spacing system (consistent UI)
// export const S = {
//   xs: 6,
//   sm: 10,
//   md: 16,
//   lg: 24,
//   xl: 32,
// };


// // 🔘 Border radius (keep consistent)
// export const R = {
//   sm: 10,
//   md: 16,
//   lg: 22,
//   xl: 28,
//   pill: 999,
// };


// // 🌫️ Shadows (very soft, Apple-like)
// export const SHADOW = {
//   soft: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,
//   },

//   medium: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.08,
//     shadowRadius: 20,
//     elevation: 4,
//   },
// };


// // 🔤 Typography (don’t overcomplicate)
// export const T = {
//   h1: {
//     fontSize: 28,
//     fontWeight: '600' as const,
//     color: C.textPrimary,
//   },
//   h2: {
//     fontSize: 22,
//     fontWeight: '600' as const,
//     color: C.textPrimary,
//   },
//   body: {
//     fontSize: 16,
//     fontWeight: '400' as const,
//     color: C.textPrimary,
//   },
//   sub: {
//     fontSize: 14,
//     fontWeight: '400' as const,
//     color: C.textSecondary,
//   },
//   caption: {
//     fontSize: 12,
//     fontWeight: '400' as const,
//     color: C.textMuted,
//   },
// };


// // 📱 Layout helpers (THIS fixes responsiveness)
// export const L = {
//   screen: {
//     flex: 1,
//     backgroundColor: C.bg,
//     paddingHorizontal: S.lg,
//   },

//   center: {
//     flex: 1,
//     justifyContent: 'center' as const,
//     alignItems: 'center' as const,
//   },

//   row: {
//     flexDirection: 'row' as const,
//     alignItems: 'center' as const,
//   },

//   spaceBetween: {
//     flexDirection: 'row' as const,
//     justifyContent: 'space-between' as const,
//     alignItems: 'center' as const,
//   },
// };


// // 🔘 Buttons (consistent primary CTA)
// export const BTN = {
//   primary: {
//     backgroundColor: C.primary,
//     paddingVertical: 16,
//     borderRadius: R.lg,
//     alignItems: 'center' as const,
//   },

//   text: {
//     color: C.white,
//     fontSize: 16,
//     fontWeight: '600' as const,
//   },
// };


// // 🧩 Cards
// export const CARD = {
//   base: {
//     backgroundColor: C.card,
//     borderRadius: R.lg,
//     padding: S.md,
//     borderWidth: 1,
//     borderColor: C.border,
//     ...SHADOW.soft,
//   },
// };










// // CLAUDE CODE BELOW

// import { Dimensions, Platform } from 'react-native';

// const { width, height } = Dimensions.get('window');

// export const SCREEN = { width, height };

// export const IS_WEB = Platform.OS === 'web';
// export const IS_MOBILE = Platform.OS !== 'web';

// export const BP = { sm: 480, md: 768, lg: 1024, xl: 1280 };
// export const isTablet = width >= BP.md;
// export const isDesktop = width >= BP.lg;

// // ─── Colors — warm ivory light theme ─────────────────────────────────
// export const C = {
//   bg:           '#FDFAF5',   // warm ivory
//   bgSecondary:  '#F7F3EC',
//   bgElevated:   '#FFFFFF',

//   card:         '#FFFFFF',
//   cardSoft:     '#FBF8F2',
//   border:       '#EAE4D8',
//   borderStrong: '#D4C9B4',

//   textPrimary:  '#1C1810',   // warm near-black
//   textSecondary:'#6B6052',   // warm brown-gray
//   textMuted:    '#A89C8C',

//   primary:      '#8B5E3C',   // cognac brown — the hero color
//   primaryDark:  '#6B4428',
//   primaryLight: '#B8845A',

//   accent:       '#C4956A',   // warm tan
//   accentSoft:   'rgba(196,149,106,0.12)',

//   gold:         '#C9A84C',
//   goldSoft:     'rgba(201,168,76,0.10)',

//   gradStart:    '#8B5E3C',
//   gradMid:      '#C4956A',
//   gradEnd:      '#C9A84C',

//   success:      '#4A7C59',
//   error:        '#C0392B',

//   white:        '#FFFFFF',
//   black:        '#000000',
//   overlay:      'rgba(28,24,16,0.5)',
// };

// export const S = {
//   xs: 6, sm: 10, md: 16, lg: 24, xl: 40, xxl: 64,
// };

// export const R = {
//   sm: 10, md: 16, lg: 22, xl: 32, pill: 999,
// };

// export const SHADOW = {
//   soft: {
//     shadowColor: '#8B5E3C',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.07,
//     shadowRadius: 10,
//     elevation: 2,
//   },
//   medium: {
//     shadowColor: '#5C3D1E',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.10,
//     shadowRadius: 18,
//     elevation: 5,
//   },
//   glow: {
//     shadowColor: '#8B5E3C',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.25,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   card: {
//     shadowColor: '#C4956A',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.13,
//     shadowRadius: 24,
//     elevation: 6,
//   },
// };

// export const T = {
//   h1: {
//     fontFamily: 'PlayfairDisplay_700Bold',
//     fontSize: isDesktop ? 50 : isTablet ? 40 : 34,
//     color: C.textPrimary,
//     letterSpacing: -0.5,
//   },
//   h2: {
//     fontFamily: 'PlayfairDisplay_700Bold',
//     fontSize: isDesktop ? 34 : isTablet ? 28 : 24,
//     color: C.textPrimary,
//   },
//   h3: {
//     fontFamily: 'PlayfairDisplay_600SemiBold',
//     fontSize: 20,
//     color: C.textPrimary,
//   },
//   body: {
//     fontFamily: 'DMSans_400Regular',
//     fontSize: isDesktop ? 17 : 15,
//     color: C.textPrimary,
//     lineHeight: 24,
//   },
//   sub: {
//     fontFamily: 'DMSans_400Regular',
//     fontSize: isDesktop ? 15 : 13,
//     color: C.textSecondary,
//     lineHeight: 20,
//   },
//   caption: {
//     fontFamily: 'DMSans_400Regular',
//     fontSize: 12,
//     color: C.textMuted,
//     letterSpacing: 0.3,
//   },
//   label: {
//     fontFamily: 'DMSans_500Medium',
//     fontSize: 11,
//     color: C.primary,
//     letterSpacing: 2.5,
//     textTransform: 'uppercase' as const,
//   },
// };

// export const L = {
//   screen: {
//     flex: 1,
//     backgroundColor: C.bg,
//     paddingHorizontal: isDesktop ? S.xxl : isTablet ? S.xl : S.lg,
//   },
//   screenWeb: {
//     flex: 1,
//     backgroundColor: C.bg,
//     maxWidth: 480,
//     width: '100%' as const,
//     alignSelf: 'center' as const,
//     paddingHorizontal: S.lg,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center' as const,
//     alignItems: 'center' as const,
//   },
//   row: {
//     flexDirection: 'row' as const,
//     alignItems: 'center' as const,
//   },
//   spaceBetween: {
//     flexDirection: 'row' as const,
//     justifyContent: 'space-between' as const,
//     alignItems: 'center' as const,
//   },
// };

// export const BTN = {
//   primary: {
//     backgroundColor: C.primary,
//     paddingVertical: isDesktop ? 18 : 16,
//     borderRadius: R.pill,
//     alignItems: 'center' as const,
//     flexDirection: 'row' as const,
//     justifyContent: 'center' as const,
//     gap: 8,
//     ...SHADOW.glow,
//   },
//   secondary: {
//     backgroundColor: 'transparent',
//     paddingVertical: isDesktop ? 18 : 16,
//     borderRadius: R.pill,
//     alignItems: 'center' as const,
//     borderWidth: 1.5,
//     borderColor: C.border,
//   },
//   text: {
//     fontFamily: 'DMSans_600SemiBold',
//     color: C.white,
//     fontSize: isDesktop ? 17 : 15,
//     letterSpacing: 0.3,
//   },
//   textSecondary: {
//     fontFamily: 'DMSans_500Medium',
//     color: C.textSecondary,
//     fontSize: 14,
//   },
// };

// export const CARD = {
//   base: {
//     backgroundColor: C.card,
//     borderRadius: R.xl,
//     padding: S.lg,
//     borderWidth: 1,
//     borderColor: C.border,
//     ...SHADOW.card,
//   },
// };














import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN = { width, height };

export const IS_WEB = Platform.OS === 'web';
export const IS_MOBILE = Platform.OS !== 'web';

export const BP = { sm: 480, md: 768, lg: 1024, xl: 1280 };
export const isTablet = width >= BP.md;
export const isDesktop = width >= BP.lg;

// ─── Responsive font scale ────────────────────────────────────────────
// Small phone  (<375 px)  → 0.88
// Normal phone (375-414)  → 1.00
// Large phone  (>414)     → 1.06
// Tablet                  → 1.20
// Desktop                 → 1.40
const fontScale =
  isDesktop ? 1.40 :
    isTablet ? 1.20 :
      width > 414 ? 1.06 :
        width < 375 ? 0.88 :
          1.00;

const fs = (base: number) => Math.round(base * fontScale);

// ─── Colors — warm ivory light theme (UNCHANGED) ─────────────────────
export const C = {
  bg: '#FDFAF5',
  bgSecondary: '#F7F3EC',
  bgElevated: '#FFFFFF',

  card: '#FFFFFF',
  cardSoft: '#FBF8F2',
  border: '#EAE4D8',
  borderStrong: '#D4C9B4',

  textPrimary: '#1C1810',
  textSecondary: '#6B6052',
  textMuted: '#A89C8C',

  primary: '#8B5E3C',
  primaryDark: '#6B4428',
  primaryLight: '#B8845A',

  accent: '#C4956A',
  accentSoft: 'rgba(196,149,106,0.12)',

  gold: '#C9A84C',
  goldSoft: 'rgba(201,168,76,0.10)',

  gradStart: '#8B5E3C',
  gradMid: '#C4956A',
  gradEnd: '#C9A84C',

  success: '#4A7C59',
  error: '#C0392B',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(28,24,16,0.5)',
};

// ─── Spacing — scales with screen width ──────────────────────────────
const spaceScale = isDesktop ? 1.5 : isTablet ? 1.25 : width < 375 ? 0.85 : 1;
const sp = (base: number) => Math.round(base * spaceScale);

export const S = {
  xs: sp(6),
  sm: sp(10),
  md: sp(16),
  lg: sp(24),
  xl: sp(40),
  xxl: sp(64),
};

export const R = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
  pill: 999,
};

export const SHADOW = {
  soft: {
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: '#5C3D1E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 5,
  },
  glow: {
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#C4956A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const T = {
  h1: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: fs(isDesktop ? 50 : isTablet ? 40 : 34),
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: fs(isDesktop ? 34 : isTablet ? 28 : 24),
    color: C.textPrimary,
  },
  h3: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: fs(20),
    color: C.textPrimary,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: fs(isDesktop ? 17 : 15),
    color: C.textPrimary,
    lineHeight: fs(isDesktop ? 26 : 24),
  },
  sub: {
    fontFamily: 'DMSans_400Regular',
    fontSize: fs(isDesktop ? 15 : 13),
    color: C.textSecondary,
    lineHeight: fs(20),
  },
  caption: {
    fontFamily: 'DMSans_400Regular',
    fontSize: fs(12),
    color: C.textMuted,
    letterSpacing: 0.3,
  },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: fs(11),
    color: C.primary,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
  },
};

// ─── Web container width ──────────────────────────────────────────────
export const WEB_MAX_W = isDesktop ? 720 : isTablet ? 600 : 480;

export const L = {
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: isDesktop ? S.xxl : isTablet ? S.xl : S.lg,
  },
  screenWeb: {
    flex: 1,
    backgroundColor: C.bg,
    maxWidth: WEB_MAX_W,
    width: '100%' as const,
    alignSelf: 'center' as const,
    paddingHorizontal: S.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  spaceBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
};

export const BTN = {
  primary: {
    backgroundColor: C.primary,
    paddingVertical: isDesktop ? 18 : isTablet ? 17 : width < 375 ? 13 : 15,
    borderRadius: R.pill,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 8,
    ...SHADOW.glow,
  },
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: isDesktop ? 18 : 16,
    borderRadius: R.pill,
    alignItems: 'center' as const,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  text: {
    fontFamily: 'DMSans_600SemiBold',
    color: C.white,
    fontSize: fs(isDesktop ? 17 : 15),
    letterSpacing: 0.3,
  },
  textSecondary: {
    fontFamily: 'DMSans_500Medium',
    color: C.textSecondary,
    fontSize: fs(14),
  },
};

export const CARD = {
  base: {
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.lg,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.card,
  },
};