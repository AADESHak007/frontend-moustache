// /**
//  * S3 — StylePickerScreen
//  *
//  * Fetches all 6 mustache styles from the API.
//  * Displays them in a horizontally-scrollable card list.
//  * Selected style is highlighted. "Generate Mustache" starts processing.
//  */

// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useNavigation } from '@react-navigation/native';

// import { RootStackParamList, Style } from '../types';
// import { useAppStore } from '../store/useAppStore';
// import { createJob } from '../api/jobs';
// import { getStyles } from '../api/styles';
// import StyleCard from '../components/StyleCard';

// type StylePickerNav = StackNavigationProp<RootStackParamList, 'StylePicker'>;

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = width * 0.44;

// export default function StylePickerScreen() {
//   const navigation      = useNavigation<StylePickerNav>();
//   const styles_list     = useAppStore((s) => s.styles);
//   const setStyles       = useAppStore((s) => s.setStyles);
//   const selectedStyle   = useAppStore((s) => s.selectedStyle);
//   const setSelectedStyle = useAppStore((s) => s.setSelectedStyle);
//   const selectedImageUri = useAppStore((s) => s.selectedImageUri);
//   const token            = useAppStore((s) => s.token);
//   const setCurrentJob    = useAppStore((s) => s.setCurrentJob);

//   const [loading,      setLoading]      = useState(false);
//   const [submitting,   setSubmitting]   = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   // Auth Guard
//   useEffect(() => {
//     if (!token) {
//       navigation.replace('SignIn');
//     }
//   }, [token]);

//   // Fetch styles on mount (backend caches for 5min)
//   useEffect(() => {
//     if (styles_list.length === 0) {
//       setLoading(true);
//       getStyles()
//         .then((res) => setStyles(res.styles))
//         .catch(() => setErrorMessage('Failed to load styles. Please go back and try again.'))
//         .finally(() => setLoading(false));
//     }
//   }, []);

//   const _onGenerate = async () => {
//     if (!selectedStyle || !selectedImageUri) return;
//     setSubmitting(true);
//     setErrorMessage(null);
//     try {
//       const job = await createJob(selectedImageUri, selectedStyle.id);
//       setCurrentJob({ job_id: job.job_id, status: job.status });
//       navigation.navigate('Processing');
//     } catch (err: any) {
//       setErrorMessage(err.message ?? 'Failed to start job. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const insets = useSafeAreaInsets();

//   return (
//     <View style={vStyles.container}>
//       <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={StyleSheet.absoluteFill} />
//       <View style={[vStyles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

//         {/* Header */}
//         <View style={vStyles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={vStyles.backBtn}>
//             <Text style={vStyles.backText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={vStyles.stepLabel}>Step 2 of 3</Text>
//         </View>

//         <Text style={vStyles.title}>Choose Your{'\n'}Mustache Style</Text>
//         <Text style={vStyles.subtitle}>
//           {selectedStyle
//             ? `✓ ${selectedStyle.label} selected`
//             : 'Tap a style to preview it'}
//         </Text>

//         {/* Image thumbnail preview */}
//         {selectedImageUri && (
//           <Image source={{ uri: selectedImageUri }} style={vStyles.thumbPreview} />
//         )}

//         {/* Style Grid */}
//         {loading ? (
//           <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 40 }} />
//         ) : errorMessage ? (
//           <View style={vStyles.errorBox}>
//             <Text style={vStyles.errorText}>{errorMessage}</Text>
//           </View>
//         ) : (
//           <View style={vStyles.listWrapper}>
//             <FlatList
//               data={styles_list}
//               keyExtractor={(item) => item.id}
//               numColumns={2}
//               columnWrapperStyle={vStyles.row}
//               contentContainerStyle={vStyles.grid}
//               renderItem={({ item }) => (
//                 <StyleCard
//                   style={item}
//                   selected={selectedStyle?.id === item.id}
//                   onSelect={() => setSelectedStyle(item)}
//                 />
//               )}
//               showsVerticalScrollIndicator={false}
//             />
//           </View>
//         )}

//         {/* Error from submission */}
//         {errorMessage && !loading && (
//           <Text style={vStyles.submitError}>{errorMessage}</Text>
//         )}

