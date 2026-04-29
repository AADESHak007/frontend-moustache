// /**
//  * S1 — HomeScreen
//  *
//  * Landing screen with animated hero, 6 style chips, feature list, and CTA.
//  * Entry point to the app flow.
//  */

// import React, { useEffect, useRef } from 'react';
// import {
//   Animated,
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useNavigation } from '@react-navigation/native';

// import { useAppStore } from '../store/useAppStore';
// import { RootStackParamList } from '../types';


// type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;



// const STYLE_CHIPS = [
//   { label: '👨 Chevron',      color: '#7c3aed' },
//   { label: '🎩 Handlebar',    color: '#0891b2' },
//   { label: '🥷 Fu Manchu',    color: '#dc2626' },
//   { label: '✏️ Pencil Thin',  color: '#059669' },
//   { label: '🦣 Walrus',       color: '#d97706' },
//   { label: '🎭 English',      color: '#db2777' },
// ];

// const FEATURES = [
//   { icon: '⚡', text: 'AI face detection in seconds' },
//   { icon: '🎨', text: '6 hand-crafted mustache styles' },
//   { icon: '🔒', text: 'Private · AI processing & storage' },
//   { icon: '📤', text: 'Save & share instantly' },
// ];

// const styles = StyleSheet.create({
//   container:   { flex: 1, backgroundColor: '#ffffff' },
//   main:        { flex: 1 },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom:     100, // Very generous padding for mobile
//     flexGrow:          1,
//   },
//   contentInner: {
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     width: '100%',
//   },
//   hero: {
//     alignItems:   'center',
//     marginBottom: 48,
//   },
//   logoWrapper: {
//     width:        88,
//     height:       88,
//     borderRadius: 22,
//     overflow:     'hidden',
//     justifyContent: 'center',
//     alignItems:   'center',
//     marginBottom: 16,
//     backgroundColor: '#ffffff',
//     shadowColor:  '#5b21b6',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.12,
//     shadowRadius: 16,
//     elevation:    4,
//   },
//   logoImage: {
//     width:  125, // Specifically sized up to trim the white edges of the jpg
//     height: 125,
//   },
//   title: {
//     fontSize:      42,
//     fontWeight:    '900',
//     color:         '#0f172a',
//     letterSpacing: -1,
//   },
//   titleAccent: {
//     fontSize:      42,
//     fontWeight:    '900',
//     color:         '#5b21b6',
//     letterSpacing: -1,
//     marginTop:     -4,
//   },
//   tagline: {
//     fontSize:   16,
//     fontWeight: '400',
//     color:      '#64748b',
//     textAlign:  'center',
//     marginTop:  16,
//     lineHeight: 24,
//   },
//   section: {
//     width:        '100%',
//     marginBottom: 24,
//   },
//   sectionLabel: {
//     fontSize:     13,
//     fontWeight:   '700',
//     textTransform: 'uppercase',
//     color:        '#94a3b8',
//     marginBottom: 16,
//     letterSpacing: 1.2,
//   },
//   chipsGrid: {
//     flexDirection: 'row',
//     flexWrap:      'wrap',
//     gap:           10,
//   },
//   chip: {
//     borderWidth:       0, // Set to 0 to override any inline colors and keep it clean
//     borderRadius:      12,
//     paddingHorizontal: 16,
//     paddingVertical:   10,
//     backgroundColor:   '#ffffff',
//     shadowColor:       '#000',
//     shadowOffset:      { width: 0, height: 2 },
//     shadowOpacity:     0.04,
//     shadowRadius:      4,
//     elevation:         2,
//   },
//   chipText: {
//     color:      '#334155',
//     fontSize:   14,
//     fontWeight: '500',
//   },
//   featureCard: {
//     width:           '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.65)',
//     borderRadius:    24,
//     padding:         24,
//     marginBottom:    36,
//     borderWidth:     1,
//     borderColor:     'rgba(255, 255, 255, 0.9)',
//     shadowColor:     '#4f46e5',
//     shadowOffset:    { width: 0, height: 12 },
//     shadowOpacity:   0.08,
//     shadowRadius:    30,
//     elevation:       4,
//   },
//   featureRow: {
//     flexDirection:  'row',
//     alignItems:     'center',
//     marginBottom:   16,
//   },
//   featureIcon: {
//     fontSize:    20,
//     marginRight: 16,
//     width:       28,
//     textAlign:   'center',
//     opacity:     0.9,
//   },
//   featureText: {
//     color:      '#475569',
//     fontSize:   15,
//     fontWeight: '500',
//     flex:       1,
//   },
//   cta: {
//     borderRadius:  20,
//     overflow:      'hidden',
//     shadowColor:   '#5b21b6',
//     shadowOffset:  { width: 0, height: 12 },
//     shadowOpacity: 0.2,
//     shadowRadius:  24,
//     elevation:     8,
//     marginBottom:  32,
//   },
//   ctaGradient: {
//     paddingVertical:   20,
//     paddingHorizontal: 64,
//     alignItems:        'center',
//   },
//   ctaText: {
//     color:         '#ffffff',
//     fontSize:      18,
//     fontWeight:    '700',
//     letterSpacing: 0.3,
//   },
//   footer: {
//     color:    '#cbd5e1',
//     fontSize: 12,
//   },
//   authBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//     width: '100%',
//     zIndex: 10,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   userDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#10b981',
//     marginRight: 8,
//   },
//   userEmail: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#64748b',
//   },
//   logoutBtn: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   logoutText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#ef4444',
//   },
// });

