/**
 * StyleCard — updated to match warm ivory theme.
 * Used by StylePickerScreen. Logic unchanged.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { Style } from '../types';
import { C, T, S, R, SHADOW, isTablet, isDesktop } from '../screens/theme';

const { width } = Dimensions.get('window');
const isSmallPhone = width < 375;

interface Props {
  style:    Style;
  selected: boolean;
  onSelect: () => void;
}

const CARD_W =
  isDesktop ? 180 :
  isTablet  ? 160 :
  (width - S.lg * 2 - S.sm) / 2;

export default function StyleCard({ style, selected, onSelect }: Props) {
  return (
    <TouchableOpacity
      style={[s.card, { width: CARD_W }, selected && s.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.75}
    >
      {/* Label */}
      <Text
        style={[s.label, selected && { color: C.primary, fontFamily: 'DMSans_600SemiBold' }]}
        numberOfLines={1}
      >
        {style.label}
      </Text>

      {/* Tick badge */}
      {selected && (
        <View style={s.tick}>
          <LinearGradient
            colors={[C.gradStart, C.gradEnd]}
            style={s.tickGrad}
          >
            <Text style={s.tickText}>✓</Text>
          </LinearGradient>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius:    R.lg,
    padding:         S.md,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1.5,
    borderColor:     C.border,
    minHeight:       isSmallPhone ? 56 : 64,
    position:        'relative',
    ...SHADOW.soft,
  },
  cardSelected: {
    borderColor:     C.primary,
    backgroundColor: C.accentSoft,
    ...SHADOW.glow,
  },
  label: {
    fontFamily: 'DMSans_400Regular',
    fontSize:   isSmallPhone ? 12 : 13,
    color:      C.textSecondary,
    textAlign:  'center',
  },
  tick: {
    position:     'absolute',
    top:          S.xs,
    right:        S.xs,
    width:        20,
    height:       20,
    borderRadius: 10,
    overflow:     'hidden',
  },
  tickGrad: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  tickText: {
    fontFamily: 'DMSans_600SemiBold', fontSize: 10, color: C.white,
  },
});