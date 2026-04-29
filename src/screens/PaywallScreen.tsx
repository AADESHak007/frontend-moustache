/**
 * PaywallScreen — pricing catalogue + Razorpay checkout.
 *
 * Reached when:
 *  - user explicitly taps "Plans" / "Upgrade" from Home.
 *  - StylePickerScreen receives a 402 from POST /api/jobs and bounces
 *    here with `route.params.reason === 'out_of_credits'`.
 *
 * Flow:
 *  1. Fetch /billing/plans  + /billing/credits.
 *  2. User taps a purchasable plan → POST /billing/orders.
 *  3. Open Razorpay Checkout (web JS / native SDK).
 *  4. POST /billing/orders/verify → update local credits.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { billingApi } from '../api/billing';
import { openRazorpayCheckout } from '../payments/razorpay';
import { useAppStore } from '../store/useAppStore';
import { Plan, RootStackParamList } from '../types';
import {
  C, T, S, R, SHADOW, BTN,
  IS_WEB, isDesktop, isTablet, WEB_MAX_W,
} from './theme';

type PaywallNav = StackNavigationProp<RootStackParamList, 'Paywall'>;

const WEB_COL = WEB_MAX_W;

export default function PaywallScreen() {
  const navigation = useNavigation<PaywallNav>();
  const route      = useRoute<any>();
  const insets     = useSafeAreaInsets();

  const token       = useAppStore((s) => s.token);
  const user        = useAppStore((s) => s.user);
  const credits     = useAppStore((s) => s.credits);
  const setCredits  = useAppStore((s) => s.setCredits);

  const [plans,    setPlans]    = useState<Plan[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState<string | null>(null);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  const fromOutOfCredits = route.params?.reason === 'out_of_credits';

  // ---- Auth guard --------------------------------------------------------
  useEffect(() => {
    if (!token) navigation.replace('SignIn');
  }, [token]);

  // ---- Animate in --------------------------------------------------------
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // ---- Fetch plans + credits --------------------------------------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [plansResp, creditsResp] = await Promise.all([
          billingApi.getPlans(),
          billingApi.getCredits(),
        ]);
        if (cancelled) return;
        setPlans(plansResp.plans);
        setCredits(creditsResp.balance);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load plans.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---- Buy a plan --------------------------------------------------------
  const onBuy = async (plan: Plan) => {
    if (!plan.purchasable) return;
    setError(null);
    setSuccess(null);
    setBusyPlan(plan.id);

    try {
      const order = await billingApi.createOrder(plan.id);

      const checkout = await openRazorpayCheckout({
        keyId:        order.key_id,
        orderId:      order.order_id,
        amountPaise:  order.amount_paise,
        name:         'Mustache AI',
        description:  `${plan.name} — ${plan.credits} credits`,
        prefillEmail: user?.email,
      });

      const verified = await billingApi.verifyOrder(checkout);
      setCredits(verified.credits_total);
      setSuccess(`Added ${verified.credits_added} credits — you now have ${verified.credits_total}.`);

      // If the user landed here because they ran out, send them straight back.
      if (fromOutOfCredits) {
        setTimeout(() => navigation.goBack(), 900);
      }
    } catch (e: any) {
      const msg = e?.message ?? 'Payment failed.';
      // "Payment cancelled." is user-initiated — show it gently, not as an error.
      if (msg.toLowerCase().includes('cancel')) {
        setError(null);
      } else {
        setError(msg);
      }
    } finally {
      setBusyPlan(null);
    }
  };

  const bottomPad = insets.bottom + S.md;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topWash} pointerEvents="none" />

      {/* Header */}
      <Animated.View style={[styles.header, IS_WEB && { width: WEB_COL }, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={[T.label, { color: C.textSecondary }]}>Pricing</Text>
        <View style={styles.backBtn} />
      </Animated.View>

      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={[
          styles.scrollContent,
          IS_WEB && { width: WEB_COL, alignSelf: 'center' },
          { paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Animated.View
          style={[styles.titleBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={T.label}>Simple Pricing</Text>
            <View style={styles.eyebrowLine} />
          </View>
          <Text style={[T.h2, { textAlign: 'center' }]}>
            One credit. <Text style={styles.titleAccent}>One mustache.</Text>
          </Text>
          <Text style={[T.sub, styles.titleSub]}>
            Pay once for a credit pack. No subscriptions, no expiry.
          </Text>

          {/* Credits chip */}
          <View style={styles.creditsChip}>
            <View style={styles.creditsDot} />
            <Text style={[T.caption, { color: C.textSecondary }]}>
              {credits == null ? 'Balance loading…' : `You have ${credits} credit${credits === 1 ? '' : 's'}`}
            </Text>
          </View>

          {fromOutOfCredits && (
            <View style={styles.banner}>
              <Text style={[T.sub, { color: C.primaryDark, textAlign: 'center' }]}>
                You're out of credits — top up to keep generating.
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Loading / error states */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={C.primary} />
          </View>
        )}

        {!loading && error && (
          <View style={styles.errorCard}>
            <Text style={[T.body, { color: C.error }]}>{error}</Text>
          </View>
        )}

        {!loading && success && (
          <View style={styles.successCard}>
            <Text style={[T.body, { color: C.success }]}>{success}</Text>
          </View>
        )}

        {/* Plan cards */}
        {!loading && plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            busy={busyPlan === plan.id}
            disabled={busyPlan !== null && busyPlan !== plan.id}
            onPress={() => onBuy(plan)}
          />
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          Payments are processed securely by Razorpay. Prices in INR (incl. taxes).
        </Text>
      </ScrollView>
    </View>
  );
}


// ---------------------------------------------------------------------------
// Plan card
// ---------------------------------------------------------------------------

function PlanCard({
  plan, busy, disabled, onPress,
}: {
  plan:     Plan;
  busy:     boolean;
  disabled: boolean;
  onPress:  () => void;
}) {
  const isFree     = !plan.purchasable;
  const ctaLabel   = isFree ? 'Included on sign-up' : busy ? 'Opening Razorpay…' : `Get ${plan.credits} credits`;
  const perCredit  = plan.price_inr > 0 ? (plan.price_inr / plan.credits).toFixed(2) : null;

  return (
    <View style={[styles.card, plan.popular && styles.cardPopular]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <Text style={[T.h3, { color: C.textPrimary }]}>{plan.name}</Text>
      <Text style={[T.caption, { color: C.textSecondary, marginTop: 2 }]}>{plan.tagline}</Text>

      {/* Price */}
      <View style={styles.priceRow}>
        <Text style={styles.priceCurrency}>₹</Text>
        <Text style={styles.priceAmount}>{plan.price_inr}</Text>
        {perCredit && (
          <Text style={styles.pricePer}>  ·  ~₹{perCredit}/credit</Text>
        )}
      </View>

      {/* Features */}
      <View style={{ marginTop: S.sm, gap: 6 }}>
        {plan.features.map((f) => (
          <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.tick}>✓</Text>
            <Text style={[T.body, { color: C.textSecondary, fontSize: 14 }]}>{f}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={{ marginTop: S.md }}
        onPress={onPress}
        disabled={isFree || busy || disabled}
        activeOpacity={0.85}
      >
        {isFree ? (
          <View style={[BTN.secondary, { opacity: 0.7 }]}>
            <Text style={BTN.textSecondary}>{ctaLabel}</Text>
          </View>
        ) : (
          <LinearGradient
            colors={[C.gradStart, C.gradEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.cta, (busy || disabled) && { opacity: 0.6 }]}
          >
            {busy ? (
              <ActivityIndicator color={C.white} />
            ) : (
              <Text style={BTN.text}>{ctaLabel}</Text>
            )}
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
}


// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    ...(IS_WEB ? { alignItems: 'center' as const } : {}),
  },
  topWash: {
    position: 'absolute',
    top: -160,
    left: '50%',
    width: 320,
    height: 320,
    borderRadius: 160,
    marginLeft: -160,
    backgroundColor: C.accent,
    opacity: 0.07,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    width: '100%',
  },
  backBtn: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: R.pill,
  },
  backArrow: {
    fontSize: 22,
    color: C.textPrimary,
  },

  scrollContent: {
    paddingHorizontal: S.lg,
    paddingTop: S.sm,
    width: '100%',
  },

  // Title
  titleBlock: {
    alignItems: 'center',
    paddingTop: S.md,
    marginBottom: S.lg,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: S.sm,
  },
  eyebrowLine: {
    width: 28, height: 1,
    backgroundColor: C.primary,
    opacity: 0.35,
  },
  titleAccent: {
    color: C.primary,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontStyle: 'italic',
  },
  titleSub: {
    textAlign: 'center',
    marginTop: S.xs,
    maxWidth: 320,
  },

  creditsChip: {
    marginTop: S.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: S.md,
    paddingVertical: 7,
    borderRadius: R.pill,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    ...SHADOW.soft,
  },
  creditsDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: C.success,
  },

  banner: {
    marginTop: S.md,
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    borderRadius: R.md,
    backgroundColor: C.goldSoft,
    borderWidth: 1,
    borderColor: C.gold,
  },

  // Cards
  card: {
    backgroundColor: C.card,
    borderRadius: R.xl,
    padding: S.lg,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: S.md,
    ...SHADOW.card,
  },
  cardPopular: {
    borderColor: C.primary,
    borderWidth: 1.5,
    ...SHADOW.glow,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: S.lg,
    backgroundColor: C.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: R.pill,
  },
  popularText: {
    fontFamily: 'DMSans_600SemiBold',
    color: C.white,
    fontSize: 10,
    letterSpacing: 1.5,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: S.sm,
  },
  priceCurrency: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: C.textPrimary,
    marginRight: 2,
  },
  priceAmount: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: isTablet ? 44 : 38,
    color: C.textPrimary,
    lineHeight: isTablet ? 50 : 44,
  },
  pricePer: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: C.textMuted,
  },

  tick: {
    color: C.primary,
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
    width: 14,
    textAlign: 'center',
  },

  cta: {
    paddingVertical: 14,
    borderRadius: R.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOW.glow,
  },

  errorCard: {
    backgroundColor: C.card,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.error,
    padding: S.md,
    marginBottom: S.md,
  },
  successCard: {
    backgroundColor: C.card,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.success,
    padding: S.md,
    marginBottom: S.md,
  },

  center: {
    alignItems: 'center',
    paddingVertical: S.xl,
  },

  footer: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    marginTop: S.md,
    letterSpacing: 0.2,
  },
});