// export default function HomeScreen() {
//   const navigation = useNavigation<HomeNav>();
//   const { token, user, logout } = useAppStore();

//   // Animations
//   const fadeAnim  = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const emojiAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Fade + slide in
//     Animated.parallel([
//       Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
//     ]).start();

//     // Emoji bounce
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(emojiAnim, { toValue: -8, duration: 700, useNativeDriver: true }),
//         Animated.timing(emojiAnim, { toValue:  0, duration: 700, useNativeDriver: true }),
//       ])
//     ).start();

//     // CTA pulse
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1,    duration: 1200, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   const handleStart = () => {
//     if (token) {
//       navigation.navigate('Upload');
//     } else {
//       navigation.navigate('SignIn');
//     }
//   };

//   const insets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#ffffff', '#f8fafc', '#f1f5f9']} style={StyleSheet.absoluteFill} />

//       <View style={[styles.main, { paddingTop: insets.top }]}>
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           bounces={true}
//           overScrollMode="always"
//           scrollEnabled={true}
//         >
//           {/* Auth Top Bar (Now inside ScrollView for better layout) */}
//           {token && (
//             <View style={styles.authBar}>
//               <View style={styles.userInfo}>
//                 <View style={styles.userDot} />
//                 <Text style={styles.userEmail}>{user?.email}</Text>
//               </View>
//               <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
//                 <Text style={styles.logoutText}>Logout</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           <View style={styles.contentInner}>
//           {/* Hero */}
//           <Animated.View
//             style={[
//               styles.hero,
//               { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
//             ]}
//           >
//             <Animated.View style={[styles.logoWrapper, { transform: [{ translateY: emojiAnim }] }]}>
//               <Image
//                 source={require('../components/logo/logo.jpeg')}
//                 style={styles.logoImage}
//               />
//             </Animated.View>
//             <Text style={styles.title}>AI Mustache</Text>
//             <Text style={styles.titleAccent}>Generator</Text>
//             <Text style={styles.tagline}>
//               Transform any selfie with AI-powered{'\n'}mustache overlays in seconds
//             </Text>
//           </Animated.View>

//           {/* Style chips */}
//           <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
//             <Text style={styles.sectionLabel}>6 Premium Styles</Text>
//             <View style={styles.chipsGrid}>
//               {STYLE_CHIPS.map((chip) => (
//                 <View
//                   key={chip.label}
//                   style={[styles.chip, { borderColor: chip.color }]}
//                 >
//                   <Text style={styles.chipText}>{chip.label}</Text>
//                 </View>
//               ))}
//             </View>
//           </Animated.View>

//           {/* Features */}
//           <Animated.View style={[styles.featureCard, { opacity: fadeAnim }]}>
//             {FEATURES.map((f) => (
//               <View key={f.text} style={styles.featureRow}>
//                 <Text style={styles.featureIcon}>{f.icon}</Text>
//                 <Text style={styles.featureText}>{f.text}</Text>
//               </View>
//             ))}
//           </Animated.View>

//           {/* CTA Button */}
//           <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//             <TouchableOpacity
//               style={styles.cta}
//               onPress={handleStart}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={['#9333ea', '#7c3aed']}
//                 style={styles.ctaGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Text style={styles.ctaText}>{token ? 'Start Generating' : 'Sign In to Start'}  →</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           <Text style={styles.footer}>🥸 AI Mustache Generator · v1.0.0</Text>
//         </View>
//       </ScrollView>
//     </View>
//   </View>
// );
// }



// CHAT GPT CODE BELOWWW


// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Animated,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   StyleSheet,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import * as ImagePicker from 'expo-image-picker';

// import { useAppStore } from '../store/useAppStore';
// import { RootStackParamList } from '../types';
// import { C, L, T, S, R, SHADOW, BTN } from '../screens/theme';

// type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;

// export default function HomeScreen() {
//   const navigation = useNavigation<HomeNav>();
//   const { token, user, logout } = useAppStore();
//   const insets = useSafeAreaInsets();

//   const [image, setImage] = useState<string | null>(null);

//   // animations
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
//     ]).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 1.03, duration: 1000, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   // Upload handler
//   const handleUpload = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permission.granted) {
//       alert('Permission required to access gallery');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setImage(uri);
//       navigation.navigate('Upload', { image: uri });
//     }
//   };

//   const handleStart = () => {
//     if (token) navigation.navigate('Upload');
//     else navigation.navigate('SignIn');
//   };

//   return (
//     <View style={[L.screen, { paddingTop: insets.top }]}>

//       {/* Top Bar */}
//       {token && (
//         <View style={styles.topBar}>
//           <Text style={T.sub}>{user?.email}</Text>
//           <TouchableOpacity onPress={logout}>
//             <Text style={[T.sub, { color: C.error }]}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >

//         {/* Hero */}
//         <Animated.View
//           style={{
//             alignItems: 'center',
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           }}
//         >
//           <View style={styles.logoBox}>
//             <Image
//               source={require('../components/logo/logo.jpeg')}
//               style={styles.logo}
//             />
//           </View>

