// /**
//  * S4 — ProcessingScreen
//  *
//  * Polls GET /api/jobs/{job_id} every 2 seconds.
//  * Shows animated loader with rotating status messages.
//  * Navigates to ResultScreen on 'done', shows error on 'failed'.
//  */

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Animated,
//   Easing,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useNavigation } from '@react-navigation/native';

// import { RootStackParamList } from '../types';
// import { useAppStore } from '../store/useAppStore';
// import { getJobStatus } from '../api/jobs';
// import LoadingAnimation from '../components/LoadingAnimation';

// type ProcessingNav = StackNavigationProp<RootStackParamList, 'Processing'>;

// const POLL_INTERVAL_MS = 2000;   // 2 seconds — per system design

// const STATUS_MESSAGES = [
//   '🔍  Detecting face landmarks...',
//   '📐  Measuring lip position...',
//   '🎨  Loading mustache style...',
//   '✂️   Resizing & rotating...',
//   '🖼️   Compositing overlay...',
//   '💾  Compressing result...',
// ];

// export default function ProcessingScreen() {
//   const navigation   = useNavigation<ProcessingNav>();
//   const currentJob   = useAppStore((s) => s.currentJob);
//   const updateJob    = useAppStore((s) => s.updateJob);
//   const resetSession = useAppStore((s) => s.resetSession);
//   const token        = useAppStore((s) => s.token);

//   const [msgIndex,     setMsgIndex]    = useState(0);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   // Auth Guard
//   useEffect(() => {
//     if (!token) {
//       navigation.replace('SignIn');
//     }
//   }, [token]);

//   const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // Cycle status messages every 2s for a lively feel
//   useEffect(() => {
//     const msgTimer = setInterval(() => {
//       setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
//     }, 2000);
//     return () => clearInterval(msgTimer);
//   }, []);

//   // Poll job status every 2 seconds
//   useEffect(() => {
//     if (!currentJob?.job_id) return;

//     const poll = async () => {
//       try {
//         const job = await getJobStatus(currentJob.job_id);
//         updateJob({ status: job.status, output_url: job.output_url, error: job.error });

//         if (job.status === 'done') {
//           clearInterval(pollRef.current!);
//           navigation.navigate('Result');
//         } else if (job.status === 'failed') {
//           clearInterval(pollRef.current!);
//           setErrorMessage(
//             job.error ?? 'Processing failed. Please try again with a clearer photo.'
//           );
//         }
//       } catch {
//         // Network error — keep trying
//       }
//     };

//     poll(); // Immediate first poll
//     pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

//     return () => {
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, [currentJob?.job_id]);

//   const _onRetry = () => {
//     resetSession();
//     navigation.popToTop();
//   };

//   const insets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={StyleSheet.absoluteFill} />
      
//       <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//         <ScrollView 
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           bounces={true}
//         >

//         {errorMessage ? (
//           /* ── Error state ── */
//           <View style={styles.center}>
//             <Text style={styles.errorEmoji}>😕</Text>
//             <Text style={styles.errorTitle}>Processing Failed</Text>
//             <Text style={styles.errorMsg}>{errorMessage}</Text>
//             <TouchableOpacity style={styles.retryBtn} onPress={_onRetry}>
//               <Text style={styles.retryText}>Try Again</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           /* ── Loading state ── */
//           <View style={styles.center}>
//             <LoadingAnimation />

//             <Text style={styles.headline}>AI is working{'\n'}its magic...</Text>

//             <View style={styles.msgBox}>
//               <Text style={styles.statusMsg} key={msgIndex}>
//                 {STATUS_MESSAGES[msgIndex]}
//               </Text>
//             </View>

//             <Text style={styles.subtext}>
//               Usually takes 5–15 seconds{'\n'}depending on image complexity
//             </Text>

//             {/* Job ID for transparency */}
//             {currentJob?.job_id && (
//               <Text style={styles.jobId} numberOfLines={1} ellipsizeMode="middle">
//                 Job: {currentJob.job_id}
//               </Text>
//             )}
//           </View>
//         )}

