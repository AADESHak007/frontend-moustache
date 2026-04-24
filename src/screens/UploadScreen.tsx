/**
 * S2 — UploadScreen
 *
 * Two options: camera selfie or gallery pick.
 * Shows image preview once selected.
 * "Next →" navigates to StylePickerScreen.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';

type UploadNav = StackNavigationProp<RootStackParamList, 'Upload'>;

const MAX_SIZE_PX = 4000;

export default function UploadScreen() {
  const navigation         = useNavigation<UploadNav>();
  const setSelectedImageUri = useAppStore((s) => s.setSelectedImageUri);
  const selectedImageUri    = useAppStore((s) => s.selectedImageUri);

  const [loading, setLoading] = useState(false);

  const _pickFromGallery = async () => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Gallery permission is required to select a photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:       ImagePicker.MediaTypeOptions.Images,
        allowsEditing:    true,
        aspect:           [1, 1],
        quality:          0.9,
        allowsMultipleSelection: false,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  };

  const _takeWithCamera = async () => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take a selfie.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        cameraType:    ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect:        [1, 1],
        quality:       0.9,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  };

  const _onNext = () => {
    if (selectedImageUri) {
      navigation.navigate('StylePicker');
    }
  };

  return (
    <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepLabel}>Step 1 of 3</Text>
        </View>

        <Text style={styles.title}>Upload Your Photo</Text>
        <Text style={styles.subtitle}>Take a selfie or choose from your gallery</Text>

        {/* Image Preview / Placeholder */}
        <View style={styles.previewContainer}>
          {selectedImageUri ? (
            <Image source={{ uri: selectedImageUri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              {loading ? (
                <ActivityIndicator size="large" color="#a855f7" />
              ) : (
                <>
                  <Text style={styles.placeholderEmoji}>📷</Text>
                  <Text style={styles.placeholderText}>No photo selected</Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionBtn, styles.cameraBtn]}
            onPress={_takeWithCamera}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.optionIcon}>📷</Text>
            <Text style={styles.optionLabel}>Take Selfie</Text>
            <Text style={styles.optionSub}>Use front camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionBtn, styles.galleryBtn]}
            onPress={_pickFromGallery}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={styles.optionLabel}>From Gallery</Text>
            <Text style={styles.optionSub}>Choose existing photo</Text>
          </TouchableOpacity>
        </View>

        {/* Validation hint */}
        <Text style={styles.hint}>JPEG or PNG · Max 5MB · Max 4000×4000px</Text>

        {/* Next */}
        {selectedImageUri && (
          <TouchableOpacity style={styles.nextBtn} onPress={_onNext} activeOpacity={0.85}>
            <LinearGradient
              colors={['#9333ea', '#7c3aed']}
              style={styles.nextGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextText}>Choose Style  →</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}

const PREVIEW_SIZE = 260;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1, paddingHorizontal: 24 },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingTop:     12,
    marginBottom:   24,
  },
  backBtn:   { padding: 4 },
  backText:  { color: '#6b7280', fontSize: 15, fontWeight: '500' },
  stepLabel: { color: '#9ca3af', fontSize: 13, fontWeight: '600' },
  title: {
    fontSize:      28,
    fontWeight:    '800',
    color:         '#1a1a2e',
    letterSpacing: -0.5,
    marginBottom:  6,
  },
  subtitle: {
    fontSize:     15,
    color:        '#6b7280',
    marginBottom: 28,
  },
  previewContainer: {
    alignItems:   'center',
    marginBottom: 28,
  },
  preview: {
    width:        PREVIEW_SIZE,
    height:       PREVIEW_SIZE,
    borderRadius: PREVIEW_SIZE / 2,
    borderWidth:  3,
    borderColor:  '#7c3aed',
  },
  placeholder: {
    width:           PREVIEW_SIZE,
    height:          PREVIEW_SIZE,
    borderRadius:    PREVIEW_SIZE / 2,
    borderWidth:     2,
    borderColor:     '#c4b5fd',
    borderStyle:     'dashed',
    backgroundColor: '#f3f0ff',
    alignItems:      'center',
    justifyContent:  'center',
  },
  placeholderEmoji: { fontSize: 52, marginBottom: 10 },
  placeholderText:  { color: '#9ca3af', fontSize: 14 },
  buttonGroup: {
    flexDirection: 'row',
    gap:           14,
    marginBottom:  20,
  },
  optionBtn: {
    flex:            1,
    borderRadius:    16,
    padding:         18,
    alignItems:      'center',
    borderWidth:     1.5,
  },
  cameraBtn: {
    backgroundColor: '#f3f0ff',
    borderColor:     '#7c3aed',
  },
  galleryBtn: {
    backgroundColor: '#f0fdf4',
    borderColor:     '#059669',
  },
  optionIcon:  { fontSize: 28, marginBottom: 6 },
  optionLabel: { color: '#1a1a2e', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  optionSub:   { color: '#9ca3af', fontSize: 12 },
  hint: {
    color:        '#9ca3af',
    fontSize:     12,
    textAlign:    'center',
    marginBottom: 24,
  },
  nextBtn: {
    borderRadius:  16,
    overflow:      'hidden',
    shadowColor:   '#7c3aed',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius:  16,
    elevation:     8,
  },
  nextGradient: {
    paddingVertical:   18,
    alignItems:        'center',
  },
  nextText: {
    color:         '#ffffff',
    fontSize:      17,
    fontWeight:    '800',
    letterSpacing: 0.3,
  },
});
