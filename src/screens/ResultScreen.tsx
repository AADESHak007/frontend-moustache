// /**
//  * S5 — ResultScreen
//  *
//  * Full-screen display of the generated mustache image.
//  * Actions: Save to camera roll · Share · Try Another
//  */

// import React, { useCallback } from 'react';
// import {
//   Alert,
//   Dimensions,
//   Image,
//   Share,
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
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';
// import * as FileSystem from 'expo-file-system/legacy';

// import { RootStackParamList } from '../types';
// import { useAppStore } from '../store/useAppStore';

// type ResultNav = StackNavigationProp<RootStackParamList, 'Result'>;

// const { width, height } = Dimensions.get('window');

// export default function ResultScreen() {
//   const navigation   = useNavigation<ResultNav>();
//   const currentJob   = useAppStore((s) => s.currentJob);
//   const resetSession = useAppStore((s) => s.resetSession);
//   const selectedStyle = useAppStore((s) => s.selectedStyle);
//   const token         = useAppStore((s) => s.token);

//   // Auth Guard
//   React.useEffect(() => {
//     if (!token) {
//       navigation.replace('SignIn');
//     }
//   }, [token]);

//   const outputUrl = currentJob?.output_url ?? null;

//   // ── Save to camera roll ──
//   const _onSave = useCallback(async () => {
//     if (!outputUrl) return;

//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Please allow access to save photos.');
//       return;
//     }

//     try {
//       // Download to local temp file first
//       const localUri  = FileSystem.cacheDirectory + `mustache_${Date.now()}.jpg`;
//       const download  = await FileSystem.downloadAsync(outputUrl, localUri);
//       await MediaLibrary.saveToLibraryAsync(download.uri);
//       Alert.alert('Saved! 💾', 'Your mustache photo has been saved to your camera roll.');
//     } catch {
//       Alert.alert('Error', 'Failed to save photo. Please try again.');
//     }
//   }, [outputUrl]);

//   // ── Share ──
//   const _onShare = useCallback(async () => {
//     if (!outputUrl) return;

//     try {
//       const localUri = FileSystem.cacheDirectory + `mustache_${Date.now()}.jpg`;
//       const download = await FileSystem.downloadAsync(outputUrl, localUri);

//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(download.uri, {
//           mimeType: 'image/jpeg',
//           dialogTitle: 'Share your mustache! 🥸',
//         });
//       } else {
//         // Fallback to native share sheet
//         await Share.share({
//           message: '🥸 Check out my AI mustache! Made with AI Mustache Generator',
//           url:     outputUrl,
//         });
//       }
//     } catch {
//       Alert.alert('Error', 'Failed to share photo.');
//     }
//   }, [outputUrl]);

//   // ── Try another ──
//   const _onRetry = () => {
//     resetSession();
//     navigation.popToTop();
//   };

//   const insets = useSafeAreaInsets();

//   if (!outputUrl) {
//     // Shouldn't normally happen, but handle gracefully
//     return (
//       <View style={styles.container}>
//         <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={StyleSheet.absoluteFill} />
//         <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//           <ScrollView contentContainerStyle={styles.center} bounces={true}>
//             <Text style={styles.errorEmoji}>😕</Text>
//             <Text style={styles.errorTitle}>No result available</Text>
//             <TouchableOpacity style={styles.retryBtn} onPress={_onRetry}>
//               <Text style={styles.retryText}>Start Over</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={StyleSheet.absoluteFill} />
//       <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//         <ScrollView 
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           bounces={true}
//         >
//           <View style={styles.contentInner}>

//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Your Mustache ✨</Text>
//           {selectedStyle && (
//             <View style={styles.styleBadge}>
//               <Text style={styles.styleBadgeText}>{selectedStyle.label}</Text>
//             </View>
//           )}
//         </View>

//         {/* Full-screen result image */}
//         <View style={styles.imageContainer}>
//           <Image
//             source={{ uri: outputUrl }}
//             style={styles.resultImage}
//             resizeMode="cover"
//           />
//           {/* Success badge */}
//           <View style={styles.successBadge}>
//             <Text style={styles.successText}>🎉 AI Generated</Text>
//           </View>
//         </View>