//         </ScrollView>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff' },
//   main: { flex: 1 },
//   scrollContent: { flexGrow: 1 },
//   center: {
//     flex:           1,
//     alignItems:     'center',
//     justifyContent: 'center',
//     paddingHorizontal: 32,
//   },
//   headline: {
//     fontSize:      30,
//     fontWeight:    '800',
//     color:         '#1a1a2e',
//     textAlign:     'center',
//     letterSpacing: -0.5,
//     marginTop:     32,
//     marginBottom:  24,
//   },
//   msgBox: {
//     backgroundColor: '#ffffff',
//     borderRadius:    14,
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderWidth:     1,
//     borderColor:     '#ede9fe',
//     marginBottom:    28,
//     minWidth:        260,
//     alignItems:      'center',
//     shadowColor:     '#7c3aed',
//     shadowOffset:    { width: 0, height: 4 },
//     shadowOpacity:   0.08,
//     shadowRadius:    12,
//     elevation:       3,
//   },
//   statusMsg: {
//     color:      '#374151',
//     fontSize:   15,
//     fontWeight: '500',
//     textAlign:  'center',
//   },
//   subtext: {
//     color:      '#6b7280',
//     fontSize:   13,
//     textAlign:  'center',
//     lineHeight: 20,
//   },
//   jobId: {
//     color:        '#9ca3af',
//     fontSize:     11,
//     fontFamily:   'monospace',
//     marginTop:    20,
//     maxWidth:     260,
//   },
//   // Error
//   errorEmoji: { fontSize: 64, marginBottom: 16 },
//   errorTitle: {
//     fontSize:     24,
//     fontWeight:   '800',
//     color:        '#1a1a2e',
//     marginBottom: 12,
//   },
//   errorMsg: {
//     color:        '#6b7280',
//     fontSize:     15,
//     textAlign:    'center',
//     lineHeight:   22,
//     marginBottom: 32,
//   },
//   retryBtn: {
//     backgroundColor: '#7c3aed',
//     borderRadius:    14,
//     paddingVertical: 16,
//     paddingHorizontal: 40,
//   },
//   retryText: {
//     color:      '#ffffff',
//     fontSize:   16,
//     fontWeight: '800',
//   },
// });




// calude code

