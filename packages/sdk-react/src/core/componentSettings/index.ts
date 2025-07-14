import { components } from '@/api';
import { CustomerTypes } from '@/components/counterparts/types';
import { FINANCING_LABEL } from '@/components/financing/consts';
import { FinanceStep } from '@/components/financing/types';
import { MonitePayableDetailsInfoProps } from '@/components/payables/PayableDetails/PayableDetailsForm';
import {
  DEFAULT_REQUIRED_COLUMNS as defaultRequiredColumns,
  DEFAULT_FIELD_ORDER as defaultPayableFieldOrder,
} from '@/components/payables/PayablesTable/consts';
import { MonitePayableTableProps } from '@/components/payables/PayablesTable/types';
import { MoniteReceivablesTableProps } from '@/components/receivables/components';
import {
  APDocumentType,
  ARDocumentType,
} from '@/components/templateSettings/types';
import type { MoniteIconWrapperProps } from '@/ui/iconWrapper';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import {
  defaultAvailableCountries,
  defaultAvailableCurrencies,
} from '../utils';

interface ReceivableSettings extends MoniteReceivablesTableProps {
  pageSizeOptions: number[];
  /** Callback to be called when an invoice is updated */
  onUpdate?: (
    receivableId: string,
    invoice?: components['schemas']['InvoiceResponsePayload']
  ) => void;
  /** Callback to be called when an invoice is deleted */
  onDelete?: (receivableId: string) => void;
  /** Callback to be called when an invoice is sent */
  onInvoiceSent?: (invoiceId: string) => void;
  /** Enables bank account creation on invoice creation flow */
  enableEntityBankAccount?: boolean;
  /** List of available countries, ISO format */
  bankAccountCountries?: components['schemas']['AllowedCountries'][];
  /** List of available currencies, ISO format */
  bankAccountCurrencies?: components['schemas']['CurrencyEnum'][];
}

/**
 * Configuration settings for the onboarding component.
 *
 * ## Onboarding Callback Architecture
 *
 * The Monite SDK supports different types of onboarding flows with corresponding callbacks:
 *
 * ### 1. General Onboarding (`onComplete`)
 * - **Trigger**: When all onboarding requirements are fulfilled (requirements.length === 0)
 * - **Use Case**: General onboarding completion, backward compatibility
 * - **Business Logic**: Called when the onboarding component completes all required steps
 *
 * ### 2. Payments Onboarding (`onPaymentsOnboardingComplete`)
 * - **Trigger**: When payments onboarding requirements are fulfilled
 * - **Use Case**: Specific to payments onboarding completion
 * - **Business Logic**: Called when entity can make/receive payments via Monite payment rails
 * - **Note**: Currently triggered alongside `onComplete` as they represent the same flow
 *
 * ### 3. Working Capital Onboarding (`onWorkingCapitalOnboardingComplete`)
 * - **Trigger**: When business status transitions from 'INPUT_REQUIRED' or 'NEW' to 'WAITING_FOR_OFFERS'
 * - **Use Case**: Financing/working capital onboarding completion
 * - **Business Logic**: Called when entity completes onboarding for working capital services
 * - **Implementation**: Handled in the financing flow (useFinancing hook)
 *
 * ### Event Flow Architecture
 *
 * ```
 * Component → useComponentSettings() → [domain]Callbacks → MoniteEvents.enhance[Domain]Settings() → EVENT emission
 * ```
 *
 * All callbacks are enhanced with event emission capabilities in the drop-in package.
 */
export interface OnboardingSettings {
  /**
   * Custom footer logo URL for the Onboarding pages.
   * If provided, the logo will be displayed instead of the Monite logo.
   * Requires `onboardingFooterWebsiteUrl` to be provided as well.
   */
  footerLogoUrl?: string;
  /**
   * Custom footer website URL for the Onboarding pages.
   * If provided, the onboardingFooterLogoUrl logo will link to this URL.
   */
  footerWebsiteUrl?: string;
  /**
   * If true, hides the footer on the Onboarding pages.
   * Defaults to false.
   */
  hideFooter?: boolean;
  /**
   * Whether to show the continue button on the onboarding completed page.
   *
   * @default false
   */
  showContinueButton?: boolean;
  /**
   * Allowed currencies to restrict options in the onboarding forms.
   * The first currency in the array will be used as the default value.
   *
   * @example ['USD', 'EUR']
   */
  allowedCurrencies?: components['schemas']['CurrencyEnum'][];
  /**
   * Allowed country codes to restrict options in the onboarding forms.
   * The first country code in the array will be used as the default value.
   *
   * @example ['US', 'GB']
   */
  allowedCountries?: components['schemas']['AllowedCountries'][];

  /**
   * Called when the onboarding process is completed.
   * This happens when all onboarding requirements have been fulfilled.
   *
   * @param {string} entityId - The ID of the entity
   * @returns {void}
   */
  onComplete?: (entityId: string) => void;