//           <Text style={[T.h1, { marginTop: S.md }]}>
//             AI Mustache
//           </Text>

//           <Text style={[T.sub, { textAlign: 'center', marginTop: S.sm }]}>
//             Generate realistic mustaches in seconds
//           </Text>

//           <Text style={[T.caption, { marginTop: 6 }]}>
//             Find your signature look
//           </Text>
//         </Animated.View>

//         {/* Upload Card */}
//         <Animated.View
//           style={{
//             transform: [{ scale: pulseAnim }],
//             marginTop: S.lg,
//           }}
//         >
//           <TouchableOpacity
//             style={styles.uploadCard}
//             onPress={handleUpload}
//             activeOpacity={0.7}
//           >
//             {image ? (
//               <Image source={{ uri: image }} style={styles.preview} />
//             ) : (
//               <>
//                 <Text style={styles.uploadIcon}>＋</Text>

//                 <Text style={T.body}>Upload your photo</Text>

//                 <Text style={[T.caption, { marginTop: 6 }]}>
//                   Tap to select from gallery
//                 </Text>

//                 <View style={styles.divider} />

//                 <Text style={styles.supportedText}>
//                   JPG · PNG · Face clearly visible
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </Animated.View>

//         {/* CTA */}
//         <TouchableOpacity
//           style={[BTN.primary, { marginTop: S.lg }]}
//           onPress={handleStart}
//           activeOpacity={0.85}
//         >
//           <Text style={BTN.text}>
//             {token ? 'Continue' : 'Get Started'}
//           </Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },

//   // 🔥 Clean logo trim
//   logoBox: {
//     width: 80,
//     height: 80,
//     borderRadius: 24,
//     backgroundColor: C.cardSoft,
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//     ...SHADOW.soft,
//   },

//   logo: {
//     width: 120,
//     height: 120,
//     resizeMode: 'cover',
//   },

//   uploadCard: {
//     width: '100%',
//     height: 220,
//     borderRadius: R.lg,
//     backgroundColor: C.cardSoft,
//     justifyContent: 'center',
//     alignItems: 'center',

//     borderWidth: 1,
//     borderColor: C.border,
//     borderStyle: 'dashed',
//   },

//   uploadIcon: {
//     fontSize: 28,
//     marginBottom: 8,
//     color: C.textSecondary,
//   },

//   divider: {
//     width: '40%',
//     height: 1,
//     backgroundColor: C.border,
//     marginVertical: 10,
//   },

//   supportedText: {
//     fontSize: 12,
//     color: C.textMuted,
//   },

//   preview: {
//     width: '100%',
//     height: '100%',
//     borderRadius: R.lg,
//   },
// });










// // CLAUDE CODE BELOW
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Animated,
//   Dimensions,
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import * as ImagePicker from 'expo-image-picker';

// import { useAppStore } from '../store/useAppStore';
// import { RootStackParamList } from '../types';
// import { C, L, T, S, R, SHADOW, BTN, IS_WEB, isDesktop, isTablet } from '../screens/theme';

// type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;

// const { width } = Dimensions.get('window');

// const STYLES = ['Handlebar', 'Chevron', 'Walrus', 'Imperial', 'Fu Manchu', 'Pencil'];

// const FEATURES = [
//   { icon: '⚡', label: 'Instant\nResults' },
//   { icon: '🎭', label: '12+ Styles' },
//   { icon: '🔒', label: 'Private &\nSecure' },
//   { icon: '✨', label: 'AI-Powered\nFit' },
// ];

// export default function HomeScreen() {
//   const navigation = useNavigation<HomeNav>();
//   const { token, user, logout } = useAppStore();
//   const insets = useSafeAreaInsets();
//   const [image, setImage] = useState<string | null>(null);

//   // ─── Animations ──────────────────────────────────────────────────
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(32)).current;
//   const scaleAnim = useRef(new Animated.Value(0.94)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const chipFades = STYLES.map(() => useRef(new Animated.Value(0)).current);

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
//       Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }),
//     ]).start();

//     chipFades.forEach((a, i) =>
//       Animated.timing(a, { toValue: 1, duration: 380, delay: 650 + i * 75, useNativeDriver: true }).start()
//     );

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 1.018, duration: 2000, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   // ─── Upload handler ───────────────────────────────────────────────
//   const handleUpload = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) { alert('Permission required to access gallery'); return; }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setImage(uri);
//       navigation.navigate('Upload', { image: uri });
//     }
//   };

//   const handleStart = () => {
//     if (token) navigation.navigate('Upload');
//     else navigation.navigate('SignIn');
//   };

