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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../types';

type HomeNav = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

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
  { icon: '🔒', text: 'Private · Auto-deleted after 24h' },
  { icon: '📤', text: 'Save & share instantly' },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();

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

  return (
    <LinearGradient colors={['#ffffff', '#f8fafc', '#f1f5f9']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
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
              onPress={() => navigation.navigate('Upload')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#9333ea', '#7c3aed']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>Try It Now  →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footer}>🥸 AI Mustache Generator · v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient:    { flex: 1 },
  safe:        { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingVertical:   40,
    alignItems:        'center',
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
    shadowOpacity:   0.06,
    shadowRadius:    24,
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
});
