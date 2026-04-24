/**
 * S5 — ResultScreen
 *
 * Full-screen display of the generated mustache image.
 * Actions: Save to camera roll · Share · Try Another
 */

import React, { useCallback } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';

type ResultNav = StackNavigationProp<RootStackParamList, 'Result'>;

const { width, height } = Dimensions.get('window');

export default function ResultScreen() {
  const navigation   = useNavigation<ResultNav>();
  const currentJob   = useAppStore((s) => s.currentJob);
  const resetSession = useAppStore((s) => s.resetSession);
  const selectedStyle = useAppStore((s) => s.selectedStyle);

  const outputUrl = currentJob?.output_url ?? null;

  // ── Save to camera roll ──
  const _onSave = useCallback(async () => {
    if (!outputUrl) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to save photos.');
      return;
    }

    try {
      // Download to local temp file first
      const localUri  = FileSystem.cacheDirectory + `mustache_${Date.now()}.jpg`;
      const download  = await FileSystem.downloadAsync(outputUrl, localUri);
      await MediaLibrary.saveToLibraryAsync(download.uri);
      Alert.alert('Saved! 💾', 'Your mustache photo has been saved to your camera roll.');
    } catch {
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  }, [outputUrl]);

  // ── Share ──
  const _onShare = useCallback(async () => {
    if (!outputUrl) return;

    try {
      const localUri = FileSystem.cacheDirectory + `mustache_${Date.now()}.jpg`;
      const download = await FileSystem.downloadAsync(outputUrl, localUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(download.uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Share your mustache! 🥸',
        });
      } else {
        // Fallback to native share sheet
        await Share.share({
          message: '🥸 Check out my AI mustache! Made with AI Mustache Generator',
          url:     outputUrl,
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to share photo.');
    }
  }, [outputUrl]);

  // ── Try another ──
  const _onRetry = () => {
    resetSession();
    navigation.popToTop();
  };

  if (!outputUrl) {
    // Shouldn't normally happen, but handle gracefully
    return (
      <LinearGradient colors={['#0d0d0d', '#130a1e', '#0d0d0d']} style={styles.gradient}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <Text style={styles.errorEmoji}>😕</Text>
            <Text style={styles.errorTitle}>No result available</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={_onRetry}>
              <Text style={styles.retryText}>Start Over</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0d0d0d', '#130a1e', '#0d0d0d']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Mustache ✨</Text>
          {selectedStyle && (
            <View style={styles.styleBadge}>
              <Text style={styles.styleBadgeText}>{selectedStyle.label}</Text>
            </View>
          )}
        </View>

        {/* Full-screen result image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: outputUrl }}
            style={styles.resultImage}
            resizeMode="cover"
          />
          {/* Success badge */}
          <View style={styles.successBadge}>
            <Text style={styles.successText}>🎉 AI Generated</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {/* Save */}
          <TouchableOpacity style={styles.actionBtn} onPress={_onSave} activeOpacity={0.8}>
            <LinearGradient
              colors={['#065f46', '#047857']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.actionIcon}>💾</Text>
              <Text style={styles.actionLabel}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={styles.actionBtn} onPress={_onShare} activeOpacity={0.8}>
            <LinearGradient
              colors={['#1e3a5f', '#1d4ed8']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionLabel}>Share</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Try Another */}
          <TouchableOpacity style={styles.actionBtn} onPress={_onRetry} activeOpacity={0.8}>
            <LinearGradient
              colors={['#4c1d95', '#7c3aed']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionLabel}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.privacyNote}>
          🔒 This image will be automatically deleted in 24 hours
        </Text>

      </SafeAreaView>
    </LinearGradient>
  );
}

const IMG_SIZE = width - 48;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1, paddingHorizontal: 24 },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingTop:     12,
    marginBottom:   16,
  },
  headerTitle: {
    fontSize:      22,
    fontWeight:    '800',
    color:         '#ffffff',
    letterSpacing: -0.3,
  },
  styleBadge: {
    backgroundColor: '#1a0a2e',
    borderRadius:    12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth:     1,
    borderColor:     '#7c3aed',
  },
  styleBadgeText: { color: '#c4b5fd', fontSize: 13, fontWeight: '600' },
  imageContainer: {
    alignItems:   'center',
    marginBottom: 24,
  },
  resultImage: {
    width:        IMG_SIZE,
    height:       IMG_SIZE,
    borderRadius: 20,
    borderWidth:  2,
    borderColor:  '#7c3aed',
  },
  successBadge: {
    position:        'absolute',
    top:             12,
    right:           12,
    backgroundColor: 'rgba(16,185,129,0.9)',
    borderRadius:    10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  successText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  actions: {
    flexDirection:  'row',
    gap:            12,
    marginBottom:   16,
  },
  actionBtn: {
    flex:         1,
    borderRadius: 14,
    overflow:     'hidden',
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation:    6,
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems:      'center',
  },
  actionIcon:  { fontSize: 22, marginBottom: 4 },
  actionLabel: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  privacyNote: {
    color:      '#4b5563',
    fontSize:   12,
    textAlign:  'center',
    marginTop:  4,
  },
  // Error fallback
  errorEmoji:  { fontSize: 64, marginBottom: 16 },
  errorTitle:  { fontSize: 22, fontWeight: '800', color: '#ffffff', marginBottom: 24 },
  retryBtn:    { backgroundColor: '#7c3aed', borderRadius: 14, padding: 16 },
  retryText:   { color: '#fff', fontSize: 16, fontWeight: '800' },
});