//   const cardWidth = isDesktop ? 420 : isTablet ? 380 : width - S.lg * 2;

//   return (
//     <View style={[styles.root, { paddingTop: insets.top }]}>

//       {/* Warm tinted top radial wash */}
//       <View style={styles.topWash} pointerEvents="none" />
//       <View style={styles.bottomWash} pointerEvents="none" />

//       {/* ── Top Bar ─────────────────────────────────────────────── */}
//       {token && (
//         <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
//           <View style={styles.userChip}>
//             <View style={styles.onlineDot} />
//             <Text style={[T.caption, { color: C.textSecondary }]} numberOfLines={1}>
//               {user?.email}
//             </Text>
//           </View>
//           <TouchableOpacity onPress={logout} activeOpacity={0.6}>
//             <Text style={[T.label, { color: C.error }]}>Logout</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       )}

//       <ScrollView
//         contentContainerStyle={[styles.scrollContent, IS_WEB && styles.scrollContentWeb]}
//         showsVerticalScrollIndicator={false}
//       >

//         {/* ── HERO ─────────────────────────────────────────────── */}
//         <Animated.View
//           style={[
//             styles.hero,
//             { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
//           ]}
//         >
//           {/* Logo badge */}
//           <View style={styles.logoBadge}>
//             <LinearGradient
//               colors={['#FFFFFF', '#F7F3EC']}
//               style={styles.logoBadgeInner}
//             >
//               <Image
//                 source={require('../components/logo/logo.jpeg')}
//                 style={styles.logo}
//               />
//             </LinearGradient>
//             {/* thin gold ring */}
//             <View style={styles.logoRing} />
//           </View>

//           {/* Eyebrow label */}
//           <View style={styles.eyebrowRow}>
//             <View style={styles.eyebrowLine} />
//             <Text style={T.label}>AI Powered</Text>
//             <View style={styles.eyebrowLine} />
//           </View>

//           {/* Main headline */}
//           <Text style={[T.h1, styles.headline]}>
//             Find Your{'\n'}
//             <Text style={styles.headlineAccent}>Perfect</Text>
//             {' '}Look
//           </Text>

//           <Text style={[T.sub, styles.heroSub]}>
//             Try every mustache style on your photo{'\n'}and discover what suits you best.
//           </Text>

//           {/* Style chips */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.chipsRow}
//           >
//             {STYLES.map((style, i) => (
//               <Animated.View key={style} style={{ opacity: chipFades[i] }}>
//                 <View style={styles.chip}>
//                   <Text style={styles.chipText}>{style}</Text>
//                 </View>
//               </Animated.View>
//             ))}
//           </ScrollView>
//         </Animated.View>

//         {/* ── UPLOAD CARD ──────────────────────────────────────── */}
//         <Animated.View style={{ transform: [{ scale: pulseAnim }], width: cardWidth, alignSelf: 'center' }}>
//           <TouchableOpacity
//             style={styles.uploadCard}
//             onPress={handleUpload}
//             activeOpacity={0.8}
//           >
//             {image ? (
//               <>
//                 <Image source={{ uri: image }} style={styles.preview} />
//                 <LinearGradient
//                   colors={['transparent', 'rgba(28,24,16,0.55)']}
//                   style={styles.previewOverlay}
//                 >
//                   <Text style={styles.previewHint}>Tap to change photo</Text>
//                 </LinearGradient>
//               </>
//             ) : (
//               <View style={styles.uploadInner}>
//                 {/* Upload icon button */}
//                 <View style={styles.uploadIconWrap}>
//                   <LinearGradient
//                     colors={[C.gradStart, C.gradEnd]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.uploadIconGrad}
//                   >
//                     <Text style={styles.uploadPlus}>＋</Text>
//                   </LinearGradient>
//                 </View>

//                 <Text style={[T.body, { color: C.textPrimary, marginTop: S.md, fontWeight: '500' }]}>
//                   Upload your photo
//                 </Text>
//                 <Text style={[T.caption, { marginTop: 5, color: C.textMuted }]}>
//                   Face clearly visible for best results
//                 </Text>

//                 <View style={styles.divider} />

//                 <View style={styles.formatRow}>
//                   {['JPG', 'PNG', 'WEBP'].map(fmt => (
//                     <View key={fmt} style={styles.fmtPill}>
//                       <Text style={styles.fmtText}>{fmt}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             )}
//           </TouchableOpacity>
//         </Animated.View>

//         {/* ── CTA ──────────────────────────────────────────────── */}
//         <Animated.View style={[{ opacity: fadeAnim, width: cardWidth, alignSelf: 'center', marginTop: S.lg }]}>
//           <TouchableOpacity onPress={handleStart} activeOpacity={0.85}>
//             <LinearGradient
//               colors={[C.gradStart, C.gradEnd]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.ctaBtn}
//             >
//               <Text style={BTN.text}>
//                 {token ? 'Continue to Upload' : 'Get Started Free'}
//               </Text>
//               <Text style={[BTN.text, { opacity: 0.75 }]}>→</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {!token && (
//             <TouchableOpacity
//               onPress={() => navigation.navigate('SignIn')}
//               style={styles.signInRow}
//               activeOpacity={0.65}
//             >
//               <Text style={[T.caption, { color: C.textMuted }]}>
//                 Already have an account?{'  '}
//                 <Text style={{ color: C.primary, fontFamily: 'DMSans_500Medium' }}>Sign in</Text>
//               </Text>
//             </TouchableOpacity>
//           )}
//         </Animated.View>