  /**
   * Called when the continue button is clicked on the onboarding completed page.
   *
   * @returns {void}
   */
  onContinue?: () => void;
  /**
   * Called when working capital onboarding is completed.
   * This happens when the business status transitions to 'ONBOARDED'.
   *
   * @param {string} entityId - The ID of the entity
   * @returns {void}
   */
  onWorkingCapitalOnboardingComplete?: (entityId: string) => void;
  /**
   * Called when payments onboarding is completed.
   * Note: This is currently triggered when all onboarding requirements are completed.
   * Future versions may tie this to a specific payments onboarding status.
   *
   * @param {string} entityId - The ID of the entity
   * @returns {void}
   */
  onPaymentsOnboardingComplete?: (entityId: string) => void;
}

export interface FinancingSettings {
  /**
   * Enables finance widget buttons inside finance card in My financing tab when true, if false,
   * buttons are shown on the top right corner instead.
   */
  enableFinanceWidgetButton?: boolean;
  /**
   * Describes the step by step of how financing an invoice works, this is shown in a drawer when clicking on
   * `How does invoice financing work?` button
   */
  financeSteps: FinanceStep[];
}

export interface TemplateSettings {
  /**
   * Shows the template selection section if true or hides it if false, defaults to true.
   */
  showTemplateSection: boolean;
  /**
   * Shows the template PDF preview if true or hides it if false, defaults to true.
   */
  showTemplatePreview: boolean;
  /**
   * Shows the legacy template options to select if true or hides it if false, defaults to true.
   */
  showLegacyTemplateOptions: boolean;
  /**
   * Shows the logo selection section if true or hides it if false, defaults to true.
   */
  showLogoSection: boolean;
  /**
   * Enables the document number customisation tab if true or hides it if false, defaults to true.
   */
  enableDocumentNumberCustomisationTab: boolean;
  /**
   * Enables the other settings customisation tab if true or hides it if false, defaults to true.
   */
  enableOtherSettingsCustomisationTab: boolean;
  /**
   * List of available AR documents for customisation, defaults to all of the documents.
   */
  availableARDocuments: ARDocumentType[];
  /**
   * List of available AP documents for customisation, defaults to all of the documents.
   */
  availableAPDocuments: APDocumentType[];
}

interface PayableSettings
  extends MonitePayableTableProps,
    MonitePayableDetailsInfoProps {
  pageSizeOptions: number[];
  onSaved?: (id: string) => void;
  onCanceled?: (id: string) => void;
  onSubmitted?: (id: string) => void;
  onRejected?: (id: string) => void;
  onApproved?: (id: string) => void;
  onReopened?: (id: string) => void;
  onDeleted?: (id: string) => void;
  onPay?: (id: string) => void;
}

export interface ComponentSettings {
  general: {
    iconWrapper: Partial<MoniteIconWrapperProps>;
  };
  approvalPolicies: {
    pageSizeOptions: number[];
  };
  approvalRequests: {
    pageSizeOptions: number[];
  };
  counterparts: {
    pageSizeOptions: number[];

    /**
     * @see {@link CustomerTypes}
     * @param customerTypes - Array of customer types, defaults to ['customer', 'vendor']
     */
    customerTypes?: CustomerTypes;
  };
  payables: Partial<PayableSettings>;
  products: {
    pageSizeOptions: number[];
  };
  receivables: Partial<ReceivableSettings>;
  tags: {
    pageSizeOptions: number[];
  };
  userRoles: {
    pageSizeOptions: number[];
  };
  onboarding: Partial<OnboardingSettings>;
  financing: Partial<FinancingSettings>;
  templateSettings: Partial<TemplateSettings>;
}

const defaultPageSizeOptions = [20, 50, 100];