//         {/* Generate CTA */}
//         <TouchableOpacity
//           style={[vStyles.generateBtn, (!selectedStyle || submitting) && vStyles.generateBtnDisabled]}
//           onPress={_onGenerate}
//           disabled={!selectedStyle || submitting}
//           activeOpacity={0.85}
//         >
//           {submitting ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <LinearGradient
//               colors={selectedStyle ? ['#9333ea', '#7c3aed'] : ['#e5e7eb', '#d1d5db']}
//               style={vStyles.generateGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Text style={vStyles.generateText}>
//                 {selectedStyle ? `Generate with ${selectedStyle.label}  →` : 'Select a style first'}
//               </Text>
//             </LinearGradient>
//           )}
//         </TouchableOpacity>

//       </View>
//     </View>
//   );
// }

// const vStyles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff' },
//   main: { flex: 1, paddingHorizontal: 20 },
//   header: {
//     flexDirection:  'row',
//     justifyContent: 'space-between',
//     alignItems:     'center',
//     paddingTop:     12,
//     marginBottom:   20,
//   },
//   backBtn:   { padding: 4 },
//   backText:  { color: '#6b7280', fontSize: 15, fontWeight: '500' },
//   stepLabel: { color: '#9ca3af', fontSize: 13, fontWeight: '600' },
//   title: {
//     fontSize:      26,
//     fontWeight:    '800',
//     color:         '#1a1a2e',
//     letterSpacing: -0.5,
//     marginBottom:  6,
//   },
//   subtitle: {
//     fontSize:     14,
//     color:        '#9333ea',
//     fontWeight:   '600',
//     marginBottom: 16,
//   },
//   thumbPreview: {
//     width:        56,
//     height:       56,
//     borderRadius: 28,
//     borderWidth:  2,
//     borderColor:  '#7c3aed',
//     marginBottom: 16,
//   },
//   row:  { justifyContent: 'space-between', marginBottom: 14 },
//   listWrapper: { flex: 1 },
//   grid: { paddingBottom: 16 },
//   errorBox: {
//     backgroundColor: '#fff5f5',
//     borderRadius:    12,
//     padding:         16,
//     marginTop:       24,
//     borderWidth:     1,
//     borderColor:     '#fecaca',
//   },
//   errorText:   { color: '#dc2626', fontSize: 14, textAlign: 'center' },
//   submitError: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 12 },
//   generateBtn: {
//     borderRadius: 16,
//     overflow:     'hidden',
//     marginTop:    10,
//     shadowColor:  '#7c3aed',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation:    8,
//   },
//   generateBtnDisabled: { shadowOpacity: 0, elevation: 0 },
//   generateGradient: {
//     paddingVertical: 18,
//     alignItems:      'center',
//   },
//   generateText: {
//     color:         '#ffffff',
//     fontSize:      16,
//     fontWeight:    '800',
//     letterSpacing: 0.3,
//   },
// });





// CLAUDE CODDE BELOW