//         {/* Action buttons */}
//         <View style={styles.actions}>
//           {/* Save */}
//           <TouchableOpacity style={styles.actionBtn} onPress={_onSave} activeOpacity={0.8}>
//             <LinearGradient
//               colors={['#065f46', '#047857']}
//               style={styles.actionGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Text style={styles.actionIcon}>💾</Text>
//               <Text style={styles.actionLabel}>Save</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Share */}
//           <TouchableOpacity style={styles.actionBtn} onPress={_onShare} activeOpacity={0.8}>
//             <LinearGradient
//               colors={['#1e3a5f', '#1d4ed8']}
//               style={styles.actionGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Text style={styles.actionIcon}>📤</Text>
//               <Text style={styles.actionLabel}>Share</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Try Another */}
//           <TouchableOpacity style={styles.actionBtn} onPress={_onRetry} activeOpacity={0.8}>
//             <LinearGradient
//               colors={['#4c1d95', '#7c3aed']}
//               style={styles.actionGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Text style={styles.actionIcon}>🔄</Text>
//               <Text style={styles.actionLabel}>Retry</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.privacyNote}>
//           🔒 This image will be automatically deleted in 24 hours
//         </Text>

//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// }

// const IMG_SIZE = width - 48;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff' },
//   main: { flex: 1 },
//   scrollContent: { flexGrow: 1, paddingVertical: 20 },
//   contentInner: { paddingHorizontal: 24, width: '100%', alignItems: 'center' },
//   center: {
//     flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
//   },
//   header: {
//     flexDirection:  'row',
//     justifyContent: 'space-between',
//     alignItems:     'center',
//     paddingTop:     12,
//     width: '100%',
//     marginBottom:   16,
//   },
//   headerTitle: {
//     fontSize:      22,
//     fontWeight:    '800',
//     color:         '#1a1a2e',
//     letterSpacing: -0.3,
//   },
//   styleBadge: {
//     backgroundColor: '#f3f0ff',
//     borderRadius:    12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderWidth:     1,
//     borderColor:     '#c4b5fd',
//   },
//   styleBadgeText: { color: '#7c3aed', fontSize: 13, fontWeight: '600' },
//   imageContainer: {
//     alignItems:   'center',
//     marginBottom: 24,
//   },
//   resultImage: {
//     width:        IMG_SIZE,
//     height:       IMG_SIZE,
//     borderRadius: 20,
//     borderWidth:  2,
//     borderColor:  '#7c3aed',
//   },
//   successBadge: {
//     position:        'absolute',
//     top:             12,
//     right:           12,
//     backgroundColor: 'rgba(16,185,129,0.9)',
//     borderRadius:    10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   successText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
//   actions: {
//     flexDirection:  'row',
//     width: '100%',
//     gap:            12,
//     marginBottom:   16,
//   },
//   actionBtn: {
//     flex:         1,
//     borderRadius: 14,
//     overflow:     'hidden',
//     shadowColor:  '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation:    6,
//   },
//   actionGradient: {
//     paddingVertical: 16,
//     alignItems:      'center',
//   },
//   actionIcon:  { fontSize: 22, marginBottom: 4 },
//   actionLabel: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
//   privacyNote: {
//     color:      '#9ca3af',
//     fontSize:   12,
//     textAlign:  'center',
//     marginTop:  4,
//   },
//   // Error fallback
//   errorEmoji:  { fontSize: 64, marginBottom: 16 },
//   errorTitle:  { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 24 },
//   retryBtn:    { backgroundColor: '#7c3aed', borderRadius: 14, padding: 16 },
//   retryText:   { color: '#fff', fontSize: 16, fontWeight: '800' },
// });












// CLAUDE CODE



