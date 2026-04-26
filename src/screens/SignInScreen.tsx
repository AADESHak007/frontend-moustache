// /**
//  * SignInScreen
//  *
//  * Premium dark/light themed login screen with gradients and micro-animations.
//  */

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../types';
// import { authApi } from '../api/auth';
// import { useAppStore } from '../store/useAppStore';

// const { width } = Dimensions.get('window');

// type SignInNav = StackNavigationProp<RootStackParamList, 'SignIn'>;

// export default function SignInScreen() {
//   const navigation = useNavigation<SignInNav>();
//   const setAuth = useAppStore((state) => state.setAuth);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Animations
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const handleSignIn = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await authApi.signIn(email, password);
//       if (response.access_token) {
//         setAuth(response.access_token, response.user);
//         navigation.replace('Home');
//       } else {
//         Alert.alert('Check Inbox', 'Please confirm your email address before signing in.');
//       }
//     } catch (error: any) {
//       Alert.alert('Sign In Failed', error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const insets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#ffffff', '#f8fafc', '#f1f5f9']} style={StyleSheet.absoluteFill} />

//       <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.keyboardView}
//         >
//           <ScrollView 
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//           >
//             <Animated.View
//               style={[
//                 styles.contentInner,
//                 { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
//               ]}
//             >
//               {/* Header / Logo */}
//             <View style={styles.header}>
//               <View style={styles.logoWrapper}>
//                 <Image
//                   source={require('../components/logo/logo.jpeg')}
//                   style={styles.logoImage}
//                 />
//               </View>
//               <Text style={styles.title}>Welcome Back</Text>
//               <Text style={styles.subtitle}>Sign in to continue your mustache journey</Text>
//             </View>

//             {/* Form */}
//             <View style={styles.form}>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Email Address</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="user@example.com"
//                   placeholderTextColor="#94a3b8"
//                   value={email}
//                   onChangeText={setEmail}
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Password</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="••••••••"
//                   placeholderTextColor="#94a3b8"
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry
//                 />
//               </View>

//               <TouchableOpacity
//                 style={styles.signInButton}
//                 onPress={handleSignIn}
//                 disabled={loading}
//               >
//                 <LinearGradient
//                   colors={['#9333ea', '#7c3aed']}
//                   style={styles.gradientButton}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="#ffffff" />
//                   ) : (
//                     <Text style={styles.buttonText}>Sign In</Text>
//                   )}
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>

//             {/* Footer */}
//             <View style={styles.footer}>
//               <Text style={styles.footerText}>Don't have an account? </Text>
//               <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//                 <Text style={styles.signUpLink}>Sign Up</Text>
//               </TouchableOpacity>
//               </View>
//             </Animated.View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff' },
//   main: { flex: 1 },
//   keyboardView: { flex: 1 },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   contentInner: {
//     paddingHorizontal: 32,
//     width: '100%',
//     alignItems: 'center',
//   },
//   header: {

//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   logoWrapper: {
//     width: 72,
//     height: 72,
//     borderRadius: 18,
//     overflow: 'hidden',
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#5b21b6',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 3,
//   },
//   logoImage: {
//     width: 100,
//     height: 100,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: '#0f172a',
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 15,
//     color: '#64748b',
//     textAlign: 'center',
//     marginTop: 8,
//     lineHeight: 22,
//   },
//   form: {
//     width: '100%',
//     maxWidth: 400,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: '700',
//     textTransform: 'uppercase',
//     color: '#94a3b8',
//     marginBottom: 8,
//     letterSpacing: 0.8,
//   },
//   input: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     fontSize: 16,
//     color: '#1e293b',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.03,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   signInButton: {
//     marginTop: 12,
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: '#7c3aed',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.2,
//     shadowRadius: 16,
//     elevation: 6,
//   },
//   gradientButton: {
//     paddingVertical: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 32,
//   },
//   footerText: {
//     color: '#64748b',
//     fontSize: 15,
//   },
//   signUpLink: {
//     color: '#7c3aed',
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });




// CLAUD CODE BELOW


