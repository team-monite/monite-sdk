import { components } from '@/api';
import { CustomerTypes } from '@/components/counterparts/types';
import { MonitePayableDetailsInfoProps } from '@/components/payables/PayableDetails/PayableDetailsForm';
import { DEFAULT_FIELD_ORDER as defaultPayableFieldOrder } from '@/components/payables/PayablesTable/consts';
import { MonitePayableTableProps } from '@/components/payables/PayablesTable/types';
import { FieldValueTypes } from '@/components/payables/PayablesTable/types';
import { MoniteReceivablesTableProps } from '@/components/receivables/ReceivablesTable/ReceivablesTable';
import { FINANCING_LABEL } from '@/core/queries/useFinancing';
import type { MoniteIconWrapperProps } from '@/ui/iconWrapper';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

interface ReceivableSettings extends MoniteReceivablesTableProps {
  pageSizeOptions: number[];
  /** Callback to be called when an invoice is updated */
  onUpdate?: (
    receivableId: string,
    invoice?: components['schemas']['InvoiceResponsePayload']
  ) => void;
  /** Callback to be called when an invoice is deleted */
  onDelete?: (receivableId: string) => void;
  /** Callback to be called when a first invoice is sent */
  onFirstInvoiceSent?: (invoiceId: string) => void;
}

export interface OnboardingSettings {
  /**
   * Called when bank account setup is completed.
   *
   * @param {string} entityId - The ID of the entity
   * @param {components['schemas']['EntityBankAccountResponse']} response - The bank account response data
   * @returns {void}
   */
  onPaymentOnboardingComplete?: (
    entityId: string,
    response?: components['schemas']['EntityBankAccountResponse']
  ) => void;
  /**
   * Called when working capital onboarding is completed.
   * This happens when the business status transitions to 'ONBOARDED'.
   *
   * @param {string} entityId - The ID of the entity
   * @returns {void}
   */
  onWorkingCapitalOnboardingComplete?: (entityId: string) => void;
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
      },
    ],
    onCreate: componentSettings?.receivables?.onCreate,
    onUpdate: componentSettings?.receivables?.onUpdate,
    onDelete: componentSettings?.receivables?.onDelete,
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
});
