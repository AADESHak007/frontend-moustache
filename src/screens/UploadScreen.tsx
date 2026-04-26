// /**
//  * S2 — UploadScreen
//  *
//  * Two options: camera selfie or gallery pick.
//  * Shows image preview once selected.
//  * "Next →" navigates to StylePickerScreen.
//  */

// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   Image,
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
// import * as ImagePicker from 'expo-image-picker';

// import { RootStackParamList } from '../types';
// import { useAppStore } from '../store/useAppStore';

// type UploadNav = StackNavigationProp<RootStackParamList, 'Upload'>;

// const MAX_SIZE_PX = 4000;

// export default function UploadScreen() {
//   const navigation         = useNavigation<UploadNav>();
//   const setSelectedImageUri = useAppStore((s) => s.setSelectedImageUri);
//   const selectedImageUri    = useAppStore((s) => s.selectedImageUri);
//   const token               = useAppStore((s) => s.token);

//   const [loading, setLoading] = useState(false);

//   // Auth Guard
//   React.useEffect(() => {
//     if (!token) {
//       navigation.replace('SignIn');
//     }
//   }, [token]);

//   const _pickFromGallery = async () => {
//     setLoading(true);
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Gallery permission is required to select a photo.');
//         return;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes:       ImagePicker.MediaTypeOptions.Images,
//         allowsEditing:    true,
//         aspect:           [1, 1],
//         quality:          0.9,
//         allowsMultipleSelection: false,
//       });
//       if (!result.canceled && result.assets[0]) {
//         setSelectedImageUri(result.assets[0].uri);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const _takeWithCamera = async () => {
//     setLoading(true);
//     try {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Camera permission is required to take a selfie.');
//         return;
//       }
//       const result = await ImagePicker.launchCameraAsync({
//         cameraType:    ImagePicker.CameraType.front,
//         allowsEditing: true,
//         aspect:        [1, 1],
//         quality:       0.9,
//       });
//       if (!result.canceled && result.assets[0]) {
//         setSelectedImageUri(result.assets[0].uri);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const _onNext = () => {
//     if (selectedImageUri) {
//       navigation.navigate('StylePicker');
//     }
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
//           <View style={styles.contentInner}>

//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.stepLabel}>Step 1 of 3</Text>
//         </View>

//         <Text style={styles.title}>Upload Your Photo</Text>
//         <Text style={styles.subtitle}>Take a selfie or choose from your gallery</Text>

//         {/* Image Preview / Placeholder */}
//         <View style={styles.previewContainer}>
//           {selectedImageUri ? (
//             <Image source={{ uri: selectedImageUri }} style={styles.preview} />
//           ) : (
//             <View style={styles.placeholder}>
//               {loading ? (
//                 <ActivityIndicator size="large" color="#a855f7" />
//               ) : (
//                 <>
//                   <Text style={styles.placeholderEmoji}>📷</Text>
//                   <Text style={styles.placeholderText}>No photo selected</Text>
//                 </>
//               )}
//             </View>
//           )}
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonGroup}>
//           <TouchableOpacity
//             style={[styles.optionBtn, styles.cameraBtn]}
//             onPress={_takeWithCamera}
//             disabled={loading}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.optionIcon}>📷</Text>
//             <Text style={styles.optionLabel}>Take Selfie</Text>
//             <Text style={styles.optionSub}>Use front camera</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.optionBtn, styles.galleryBtn]}
//             onPress={_pickFromGallery}
//             disabled={loading}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.optionIcon}>🖼️</Text>
//             <Text style={styles.optionLabel}>From Gallery</Text>
//             <Text style={styles.optionSub}>Choose existing photo</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Validation hint */}
//         <Text style={styles.hint}>JPEG or PNG · Max 5MB · Max 4000×4000px</Text>

//         {/* Next */}
//         {selectedImageUri && (
//           <TouchableOpacity style={styles.nextBtn} onPress={_onNext} activeOpacity={0.85}>
//             <LinearGradient
//               colors={['#9333ea', '#7c3aed']}
//               style={styles.nextGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Text style={styles.nextText}>Choose Style  →</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         )}

//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// }

