import { ROUTES } from '@/apps/Base';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  Badge as BadgeIcon,
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  Tab as TabIcon,
  Label as LabelIcon,
  DoneOutline as DoneOutlineIcon,
} from '@mui/icons-material';

import { MenuItemType } from './types';

export const getNavigationData = (
  i18n: I18n
): Record<string, MenuItemType> => ({
  payables: {
    label: t(i18n)`Payables`,
    url: ROUTES.payables,
    renderIcon: (props) => <MonetizationOnIcon {...props} />,
  },
  approvalRequests: {
    label: 'Approval Requests',
    url: ROUTES.approvalRequests,
    renderIcon: (props) => <DoneOutlineIcon {...props} />,
  },
  receivables: {
    label: t(i18n)`Sales`,
    url: ROUTES.receivables,
    renderIcon: (props) => <ReceiptIcon {...props} />,
  },
  counterparts: {
    label: t(i18n)`Counterparts`,
    url: ROUTES.counterparts,
    renderIcon: (props) => <AccountBalanceIcon {...props} />,
  },
  products: {
    label: t(i18n)`Products`,
    url: ROUTES.products,
    renderIcon: (props) => <TabIcon {...props} />,
  },
  settings: {
    label: t(i18n)`Settings`,
    url: ROUTES.settings,
    renderIcon: (props) => <SettingsIcon {...props} />,
    children: {
      approvalPolicies: {
        label: 'Approval Policies',
        url: ROUTES.approvalPolicies,
        renderIcon: (props) => <TabIcon {...props} />,
      },
      roles: {
        label: 'Roles',
        url: ROUTES.roles,
        renderIcon: (props) => <BadgeIcon {...props} />,
      },
      tags: {
        label: t(i18n)`Tags`,
        url: ROUTES.tags,
        renderIcon: (props) => <LabelIcon {...props} />,
      },
      onboarding: {
        label: t(i18n)`Onboard Entity`,
        url: ROUTES.onboarding,
        renderIcon: (props) => <LabelIcon {...props} />,
      },
    },
  },
});