/**
 * StylePickerScreen — redesigned to match warm ivory theme.
 * ALL business logic preserved exactly as original.
 * Added: per-style mustache preview on a dummy face (SVG-based, no extra assets).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';

import { RootStackParamList, Style } from '../types';
import { useAppStore } from '../store/useAppStore';
import { createJob } from '../api/jobs';
import { getStyles } from '../api/styles';
import StyleCard from '../components/StyleCard';
import {
  C, T, S, R, SHADOW, BTN,
  IS_WEB, isDesktop, isTablet, WEB_MAX_W,
} from '../screens/theme';

type StylePickerNav = StackNavigationProp<RootStackParamList, 'StylePicker'>;

const { width, height } = Dimensions.get('window');
const isSmallPhone = width < 375;
const WEB_COL = Math.min(WEB_MAX_W, width);
const WASH_W = isDesktop ? width * 0.3 : isTablet ? width * 0.4 : width * 0.6;


// Card grid sizing
const GRID_GAP = S.sm;
const CARD_WIDTH =
  isDesktop ? 180 :
    isTablet ? 160 :
      (width - S.lg * 2 - GRID_GAP) / 2;

// Preview panel size
const PREVIEW_SIZE = Math.min(
  isDesktop ? 340 : isTablet ? 300 : width - S.lg * 2,
  height * 0.38,
);

// ─── Dummy-face + mustache SVGs ───────────────────────────────────────
// Each returns an SVG string. The face is a neutral, gender-neutral illustration.
// Mustache shapes are drawn in C.textPrimary / dark brown so they pop on the ivory face.

const FACE_SVG = `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <!-- neck -->
  <rect x="82" y="190" width="36" height="40" rx="8" fill="#F5C8A0"/>
  <!-- head -->
  <ellipse cx="100" cy="108" rx="72" ry="88" fill="#F5C8A0"/>
  <!-- ear left -->
  <ellipse cx="28" cy="112" rx="12" ry="16" fill="#F0BC90"/>
  <!-- ear right -->
  <ellipse cx="172" cy="112" rx="12" ry="16" fill="#F0BC90"/>
  <!-- hair -->
  <ellipse cx="100" cy="36" rx="72" ry="38" fill="#4A3728"/>
  <rect x="28" y="20" width="144" height="40" fill="#4A3728"/>
  <!-- eyebrow left -->
  <path d="M58 78 Q72 70 86 76" stroke="#4A3728" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- eyebrow right -->
  <path d="M114 76 Q128 70 142 78" stroke="#4A3728" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- eye left -->
  <ellipse cx="72" cy="96" rx="12" ry="10" fill="white"/>
  <ellipse cx="72" cy="96" rx="6" ry="7" fill="#4A3728"/>
  <ellipse cx="74" cy="93" rx="2" ry="2" fill="white"/>
  <!-- eye right -->
  <ellipse cx="128" cy="96" rx="12" ry="10" fill="white"/>
  <ellipse cx="128" cy="96" rx="6" ry="7" fill="#4A3728"/>
  <ellipse cx="130" cy="93" rx="2" ry="2" fill="white"/>
  <!-- nose -->
  <path d="M96 108 Q90 128 84 132 Q100 138 116 132 Q110 128 104 108" fill="#E8A882" stroke="none"/>
  <!-- mouth (neutral) -->
  <path d="M84 154 Q100 162 116 154" stroke="#C07050" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>
`;

// Mustache SVGs — positioned over the philtrum area (y ≈ 136-152)
const MUSTACHE_SVGS: Record<string, string> = {
  chevron: `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  ${FACE_SVG.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  <!-- Chevron: wide, flat, full coverage -->
  <path d="M68 138 Q100 128 132 138 Q116 148 100 144 Q84 148 68 138Z"
        fill="#2C1A0E"/>
</svg>`,

  handlebar: `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  ${FACE_SVG.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  <!-- Handlebar: curled ends -->
  <path d="M66 142 Q72 132 86 136 Q100 140 114 136 Q128 132 134 142
           Q130 150 124 148 Q112 144 100 146 Q88 144 76 148 Q70 150 66 142Z"
        fill="#2C1A0E"/>
  <!-- left curl -->
  <path d="M66 142 Q58 136 56 128 Q58 122 64 126 Q60 134 66 142"
        fill="#2C1A0E"/>
  <!-- right curl -->
  <path d="M134 142 Q142 136 144 128 Q142 122 136 126 Q140 134 134 142"
        fill="#2C1A0E"/>
</svg>`,

  walrus: `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  ${FACE_SVG.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  <!-- Walrus: big drooping -->
  <path d="M70 134 Q100 126 130 134 Q128 152 116 158 Q100 162 84 158 Q72 152 70 134Z"
        fill="#2C1A0E"/>
  <!-- droop left -->
  <path d="M70 134 Q68 150 72 158 Q80 162 84 158 Q72 152 70 134" fill="#2C1A0E"/>
  <!-- droop right -->
  <path d="M130 134 Q132 150 128 158 Q120 162 116 158 Q128 152 130 134" fill="#2C1A0E"/>
</svg>`,

  imperial: `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  ${FACE_SVG.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  <!-- Imperial: narrow, pointy, waxed upward tips -->
  <path d="M84 142 Q100 136 116 142 Q108 148 100 146 Q92 148 84 142Z"
        fill="#2C1A0E"/>
  <!-- left tip up -->
  <path d="M84 142 Q76 136 74 128 Q78 124 82 130 Q80 138 84 142" fill="#2C1A0E"/>
  <!-- right tip up -->
  <path d="M116 142 Q124 136 126 128 Q122 124 118 130 Q120 138 116 142" fill="#2C1A0E"/>
</svg>`,

  fu_manchu: `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  ${FACE_SVG.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  <!-- Fu Manchu: thin strip + long hanging tendrils -->
  <rect x="82" y="136" width="36" height="8" rx="4" fill="#2C1A0E"/>
  <!-- left tendril -->
  <path d="M84 144 Q76 158 74 178 Q76 186 80 178 Q82 160 88 148" fill="#2C1A0E"/>
  <!-- right tendril -->
  <path d="M116 144 Q124 158 126 178 Q124 186 120 178 Q118 160 112 148" fill="#2C1A0E"/>
</svg>`,

  pencil: `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  ${FACE_SVG.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  <!-- Pencil thin: very slim line -->
  <rect x="78" y="138" width="44" height="6" rx="3" fill="#2C1A0E"/>
</svg>`,
};

// Map style.id → SVG key (handles whatever casing the backend sends)
const svgKey = (id: string): string => {
  const map: Record<string, string> = {
    chevron: 'chevron',
    handlebar: 'handlebar',
    walrus: 'walrus',
    imperial: 'imperial',
    fu_manchu: 'fu_manchu',
    fumanchu: 'fu_manchu',
    pencil: 'pencil',
    pencil_thin: 'pencil',
  };
  return map[id.toLowerCase()] ?? 'chevron';
};

// ─── Style descriptions ───────────────────────────────────────────────
const STYLE_DESC: Record<string, string> = {
  chevron: "Classic, bold & full. The everyman's go-to.",
  handlebar: 'Dramatic curled ends. Timeless showmanship.',
  walrus: 'Thick & drooping. Rugged, untamed character.',
  imperial: 'Pointed, waxed tips. Distinguished elegance.',
  fu_manchu: 'Thin strip with long tendrils. Mysterious flair.',
  pencil: 'Ultra-slim line. Refined, minimalist cool.',
};

// ─── Component ───────────────────────────────────────────────────────
export default function StylePickerScreen() {
  const navigation = useNavigation<StylePickerNav>();
  const styles_list = useAppStore((s) => s.styles);
  const setStyles = useAppStore((s) => s.setStyles);
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const setSelectedStyle = useAppStore((s) => s.setSelectedStyle);
  const selectedImageUri = useAppStore((s) => s.selectedImageUri);
  const token = useAppStore((s) => s.token);
  const setCurrentJob = useAppStore((s) => s.setCurrentJob);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const previewScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Animate preview whenever selection changes
  useEffect(() => {
    if (selectedStyle) {
      previewScale.setValue(0.90);
      Animated.spring(previewScale, {
        toValue: 1, friction: 6, tension: 60, useNativeDriver: true,
      }).start();
    }
  }, [selectedStyle?.id]);

  // ── Auth guard (original) ─────────────────────────────────────────
  useEffect(() => {
    if (!token) navigation.replace('SignIn');
  }, [token]);

  // ── Fetch styles (original) ───────────────────────────────────────
  useEffect(() => {
    if (styles_list.length === 0) {
      setLoading(true);
      getStyles()
        .then((res) => setStyles(res.styles))
        .catch(() => setErrorMessage('Failed to load styles. Please go back and try again.'))
        .finally(() => setLoading(false));
    }
  }, []);

  // ── Generate (original) ───────────────────────────────────────────
  const _onGenerate = async () => {
    if (!selectedStyle || !selectedImageUri) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const job = await createJob(selectedImageUri, selectedStyle.id);
      setCurrentJob({ job_id: job.job_id, status: job.status });
      navigation.navigate('Processing');
    } catch (err: any) {
      // 402 = no credits → straight to paywall, no in-screen error needed.
      if (err?.status === 402) {
        navigation.navigate('Paywall', { reason: 'out_of_credits' });
        return;
      }
      setErrorMessage(err.message ?? 'Failed to start job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + S.md;

  // The SVG to show in the preview panel
  const previewSvg = selectedStyle
    ? MUSTACHE_SVGS[svgKey(selectedStyle.id)] ?? MUSTACHE_SVGS.chevron
    : FACE_SVG;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Ambient washes */}
      <View style={styles.topWash} pointerEvents="none" />
      {/* <View style={styles.bottomWash} pointerEvents="none" /> */}

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.header,
          IS_WEB && { width: WEB_COL },
          { opacity: fadeAnim },
        ]}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          {['Upload', 'Style', 'Result'].map((step, i) => {
            const active = i === 1;
            const done = i === 0;
            return (
              <React.Fragment key={step}>
                {i > 0 && (
                  <View style={[styles.stepLine, done && styles.stepLineDone]} />
                )}
                <View style={styles.stepItem}>
                  <View style={[styles.stepDot, active && styles.stepDotActive]}>
                    {active ? (
                      <LinearGradient
                        colors={[C.gradStart, C.gradEnd]}
                        style={styles.stepDotGrad}
                      >
                        <Text style={styles.stepNum}>{i + 1}</Text>
                      </LinearGradient>
                    ) : done ? (
                      <LinearGradient
                        colors={[C.gradStart, C.gradEnd]}
                        style={[styles.stepDotGrad, { opacity: 0.5 }]}
                      >
                        <Text style={styles.stepNum}>✓</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.stepNumInactive}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
                    {step}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* Right spacer */}
        <View style={styles.backBtn} />
      </Animated.View>

      {/* ── MAIN SCROLL ──────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          IS_WEB && { width: WEB_COL },
          { paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── TITLE ────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.titleBlock,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={T.label}>Step 2 of 3</Text>
            <View style={styles.eyebrowLine} />
          </View>
          <Text style={[T.h2, { textAlign: 'center' }]}>
            Pick Your{' '}
            <Text style={styles.titleAccent}>Style</Text>
          </Text>
          <Text style={[T.sub, styles.titleSub]}>
            Select a look below to preview it on a face before generating
          </Text>
        </Animated.View>

        {/* ── PREVIEW PANEL ────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.previewPanel,
            { transform: [{ scale: previewScale }], opacity: fadeAnim },
          ]}
        >
          {/* Face SVG preview */}
          <View style={[styles.faceContainer, { width: PREVIEW_SIZE, height: PREVIEW_SIZE }]}>
            <SvgXml
              xml={previewSvg}
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE}
            />
            {/* "Your photo" thumbnail overlay */}
            {selectedImageUri && (
              <View style={styles.thumbBadge}>
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.thumbImg}
                />
              </View>
            )}
          </View>

          {/* Style name + description */}
          <View style={styles.previewMeta}>
            {selectedStyle ? (
              <>
                <View style={styles.selectedBadge}>
                  <LinearGradient
                    colors={[C.gradStart, C.gradEnd]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.selectedBadgeGrad}
                  >
                    <Text style={styles.selectedBadgeText}>
                      ✓  {selectedStyle.label}
                    </Text>
                  </LinearGradient>
                </View>
                <Text style={[T.sub, { textAlign: 'center', marginTop: S.xs, maxWidth: 260 }]}>
                  {STYLE_DESC[svgKey(selectedStyle.id)] ?? ''}
                </Text>
              </>
            ) : (
              <Text style={[T.caption, { color: C.textMuted, textAlign: 'center' }]}>
                Tap a style card below to preview it here
              </Text>
            )}
          </View>
        </Animated.View>

        {/* ── STYLE GRID ───────────────────────────────────────── */}
        <Animated.View style={[styles.gridWrap, { opacity: fadeAnim }]}>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={C.primary} />
              <Text style={[T.caption, { marginTop: S.sm, color: C.textMuted }]}>
                Loading styles…
              </Text>
            </View>
          ) : errorMessage && styles_list.length === 0 ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorEmoji}>⚠️</Text>
              <Text style={[T.body, { color: C.error, textAlign: 'center', marginTop: S.xs }]}>
                {errorMessage}
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {styles_list.map((item) => {
                const isSelected = selectedStyle?.id === item.id;
                const key = svgKey(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.styleCard,
                      { width: CARD_WIDTH },
                      isSelected && styles.styleCardSelected,
                    ]}
                    onPress={() => setSelectedStyle(item)}
                    activeOpacity={0.75}
                  >
                    {/* Mini face preview inside card */}
                    <View style={styles.cardFaceWrap}>
                      <SvgXml
                        xml={MUSTACHE_SVGS[key] ?? MUSTACHE_SVGS.chevron}
                        width={isSmallPhone ? 68 : 80}
                        height={isSmallPhone ? 68 : 80}
                      />
                    </View>

                    <Text
                      style={[
                        styles.cardLabel,
                        isSelected && { color: C.primary, fontFamily: 'DMSans_600SemiBold' },
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>

                    {/* Selected tick */}
                    {isSelected && (
                      <View style={styles.cardTick}>
                        <LinearGradient
                          colors={[C.gradStart, C.gradEnd]}
                          style={styles.cardTickGrad}
                        >
                          <Text style={styles.cardTickText}>✓</Text>
                        </LinearGradient>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Animated.View>

        {/* Submission error */}
        {errorMessage && !loading && styles_list.length > 0 && (
          <Text style={styles.submitError}>{errorMessage}</Text>
        )}

        {/* ── GENERATE CTA ─────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.ctaWrap,
            { opacity: fadeAnim },
          ]}
        >
          <TouchableOpacity
            onPress={_onGenerate}
            disabled={!selectedStyle || submitting}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                selectedStyle
                  ? [C.gradStart, C.gradEnd]
                  : [C.border, C.borderStrong]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.ctaBtn,
                !selectedStyle && styles.ctaBtnDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={C.white} />
              ) : (
                <>
                  <Text
                    style={[
                      BTN.text,
                      !selectedStyle && { color: C.textMuted },
                    ]}
                  >
                    {selectedStyle
                      ? `Generate with ${selectedStyle.label}`
                      : 'Select a style first'}
                  </Text>
                  {selectedStyle && (
                    <Text style={[BTN.text, { opacity: 0.75 }]}>→</Text>
                  )}
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Helper text */}
          <Text style={[T.caption, { textAlign: 'center', marginTop: S.sm, color: C.textMuted }]}>
            {selectedStyle
              ? '🎨 AI will place this style on your photo'
              : 'Choose one of the 6 styles above'}
          </Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    ...(IS_WEB ? { alignItems: 'center' as const } : {}),
  },

  // Ambient washes
  // topWash: {
  //   position: 'absolute', top: -80, left: '10%',
  //   width: isTablet ? 340 : 240, height: isTablet ? 340 : 240,
  //   borderRadius: 170, backgroundColor: C.accent, opacity: 0.07,
  // },
  topWash: {
    position: 'absolute',
    top: -WASH_W * 0.3,
    left: '50%',
    width: WASH_W,
    height: WASH_W,
    borderRadius: WASH_W / 2,
    marginLeft: -WASH_W / 2,
    backgroundColor: C.accent,
    opacity: 0.07,
  },
  // bottomWash: {
  //   position: 'absolute', bottom: 80, right: -40,
  //   width: isTablet ? 280 : 200, height: isTablet ? 280 : 200,
  //   borderRadius: 140, backgroundColor: C.gold, opacity: 0.06,
  // },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    width: IS_WEB ? WEB_COL : '100%',
  },
  backBtn: {
    width: isSmallPhone ? 34 : 40,
    height: isSmallPhone ? 34 : 40,
    borderRadius: isSmallPhone ? 17 : 20,
    backgroundColor: C.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  backArrow: {
    fontSize: isSmallPhone ? 14 : 16, color: C.textPrimary, lineHeight: 22,
  },

  // Step row
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepItem: { alignItems: 'center', gap: 5 },
  stepDot: {
    width: isSmallPhone ? 26 : 30,
    height: isSmallPhone ? 26 : 30,
    borderRadius: isSmallPhone ? 13 : 15,
    backgroundColor: C.bgSecondary,
    borderWidth: 1, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  stepDotActive: { borderWidth: 0, ...SHADOW.glow },
  stepDotGrad: {
    width: '100%', height: '100%',
    justifyContent: 'center', alignItems: 'center',
  },
  stepNum: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: C.white },
  stepNumInactive: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: C.textMuted },
  stepLabel: { fontFamily: 'DMSans_400Regular', fontSize: 9, color: C.textMuted, letterSpacing: 0.3 },
  stepLabelActive: { color: C.primary, fontFamily: 'DMSans_500Medium' },
  stepLine: {
    width: isSmallPhone ? 20 : 28, height: 1,
    backgroundColor: C.border, marginHorizontal: 4, marginBottom: 14,
  },
  stepLineDone: { backgroundColor: C.primary, opacity: 0.5 },

  // ── Scroll
  // scrollContent: {
  //   flexGrow:          1,
  //   paddingHorizontal: S.lg,
  //   alignItems:        'center',
  //   paddingTop:        S.sm,
  // },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: S.lg,
    alignItems: 'center',
    paddingTop: S.sm,
    paddingBottom: S.xl,  // add this if not present
  },

  // ── Title
  titleBlock: {
    width: '100%', alignItems: 'center',
    paddingVertical: S.md,
  },
  eyebrowRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: S.sm,
  },
  eyebrowLine: {
    width: 28, height: 1, backgroundColor: C.primary, opacity: 0.35,
  },
  titleAccent: {
    color: C.primary, fontFamily: 'PlayfairDisplay_700Bold', fontStyle: 'italic',
  },
  titleSub: {
    textAlign: 'center', maxWidth: 280,
    marginTop: S.xs, lineHeight: 20,
  },

  // ── Preview panel
  previewPanel: {
    width: '100%',
    alignItems: 'center',
    marginTop: S.sm,
  },
  faceContainer: {
    borderRadius: R.xl,
    overflow: 'hidden',
    backgroundColor: C.cardSoft,
    borderWidth: 1.5,
    borderColor: C.border,
    ...SHADOW.card,
    position: 'relative',
  },
  thumbBadge: {
    position: 'absolute',
    bottom: S.sm,
    right: S.sm,
    width: isSmallPhone ? 40 : 48,
    height: isSmallPhone ? 40 : 48,
    borderRadius: isSmallPhone ? 20 : 24,
    borderWidth: 2,
    borderColor: C.gold,
    overflow: 'hidden',
    ...SHADOW.soft,
  },
  thumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },

  previewMeta: {
    alignItems: 'center',
    marginTop: S.md,
    marginBottom: S.sm,
    minHeight: 56,
  },
  selectedBadge: { borderRadius: R.pill, overflow: 'hidden' },
  selectedBadgeGrad: {
    paddingHorizontal: S.lg,
    paddingVertical: S.xs,
    borderRadius: R.pill,
  },
  selectedBadgeText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: isSmallPhone ? 12 : 13,
    color: C.white,
    letterSpacing: 0.5,
  },

  // ── Style grid
  gridWrap: { width: '100%', marginTop: S.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    justifyContent: 'space-between',
  },
  styleCard: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: S.sm,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: GRID_GAP,
    position: 'relative',
    ...SHADOW.soft,
  },
  styleCardSelected: {
    borderColor: C.primary,
    backgroundColor: C.accentSoft,
    ...SHADOW.glow,
  },
  cardFaceWrap: {
    borderRadius: R.md,
    overflow: 'hidden',
    backgroundColor: C.cardSoft,
    marginBottom: S.xs,
  },
  cardLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: isSmallPhone ? 11 : 12,
    color: C.textSecondary,
    textAlign: 'center',
  },
  cardTick: {
    position: 'absolute',
    top: S.xs,
    right: S.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardTickGrad: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  cardTickText: {
    fontFamily: 'DMSans_600SemiBold', fontSize: 10, color: C.white,
  },

  // Loading / error
  loadingBox: {
    paddingVertical: S.xxl,
    alignItems: 'center',
  },
  errorBox: {
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  errorEmoji: { fontSize: 28, marginBottom: S.xs },
  submitError: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: C.error,
    textAlign: 'center',
    marginTop: S.sm,
  },

  // ── CTA
  ctaWrap: {
    width: '100%',
    marginTop: S.lg,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: isSmallPhone ? 13 : 17,
    borderRadius: R.pill,
    ...SHADOW.glow,
  },
  ctaBtnDisabled: { shadowOpacity: 0, elevation: 0 },
});

// const isSmallPhone = width < 375;