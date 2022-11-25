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
} from '@team-monite/ui-kit-react';

import { MenuItemType } from './types';

export const ROUTES = {
  signin: '/signin',

  counterparts: '/counterparts',
  counterpartsCreate: '/counterparts/create',
  payables: '/payables',
  pay: '/pay',
  payResult: '/pay/:id/result',
  settings: '/settings',
  approvalPolicies: '/settings/approval-policies',
  dashboard: '/dashboard',
  receivables: '/receivables',
  products: '/products',
  audit: '/audit',
};

export const navigationData: Record<string, MenuItemType> = {
  dashboard: {
    label: 'Dashboard',
    url: '/dashboard',
    renderIcon: (props) => <UApps {...props} />,
    apiLink: 'https://docs.monite.com/docs/get-started',
  },
  payables: {
    label: 'Payables',
    url: '/payables',
    renderIcon: (props) => <UUsdCircle {...props} />,
  },
  receivables: {
    label: 'Sales',
    url: '/receivables',
    renderIcon: (props) => <UInvoice {...props} />,
  },
  counterparts: {
    label: 'Counterparts',
    url: '/counterparts',
    renderIcon: (props) => <UUniversity {...props} />,
    apiLink: 'https://docs.monite.com/docs/manage-counterparts',
  },
  products: {
    label: 'Products & Services',
    url: '/products',
    renderIcon: (props) => <UBox {...props} />,
    apiLink: 'https://docs.monite.com/docs/get-started',
  },
  audit: {
    label: 'Audit',
    url: '/audit',
    renderIcon: (props) => <UClipboardNotes {...props} />,
    apiLink: 'https://docs.monite.com/docs/get-started',
  },
  settings: {
    label: 'Settings',
    url: '/settings',
    renderIcon: (props) => <USetting {...props} />,
    children: {
      approvalPolicies: {
        label: 'Approval Policies',
        url: '/settings/approval-policies',
        renderIcon: (props) => <UPostcard {...props} />,
        apiLink: 'https://docs.monite.com/docs/approval-workflows',
      },
    },
  },
};
