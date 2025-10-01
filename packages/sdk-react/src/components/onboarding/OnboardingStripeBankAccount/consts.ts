const getEnvVar = (name: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[`VITE_${name}`] || fallback;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || fallback;
  }

  return fallback;
};

export const STRIPE_JS_URL = getEnvVar(
  'STRIPE_JS_URL',
  'https://js.stripe.com/v3/'
);

export const STRIPE_LOGO_URL = getEnvVar(
  'STRIPE_LOGO_URL',
  'https://stripe.com/img/v3/home/social.png'
);

export const STRIPE_TERMS_URL = getEnvVar(
  'STRIPE_TERMS_URL',
  'https://stripe.com/legal'
);

export const STRIPE_CONNECT_LEGAL_URL = getEnvVar(
  'STRIPE_CONNECT_LEGAL_URL',
  'https://stripe.com/connect-account/legal'
);

export const STRIPE_TREASURY_TERMS_URL = getEnvVar(
  'STRIPE_TREASURY_TERMS_URL',
  'https://stripe.com/legal/treasury'
);

export const VERIFICATION_POLLING_INTERVAL_MS = 2000; // Poll every 2 seconds
export const VERIFICATION_POLLING_MAX_ATTEMPTS = 150; // Max 5 minutes (150 * 2s)
export const VERIFICATION_POLLING_STALE_TIME_MS = 1000; // Consider data stale after 1 second

export const STRIPE_MODAL_MIN_HEIGHT = '500px';
export const STRIPE_LOGO_HEIGHT = '24px';
