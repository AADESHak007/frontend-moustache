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
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';

type ResultNav = StackNavigationProp<RootStackParamList, 'Result'>;

const { width, height } = Dimensions.get('window');

export default function ResultScreen() {
  const navigation   = useNavigation<ResultNav>();
  const currentJob   = useAppStore((s) => s.currentJob);
  const resetSession = useAppStore((s) => s.resetSession);
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const token         = useAppStore((s) => s.token);

  // Auth Guard
  React.useEffect(() => {
    if (!token) {
      navigation.replace('SignIn');
    }
  }, [token]);

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

  const insets = useSafeAreaInsets();

  if (!outputUrl) {
    // Shouldn't normally happen, but handle gracefully
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={StyleSheet.absoluteFill} />
        <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <ScrollView contentContainerStyle={styles.center} bounces={true}>
            <Text style={styles.errorEmoji}>😕</Text>
            <Text style={styles.errorTitle}>No result available</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={_onRetry}>
              <Text style={styles.retryText}>Start Over</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={StyleSheet.absoluteFill} />
      <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.contentInner}>

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

          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const IMG_SIZE = width - 48;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  main: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingVertical: 20 },
  contentInner: { paddingHorizontal: 24, width: '100%', alignItems: 'center' },
  center: {
    flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingTop:     12,
    width: '100%',
    marginBottom:   16,
  },
  headerTitle: {
    fontSize:      22,
    fontWeight:    '800',
    color:         '#1a1a2e',
    letterSpacing: -0.3,
  },
  styleBadge: {
    backgroundColor: '#f3f0ff',
    borderRadius:    12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth:     1,
    borderColor:     '#c4b5fd',
  },
  styleBadgeText: { color: '#7c3aed', fontSize: 13, fontWeight: '600' },
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
    width: '100%',
    gap:            12,
    marginBottom:   16,
  },
  actionBtn: {
    flex:         1,
    borderRadius: 14,
    overflow:     'hidden',
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
    color:      '#9ca3af',
    fontSize:   12,
    textAlign:  'center',
    marginTop:  4,
  },
  // Error fallback
  errorEmoji:  { fontSize: 64, marginBottom: 16 },
  errorTitle:  { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 24 },
  retryBtn:    { backgroundColor: '#7c3aed', borderRadius: 14, padding: 16 },
  retryText:   { color: '#fff', fontSize: 16, fontWeight: '800' },
});