/**
 * SignInScreen — redesigned to match HomeScreen / UploadScreen warm ivory theme.
 * ALL business logic preserved exactly as original.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { authApi } from '../api/auth';
import { useAppStore } from '../store/useAppStore';
import {
  C, T, S, R, SHADOW, BTN,
  IS_WEB, isDesktop, isTablet, WEB_MAX_W,
} from '../screens/theme';

const { width, height } = Dimensions.get('window');
const isSmallPhone = width < 375;
const WEB_COL = Math.min(WEB_MAX_W, width);

const WASH_W = isDesktop ? width * 0.3 : isTablet ? width * 0.4 : width * 0.6;


// Logo — same sizing pattern as HomeScreen
const LOGO_SIZE = isDesktop ? 100 : isTablet ? 92 : isSmallPhone ? 68 : 80;
const LOGO_IMG = LOGO_SIZE + 36;
const LOGO_R = isDesktop ? 32 : 24;

type SignInNav = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<SignInNav>();
  const setAuth = useAppStore((state) => state.setAuth);
  const insets = useSafeAreaInsets();

  // ── State ──────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // ── Animations ─────────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Logic (original — untouched) ───────────────────────────────────
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.signIn(email, password);
      if (response.access_token) {
        setAuth(response.access_token, response.user);
        navigation.replace('Home');
      } else {
        Alert.alert('Check Inbox', 'Please confirm your email address before signing in.');
      }
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const bottomPad = insets.bottom + S.md;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* Ambient colour washes — identical to HomeScreen */}
      <View style={styles.topWash} pointerEvents="none" />
      {/* <View style={styles.bottomWash} pointerEvents="none" /> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={[
            styles.scrollContent,
            IS_WEB && { width: WEB_COL },
            { paddingBottom: bottomPad },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.inner,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >

            {/* ── LOGO ───────────────────────────────────────────── */}
            <View style={[styles.logoBadge, { width: LOGO_SIZE + 6, height: LOGO_SIZE + 6 }]}>
              <LinearGradient
                colors={['#FFFFFF', '#F7F3EC']}
                style={[
                  styles.logoBadgeInner,
                  { width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_R,
                    position: 'absolute', top: 3, left: 3 },
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
                    width: LOGO_SIZE + 6, height: LOGO_SIZE + 6,
                    borderRadius: LOGO_R + 4, top: 0, left: 0,
                  },
                ]}
              />
            </View>

            {/* ── EYEBROW ────────────────────────────────────────── */}
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowLine} />
              <Text style={T.label}>Welcome Back</Text>
              <View style={styles.eyebrowLine} />
            </View>

            {/* ── HEADLINE ───────────────────────────────────────── */}
            <Text style={[T.h2, styles.headline]}>
              Sign In to{' '}
              <Text style={styles.headlineAccent}>Continue</Text>
            </Text>
            <Text style={[T.sub, styles.subText]}>
              Your perfect look is waiting for you
            </Text>

            {/* ── FORM CARD ──────────────────────────────────────── */}
            <View style={styles.formCard}>

              {/* Email field */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={[styles.inputWrap, emailFocused && styles.inputFocused]}>
                  <Text style={styles.fieldIcon}>✉️</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="user@example.com"
                    placeholderTextColor={C.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              {/* Password field */}
              <View style={[styles.fieldWrap, { marginBottom: 0 }]}>
                <Text style={styles.fieldLabel}>Password</Text>
                <View style={[styles.inputWrap, passwordFocused && styles.inputFocused]}>
                  <Text style={styles.fieldIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={C.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </View>
              </View>

              {/* Sign In CTA */}
              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.85}
                style={{ marginTop: S.lg }}
              >
                <LinearGradient
                  colors={[C.gradStart, C.gradEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaBtn}
                >
                  {loading ? (
                    <ActivityIndicator color={C.white} />
                  ) : (
                    <>
                      <Text style={BTN.text}>Sign In</Text>
                      <Text style={[BTN.text, { opacity: 0.75 }]}>→</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* ── DIVIDER ────────────────────────────────────────── */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={[T.caption, { paddingHorizontal: S.sm, color: C.textMuted }]}>
                or
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* ── FOOTER ─────────────────────────────────────────── */}
            <View style={styles.footer}>
              <Text style={[T.caption, { color: C.textMuted }]}>
                Don't have an account?{'  '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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

  kav: { flex: 1, width: IS_WEB ? WEB_COL : '100%' },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: S.lg,
    paddingTop: isDesktop ? 100 : isTablet ? 80 : 60,
    paddingBottom: S.xl,
  },

  inner: {
    width: '100%',
    maxWidth: isDesktop ? 480 : isTablet ? 440 : undefined,
    alignItems: 'center',
  },

  // Logo
  logoBadge: { marginBottom: S.lg, position: 'relative' },
  logoBadgeInner: {
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: C.borderStrong,
    overflow: 'hidden', ...SHADOW.card,
  },
  logoRing: {
    position: 'absolute', borderWidth: 1.5, borderColor: C.gold, opacity: 0.5,
  },

  // Eyebrow
  eyebrowRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: S.sm,
  },
  eyebrowLine: {
    width: 28, height: 1, backgroundColor: C.primary, opacity: 0.35,
  },

  // Headline
  headline: {
    textAlign: 'center',
    lineHeight: isDesktop ? 50 : isTablet ? 42 : isSmallPhone ? 32 : 36,
    marginBottom: S.xs,
  },
  headlineAccent: {
    color: C.primary, fontFamily: 'PlayfairDisplay_700Bold', fontStyle: 'italic',
  },
  subText: {
    textAlign: 'center', maxWidth: 260,
    marginBottom: S.lg, lineHeight: 20,
  },

  // Form card
  formCard: {
    width: '100%',
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.lg,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.card,
  },
  fieldWrap: { marginBottom: S.md },
  fieldLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: isSmallPhone ? 10 : 11,
    color: C.primary,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    marginBottom: S.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardSoft,
    borderRadius: R.lg,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: S.md,
    paddingVertical: isSmallPhone ? 10 : 13,
    gap: S.sm,
  },
  inputFocused: {
    borderColor: C.primary,
    backgroundColor: C.bgElevated,
    ...SHADOW.soft,
  },
  fieldIcon: { fontSize: isSmallPhone ? 14 : 16 },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: isSmallPhone ? 14 : 15,
    color: C.textPrimary,
    padding: 0,
  },

  // CTA button
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: isSmallPhone ? 13 : 17,
    borderRadius: R.pill,
    ...SHADOW.glow,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', marginVertical: S.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },

  // Footer
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  footerLink: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: isSmallPhone ? 12 : 13,
    color: C.primary,
  },
});
