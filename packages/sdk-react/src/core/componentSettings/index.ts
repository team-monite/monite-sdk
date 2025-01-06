import { MoniteReceivablesTableProps } from '@/components/receivables/ReceivablesTable/ReceivablesTable';
import { FINANCING_LABEL } from '@/core/queries/useFinancing';
import type { MoniteIconWrapperProps } from '@/ui/iconWrapper';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

interface ReceivableSettings extends MoniteReceivablesTableProps {
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
  };
  payables: {
    pageSizeOptions: number[];
  };
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
}

const defaultPageSizeOptions = [15, 30, 100];

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
  },
  payables: {
    pageSizeOptions:
      componentSettings?.payables?.pageSizeOptions || defaultPageSizeOptions,
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
  },
  tags: {
    pageSizeOptions:
      componentSettings?.tags?.pageSizeOptions || defaultPageSizeOptions,
  },
  userRoles: {
    pageSizeOptions:
      componentSettings?.userRoles?.pageSizeOptions || defaultPageSizeOptions,
  },
});
