/**
 * Razorpay Checkout — cross-platform façade.
 *
 *   await openRazorpayCheckout({ ... })
 *     → resolves with { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *     → rejects if the user dismisses or payment fails
 *
 * Web   : dynamically loads `https://checkout.razorpay.com/v1/checkout.js`
 *         and opens the standard hosted checkout.
 * Native: uses `react-native-razorpay` if it's been installed in a dev
 *         build. Throws a helpful error otherwise — in that case the
 *         caller can fall back to opening the hosted page in a browser.
 *
 * Razorpay docs: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
 */

import { Platform } from 'react-native';

export interface CheckoutOptions {
  keyId:        string;     // rzp_test_… / rzp_live_…
  orderId:      string;     // returned by /api/billing/orders
  amountPaise:  number;
  name:         string;     // shown in checkout — e.g. "Mustache AI"
  description:  string;     // e.g. "Pro pack — 100 credits"
  prefillEmail?: string;
  themeColor?:  string;     // hex, defaults to brown
}

export interface CheckoutResult {
  razorpay_order_id:   string;
  razorpay_payment_id: string;
  razorpay_signature:  string;
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
const THEME      = '#8B5E3C';

// ---------------------------------------------------------------------------
// Web
// ---------------------------------------------------------------------------

let scriptPromise: Promise<void> | null = null;

function loadCheckoutScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay checkout not available outside a browser.'));
  }
  // already loaded
  if ((window as any).Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout.')));
      return;
    }

    const tag = document.createElement('script');
    tag.src   = SCRIPT_SRC;
    tag.async = true;
    tag.onload  = () => resolve();
    tag.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Razorpay checkout.'));
    };
    document.body.appendChild(tag);
  });
  return scriptPromise;
}

async function openOnWeb(opts: CheckoutOptions): Promise<CheckoutResult> {
  await loadCheckoutScript();
  const Razorpay = (window as any).Razorpay;
  if (!Razorpay) throw new Error('Razorpay SDK did not initialise.');

  return new Promise<CheckoutResult>((resolve, reject) => {
    const rz = new Razorpay({
      key:         opts.keyId,
      amount:      opts.amountPaise,
      currency:    'INR',
      name:        opts.name,
      description: opts.description,
      order_id:    opts.orderId,
      prefill:     opts.prefillEmail ? { email: opts.prefillEmail } : undefined,
      theme:       { color: opts.themeColor ?? THEME },
      handler:     (resp: any) => {
        resolve({
          razorpay_order_id:   resp.razorpay_order_id,
          razorpay_payment_id: resp.razorpay_payment_id,
          razorpay_signature:  resp.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled.')),
      },
    });

    rz.on('payment.failed', (resp: any) => {
      const desc = resp?.error?.description ?? 'Payment failed.';
      reject(new Error(desc));
    });

    rz.open();
  });
}

// ---------------------------------------------------------------------------
// Native (react-native-razorpay, optional)
// ---------------------------------------------------------------------------

async function openOnNative(opts: CheckoutOptions): Promise<CheckoutResult> {
  let RazorpayCheckout: any;
  try {
    // Optional dep — only present in dev/release builds that include it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    RazorpayCheckout = require('react-native-razorpay').default;
  } catch {
    throw new Error(
      'In-app payments need a development build with `react-native-razorpay` ' +
      'installed. Run `npx expo prebuild` after adding the package.'
    );
  }

  const data = await RazorpayCheckout.open({
    key:         opts.keyId,
    amount:      opts.amountPaise,
    currency:    'INR',
    name:        opts.name,
    description: opts.description,
    order_id:    opts.orderId,
    prefill:     opts.prefillEmail ? { email: opts.prefillEmail } : undefined,
    theme:       { color: opts.themeColor ?? THEME },
  });

  return {
    razorpay_order_id:   data.razorpay_order_id,
    razorpay_payment_id: data.razorpay_payment_id,
    razorpay_signature:  data.razorpay_signature,
  };
}

// ---------------------------------------------------------------------------
// Public entry
// ---------------------------------------------------------------------------

export async function openRazorpayCheckout(opts: CheckoutOptions): Promise<CheckoutResult> {
  return Platform.OS === 'web' ? openOnWeb(opts) : openOnNative(opts);
}