// const PREVIEW_SIZE = 260;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff' },
//   main: { flex: 1 },
//   scrollContent: {
//     flexGrow: 1,
//     paddingVertical: 20,
//   },
//   contentInner: {
//     paddingHorizontal: 24,
//     width: '100%',
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection:  'row',
//     justifyContent: 'space-between',
//     alignItems:     'center',
//     paddingTop:     12,
//     width: '100%',
//     marginBottom:   24,
//   },
//   backBtn:   { padding: 4, alignSelf: 'flex-start' },
//   backText:  { color: '#6b7280', fontSize: 15, fontWeight: '500' },
//   stepLabel: { color: '#9ca3af', fontSize: 13, fontWeight: '600' },
//   title: {
//     fontSize:      28,
//     fontWeight:    '800',
//     color:         '#1a1a2e',
//     letterSpacing: -0.5,
//     alignSelf: 'flex-start',
//     marginBottom:  6,
//   },
//   subtitle: {
//     fontSize:     15,
//     color:        '#6b7280',
//     alignSelf: 'flex-start',
//     marginBottom: 28,
//   },
//   previewContainer: {
//     alignItems:   'center',
//     marginBottom: 28,
//   },
//   preview: {
//     width:        PREVIEW_SIZE,
//     height:       PREVIEW_SIZE,
//     borderRadius: PREVIEW_SIZE / 2,
//     borderWidth:  3,
//     borderColor:  '#7c3aed',
//   },
//   placeholder: {
//     width:           PREVIEW_SIZE,
//     height:          PREVIEW_SIZE,
//     borderRadius:    PREVIEW_SIZE / 2,
//     borderWidth:     2,
//     borderColor:     '#c4b5fd',
//     borderStyle:     'dashed',
//     backgroundColor: '#f3f0ff',
//     alignItems:      'center',
//     justifyContent:  'center',
//   },
//   placeholderEmoji: { fontSize: 52, marginBottom: 10 },
//   placeholderText:  { color: '#9ca3af', fontSize: 14 },
//   buttonGroup: {
//     flexDirection: 'row',
//     width: '100%',
//     gap:           14,
//     marginBottom:  20,
//   },
//   optionBtn: {
//     flex:            1,
//     borderRadius:    16,
//     padding:         18,
//     alignItems:      'center',
//     borderWidth:     1.5,
//   },
//   cameraBtn: {
//     backgroundColor: '#f3f0ff',
//     borderColor:     '#7c3aed',
//   },
//   galleryBtn: {
//     backgroundColor: '#f0fdf4',
//     borderColor:     '#059669',
//   },
//   optionIcon:  { fontSize: 28, marginBottom: 6 },
//   optionLabel: { color: '#1a1a2e', fontSize: 14, fontWeight: '700', marginBottom: 2 },
//   optionSub:   { color: '#9ca3af', fontSize: 12 },
//   hint: {
//     color:        '#9ca3af',
//     fontSize:     12,
//     textAlign:    'center',
//     marginBottom: 24,
//   },
//   nextBtn: {
//     width: '100%',
//     borderRadius:  16,
//     overflow:      'hidden',
//     shadowColor:   '#7c3aed',
//     shadowOffset:  { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius:  16,
//     elevation:     8,
//   },
//   nextGradient: {
//     paddingVertical:   18,
//     alignItems:        'center',
//   },
//   nextText: {
//     color:         '#ffffff',
//     fontSize:      17,
//     fontWeight:    '800',
//     letterSpacing: 0.3,
//   },
// });
















//CHATGPT below

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import * as ImagePicker from 'expo-image-picker';

// import { RootStackParamList } from '../types';
// import { useAppStore } from '../store/useAppStore';
// import { C, T, S, SHADOW, BTN } from '../screens/theme';

// type UploadNav = StackNavigationProp<RootStackParamList, 'Upload'>;

// export default function UploadScreen() {
//   const navigation = useNavigation<UploadNav>();
//   const route = useRoute<any>();
//   const insets = useSafeAreaInsets();

//   const setSelectedImageUri = useAppStore((s) => s.setSelectedImageUri);

//   const passedImage = route.params?.image;
//   const [localImage, setLocalImage] = useState<string | null>(passedImage || null);
//   const [loading, setLoading] = useState(false);