//         {/* ── FEATURE STRIP ─────────────────────────────────────── */}
//         <Animated.View style={[styles.featureStrip, { opacity: fadeAnim }]}>
//           {FEATURES.map(f => (
//             <View key={f.label} style={styles.featureItem}>
//               <View style={styles.featureIconWrap}>
//                 <Text style={styles.featureEmoji}>{f.icon}</Text>
//               </View>
//               <Text style={[T.caption, { textAlign: 'center', marginTop: 6, color: C.textSecondary }]}>
//                 {f.label}
//               </Text>
//             </View>
//           ))}
//         </Animated.View>

//         <View style={{ height: insets.bottom + S.xl }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: C.bg,
//     ...(IS_WEB ? { alignItems: 'center' as const } : {}),
//   },

//   // Ambient colour washes
//   topWash: {
//     position: 'absolute',
//     top: -80, left: '10%',
//     width: 280, height: 280,
//     borderRadius: 140,
//     backgroundColor: C.accent,
//     opacity: 0.07,
//   },
//   bottomWash: {
//     position: 'absolute',
//     bottom: 80, right: -40,
//     width: 220, height: 220,
//     borderRadius: 110,
//     backgroundColor: C.gold,
//     opacity: 0.06,
//   },

//   // ── Top bar
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: S.lg,
//     paddingVertical: S.sm,
//     width: IS_WEB ? Math.min(480, width) : '100%',
//   },
//   userChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 7,
//     backgroundColor: C.card,
//     paddingHorizontal: S.sm,
//     paddingVertical: 6,
//     borderRadius: R.pill,
//     borderWidth: 1,
//     borderColor: C.border,
//     maxWidth: 200,
//     ...SHADOW.soft,
//   },
//   onlineDot: {
//     width: 7, height: 7, borderRadius: 4,
//     backgroundColor: C.success,
//   },

//   // ── Scroll
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: S.lg,
//     alignItems: 'center',
//     paddingTop: S.sm,
//   },
//   scrollContentWeb: {
//     width: Math.min(480, width),
//   },

//   // ── Hero
//   hero: {
//     width: '100%',
//     alignItems: 'center',
//     paddingVertical: S.lg,
//   },

//   logoBadge: {
//     width: 88, height: 88,
//     marginBottom: S.lg,
//     position: 'relative',
//   },
//   logoBadgeInner: {
//     width: 88, height: 88,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: C.borderStrong,
//     overflow: 'hidden',
//     ...SHADOW.card,
//   },
//   logo: {
//     width: 120, height: 120,
//     resizeMode: 'cover',
//   },
//   logoRing: {
//     position: 'absolute',
//     inset: -3,
//     // simulate as outer border by using shadow on a transparent view
//     width: 94, height: 94,
//     borderRadius: 32,
//     borderWidth: 1.5,
//     borderColor: C.gold,
//     opacity: 0.5,
//   },

//   eyebrowRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: S.sm,
//   },
//   eyebrowLine: {
//     width: 28, height: 1,
//     backgroundColor: C.primary,
//     opacity: 0.35,
//   },

//   headline: {
//     textAlign: 'center',
//     lineHeight: isDesktop ? 62 : isTablet ? 50 : 44,
//     marginBottom: S.sm,
//   },
//   headlineAccent: {
//     color: C.primary,
//     fontFamily: 'PlayfairDisplay_700Bold',
//     fontStyle: 'italic',
//   },
//   heroSub: {
//     textAlign: 'center',
//     maxWidth: 280,
//     marginBottom: S.md,
//     lineHeight: 20,
//   },

//   // Chips
//   chipsRow: {
//     paddingHorizontal: 2,
//     gap: 8,
//     flexDirection: 'row',
//   },
//   chip: {
//     backgroundColor: C.card,
//     borderRadius: R.pill,
//     paddingHorizontal: S.md,
//     paddingVertical: 7,
//     borderWidth: 1,
//     borderColor: C.border,
//     ...SHADOW.soft,
//   },
//   chipText: {
//     fontFamily: 'DMSans_400Regular',
//     fontSize: 12,
//     color: C.textSecondary,
//   },

