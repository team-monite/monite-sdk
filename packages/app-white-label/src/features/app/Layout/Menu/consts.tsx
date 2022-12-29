import React from 'react';
import {
  UApps,
  UUsdCircle,
  UInvoice,
  UUniversity,
  UBox,
  USetting,
  UClipboardNotes,
  UPostcard,
  UTag,
} from '@team-monite/ui-kit-react';

import { ROUTES } from 'consts';
import { MenuItemType } from './types';

export const navigationData: Record<string, MenuItemType> = {
  dashboard: {
    label: 'Dashboard',
    url: ROUTES.dashboard,
    renderIcon: (props) => <UApps {...props} />,
    apiLink: 'https://docs.monite.com/docs/get-started',
  },
  payables: {
    label: 'Payables',
    url: ROUTES.payables,
    renderIcon: (props) => <UUsdCircle {...props} />,
  },
  receivables: {
    label: 'Sales',
    url: ROUTES.receivables,
    renderIcon: (props) => <UInvoice {...props} />,
  },
  counterparts: {
    label: 'Counterparts',
    url: ROUTES.counterparts,
    renderIcon: (props) => <UUniversity {...props} />,
    apiLink: 'https://docs.monite.com/docs/manage-counterparts',
  },
  products: {
    label: 'Products & Services',
    url: ROUTES.products,
    renderIcon: (props) => <UBox {...props} />,
    apiLink: 'https://docs.monite.com/docs/get-started',
  },
  audit: {
    label: 'Audit',
    url: ROUTES.audit,
    renderIcon: (props) => <UClipboardNotes {...props} />,
    apiLink: 'https://docs.monite.com/docs/get-started',
  },
  settings: {
    label: 'Settings',
    url: ROUTES.settings,
    renderIcon: (props) => <USetting {...props} />,
    children: {
      approvalPolicies: {
        label: 'Approval Policies',
        url: ROUTES.approvalPolicies,
        renderIcon: (props) => <UPostcard {...props} />,
        apiLink: 'https://docs.monite.com/docs/approval-workflows',
      },
      tags: {
        label: 'Tags',
        url: ROUTES.tags,
        renderIcon: (props) => <UTag {...props} />,
      },
    },
  },
};
