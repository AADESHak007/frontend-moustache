/**
 * StyleCard component
 *
 * A single mustache style option displayed in the StylePickerScreen grid.
 * Shows style label, a visual placeholder, and selection highlight.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Style } from '../types';

interface StyleCardProps {
  style:    Style;
  selected: boolean;
  onSelect: () => void;
}

const { width } = Dimensions.get('window');
const CARD_W    = (width - 54) / 2;  // 2 columns with gaps

// Emoji and color map per style ID
const STYLE_META: Record<string, { emoji: string; color: string; gradient: [string, string] }> = {
  chevron:   { emoji: '👨',  color: '#7c3aed', gradient: ['#1a0a2e', '#2d1458'] },
  handlebar: { emoji: '🎩',  color: '#0891b2', gradient: ['#0a1a2e', '#0c2a40'] },
  fu_manchu: { emoji: '🥷',  color: '#dc2626', gradient: ['#2e0a0a', '#4a1010'] },
  pencil:    { emoji: '✏️',  color: '#059669', gradient: ['#0a1a10', '#0f2a18'] },
  walrus:    { emoji: '🦭',  color: '#d97706', gradient: ['#1a1000', '#2a1a00'] },
  english:   { emoji: '🎭',  color: '#db2777', gradient: ['#2e0a18', '#4a1028'] },
};

export default function StyleCard({ style, selected, onSelect }: StyleCardProps) {
  const meta    = STYLE_META[style.id] ?? { emoji: '🥸', color: '#7c3aed', gradient: ['#1a1a1a', '#2a2a2a'] };
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue:        selected ? 1.04 : 1,
      useNativeDriver: true,
      tension:         120,
      friction:        8,
    }).start();
  }, [selected]);

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.card,
          selected && { borderColor: meta.color, borderWidth: 2.5 },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={meta.gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Emoji icon */}
          <Text style={styles.emoji}>{meta.emoji}</Text>

          {/* Style label */}
          <Text style={[styles.label, selected && { color: meta.color }]}>
            {style.label}
          </Text>

          {/* Selected checkmark */}
          {selected && (
            <View style={[styles.checkBadge, { backgroundColor: meta.color }]}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width:        CARD_W,
    borderRadius: 18,
    overflow:     'hidden',
    borderWidth:  1.5,
    borderColor:  '#2a2a2a',
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation:    6,
  },
  gradient: {
    paddingVertical:   28,
    paddingHorizontal: 16,
    alignItems:        'center',
    minHeight:         120,
    justifyContent:    'center',
  },
  emoji: {
    fontSize:     40,
    marginBottom: 10,
  },
  label: {
    fontSize:      14,
    fontWeight:    '700',
    color:         '#e5e7eb',
    textAlign:     'center',
    letterSpacing: 0.2,
  },
  checkBadge: {
    position:  'absolute',
    top:        10,
    right:      10,
    width:      24,
    height:     24,
    borderRadius: 12,
    alignItems:   'center',
    justifyContent: 'center',
  },
  checkText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});
