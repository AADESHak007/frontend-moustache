/**
 * S1 — HomeScreen
 *
 * Landing screen with animated hero, 6 style chips, feature list, and CTA.
 * Entry point to the app flow.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from '../types';


type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;



const STYLE_CHIPS = [
  { label: '👨 Chevron',      color: '#7c3aed' },
  { label: '🎩 Handlebar',    color: '#0891b2' },
  { label: '🥷 Fu Manchu',    color: '#dc2626' },
  { label: '✏️ Pencil Thin',  color: '#059669' },
  { label: '🦣 Walrus',       color: '#d97706' },
  { label: '🎭 English',      color: '#db2777' },
];

const FEATURES = [
  { icon: '⚡', text: 'AI face detection in seconds' },
  { icon: '🎨', text: '6 hand-crafted mustache styles' },
  { icon: '🔒', text: 'Private · AI processing & storage' },
  { icon: '📤', text: 'Save & share instantly' },
];

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#ffffff' },
  main:        { flex: 1 },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom:     100, // Very generous padding for mobile
    flexGrow:          1,
  },
  contentInner: {
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  hero: {
    alignItems:   'center',
    marginBottom: 48,
  },
  logoWrapper: {
    width:        88,
    height:       88,
    borderRadius: 22,
    overflow:     'hidden',
    justifyContent: 'center',
    alignItems:   'center',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    shadowColor:  '#5b21b6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation:    4,
  },
  logoImage: {
    width:  125, // Specifically sized up to trim the white edges of the jpg
    height: 125,
  },
  title: {
    fontSize:      42,
    fontWeight:    '900',
    color:         '#0f172a',
    letterSpacing: -1,
  },
  titleAccent: {
    fontSize:      42,
    fontWeight:    '900',
    color:         '#5b21b6',
    letterSpacing: -1,
    marginTop:     -4,
  },
  tagline: {
    fontSize:   16,
    fontWeight: '400',
    color:      '#64748b',
    textAlign:  'center',
    marginTop:  16,
    lineHeight: 24,
  },
  section: {
    width:        '100%',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize:     13,
    fontWeight:   '700',
    textTransform: 'uppercase',
    color:        '#94a3b8',
    marginBottom: 16,
    letterSpacing: 1.2,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
  },
  chip: {
    borderWidth:       0, // Set to 0 to override any inline colors and keep it clean
    borderRadius:      12,
    paddingHorizontal: 16,
    paddingVertical:   10,
    backgroundColor:   '#ffffff',
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.04,
    shadowRadius:      4,
    elevation:         2,
  },
  chipText: {
    color:      '#334155',
    fontSize:   14,
    fontWeight: '500',
  },
  featureCard: {
    width:           '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius:    24,
    padding:         24,
    marginBottom:    36,
    borderWidth:     1,
    borderColor:     'rgba(255, 255, 255, 0.9)',
    shadowColor:     '#4f46e5',
    shadowOffset:    { width: 0, height: 12 },
    shadowOpacity:   0.08,
    shadowRadius:    30,
    elevation:       4,
  },
  featureRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginBottom:   16,
  },
  featureIcon: {
    fontSize:    20,
    marginRight: 16,
    width:       28,
    textAlign:   'center',
    opacity:     0.9,
  },
  featureText: {
    color:      '#475569',
    fontSize:   15,
    fontWeight: '500',
    flex:       1,
  },
  cta: {
    borderRadius:  20,
    overflow:      'hidden',
    shadowColor:   '#5b21b6',
    shadowOffset:  { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius:  24,
    elevation:     8,
    marginBottom:  32,
  },
  ctaGradient: {
    paddingVertical:   20,
    paddingHorizontal: 64,
    alignItems:        'center',
  },
  ctaText: {
    color:         '#ffffff',
    fontSize:      18,
    fontWeight:    '700',
    letterSpacing: 0.3,
  },
  footer: {
    color:    '#cbd5e1',
    fontSize: 12,
  },
  authBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
  },
});

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { token, user, logout } = useAppStore();

  // Animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const emojiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade + slide in
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();

    // Emoji bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiAnim, { toValue: -8, duration: 700, useNativeDriver: true }),
        Animated.timing(emojiAnim, { toValue:  0, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    // CTA pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleStart = () => {
    if (token) {
      navigation.navigate('Upload');
    } else {
      navigation.navigate('SignIn');
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ffffff', '#f8fafc', '#f1f5f9']} style={StyleSheet.absoluteFill} />
      
      <View style={[styles.main, { paddingTop: insets.top }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          overScrollMode="always"
          scrollEnabled={true}
        >
          {/* Auth Top Bar (Now inside ScrollView for better layout) */}
          {token && (
            <View style={styles.authBar}>
              <View style={styles.userInfo}>
                <View style={styles.userDot} />
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
              <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.contentInner}>
          {/* Hero */}
          <Animated.View
            style={[
              styles.hero,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Animated.View style={[styles.logoWrapper, { transform: [{ translateY: emojiAnim }] }]}>
              <Image
                source={require('../components/logo/logo.jpeg')}
                style={styles.logoImage}
              />
            </Animated.View>
            <Text style={styles.title}>AI Mustache</Text>
            <Text style={styles.titleAccent}>Generator</Text>
            <Text style={styles.tagline}>
              Transform any selfie with AI-powered{'\n'}mustache overlays in seconds
            </Text>
          </Animated.View>

          {/* Style chips */}
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <Text style={styles.sectionLabel}>6 Premium Styles</Text>
            <View style={styles.chipsGrid}>
              {STYLE_CHIPS.map((chip) => (
                <View
                  key={chip.label}
                  style={[styles.chip, { borderColor: chip.color }]}
                >
                  <Text style={styles.chipText}>{chip.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Features */}
          <Animated.View style={[styles.featureCard, { opacity: fadeAnim }]}>
            {FEATURES.map((f) => (
              <View key={f.text} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </Animated.View>

          {/* CTA Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.cta}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#9333ea', '#7c3aed']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>{token ? 'Start Generating' : 'Sign In to Start'}  →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footer}>🥸 AI Mustache Generator · v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  </View>
);
}