//   // ── Upload card
//   uploadCard: {
//     width: '100%',
//     height: isDesktop ? 260 : isTablet ? 240 : 210,
//     borderRadius: R.xl,
//     backgroundColor: C.card,
//     borderWidth: 1.5,
//     borderColor: C.border,
//     borderStyle: 'dashed',
//     overflow: 'hidden',
//     marginTop: S.lg,
//     ...SHADOW.card,
//   },
//   uploadInner: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: S.lg,
//     backgroundColor: C.cardSoft,
//   },
//   uploadIconWrap: {
//     width: 56, height: 56,
//     borderRadius: 28,
//     overflow: 'hidden',
//     ...SHADOW.glow,
//   },
//   uploadIconGrad: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   uploadPlus: {
//     fontSize: 24,
//     color: C.white,
//     fontWeight: '300',
//   },
//   divider: {
//     width: '35%', height: 1,
//     backgroundColor: C.border,
//     marginVertical: S.sm,
//   },
//   formatRow: {
//     flexDirection: 'row',
//     gap: 6,
//   },
//   fmtPill: {
//     backgroundColor: C.bgSecondary,
//     borderRadius: R.sm,
//     paddingHorizontal: 9,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: C.border,
//   },
//   fmtText: {
//     fontFamily: 'DMSans_400Regular',
//     fontSize: 10,
//     color: C.textMuted,
//     letterSpacing: 1,
//   },
//   preview: {
//     width: '100%', height: '100%',
//   },
//   previewOverlay: {
//     position: 'absolute',
//     bottom: 0, left: 0, right: 0,
//     height: 64,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: S.md,
//   },
//   previewHint: {
//     fontFamily: 'DMSans_400Regular',
//     fontSize: 12,
//     color: '#FFFFFF',
//     opacity: 0.85,
//   },

//   // ── CTA
//   ctaBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 10,
//     paddingVertical: 17,
//     borderRadius: R.pill,
//     ...SHADOW.glow,
//   },
//   signInRow: {
//     marginTop: S.md,
//     alignItems: 'center',
//   },

//   // ── Feature strip
//   featureStrip: {
//     flexDirection: 'row',
//     marginTop: S.xl,
//     width: '100%',
//     justifyContent: 'space-between',
//     paddingHorizontal: S.xs,
//   },
//   featureItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   featureIconWrap: {
//     width: 44, height: 44,
//     borderRadius: R.md,
//     backgroundColor: C.card,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: C.border,
//     ...SHADOW.soft,
//   },
//   featureEmoji: {
//     fontSize: 18,
//   },
// });








import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';

import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from '../types';
import { billingApi } from '../api/billing';
import {
  C, L, T, S, R, SHADOW, BTN,
  IS_WEB, isDesktop, isTablet, WEB_MAX_W,
} from '../screens/theme';

type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

// ─── Breakpoint helpers ───────────────────────────────────────────────
const isSmallPhone = width < 375;
const isLargePhone = width > 414 && !isTablet;

/** Card width: fills the column, capped on tablet / desktop */
const cardWidth =
  isDesktop ? 580 :
    isTablet ? 500 :
      width - S.lg * 2;

/** Upload card height scales with screen so nothing overflows */
const uploadCardH =
  isDesktop ? 260 :
    isTablet ? 240 :
      isSmallPhone ? Math.min(160, height * 0.20) :
        isLargePhone ? Math.min(200, height * 0.22) :
          Math.min(185, height * 0.21);

/** Logo badge size */
const LOGO_SIZE = isDesktop ? 100 : isTablet ? 92 : isSmallPhone ? 72 : 80;
const LOGO_IMG = LOGO_SIZE + 36;
const LOGO_R = isDesktop ? 32 : 24;

/** Feature icon box size */
const FEAT_ICON = isSmallPhone ? 38 : isTablet ? 50 : 44;

/** Decorative wash size: 60% width on mobile, 40% on tablet, 30% on desktop */
const WASH_W = isDesktop ? width * 0.3 : isTablet ? width * 0.4 : width * 0.6;

const STYLES_LIST = ['Handlebar', 'Chevron', 'Walrus', 'Imperial', 'Fu Manchu', 'Pencil'];

/** Approximate pixel-width of one full set of chips (used for marquee loop) */
const CHIP_ROW_W = isSmallPhone ? 520 : 600;

