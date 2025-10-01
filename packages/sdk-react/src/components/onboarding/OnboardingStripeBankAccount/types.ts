/**
 * Response types for Stripe bank account verification endpoints
 *
 * These types represent the responses from internal Treasury verification endpoints:
 * - POST /internal/stripe-bank-account-verification/start
 * - GET /internal/stripe-bank-account-verification/status/{setup_intent_id}
 */

export interface StripeBankAccountVerificationComponentDataResponse {
  publishable_key: string;
  account_id: string | null;
  setup_intent_id: string | null;
  client_secret: string | null;
}

export interface VerificationStatusResponse {
  id: string;
  status: string;
  client_secret: string;
  next_action?: {
    type: string;
    [key: string]: unknown;
  } | null;
  payment_method?: {
    id: string;
    [key: string]: unknown;
  } | null;
  created?: number | null;
  last_setup_error?: {
    code?: string;
    message?: string;
    [key: string]: unknown;
  } | null;
}

// Bank account details from Stripe Financial Connections
export interface StripeBankAccountDetails {
  account_holder_name?: string;
  account_holder_type?: 'individual' | 'company';
  bank_name?: string;
  last4?: string;
  routing_number?: string;
  financial_connections_account?: {
    id: string;
    display_name?: string;
    institution_name?: string;
    last4?: string;
    routing_number?: string;
    account_holder?: {
      name?: string;
      type?: string;
    };
  };
}

export interface SaveBankAccountDetailsRequest {
  setup_intent_id: string;
  payment_method_id?: string;
  bank_account_details: StripeBankAccountDetails;
}