export const getDefaultComponentSettings = (
  i18n: I18n,
  componentSettings?: Partial<ComponentSettings>
) => ({
  general: {
    iconWrapper: {
      defaultProps: {
        showCloseIcon: true,
      },
      ...componentSettings?.general?.iconWrapper,
    },
  },
  approvalPolicies: {
    pageSizeOptions:
      componentSettings?.approvalPolicies?.pageSizeOptions ||
      defaultPageSizeOptions,
  },
  approvalRequests: {
    pageSizeOptions:
      componentSettings?.approvalRequests?.pageSizeOptions ||
      defaultPageSizeOptions,
  },
  counterparts: {
    pageSizeOptions:
      componentSettings?.counterparts?.pageSizeOptions ||
      defaultPageSizeOptions,
    customerTypes: componentSettings?.counterparts?.customerTypes || [
      'customer',
      'vendor',
    ],
  },
  payables: {
    pageSizeOptions:
      componentSettings?.payables?.pageSizeOptions || defaultPageSizeOptions,
    isShowingSummaryCards:
      componentSettings?.payables?.isShowingSummaryCards ?? true,
    fieldOrder:
      componentSettings?.payables?.fieldOrder || defaultPayableFieldOrder,
    summaryCardFilters: componentSettings?.payables?.summaryCardFilters,
    requiredColumns:
      componentSettings?.payables?.requiredColumns || defaultRequiredColumns,
    optionalFields: componentSettings?.payables?.optionalFields,
    ocrRequiredFields: componentSettings?.payables?.ocrRequiredFields,
    ocrMismatchFields: componentSettings?.payables?.ocrMismatchFields ?? {
      amount_to_pay: false,
      counterpart_bank_account_id: false,
    },
    isTagsDisabled: componentSettings?.payables?.isTagsDisabled,
    onSaved: componentSettings?.payables?.onSaved,
    onCanceled: componentSettings?.payables?.onCanceled,
    onSubmitted: componentSettings?.payables?.onSubmitted,
    onRejected: componentSettings?.payables?.onRejected,
    onApproved: componentSettings?.payables?.onApproved,
    onReopened: componentSettings?.payables?.onReopened,
    onDeleted: componentSettings?.payables?.onDeleted,
    onPay: componentSettings?.payables?.onPay,
  },
  products: {
    pageSizeOptions:
      componentSettings?.products?.pageSizeOptions || defaultPageSizeOptions,
  },
  receivables: {
    pageSizeOptions:
      componentSettings?.receivables?.pageSizeOptions || defaultPageSizeOptions,
    tab: componentSettings?.receivables?.tab || 0,
    tabs: componentSettings?.receivables?.tabs || [
      {
        label: t(i18n)`Invoices`,
        query: { type: 'invoice' },
      },
      {
        label: t(i18n)`Quotes`,
        query: { type: 'quote' },
      },
      {
        label: t(i18n)`Credit notes`,
        query: { type: 'credit_note' },
      },
      {
        label: FINANCING_LABEL,
        query: { type: 'financing' },
      },
    ],
    enableEntityBankAccount:
      componentSettings?.receivables?.enableEntityBankAccount || false,
    bankAccountCurrencies:
      componentSettings?.receivables?.bankAccountCurrencies ||
      defaultAvailableCurrencies,
    bankAccountCountries:
      componentSettings?.receivables?.bankAccountCountries ||
      defaultAvailableCountries,
    onCreate: componentSettings?.receivables?.onCreate,
    onUpdate: componentSettings?.receivables?.onUpdate,
    onDelete: componentSettings?.receivables?.onDelete,
    onInvoiceSent: componentSettings?.receivables?.onInvoiceSent,
  },
  tags: {
    pageSizeOptions:
      componentSettings?.tags?.pageSizeOptions || defaultPageSizeOptions,
  },
  userRoles: {
    pageSizeOptions:
      componentSettings?.userRoles?.pageSizeOptions || defaultPageSizeOptions,
  },
  onboarding: {
    footerLogoUrl: componentSettings?.onboarding?.footerLogoUrl,
    footerWebsiteUrl: componentSettings?.onboarding?.footerWebsiteUrl,
    hideFooter: componentSettings?.onboarding?.hideFooter,
    showContinueButton: componentSettings?.onboarding?.showContinueButton,
    allowedCurrencies: componentSettings?.onboarding?.allowedCurrencies,
    allowedCountries: componentSettings?.onboarding?.allowedCountries,
    onComplete: componentSettings?.onboarding?.onComplete,
    onContinue: componentSettings?.onboarding?.onContinue,
    onWorkingCapitalOnboardingComplete:
      componentSettings?.onboarding?.onWorkingCapitalOnboardingComplete,
    onPaymentsOnboardingComplete:
      componentSettings?.onboarding?.onPaymentsOnboardingComplete,
  },
  financing: componentSettings?.financing ?? {},
  templateSettings: {
    showTemplateSection:
      componentSettings?.templateSettings?.showTemplateSection ?? true,
    showTemplatePreview:
      componentSettings?.templateSettings?.showTemplatePreview ?? true,
    showLegacyTemplateOptions:
      componentSettings?.templateSettings?.showLegacyTemplateOptions ?? true,
    showLogoSection:
      componentSettings?.templateSettings?.showLogoSection ?? true,
    enableDocumentNumberCustomisationTab:
      componentSettings?.templateSettings
        ?.enableDocumentNumberCustomisationTab ?? true,
    enableOtherSettingsCustomisationTab:
      componentSettings?.templateSettings
        ?.enableOtherSettingsCustomisationTab ?? true,
    availableARDocuments: componentSettings?.templateSettings
      ?.availableARDocuments ?? [
      'invoice',
      'credit_note',
      'quote',
      'delivery_note',
    ],
    availableAPDocuments: componentSettings?.templateSettings
      ?.availableAPDocuments ?? ['purchase_order'],
  },
});
