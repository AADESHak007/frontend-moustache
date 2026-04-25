/**
 * S4 — ProcessingScreen
 *
 * Polls GET /api/jobs/{job_id} every 2 seconds.
 * Shows animated loader with rotating status messages.
 * Navigates to ResultScreen on 'done', shows error on 'failed'.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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

import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getJobStatus } from '../api/jobs';
import LoadingAnimation from '../components/LoadingAnimation';

type ProcessingNav = StackNavigationProp<RootStackParamList, 'Processing'>;

const POLL_INTERVAL_MS = 2000;   // 2 seconds — per system design

const STATUS_MESSAGES = [
  '🔍  Detecting face landmarks...',
  '📐  Measuring lip position...',
  '🎨  Loading mustache style...',
  '✂️   Resizing & rotating...',
  '🖼️   Compositing overlay...',
  '💾  Compressing result...',
];

export default function ProcessingScreen() {
  const navigation   = useNavigation<ProcessingNav>();
  const currentJob   = useAppStore((s) => s.currentJob);
  const updateJob    = useAppStore((s) => s.updateJob);
  const resetSession = useAppStore((s) => s.resetSession);
  const token        = useAppStore((s) => s.token);

  const [msgIndex,     setMsgIndex]    = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!token) {
      navigation.replace('SignIn');
    }
  }, [token]);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycle status messages every 2s for a lively feel
  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(msgTimer);
  }, []);

  // Poll job status every 2 seconds
  useEffect(() => {
    if (!currentJob?.job_id) return;

    const poll = async () => {
      try {
        const job = await getJobStatus(currentJob.job_id);
        updateJob({ status: job.status, output_url: job.output_url, error: job.error });

        if (job.status === 'done') {
          clearInterval(pollRef.current!);
          navigation.navigate('Result');
        } else if (job.status === 'failed') {
          clearInterval(pollRef.current!);
          setErrorMessage(
            job.error ?? 'Processing failed. Please try again with a clearer photo.'
          );
        }
      } catch {
        // Network error — keep trying
      }
    };

    poll(); // Immediate first poll
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [currentJob?.job_id]);

  const _onRetry = () => {
    resetSession();
    navigation.popToTop();
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f6f4ff', '#fdf4ff', '#f6f4ff']} style={StyleSheet.absoluteFill} />
      
      <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >

        {errorMessage ? (
          /* ── Error state ── */
          <View style={styles.center}>
            <Text style={styles.errorEmoji}>😕</Text>
            <Text style={styles.errorTitle}>Processing Failed</Text>
            <Text style={styles.errorMsg}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={_onRetry}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Loading state ── */
          <View style={styles.center}>
            <LoadingAnimation />

            <Text style={styles.headline}>AI is working{'\n'}its magic...</Text>

            <View style={styles.msgBox}>
              <Text style={styles.statusMsg} key={msgIndex}>
                {STATUS_MESSAGES[msgIndex]}
              </Text>
            </View>

            <Text style={styles.subtext}>
              Usually takes 5–15 seconds{'\n'}depending on image complexity
            </Text>

            {/* Job ID for transparency */}
            {currentJob?.job_id && (
              <Text style={styles.jobId} numberOfLines={1} ellipsizeMode="middle">
                Job: {currentJob.job_id}
              </Text>
            )}
          </View>
        )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  main: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  center: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headline: {
    fontSize:      30,
    fontWeight:    '800',
    color:         '#1a1a2e',
    textAlign:     'center',
    letterSpacing: -0.5,
    marginTop:     32,
    marginBottom:  24,
  },
  msgBox: {
    backgroundColor: '#ffffff',
    borderRadius:    14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth:     1,
    borderColor:     '#ede9fe',
    marginBottom:    28,
    minWidth:        260,
    alignItems:      'center',
    shadowColor:     '#7c3aed',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.08,
    shadowRadius:    12,
    elevation:       3,
  },
  statusMsg: {
    color:      '#374151',
    fontSize:   15,
    fontWeight: '500',
    textAlign:  'center',
  },
  subtext: {
    color:      '#6b7280',
    fontSize:   13,
    textAlign:  'center',
    lineHeight: 20,
  },
  jobId: {
    color:        '#9ca3af',
    fontSize:     11,
    fontFamily:   'monospace',
    marginTop:    20,
    maxWidth:     260,
  },
  // Error
  errorEmoji: { fontSize: 64, marginBottom: 16 },
  errorTitle: {
    fontSize:     24,
    fontWeight:   '800',
    color:        '#1a1a2e',
    marginBottom: 12,
  },
  errorMsg: {
    color:        '#6b7280',
    fontSize:     15,
    textAlign:    'center',
    lineHeight:   22,
    marginBottom: 32,
  },
  retryBtn: {
    backgroundColor: '#7c3aed',
    borderRadius:    14,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  retryText: {
    color:      '#ffffff',
    fontSize:   16,
    fontWeight: '800',
  },
});
