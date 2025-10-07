import {
  defaultAvailableCountries,
  defaultAvailableCurrencies,
} from '../utils';
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

import type {
  PaginationLayout,
  PaginationPosition,
} from '@/ui/table/TablePagination.types';

interface TablePaginationSettings {
  /** Controls the layout of pagination controls */
  paginationLayout?: PaginationLayout;
  /** Position of navigation arrows when paginationLayout is 'custom' */
  navigationPosition?: PaginationPosition;
  /** Position of page size selector when paginationLayout is 'custom' */
  pageSizePosition?: PaginationPosition;
}

interface ReceivableSettings
  extends MoniteReceivablesTableProps, TablePaginationSettings {
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
   * List of available template IDs for template selection, if no list is provided,
   * then all templates will be available, defaults to an empty list.
   */
  availableTemplateIds: string[];
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

/**
 * Action handlers for custom payment flows in payable operations.
 *
 * These handlers provide fine-grained control over payment workflows, allowing customers to:
 * - Integrate external payment providers
 * - Implement custom approval processes or multi-step authentication
 * - Add specialized banking solutions or enterprise payment workflows
 * - Control UI feedback and data refresh timing after payment completion
 *
 * @example Custom payment provider integration:
 * ```typescript
 * const onPay = (id: string, _data?: unknown, actions?: PayActionHandlers) => {
 *   // Start custom payment flow
 *   initiatePayment(id)
 *     .then(() => {
 *       // Payment successful - update SDK state and show success message
 *       actions?.resolve({ showToast: true });
 *     })
 *     .catch((error) => {
 *       // Payment failed - update SDK state and show error message
 *       actions?.reject(error, { showToast: true });
 *     });
 * };
 * ```
 */
export type PayActionHandlers = {
  /**
   * Call when a custom payment flow has been successfully initiated/completed.
   * This triggers SDK's built-in state management: refreshes payable data,
   * payment records, and optionally displays success feedback to the user.
   *
   * @param options.showToast - Whether to display a success toast notification
   */
  resolve: (options?: { showToast?: boolean }) => void;
  /**
   * Call when a custom payment flow failed or was cancelled by the user.
   * This triggers SDK's built-in state management: refreshes payable data,
   * payment records, and optionally displays error feedback to the user.
   *
   * @param error - Optional error details from the failed payment attempt
   * @param options.showToast - Whether to display an error toast notification
   */
  reject: (error?: unknown, options?: { showToast?: boolean }) => void;
};

interface PayableSettings
  extends MonitePayableTableProps,
    MonitePayableDetailsInfoProps,
    TablePaginationSettings {
  pageSizeOptions: number[];
  enableGLCodes?: boolean;
  hideAddDiscountButton?: boolean;
  hideAddBankAccountButton?: boolean;
  onSaved?: (id: string) => void;
  onCanceled?: (id: string) => void;
  onSubmitted?: (id: string) => void;
  onRejected?: (id: string) => void;
  onApproved?: (id: string) => void;
  onReopened?: (id: string) => void;
  onDeleted?: (id: string) => void;
  /**
   * Called when the user clicks Pay button on a payable.
   *
   * **Legacy Usage (Backward Compatible):**
   * ```typescript
   * onPay: (id: string) => {
   *   console.log('Payment initiated for:', id);
   * }
   * ```
   *
   * **Enhanced Usage (Custom Payment Flow):**
   * ```typescript
   * onPay: (id: string, _data?: unknown, actions?: PayActionHandlers) => {
   *   // Custom payment implementation
   *   processPaymentWithCustomProvider(id)
   *     .then(() => actions?.resolve({ showToast: true }))
   *     .catch(err => actions?.reject(err, { showToast: true }));
   * }
   * ```
   *
   * @param id - The payable ID being paid
   * @param _data - Reserved for future use (currently undefined)
   * @param actions - Optional handlers for custom payment flows. When provided,
   *                  enables custom payment integration. Call actions.resolve()
   *                  on success or actions.reject() on failure to update SDK state.
   */
  onPay?: (id: string, _data?: unknown, actions?: PayActionHandlers) => void;
}

export interface ComponentSettings {
  general: {
    iconWrapper: Partial<MoniteIconWrapperProps>;
  };
  approvalPolicies: {
    pageSizeOptions: number[];
  } & TablePaginationSettings;
  approvalRequests: {
    pageSizeOptions: number[];
  } & TablePaginationSettings;
  counterparts: {
    pageSizeOptions: number[];
    /**
     * @see {@link CustomerTypes}
     * @param customerTypes - Array of customer types, defaults to ['customer', 'vendor']
     */
    customerTypes?: CustomerTypes;
  } & TablePaginationSettings;
  payables: Partial<PayableSettings>;
  products: {
    pageSizeOptions: number[];
  } & TablePaginationSettings;
  receivables: Partial<ReceivableSettings>;
  tags: {
    pageSizeOptions: number[];
  } & TablePaginationSettings;
  userRoles: {
    pageSizeOptions: number[];
  } & TablePaginationSettings;
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
    paginationLayout: componentSettings?.approvalPolicies?.paginationLayout,
    navigationPosition: componentSettings?.approvalPolicies?.navigationPosition,
    pageSizePosition: componentSettings?.approvalPolicies?.pageSizePosition,
  },
  approvalRequests: {
    pageSizeOptions:
      componentSettings?.approvalRequests?.pageSizeOptions ||
      defaultPageSizeOptions,
    paginationLayout: componentSettings?.approvalRequests?.paginationLayout,
    navigationPosition: componentSettings?.approvalRequests?.navigationPosition,
    pageSizePosition: componentSettings?.approvalRequests?.pageSizePosition,
  },
  counterparts: {
    pageSizeOptions:
      componentSettings?.counterparts?.pageSizeOptions ||
      defaultPageSizeOptions,
    paginationLayout: componentSettings?.counterparts?.paginationLayout,
    navigationPosition: componentSettings?.counterparts?.navigationPosition,
    pageSizePosition: componentSettings?.counterparts?.pageSizePosition,
    customerTypes: componentSettings?.counterparts?.customerTypes || [
      'customer',
      'vendor',
    ],
  },
  payables: {
    pageSizeOptions:
      componentSettings?.payables?.pageSizeOptions || defaultPageSizeOptions,
    paginationLayout: componentSettings?.payables?.paginationLayout,
    navigationPosition: componentSettings?.payables?.navigationPosition,
    pageSizePosition: componentSettings?.payables?.pageSizePosition,
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
    enableGLCodes: componentSettings?.payables?.enableGLCodes ?? false,
    /** Whether to hide the "Add Discount" button in the totals section **/
    hideAddDiscountButton:
      componentSettings?.payables?.hideAddDiscountButton ?? false,
    /** Whether to hide the "Add new bank account" button in the counterpart bank account select **/
    hideAddBankAccountButton:
      componentSettings?.payables?.hideAddBankAccountButton ?? false,
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
    paginationLayout: componentSettings?.products?.paginationLayout,
    navigationPosition: componentSettings?.products?.navigationPosition,
    pageSizePosition: componentSettings?.products?.pageSizePosition,
  },
  receivables: {
    pageSizeOptions:
      componentSettings?.receivables?.pageSizeOptions || defaultPageSizeOptions,
    paginationLayout: componentSettings?.receivables?.paginationLayout,
    navigationPosition: componentSettings?.receivables?.navigationPosition,
    pageSizePosition: componentSettings?.receivables?.pageSizePosition,
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
    paginationLayout: componentSettings?.tags?.paginationLayout,
    navigationPosition: componentSettings?.tags?.navigationPosition,
    pageSizePosition: componentSettings?.tags?.pageSizePosition,
  },
  userRoles: {
    pageSizeOptions:
      componentSettings?.userRoles?.pageSizeOptions || defaultPageSizeOptions,
    paginationLayout: componentSettings?.userRoles?.paginationLayout,
    navigationPosition: componentSettings?.userRoles?.navigationPosition,
    pageSizePosition: componentSettings?.userRoles?.pageSizePosition,
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
    availableTemplateIds:
      componentSettings?.templateSettings?.availableTemplateIds ?? [],
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