//   const pickImage = async () => {
//     setLoading(true);
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') return;

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setLocalImage(result.assets[0].uri);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const takePhoto = async () => {
//     setLoading(true);
//     try {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== 'granted') return;

//       const result = await ImagePicker.launchCameraAsync({
//         cameraType: ImagePicker.CameraType.front,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setLocalImage(result.assets[0].uri);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (!localImage) return;
//     setSelectedImageUri(localImage);
//     navigation.navigate('StylePicker');
//   };

//   return (
//     <View style={[styles.screen, { paddingTop: insets.top }]}>

//       {/* HEADER */}
//       <View style={styles.header}>
//         <Text style={T.sub} onPress={() => navigation.goBack()}>← Back</Text>
//         <Text style={T.caption}>Step 1 of 3</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scroll}>

//         {/* TITLE */}
//         <Text style={styles.title}>
//           {localImage ? 'Preview Your Photo' : 'Upload Your Photo'}
//         </Text>

//         <Text style={styles.subtitle}>
//           {localImage
//             ? 'Ready? Choose your style'
//             : 'Take a selfie or choose from gallery'}
//         </Text>

//         {/* IMAGE */}
//         <View style={styles.previewWrapper}>
//           {loading ? (
//             <ActivityIndicator />
//           ) : localImage ? (
//             <Image source={{ uri: localImage }} style={styles.preview} />
//           ) : (
//             <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
//               <Text style={{ fontSize: 42 }}>📷</Text>
//               <Text style={{ marginTop: 8, color: '#666' }}>Tap to upload</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* OPTIONS */}
//         {!localImage && (
//           <View style={styles.row}>
//             <TouchableOpacity style={styles.option} onPress={takePhoto}>
//               <Text style={styles.icon}>📷</Text>
//               <Text>Selfie</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.option} onPress={pickImage}>
//               <Text style={styles.icon}>🖼️</Text>
//               <Text>Gallery</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* CTA */}
//         {localImage && (
//           <TouchableOpacity style={styles.cta} onPress={handleNext}>
//             <Text style={styles.ctaText}>Choose Style →</Text>
//           </TouchableOpacity>
//         )}

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginBottom: 10,
//   },

//   scroll: {
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginTop: 10,
//   },

//   subtitle: {
//     textAlign: 'center',
//     color: '#777',
//     marginTop: 6,
//     marginBottom: 24,
//   },

//   previewWrapper: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 24,
//     overflow: 'hidden',
//     backgroundColor: '#f5f5f7',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...SHADOW.soft,
//   },

//   preview: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },

//   placeholder: {
//     alignItems: 'center',
//   },

//   row: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 20,
//   },

//   option: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 16,
//     backgroundColor: '#f5f5f7',
//     alignItems: 'center',
//   },

//   icon: {
//     fontSize: 24,
//     marginBottom: 6,
//   },

//   cta: {
//     marginTop: 30,
//     backgroundColor: '#111',
//     paddingVertical: 16,
//     borderRadius: 999,
//     alignItems: 'center',
//   },

//   ctaText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });



// claud below

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';
import {
  C, T, S, R, SHADOW, BTN,
  IS_WEB, isDesktop, isTablet, WEB_MAX_W,
} from '../screens/theme';

type UploadNav = StackNavigationProp<RootStackParamList, 'Upload'>;

const { width, height } = Dimensions.get('window');

// ─── Responsive helpers ───────────────────────────────────────────────
const isSmallPhone = width < 375;
const cardWidth =
  isDesktop ? 560 :
    isTablet ? 480 :
      width - S.lg * 2;

// Preview square: fills the column but never exceeds ~55% of screen height
const previewSize = Math.min(
  cardWidth,
  isDesktop ? 520 :
    isTablet ? 440 :
      height * (isSmallPhone ? 0.38 : 0.44),
);

const WEB_COL = Math.min(WEB_MAX_W, width);

/** Decorative wash size: 60% width on mobile, 40% on tablet, 30% on desktop */
const WASH_W = isDesktop ? width * 0.3 : isTablet ? width * 0.4 : width * 0.6;
// ─── Step indicator config ────────────────────────────────────────────
const STEPS = ['Upload', 'Style', 'Result'];

// ─── Source option cards ─────────────────────────────────────────────
const SOURCES = [
  { id: 'camera', icon: '📷', label: 'Take Selfie', sub: 'Use front camera' },
  { id: 'gallery', icon: '🖼️', label: 'From Gallery', sub: 'Pick from library' },
];

export default function UploadScreen() {
  const navigation = useNavigation<UploadNav>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const setSelectedImageUri = useAppStore((s) => s.setSelectedImageUri);
  const storeImage = useAppStore((s) => s.selectedImageUri);

  const passedImage = route.params?.image;
  const [localImage, setLocalImage] = useState<string | null>(passedImage || storeImage || null);
  const [loading, setLoading] = useState(false);

  // ─── Animations ──────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;
  const imgScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (localImage) {
      imgScale.setValue(0.92);
      Animated.spring(imgScale, {
        toValue: 1, friction: 7, tension: 50, useNativeDriver: true,
      }).start();
    }
  }, [localImage]);

  useEffect(() => {
    if (passedImage || storeImage) {
      setLocalImage(passedImage || storeImage);
    }
  }, [passedImage, storeImage]);

  // ─── Actions ─────────────────────────────────────────────────────
  const pickImage = async () => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) setLocalImage(result.assets[0].uri);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        quality: 1,
      });
      if (!result.canceled) setLocalImage(result.assets[0].uri);
    } finally {
      setLoading(false);
    }
  };

  const handleSource = (id: string) =>
    id === 'camera' ? takePhoto() : pickImage();

  const handleNext = () => {
    if (!localImage) return;
    setSelectedImageUri(localImage);
    navigation.navigate('StylePicker');
  };

  const bottomPad = insets.bottom + S.md;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Ambient washes — same as HomeScreen */}
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
          {STEPS.map((step, i) => {
            const active = i === 0;
            const done = false; // step 1 is always current on this screen
            return (
              <React.Fragment key={step}>
                {i > 0 && (
                  <View style={[styles.stepLine, done && styles.stepLineDone]} />
                )}
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      active && styles.stepDotActive,
                    ]}
                  >
                    {active ? (
                      <LinearGradient
                        colors={[C.gradStart, C.gradEnd]}
                        style={styles.stepDotGrad}
                      >
                        <Text style={styles.stepDotNum}>{i + 1}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.stepDotNumInactive}>{i + 1}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      active && { color: C.primary, fontFamily: 'DMSans_500Medium' },
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* Right spacer (keeps step row centred) */}
        <View style={styles.backBtn} />
      </Animated.View>

      {/* ── SCROLL ───────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={[
          styles.scrollContent,
          IS_WEB && styles.scrollContentWeb,
          { paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
        bounces
      >

        {/* ── TITLE BLOCK ──────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.titleBlock,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Eyebrow — same pattern as HomeScreen */}
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={T.label}>Step 1 of 3</Text>
            <View style={styles.eyebrowLine} />
          </View>

          <Text style={[T.h2, { textAlign: 'center' }]}>
            {localImage ? 'Looking Good!' : 'Upload Your Photo'}
          </Text>
          <Text style={[T.sub, styles.titleSub]}>
            {localImage
              ? 'Tap the image to swap it, or continue below'
              : 'Choose a clear selfie for the best AI results'}
          </Text>
        </Animated.View>

        {/* ── PREVIEW / PLACEHOLDER ────────────────────────────── */}
        <Animated.View
          style={[
            styles.previewOuter,
            { width: cardWidth, transform: [{ scale: imgScale }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.previewCard, { width: cardWidth, height: previewSize }]}
            onPress={pickImage}
            activeOpacity={localImage ? 0.92 : 0.8}
          >
            {loading ? (
              /* Loading state */
              <View style={styles.placeholderInner}>
                <ActivityIndicator size="large" color={C.primary} />
                <Text style={[T.caption, { marginTop: S.sm, color: C.textSecondary }]}>
                  Loading…
                </Text>
              </View>
            ) : localImage ? (
              /* Image preview */
              <>
                <Image source={{ uri: localImage }} style={styles.preview} />
                {/* Tap-to-change hint overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(28,24,16,0.60)']}
                  style={styles.previewOverlay}
                >
                  <View style={styles.changeHintPill}>
                    <Text style={styles.changeHintText}>TAP TO CHANGE</Text>
                  </View>
                </LinearGradient>
              </>
            ) : (
              /* Empty placeholder */
              <View style={styles.placeholderInner}>
                <LinearGradient
                  colors={[C.gradStart, C.gradEnd]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={styles.placeholderIcon}
                >
                  <Text style={styles.placeholderEmoji}>📸</Text>
                </LinearGradient>
                <Text style={[T.body, { marginTop: S.md, color: C.textPrimary, fontWeight: '500' }]}>
                  No photo selected
                </Text>
                <Text style={[T.caption, { marginTop: 4, color: C.textMuted, textAlign: 'center' }]}>
                  Face clearly visible · Good lighting
                </Text>
                {/* Format pills */}
                <View style={styles.fmtRow}>
                  {['JPG', 'PNG', 'WEBP'].map(f => (
                    <View key={f} style={styles.fmtPill}>
                      <Text style={styles.fmtText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* ── SOURCE CARDS (shown when no image yet) ───────────── */}
        {!localImage && !loading && (
          <Animated.View
            style={[
              styles.sourceRow,
              { width: cardWidth, opacity: fadeAnim },
            ]}
          >
            {SOURCES.map((src) => (
              <TouchableOpacity
                key={src.id}
                style={styles.sourceCard}
                onPress={() => handleSource(src.id)}
                activeOpacity={0.75}
              >
                <View style={styles.sourceIconWrap}>
                  <Text style={styles.sourceEmoji}>{src.icon}</Text>
                </View>
                <Text style={[T.body, { fontWeight: '600', color: C.textPrimary, marginTop: S.sm }]}>
                  {src.label}
                </Text>
                <Text style={[T.caption, { marginTop: 3, textAlign: 'center' }]}>
                  {src.sub}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* ── TIPS (shown when no image) ───────────────────────── */}
        {!localImage && !loading && (
          <Animated.View
            style={[styles.tipsCard, { width: cardWidth, opacity: fadeAnim }]}
          >
            <Text style={[T.label, { marginBottom: S.sm }]}>Tips for best results</Text>
            {[
              ['💡', 'Good natural lighting'],
              ['🧍', 'Face centred & forward-facing'],
              ['📐', 'Avoid heavy filters or hats'],
            ].map(([icon, tip]) => (
              <View key={tip} style={styles.tipRow}>
                <Text style={styles.tipIcon}>{icon}</Text>
                <Text style={[T.sub, { flex: 1 }]}>{tip}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        {localImage && (
          <Animated.View
            style={[
              styles.ctaWrap,
              { width: cardWidth, opacity: fadeAnim },
            ]}
          >
            {/* Primary CTA */}
            <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
              <LinearGradient
                colors={[C.gradStart, C.gradEnd]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.ctaBtn}
              >
                <Text style={BTN.text}>Choose My Style</Text>
                <Text style={[BTN.text, { opacity: 0.75 }]}>→</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary: swap photo */}
            {/* <TouchableOpacity
              style={styles.swapBtn}
              onPress={pickImage}
              activeOpacity={0.65}
            >
              <Text style={[T.caption, { color: C.textMuted }]}>
                🔄{'  '}
                <Text style={{ color: C.primary, fontFamily: 'DMSans_500Medium' }}>
                  Use a different photo
                </Text>
              </Text>
            </TouchableOpacity> */}
          </Animated.View>
        )}

        {/* ── UPLOAD BUTTONS (shown when image present) ────────── */}
        {localImage && (
          <Animated.View
            style={[
              styles.sourceRow,
              { width: cardWidth, opacity: fadeAnim, marginTop: S.sm },
            ]}
          >
            {SOURCES.map((src) => (
              <TouchableOpacity
                key={src.id}
                style={[styles.sourceCard, styles.sourceCardSmall]}
                onPress={() => handleSource(src.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.sourceEmojiSm}>{src.icon}</Text>
                <Text style={[T.caption, { color: C.textSecondary, marginTop: 4 }]}>
                  {src.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

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

  // Ambient washes (identical to HomeScreen)
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
  bottomWash: {
    position: 'absolute',
    bottom: 80,
    right: -40,
    width: isTablet ? 280 : 200,
    height: isTablet ? 280 : 200,
    borderRadius: 140,
    backgroundColor: C.gold,
    opacity: 0.06,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    width: IS_WEB ? WEB_COL : '100%',
    alignSelf: 'center',
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
    fontSize: isSmallPhone ? 14 : 16,
    color: C.textPrimary,
    lineHeight: isSmallPhone ? 20 : 22,
  },

  // Step indicator
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  stepItem: {
    alignItems: 'center',
    gap: 5,
  },
  stepDot: {
    width: isSmallPhone ? 26 : 30,
    height: isSmallPhone ? 26 : 30,
    borderRadius: isSmallPhone ? 13 : 15,
    backgroundColor: C.bgSecondary,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stepDotActive: {
    borderWidth: 0,
    ...SHADOW.glow,
  },
  stepDotGrad: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotNum: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: isSmallPhone ? 11 : 12,
    color: C.white,
  },
  stepDotNumInactive: {
    fontFamily: 'DMSans_400Regular',
    fontSize: isSmallPhone ? 11 : 12,
    color: C.textMuted,
  },
  stepLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: isSmallPhone ? 9 : 10,
    color: C.textMuted,
    letterSpacing: 0.3,
  },
  stepLine: {
    width: isSmallPhone ? 20 : 28,
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 4,
    marginBottom: 14, // offset to align with dots
  },
  stepLineDone: {
    backgroundColor: C.primary,
    opacity: 0.5,
  },

  // ── Scroll
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: S.lg,
    alignItems: 'center',
    paddingTop: S.sm,
  },
  scrollContentWeb: {
    width: WEB_COL,
    alignSelf: 'center',
  },

  // ── Title block
  titleBlock: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: S.md,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: S.sm,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: C.primary,
    opacity: 0.35,
  },
  titleSub: {
    textAlign: 'center',
    maxWidth: isSmallPhone ? 230 : 280,
    marginTop: S.xs,
    lineHeight: 20,
    alignSelf: 'center',
  },

  // ── Preview
  previewOuter: {
    alignSelf: 'center',
    marginTop: S.md,
  },
  previewCard: {
    borderRadius: R.xl,
    backgroundColor: C.cardSoft,
    borderWidth: 1.5,
    borderColor: C.border,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: isSmallPhone ? 56 : 70,
    justifyContent: 'flex-end',
    paddingBottom: S.md,
    alignItems: 'center',
  },
  changeHintPill: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  changeHintText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 10,
    color: C.white,
    letterSpacing: 1,
  },

  // Placeholder (empty state)
  placeholderInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: S.lg,
    backgroundColor: C.cardSoft,
  },
  placeholderIcon: {
    width: isSmallPhone ? 56 : 68,
    height: isSmallPhone ? 56 : 68,
    borderRadius: isSmallPhone ? 28 : 34,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.glow,
  },
  placeholderEmoji: {
    fontSize: isSmallPhone ? 24 : 30,
  },
  fmtRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: S.md,
  },
  fmtPill: {
    backgroundColor: C.bgSecondary,
    borderRadius: R.sm,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  fmtText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 1,
  },

  // ── Source cards
  sourceRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: S.lg,
    alignSelf: 'center',
  },
  sourceCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: S.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  sourceCardSmall: {
    padding: S.sm,
    paddingVertical: S.sm,
  },
  sourceIconWrap: {
    width: isSmallPhone ? 46 : 54,
    height: isSmallPhone ? 46 : 54,
    borderRadius: isSmallPhone ? 23 : 27,
    backgroundColor: C.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  sourceEmoji: {
    fontSize: isSmallPhone ? 20 : 24,
  },
  sourceEmojiSm: {
    fontSize: isSmallPhone ? 16 : 18,
  },

  // ── Tips card
  tipsCard: {
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.lg,
    marginTop: S.lg,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: S.sm,
    gap: S.sm,
  },
  tipIcon: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },

  // ── CTA
  ctaWrap: {
    alignSelf: 'center',
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
  swapBtn: {
    marginTop: S.md,
    alignItems: 'center',
  },
});

// const isSmallPhone = width < 375;