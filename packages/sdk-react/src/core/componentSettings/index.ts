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
   *
   * @returns {void}
   */
  onComplete?: () => void;

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

interface PayableSettings
  extends MonitePayableTableProps,
    MonitePayableDetailsInfoProps {
  pageSizeOptions: number[];
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
    onCreate: componentSettings?.receivables?.onCreate,
    onUpdate: componentSettings?.receivables?.onUpdate,
    onDelete: componentSettings?.receivables?.onDelete,
    onInvoiceSent: componentSettings?.receivables?.onInvoiceSent,
    enableEntityBankAccount:
      componentSettings?.receivables?.enableEntityBankAccount || false,
    bankAccountCurrencies:
      componentSettings?.receivables?.bankAccountCurrencies ||
      defaultAvailableCurrencies,
    bankAccountCountries:
      componentSettings?.receivables?.bankAccountCountries ||
      defaultAvailableCountries,
  },
  tags: {
    pageSizeOptions:
      componentSettings?.tags?.pageSizeOptions || defaultPageSizeOptions,
  },
  userRoles: {
    pageSizeOptions:
      componentSettings?.userRoles?.pageSizeOptions || defaultPageSizeOptions,
  },
  onboarding: componentSettings?.onboarding ?? {},
  financing: componentSettings?.financing ?? {},
});
