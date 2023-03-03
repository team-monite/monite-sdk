/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Payment methods provided by monite for onboarding.
 * sepa_credit is excluded as open banking does not require onboarding
 */
export enum MoniteOnboardingPaymentMethods {
    CARD_PAYMENTS = 'Card payments',
    BANCONTACT = 'Bancontact',
    ELECTRONIC_PAYMENT_STANDARD = 'Electronic Payment Standard',
    GIROPAY = 'Giropay',
    I_DEAL = 'iDEAL',
    PRZELEWY24 = 'Przelewy24',
    SEPA_DIRECT_DEBIT = 'SEPA Direct Debit',
    SEPA_PAYMENTS = 'SEPA Payments',
    SOFORT = 'SOFORT',
    AFTERPAY_CLEARPAY_ = 'Afterpay (Clearpay)',
    BECS_DIRECT_DEBIT_AU_ = 'BECS Direct Debit (AU)',
    ACSS_DEBIT_PAYMENT_INTENT = 'ACSS Debit PaymentIntent',
    BACS_DIRECT_DEBIT = 'Bacs Direct Debit',
    FINANCIAL_PROCESS_EXCHANGE = 'Financial Process Exchange',
    PAY_NOW = 'PayNow',
    AFFIRM = 'Affirm',
    US_BANK_ACCOUNT_ACH = 'US bank account ACH',
}
