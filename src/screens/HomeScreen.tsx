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
    <LinearGradient colors={['#0d0d0d', '#130a1e', '#0d0d0d']} style={styles.gradient}>
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
            <Animated.Text
              style={[styles.emoji, { transform: [{ translateY: emojiAnim }] }]}
            >
              🥸
            </Animated.Text>
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
    paddingVertical:   36,
    alignItems:        'center',
  },
  hero: {
    alignItems:   'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize:     76,
    marginBottom: 10,
  },
  title: {
    fontSize:      44,
    fontWeight:    '800',
    color:         '#ffffff',
    letterSpacing: -1.5,
  },
  titleAccent: {
    fontSize:      44,
    fontWeight:    '800',
    color:         '#a855f7',
    letterSpacing: -1.5,
    marginTop:     -6,
  },
  tagline: {
    fontSize:   16,
    color:      '#9ca3af',
    textAlign:  'center',
    marginTop:  16,
    lineHeight: 24,
  },
  section: {
    width:        '100%',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize:     16,
    fontWeight:   '700',
    color:        '#e5e7eb',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
  },
  chip: {
    borderWidth:      1.5,
    borderRadius:     24,
    paddingHorizontal: 14,
    paddingVertical:   8,
  },
  chipText: {
    color:      '#e5e7eb',
    fontSize:   14,
    fontWeight: '600',
  },
  featureCard: {
    width:         '100%',
    backgroundColor: '#161616',
    borderRadius:   18,
    padding:        20,
    marginBottom:   32,
    borderWidth:    1,
    borderColor:    '#2a2a2a',
  },
  featureRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginBottom:   14,
  },
  featureIcon: {
    fontSize:    20,
    marginRight: 14,
    width:       28,
    textAlign:   'center',
  },
  featureText: {
    color:      '#d1d5db',
    fontSize:   15,
    fontWeight: '500',
    flex:       1,
  },
  cta: {
    borderRadius:  18,
    overflow:      'hidden',
    shadowColor:   '#a855f7',
    shadowOffset:  { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius:  20,
    elevation:     10,
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
    fontWeight:    '800',
    letterSpacing: 0.5,
  },
  footer: {
    color:    '#4b5563',
    fontSize: 12,
  },
});