/**
 * S5 — ResultScreen (Redesigned)
 *
 * Full-screen display of the generated mustache image.
 * Actions: Save to camera roll · Share · Try Another
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';
import {
  C, T, S, R, SHADOW, BTN,
  IS_WEB, isDesktop, isTablet, WEB_MAX_W,
} from '../screens/theme';

type ResultNav = StackNavigationProp<RootStackParamList, 'Result'>;

const { width, height } = Dimensions.get('window');
const WASH_W = isDesktop ? width * 0.3 : isTablet ? width * 0.4 : width * 0.6;

const cardWidth = isDesktop ? 560 : isTablet ? 480 : width - S.lg * 2;
const IMG_SIZE = Math.min(
  cardWidth,
  isDesktop ? 520 : isTablet ? 440 : height * 0.44,
);

export default function ResultScreen() {
  const navigation    = useNavigation<ResultNav>();
  const currentJob    = useAppStore((s) => s.currentJob);
  const resetSession  = useAppStore((s) => s.resetSession);
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const token         = useAppStore((s) => s.token);

  // Auth Guard
  useEffect(() => {
    if (!token) navigation.replace('SignIn');
  }, [token]);

  const outputUrl = currentJob?.output_url ?? null;

  // ── Animations ──────────────────────────────────────────────────
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(32)).current;
  const imgScale    = useRef(new Animated.Value(0.88)).current;
  const badgeSlide  = useRef(new Animated.Value(-20)).current;
  const badgeFade   = useRef(new Animated.Value(0)).current;
  const confettiRot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,   { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim,  { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.spring(imgScale,   { toValue: 1, friction: 7, tension: 45, useNativeDriver: true }),
    ]).start(() => {
      // Badge pops in after image settles
      Animated.parallel([
        Animated.timing(badgeFade,  { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(badgeSlide, { toValue: 0, friction: 6, tension: 60, useNativeDriver: true }),
      ]).start();
    });

    // Spin the success star
    Animated.loop(
      Animated.timing(confettiRot, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // ── Save ──────────────────────────────────────────────────────
  const _onSave = useCallback(async () => {
    if (!outputUrl) return;

    if (IS_WEB) {
      try {
        // Simple <a> tag download for web
        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = `mustache_${Date.now()}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } catch (err) {
        console.error('Web download error:', err);
        Alert.alert('Error', 'Failed to download image. Try right-clicking and saving.');
        return;
      }
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to save photos.');
      return;
    }

    try {
      const cacheDir = (FileSystem as any).cacheDirectory ?? '';
      const localUri = cacheDir + `mustache_${Date.now()}.jpg`;
      const download = await FileSystem.downloadAsync(outputUrl, localUri);
      await MediaLibrary.saveToLibraryAsync(download.uri);
      Alert.alert('Saved! 🎉', 'Your mustache photo is now in your camera roll.');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  }, [outputUrl]);

  // ── Share ─────────────────────────────────────────────────────
  const _onShare = useCallback(async () => {
    if (!outputUrl) return;

    try {
      if (IS_WEB) {
        // Direct share URL on web
        await Share.share({
          message: 'Check out my AI mustache! Made with AI Mustache Generator',
          url: outputUrl,
        });
        return;
      }

      const cacheDir = (FileSystem as any).cacheDirectory ?? '';
      const localUri = cacheDir + `mustache_${Date.now()}.jpg`;
      const download = await FileSystem.downloadAsync(outputUrl, localUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(download.uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share your mustache! 🥸',
        });
      } else {
        await Share.share({
          message: '🥸 Check out my AI mustache! Made with AI Mustache Generator',
          url: outputUrl,
        });
      }
    } catch (err) {
      console.error('Share error:', err);
      Alert.alert('Error', 'Failed to share photo.');
    }
  }, [outputUrl]);

  // ── Retry ─────────────────────────────────────────────────────
  const _onRetry = () => {
    resetSession();
    navigation.popToTop();
  };

  const insets = useSafeAreaInsets();

  const confettiInterpolate = confettiRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ── Error fallback ─────────────────────────────────────────────
  if (!outputUrl) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.topWash} pointerEvents="none" />
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={styles.errorCenter} bounces>
          <Text style={{ fontSize: 64, marginBottom: S.lg }}>😕</Text>
          <Text style={[T.h2, { textAlign: 'center', marginBottom: S.sm }]}>
            No result available
          </Text>
          <Text style={[T.sub, { textAlign: 'center', marginBottom: S.xl }]}>
            Something went wrong fetching your image.
          </Text>
          <TouchableOpacity onPress={_onRetry} activeOpacity={0.85}>
            <LinearGradient
              colors={[C.gradStart, C.gradEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.retryBtnSm}
            >
              <Text style={BTN.text}>Start Over</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Ambient washes */}
      <View style={styles.topWash}    pointerEvents="none" />
      {/* <View style={styles.bottomWash} pointerEvents="none" /> */}

      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={[
          styles.scrollContent,
          IS_WEB && { width: cardWidth, alignSelf: 'center' },
          { paddingBottom: insets.bottom + S.lg },
        ]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.header,
            { width: cardWidth, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Eyebrow */}
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={T.label}>Your Result</Text>
            <View style={styles.eyebrowLine} />
          </View>

          <Text style={[T.h2, { textAlign: 'center' }]}>
            Looking Sharp ✨
          </Text>

          {selectedStyle && (
            <View style={styles.styleBadge}>
              <Text style={styles.styleBadgeText}>{selectedStyle.label}</Text>
            </View>
          )}
        </Animated.View>

        {/* ── Image ───────────────────────────────────────────── */}
        <View style={[styles.imageWrapper, { width: cardWidth }]}>
          <Animated.View
            style={[
              styles.imageCard,
              { width: cardWidth, height: IMG_SIZE, transform: [{ scale: imgScale }] },
            ]}
          >
            <Image
              source={{ uri: outputUrl }}
              style={styles.resultImage}
              resizeMode="cover"
            />

            {/* Shimmer gradient on bottom */}
            <LinearGradient
              colors={['transparent', 'rgba(28,24,16,0.45)']}
              style={styles.imageOverlay}
            />
          </Animated.View>

          {/* AI Generated badge — floats top-right */}
          <Animated.View
            style={[
              styles.aiBadge,
              {
                opacity: badgeFade,
                transform: [{ translateY: badgeSlide }],
              },
            ]}
          >
            <Animated.Text
              style={[styles.aiBadgeStar, { transform: [{ rotate: confettiInterpolate }] }]}
            >
              ✦
            </Animated.Text>
            <Text style={styles.aiBadgeText}>AI Generated</Text>
          </Animated.View>
        </View>

        {/* ── Stats row ───────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.statsRow,
            { width: cardWidth, opacity: fadeAnim },
          ]}
        >
          {[
            { icon: '🎨', label: 'Style Applied' },
            { icon: '⚡', label: 'AI Powered' },
            { icon: '🔒', label: 'Private & Secure' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[T.caption, { textAlign: 'center', marginTop: 4, color: C.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* ── Action Buttons ──────────────────────────────────── */}
        <Animated.View
          style={[
            styles.actionsContainer,
            { width: cardWidth, opacity: fadeAnim },
          ]}
        >
          {/* Save — primary */}
          <TouchableOpacity onPress={_onSave} activeOpacity={0.85} style={styles.actionPrimary}>
            <LinearGradient
              colors={[C.gradStart, C.gradEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.actionGradPrimary}
            >
              <Text style={styles.actionIconLg}>💾</Text>
              <Text style={BTN.text}>Save to Camera Roll</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Share + Try Another — secondary row */}
          <View style={styles.actionsSecRow}>
            <TouchableOpacity
              onPress={_onShare}
              activeOpacity={0.8}
              style={styles.actionSecBtn}
            >
              <View style={styles.actionSecInner}>
                <Text style={styles.actionIconMd}>📤</Text>
                <Text style={[T.body, { color: C.primary, fontWeight: '600' }]}>Share</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={_onRetry}
              activeOpacity={0.8}
              style={styles.actionSecBtn}
            >
              <View style={styles.actionSecInner}>
                <Text style={styles.actionIconMd}>🔄</Text>
                <Text style={[T.body, { color: C.primary, fontWeight: '600' }]}>Try Another</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Privacy note ────────────────────────────────────── */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.privacyRow}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={[T.caption, { color: C.textMuted }]}>
              Image auto-deleted after 24 hours
            </Text>
          </View>
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
  //   width: WASH_W * 0.8,
  //   height: WASH_W * 0.8,
  //   borderRadius: WASH_W,
  //   backgroundColor: C.gold,
  //   opacity: 0.05,
  // },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: S.lg,
    paddingTop: S.sm,
    gap: S.lg,
    paddingBottom: 60,
  },

  // ── Header
  header: {
    alignItems: 'center',
    paddingTop: S.sm,
    gap: S.xs,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 2,
  },
  eyebrowLine: {
    width: 22,
    height: 1,
    backgroundColor: C.primary,
    opacity: 0.35,
  },
  styleBadge: {
    backgroundColor: C.accentSoft,
    borderRadius: R.pill,
    paddingHorizontal: S.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  styleBadgeText: {
    color: C.primary,
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
  },

  // ── Image
  imageWrapper: {
    alignSelf: 'center',
    position: 'relative',
    ...SHADOW.card,
  },
  imageCard: {
    borderRadius: R.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: C.borderStrong,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  // AI badge
  aiBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16,185,129,0.88)',
    borderRadius: R.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...SHADOW.soft,
  },
  aiBadgeStar: {
    color: '#fff',
    fontSize: 11,
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'DMSans_600SemiBold',
    letterSpacing: 0.3,
  },

  // ── Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.md,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
  },

  // ── Actions
  actionsContainer: {
    gap: S.sm,
  },
  actionPrimary: {
    borderRadius: R.pill,
    overflow: 'hidden',
    ...SHADOW.glow,
  },
  actionGradPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.sm,
    paddingVertical: isDesktop ? 14 : 17,
  },
  actionIconLg: {
    fontSize: 20,
  },
  actionsSecRow: {
    flexDirection: 'row',
    gap: S.sm,
  },
  actionSecBtn: {
    flex: 1,
    borderRadius: R.xl,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  actionSecInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.xs,
    paddingVertical: 16,
  },
  actionIconMd: {
    fontSize: 18,
  },

  // ── Privacy
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: S.sm,
  },
  privacyIcon: {
    fontSize: 13,
  },

  // ── Error fallback
  errorCenter: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S.lg,
  },
  retryBtnSm: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: R.pill,
    ...SHADOW.glow,
  },
});

