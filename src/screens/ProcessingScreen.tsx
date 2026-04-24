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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const [msgIndex,     setMsgIndex]    = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <LinearGradient colors={['#0d0d0d', '#130a1e', '#0d0d0d']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>

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

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },
  center: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headline: {
    fontSize:      30,
    fontWeight:    '800',
    color:         '#ffffff',
    textAlign:     'center',
    letterSpacing: -0.5,
    marginTop:     32,
    marginBottom:  24,
  },
  msgBox: {
    backgroundColor: '#1a1a1a',
    borderRadius:    14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth:     1,
    borderColor:     '#2a2a2a',
    marginBottom:    28,
    minWidth:        260,
    alignItems:      'center',
  },
  statusMsg: {
    color:      '#d1d5db',
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
    color:        '#374151',
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
    color:        '#ffffff',
    marginBottom: 12,
  },
  errorMsg: {
    color:        '#9ca3af',
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