const FEATURES = [
  { icon: '⚡', label: 'Instant\nResults' },
  { icon: '🎭', label: '12+ Styles' },
  { icon: '🔒', label: 'Private &\nSecure' },
  { icon: '✨', label: 'AI-Powered\nFit' },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { token, user, logout } = useAppStore();
  const credits     = useAppStore((s) => s.credits);
  const setCredits  = useAppStore((s) => s.setCredits);
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState<string | null>(null);

  // Refresh credit balance whenever Home re-mounts and we have a token.
  useEffect(() => {
    if (!token) return;
    billingApi.getCredits()
      .then((r) => setCredits(r.balance))
      .catch(() => { /* non-fatal — UI shows the cached value */ });
  }, [token]);

  // ─── Animations ──────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // stable refs — no Rules-of-Hooks issue
  const chipFades = useRef(STYLES_LIST.map(() => new Animated.Value(0))).current;
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }),
    ]).start();

    chipFades.forEach((a, i) =>
      Animated.timing(a, {
        toValue: 1, duration: 380, delay: 650 + i * 75, useNativeDriver: true,
      }).start()
    );

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.018, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Start marquee after chips have faded in (~1.5s)
    const marqueeDelay = setTimeout(() => {
      Animated.loop(
        Animated.timing(marqueeAnim, {
          toValue: -CHIP_ROW_W,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: Platform.OS !== 'web',
        })
      ).start();
    }, 1500);

    return () => clearTimeout(marqueeDelay);
  }, []);

  // ─── Upload handler ───────────────────────────────────────────────
  const handleUpload = async () => {
    if (!token) {
      navigation.navigate('SignIn');
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { alert('Permission required to access gallery'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      navigation.navigate('Upload');
    }
  };

  const handleStart = () => {
    if (token) navigation.navigate('Upload');
    else navigation.navigate('SignIn');
  };

  // Dynamic bottom padding = safe-area bottom + a small gap
  const bottomPad = insets.bottom + S.md;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Decorative ambient washes */}
      <View style={styles.topWash} pointerEvents="none" />

      {/* ── Top Bar ──────────────────────────────────────────────── */}
      {token && (
        <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
          <View style={styles.userChip}>
            <View style={styles.onlineDot} />
            <Text style={[T.caption, { color: C.textSecondary }]} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Paywall')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: C.card,
                borderWidth: 1,
                borderColor: C.border,
                paddingHorizontal: S.sm,
                paddingVertical: 5,
                borderRadius: R.pill,
              }}
            >
              <Text style={{ fontSize: 12 }}>✨</Text>
              <Text style={[T.caption, { color: C.textPrimary }]}>
                {credits == null ? 'Plans' : `${credits} credit${credits === 1 ? '' : 's'}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} activeOpacity={0.6}>
              <Text style={[T.label, { color: C.error }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* ── Scroll View ──────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          IS_WEB && styles.scrollContentWeb,
          { paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >

        {/* ── HERO ─────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.hero,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
          ]}
        >
          {/* Logo badge — container sized to include the ring so it centres correctly */}
          <View style={[styles.logoBadge, { width: LOGO_SIZE + 6, height: LOGO_SIZE + 6 }]}>
            <LinearGradient
              colors={['#FFFFFF', '#F7F3EC']}
              style={[
                styles.logoBadgeInner,
                {
                  width: LOGO_SIZE,
                  height: LOGO_SIZE,
                  borderRadius: LOGO_R,
                  position: 'absolute',
                  top: 3,
                  left: 3,
                },
              ]}
            >
              <Image
                source={require('../components/logo/logo.jpeg')}
                style={{ width: LOGO_IMG, height: LOGO_IMG }}
                resizeMode="cover"
              />
            </LinearGradient>
            <View
              style={[
                styles.logoRing,
                {
                  width: LOGO_SIZE + 6,
                  height: LOGO_SIZE + 6,
                  borderRadius: LOGO_R + 4,
                  top: 0,
                  left: 0,
                },
              ]}
            />
          </View>

          {/* Eyebrow */}
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={T.label}>AI Powered</Text>
            <View style={styles.eyebrowLine} />
          </View>

          {/* Main headline */}
          <Text style={[T.h1, styles.headline]}>
            Find Your{'\n'}
            <Text style={styles.headlineAccent}>Perfect</Text>
            {' '}Look
          </Text>

          <Text style={[T.sub, styles.heroSub]}>
            Try every mustache style on your photo{'\n'}and discover what suits you best.
          </Text>

          {/* Style chips — auto-scrolling marquee */}
          <View style={styles.chipsContainer}>
            <Animated.View
              style={[
                styles.chipsRow,
                { transform: [{ translateX: marqueeAnim }] },
              ]}
            >
              {[...STYLES_LIST, ...STYLES_LIST].map((style, i) => (
                <Animated.View
                  key={`chip-${i}`}
                  style={{
                    opacity: i < STYLES_LIST.length ? chipFades[i] : chipFades[i - STYLES_LIST.length],
                  }}
                >
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{style}</Text>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        </Animated.View>

        {/* ── UPLOAD CARD ──────────────────────────────────────── */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
            width: cardWidth,
            alignSelf: 'center',
          }}
        >
          <TouchableOpacity
            style={[styles.uploadCard, { height: uploadCardH }]}
            onPress={handleUpload}
            activeOpacity={0.8}
          >
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.preview} />
                <LinearGradient
                  colors={['transparent', 'rgba(28,24,16,0.55)']}
                  style={styles.previewOverlay}
                >
                  <Text style={styles.previewHint}>Tap to change photo</Text>
                </LinearGradient>
              </>
            ) : (
              <View style={styles.uploadInner}>
                <View style={styles.uploadIconWrap}>
                  <LinearGradient
                    colors={[C.gradStart, C.gradEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.uploadIconGrad}
                  >
                    <Text style={styles.uploadPlus}>＋</Text>
                  </LinearGradient>
                </View>

                <Text
                  style={[T.body, { color: C.textPrimary, marginTop: S.sm, fontWeight: '500' }]}
                >
                  Upload your photo
                </Text>
                <Text style={[T.caption, { marginTop: 4, color: C.textMuted }]}>
                  Face clearly visible for best results
                </Text>

                <View style={styles.divider} />

                <View style={styles.formatRow}>
                  {['JPG', 'PNG', 'WEBP'].map(fmt => (
                    <View key={fmt} style={styles.fmtPill}>
                      <Text style={styles.fmtText}>{fmt}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            width: cardWidth,
            alignSelf: 'center',
            marginTop: S.lg,
          }}
        >
          <TouchableOpacity onPress={handleStart} activeOpacity={0.85}>
            <LinearGradient
              colors={[C.gradStart, C.gradEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtn}
            >
              <Text style={BTN.text}>
                {token ? 'Continue to Upload' : 'Get Started Free'}
              </Text>
              <Text style={[BTN.text, { opacity: 0.75 }]}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {!token && (
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn')}
              style={styles.signInRow}
              activeOpacity={0.65}
            >
              <Text style={[T.caption, { color: C.textMuted }]}>
                Already have an account?{'  '}
                <Text style={{ color: C.primary, fontFamily: 'DMSans_500Medium' }}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── FEATURE STRIP ────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.featureStrip,
            { opacity: fadeAnim, width: cardWidth, alignSelf: 'center' },
          ]}
        >
          {FEATURES.map(f => (
            <View key={f.label} style={styles.featureItem}>
              <View
                style={[
                  styles.featureIconWrap,
                  { width: FEAT_ICON, height: FEAT_ICON },
                ]}
              >
                <Text style={styles.featureEmoji}>{f.icon}</Text>
              </View>
              <Text
                style={[
                  T.caption,
                  { textAlign: 'center', marginTop: 6, color: C.textSecondary },
                ]}
              >
                {f.label}
              </Text>
            </View>
          ))}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────
const WEB_COL = Math.min(WEB_MAX_W, width);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    ...(IS_WEB ? { alignItems: 'center' as const } : {}),
  },

  // Decorative ambient washes
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

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    width: IS_WEB ? WEB_COL : '100%',
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: C.card,
    paddingHorizontal: S.sm,
    paddingVertical: 6,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: C.border,
    maxWidth: 200,
    ...SHADOW.soft,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.success,
  },

  // Scroll
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: S.lg,
    alignItems: 'center',
    paddingTop: S.sm,
    // paddingBottom is injected inline (dynamic)
  },
  scrollContentWeb: {
    width: WEB_COL,
  },

  // Hero section
  hero: {
    width: '100%',
    alignItems: 'center',
    paddingTop: S.md,
    paddingBottom: S.sm,
  },

  logoBadge: {
    marginBottom: S.md,
    position: 'relative',
  },
  logoBadgeInner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderStrong,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  logoRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: C.gold,
    opacity: 0.5,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: S.sm,
  },
  eyebrowLine: {
    width: 28,
    height: 1,
    backgroundColor: C.primary,
    opacity: 0.35,
  },

  headline: {
    textAlign: 'center',
    lineHeight: isDesktop ? 62 : isTablet ? 50 : isSmallPhone ? 38 : 44,
    marginBottom: S.sm,
  },
  headlineAccent: {
    color: C.primary,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontStyle: 'italic',
  },
  heroSub: {
    textAlign: 'center',
    maxWidth: isSmallPhone ? 230 : 280,
    marginBottom: S.md,
    lineHeight: 20,
  },

  // Style chips — marquee
  chipsContainer: {
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: C.card,
    borderRadius: R.pill,
    paddingHorizontal: isSmallPhone ? S.sm : S.md,
    paddingVertical: isSmallPhone ? 5 : 7,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  chipText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: isSmallPhone ? 11 : 12,
    color: C.textSecondary,
  },

  // Upload card
  uploadCard: {
    width: '100%',
    borderRadius: R.xl,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginTop: S.md,
    ...SHADOW.card,
  },
  uploadInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: S.md,
    backgroundColor: C.cardSoft,
  },
  uploadIconWrap: {
    width: isSmallPhone ? 46 : 56,
    height: isSmallPhone ? 46 : 56,
    borderRadius: isSmallPhone ? 23 : 28,
    overflow: 'hidden',
    ...SHADOW.glow,
  },
  uploadIconGrad: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlus: {
    fontSize: isSmallPhone ? 20 : 24,
    color: C.white,
    fontWeight: '300',
  },
  divider: {
    width: '35%',
    height: 1,
    backgroundColor: C.border,
    marginVertical: S.sm,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 6,
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
  preview: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: S.md,
  },
  previewHint: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.85,
  },

  // CTA
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: isSmallPhone ? 13 : 17,
    borderRadius: R.pill,
    ...SHADOW.glow,
  },
  signInRow: {
    marginTop: S.md,
    alignItems: 'center',
  },

  // Feature strip
  featureStrip: {
    flexDirection: 'row',
    marginTop: S.lg,
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconWrap: {
    borderRadius: R.md,
    backgroundColor: C.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  featureEmoji: {
    fontSize: isSmallPhone ? 15 : 18,
  },
});




