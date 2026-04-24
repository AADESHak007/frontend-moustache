/**
 * S3 — StylePickerScreen
 *
 * Fetches all 6 mustache styles from the API.
 * Displays them in a horizontally-scrollable card list.
 * Selected style is highlighted. "Generate Mustache" starts processing.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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

import { RootStackParamList, Style } from '../types';
import { useAppStore } from '../store/useAppStore';
import { createJob } from '../api/jobs';
import { getStyles } from '../api/styles';
import StyleCard from '../components/StyleCard';

type StylePickerNav = StackNavigationProp<RootStackParamList, 'StylePicker'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

export default function StylePickerScreen() {
  const navigation      = useNavigation<StylePickerNav>();
  const styles_list     = useAppStore((s) => s.styles);
  const setStyles       = useAppStore((s) => s.setStyles);
  const selectedStyle   = useAppStore((s) => s.selectedStyle);
  const setSelectedStyle = useAppStore((s) => s.setSelectedStyle);
  const selectedImageUri = useAppStore((s) => s.selectedImageUri);
  const userId           = useAppStore((s) => s.userId);
  const setCurrentJob    = useAppStore((s) => s.setCurrentJob);

  const [loading,      setLoading]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch styles on mount (backend caches for 5min)
  useEffect(() => {
    if (styles_list.length === 0) {
      setLoading(true);
      getStyles()
        .then((res) => setStyles(res.styles))
        .catch(() => setErrorMessage('Failed to load styles. Please go back and try again.'))
        .finally(() => setLoading(false));
    }
  }, []);

  const _onGenerate = async () => {
    if (!selectedStyle || !selectedImageUri) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const job = await createJob(selectedImageUri, selectedStyle.id, userId);
      setCurrentJob({ job_id: job.job_id, status: job.status });
      navigation.navigate('Processing');
    } catch (err: any) {
      setErrorMessage(err.message ?? 'Failed to start job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={vStyles.gradient}>
      <SafeAreaView style={vStyles.safe}>

        {/* Header */}
        <View style={vStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={vStyles.backBtn}>
            <Text style={vStyles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={vStyles.stepLabel}>Step 2 of 3</Text>
        </View>

        <Text style={vStyles.title}>Choose Your{'\n'}Mustache Style</Text>
        <Text style={vStyles.subtitle}>
          {selectedStyle
            ? `✓ ${selectedStyle.label} selected`
            : 'Tap a style to preview it'}
        </Text>

        {/* Image thumbnail preview */}
        {selectedImageUri && (
          <Image source={{ uri: selectedImageUri }} style={vStyles.thumbPreview} />
        )}

        {/* Style Grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 40 }} />
        ) : errorMessage ? (
          <View style={vStyles.errorBox}>
            <Text style={vStyles.errorText}>{errorMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={styles_list}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={vStyles.row}
            contentContainerStyle={vStyles.grid}
            renderItem={({ item }) => (
              <StyleCard
                style={item}
                selected={selectedStyle?.id === item.id}
                onSelect={() => setSelectedStyle(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Error from submission */}
        {errorMessage && !loading && (
          <Text style={vStyles.submitError}>{errorMessage}</Text>
        )}

        {/* Generate CTA */}
        <TouchableOpacity
          style={[vStyles.generateBtn, (!selectedStyle || submitting) && vStyles.generateBtnDisabled]}
          onPress={_onGenerate}
          disabled={!selectedStyle || submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <LinearGradient
              colors={selectedStyle ? ['#9333ea', '#7c3aed'] : ['#e5e7eb', '#d1d5db']}
              style={vStyles.generateGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={vStyles.generateText}>
                {selectedStyle ? `Generate with ${selectedStyle.label}  →` : 'Select a style first'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const vStyles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingTop:     12,
    marginBottom:   20,
  },
  backBtn:   { padding: 4 },
  backText:  { color: '#6b7280', fontSize: 15, fontWeight: '500' },
  stepLabel: { color: '#9ca3af', fontSize: 13, fontWeight: '600' },
  title: {
    fontSize:      26,
    fontWeight:    '800',
    color:         '#1a1a2e',
    letterSpacing: -0.5,
    marginBottom:  6,
  },
  subtitle: {
    fontSize:     14,
    color:        '#9333ea',
    fontWeight:   '600',
    marginBottom: 16,
  },
  thumbPreview: {
    width:        56,
    height:       56,
    borderRadius: 28,
    borderWidth:  2,
    borderColor:  '#7c3aed',
    marginBottom: 16,
  },
  row:  { justifyContent: 'space-between', marginBottom: 14 },
  grid: { paddingBottom: 16 },
  errorBox: {
    backgroundColor: '#fff5f5',
    borderRadius:    12,
    padding:         16,
    marginTop:       24,
    borderWidth:     1,
    borderColor:     '#fecaca',
  },
  errorText:   { color: '#dc2626', fontSize: 14, textAlign: 'center' },
  submitError: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  generateBtn: {
    borderRadius: 16,
    overflow:     'hidden',
    marginTop:    10,
    shadowColor:  '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation:    8,
  },
  generateBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  generateGradient: {
    paddingVertical: 18,
    alignItems:      'center',
  },
  generateText: {
    color:         '#ffffff',
    fontSize:      16,
    fontWeight:    '800',
    letterSpacing: 0.3,
  },
});
