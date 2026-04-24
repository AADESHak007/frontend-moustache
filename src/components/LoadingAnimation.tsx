/**
 * LoadingAnimation component
 *
 * A multi-ring spinning animation used on the ProcessingScreen.
 * Pure React Native Animated — no third-party animation library needed.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function LoadingAnimation() {
  const spin1 = useRef(new Animated.Value(0)).current;
  const spin2 = useRef(new Animated.Value(0)).current;
  const spin3 = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Outer ring — slow clockwise
    Animated.loop(
      Animated.timing(spin1, {
        toValue: 1,
        duration: 2800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Middle ring — medium counter-clockwise
    Animated.loop(
      Animated.timing(spin2, {
        toValue: -1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Inner ring — fast clockwise
    Animated.loop(
      Animated.timing(spin3, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Core pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 0.9, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotate1 = spin1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotate2 = spin2.interpolate({ inputRange: [-1, 0], outputRange: ['-360deg', '0deg'] });
  const rotate3 = spin3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      {/* Outer ring */}
      <Animated.View
        style={[styles.ring, styles.ring1, { transform: [{ rotate: rotate1 }] }]}
      />
      {/* Middle ring */}
      <Animated.View
        style={[styles.ring, styles.ring2, { transform: [{ rotate: rotate2 }] }]}
      />
      {/* Inner ring */}
      <Animated.View
        style={[styles.ring, styles.ring3, { transform: [{ rotate: rotate3 }] }]}
      />
      {/* Core emoji */}
      <Animated.Text
        style={[styles.emoji, { transform: [{ scale: pulseScale }] }]}
      >
        🥸
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderStyle: 'solid',
  },
  ring1: {
    width: 140,
    height: 140,
    borderWidth: 3,
    borderColor: '#7c3aed',
    borderTopColor: 'transparent',
  },
  ring2: {
    width: 104,
    height: 104,
    borderWidth: 3,
    borderColor: '#a855f7',
    borderRightColor: 'transparent',
  },
  ring3: {
    width: 72,
    height: 72,
    borderWidth: 3,
    borderColor: '#c084fc',
    borderBottomColor: 'transparent',
  },
  emoji: {
    fontSize: 32,
    textAlign: 'center',
  },
});