/**
 * S4 — ProcessingScreen (Redesigned)
 *
 * Polls GET /api/jobs/{job_id} every 2 seconds.
 * Shows animated loader with rotating status messages.
 * Navigates to ResultScreen on 'done', shows error on 'failed'.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getJobStatus } from '../api/jobs';
import {
  C, T, S, R, SHADOW, BTN,
  IS_WEB, isDesktop, isTablet, WEB_MAX_W,
} from '../screens/theme';

type ProcessingNav = StackNavigationProp<RootStackParamList, 'Processing'>;

const { width, height } = Dimensions.get('window');
const POLL_INTERVAL_MS = 2000;

const STATUS_STEPS = [
  { icon: '👤', label: 'Detecting face landmarks', detail: 'Mapping your facial structure' },
  { icon: '📐', label: 'Measuring lip position', detail: 'Finding the perfect placement' },
  { icon: '🎨', label: 'Loading mustache style', detail: 'Selecting your chosen look' },
  { icon: '✂️',  label: 'Resizing & rotating', detail: 'Fitting it just right' },
  { icon: '🖼️',  label: 'Compositing overlay', detail: 'Blending with natural lighting' },
  { icon: '✨',  label: 'Finalising your look', detail: 'Almost there...' },
];

const WASH_W = isDesktop ? width * 0.3 : isTablet ? width * 0.4 : width * 0.6;
const cardWidth = isDesktop ? 480 : isTablet ? 420 : width - S.lg * 2;

export default function ProcessingScreen() {
  const navigation   = useNavigation<ProcessingNav>();
  const currentJob   = useAppStore((s) => s.currentJob);
  const updateJob    = useAppStore((s) => s.updateJob);
  const resetSession = useAppStore((s) => s.resetSession);
  const token        = useAppStore((s) => s.token);

  const [stepIndex,    setStepIndex]    = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsed,      setElapsed]      = useState(0);

  // Auth Guard
  useEffect(() => {
    if (!token) navigation.replace('SignIn');
  }, [token]);

  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Animations ──────────────────────────────────────────────────
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(24)).current;
  const spinAnim   = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0.96)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stepFade   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Spin the outer ring
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Breathe the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1.04, duration: 1800, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 0.96, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Elapsed timer
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Cycle steps with fade transition
  useEffect(() => {
    const msgTimer = setInterval(() => {
      Animated.timing(stepFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setStepIndex((i) => {
          const next = (i + 1) % STATUS_STEPS.length;
          Animated.timing(progressAnim, {
            toValue: next / (STATUS_STEPS.length - 1),
            duration: 400,
            useNativeDriver: false,
          }).start();
          return next;
        });
        Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 2200);
    return () => clearInterval(msgTimer);
  }, []);

  // Poll job status
  useEffect(() => {
    if (!currentJob?.job_id) return;

    const poll = async () => {
      try {
        const job = await getJobStatus(currentJob.job_id);
        updateJob({ status: job.status, output_url: job.output_url, error: job.error });

        if (job.status === 'done') {
          clearInterval(pollRef.current!);
          if (timerRef.current) clearInterval(timerRef.current);
          navigation.navigate('Result');
        } else if (job.status === 'failed') {
          clearInterval(pollRef.current!);
          if (timerRef.current) clearInterval(timerRef.current);
          setErrorMessage(job.error ?? 'Processing failed. Please try again with a clearer photo.');
        }
      } catch {
        // Network error — keep trying
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [currentJob?.job_id]);

  const _onRetry = () => {
    resetSession();
    navigation.popToTop();
  };

  const insets = useSafeAreaInsets();

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '90%'],
  });

  const elapsedStr = elapsed < 60
    ? `${elapsed}s`
    : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Ambient washes */}
      <View style={styles.topWash} pointerEvents="none" />
      {/* <View style={styles.bottomWash} pointerEvents="none" /> */}

      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + S.lg },
        ]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <Animated.View
          style={[
            styles.inner,
            { width: cardWidth, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {errorMessage ? (
            /* ── Error State ─────────────────────────────────────── */
            <View style={styles.errorContainer}>
              {/* Eyebrow */}
              <View style={styles.eyebrowRow}>
                <View style={styles.eyebrowLine} />
                <Text style={T.label}>Oops</Text>
                <View style={styles.eyebrowLine} />
              </View>

              <View style={styles.errorIconWrap}>
                <LinearGradient
                  colors={['#FFF5F5', '#FFE5E5']}
                  style={styles.errorIconGrad}
                >
                  <Text style={styles.errorEmoji}>😕</Text>
                </LinearGradient>
              </View>

              <Text style={[T.h2, { textAlign: 'center', marginTop: S.lg }]}>
                Something Went Wrong
              </Text>
              <Text style={[T.sub, { textAlign: 'center', marginTop: S.sm, lineHeight: 22 }]}>
                {errorMessage}
              </Text>

              <View style={styles.errorCard}>
                <Text style={[T.caption, { color: C.textMuted }]}>💡 Tips for better results</Text>
                <View style={styles.tipDivider} />
                {[
                  'Use a well-lit, clear selfie',
                  'Ensure your face is fully visible',
                  'Avoid heavy filters or sunglasses',
                ].map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <View style={styles.tipDot} />
                    <Text style={[T.sub, { flex: 1 }]}>{tip}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity onPress={_onRetry} activeOpacity={0.85} style={{ width: '100%' }}>
                <LinearGradient
                  colors={[C.gradStart, C.gradEnd]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.retryBtn}
                >
                  <Text style={[BTN.text]}>🔄  Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          ) : (
            /* ── Loading State ───────────────────────────────────── */
            <View style={styles.loadingContainer}>

              {/* Eyebrow */}
              <View style={styles.eyebrowRow}>
                <View style={styles.eyebrowLine} />
                <Text style={T.label}>Processing</Text>
                <View style={styles.eyebrowLine} />
              </View>

              {/* Central orb */}
              <View style={styles.orbWrapper}>
                {/* Spinning outer ring */}
                <Animated.View
                  style={[
                    styles.spinRing,
                    { transform: [{ rotate: spinInterpolate }] },
                  ]}
                />
                {/* Slow counter-spin ring */}
                <Animated.View
                  style={[
                    styles.spinRingInner,
                    {
                      transform: [{
                        rotate: spinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '-360deg'],
                        })
                      }],
                    },
                  ]}
                />

                {/* Core badge */}
                <Animated.View style={[styles.orbCore, { transform: [{ scale: breathAnim }] }]}>
                  <LinearGradient
                    colors={[C.gradStart, C.gradMid, C.gradEnd]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.orbGrad}
                  >
                    <Text style={styles.orbEmoji}>🥸</Text>
                  </LinearGradient>
                </Animated.View>
              </View>

              {/* Headline */}
              <Text style={[T.h2, styles.headline]}>
                AI is crafting{'\n'}your look
              </Text>
              <Text style={[T.sub, { textAlign: 'center', marginTop: S.xs }]}>
                Usually takes 5–15 seconds
              </Text>

              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
                  <LinearGradient
                    colors={[C.gradStart, C.gradEnd]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              </View>

              {/* Active step card */}
              <Animated.View style={[styles.stepCard, { opacity: stepFade }]}>
                <View style={styles.stepIconWrap}>
                  <Text style={styles.stepEmoji}>{STATUS_STEPS[stepIndex].icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[T.body, { fontWeight: '600', color: C.textPrimary }]}>
                    {STATUS_STEPS[stepIndex].label}
                  </Text>
                  <Text style={[T.caption, { marginTop: 2 }]}>
                    {STATUS_STEPS[stepIndex].detail}
                  </Text>
                </View>
                <View style={styles.stepSpinner}>
                  <Animated.Text
                    style={{
                      fontSize: 16,
                      transform: [{ rotate: spinInterpolate }],
                    }}
                  >
                    ⚙️
                  </Animated.Text>
                </View>
              </Animated.View>

              {/* Step dots */}
              <View style={styles.stepDots}>
                {STATUS_STEPS.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i <= stepIndex && styles.dotActive,
                      i === stepIndex && styles.dotCurrent,
                    ]}
                  />
                ))}
              </View>

              {/* Elapsed + Job ID footer */}
              <View style={styles.footer}>
                <View style={styles.footerChip}>
                  <View style={styles.pulseDot} />
                  <Text style={[T.caption, { color: C.textSecondary }]}>Live</Text>
                </View>
                <Text style={[T.caption, { color: C.textMuted }]}>
                  ⏱  {elapsedStr} elapsed
                </Text>
                {currentJob?.job_id && (
                  <Text style={styles.jobId} numberOfLines={1} ellipsizeMode="middle">
                    #{currentJob.job_id.slice(-8)}
                  </Text>
                )}
              </View>

            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    ...(IS_WEB ? { alignItems: 'center' as const } : {}),
  },

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
  //   position: 'absolute',
  //   bottom: 60,
  //   right: -40,
  //   width: WASH_W * 0.7,
  //   height: WASH_W * 0.7,
  //   borderRadius: WASH_W,
  //   backgroundColor: C.gold,
  //   opacity: 0.05,
  // },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.lg,
    paddingTop: S.lg,
  },

  inner: {
    alignSelf: 'center',
  },

  // ── Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: S.lg,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: S.md,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: C.primary,
    opacity: 0.35,
  },

  // Orb
  orbWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: S.lg,
  },
  spinRing: {
    position: 'absolute',
    width: 138,
    height: 138,
    borderRadius: 69,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: C.gold,
    borderRightColor: C.accent,
  },
  spinRingInner: {
    position: 'absolute',
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderTopColor: C.primaryLight,
    borderLeftColor: C.gold,
    opacity: 0.5,
  },
  orbCore: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    ...SHADOW.glow,
  },
  orbGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbEmoji: {
    fontSize: 44,
  },

  headline: {
    textAlign: 'center',
    marginBottom: S.md,
  },

  // Progress
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: C.bgSecondary,
    borderRadius: R.pill,
    overflow: 'hidden',
    marginTop: S.lg,
    marginBottom: S.md,
    borderWidth: 1,
    borderColor: C.border,
  },
  progressFill: {
    height: '100%',
    borderRadius: R.pill,
    overflow: 'hidden',
  },

  // Step card
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.md,
    borderWidth: 1,
    borderColor: C.border,
    width: '100%',
    marginBottom: S.md,
    ...SHADOW.card,
  },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  stepEmoji: {
    fontSize: 20,
  },
  stepSpinner: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Step dots
  stepDots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: S.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.border,
  },
  dotActive: {
    backgroundColor: C.primaryLight,
  },
  dotCurrent: {
    backgroundColor: C.primary,
    width: 18,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.card,
    paddingHorizontal: S.sm,
    paddingVertical: 5,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.success,
  },
  jobId: {
    color: C.textMuted,
    fontSize: 10,
    fontFamily: 'monospace',
    maxWidth: 100,
  },

  // ── Error
  errorContainer: {
    alignItems: 'center',
    paddingVertical: S.lg,
  },
  errorIconWrap: {
    marginTop: S.sm,
    borderRadius: 40,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  errorIconGrad: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorEmoji: {
    fontSize: 44,
  },
  errorCard: {
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: C.border,
    marginTop: S.lg,
    marginBottom: S.lg,
    ...SHADOW.soft,
  },
  tipDivider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: S.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    marginBottom: S.xs,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.primary,
    opacity: 0.6,
  },
  retryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: R.pill,
    ...SHADOW.glow,
  },
});