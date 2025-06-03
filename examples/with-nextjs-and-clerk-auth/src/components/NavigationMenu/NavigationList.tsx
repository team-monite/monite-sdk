'use client';

import React, { useEffect, useState } from 'react';

import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';
import { List } from '@mui/material';

import { NavigationListItem } from '@/components/NavigationMenu/NavigationListItem';
import {
  IconApps,
  IconBag,
  IconBox,
  IconFilesLandscapes,
  IconPostcard,
  IconQuestionCircle,
  IconReceipt,
  IconUniversity,
  IconUsdCircle,
  IconBolt,
  IconBrush,
} from '@/icons';

interface NavigationItemConfig {
  href: string;
  icon: React.ReactNode;
  labelKey: string;
  target?: string;
  showOnlyInDev?: boolean;
}

const mainNavigationItems: NavigationItemConfig[] = [
  { href: '/', icon: <IconApps />, labelKey: 'Dashboard' },
  { href: '/payables', icon: <IconUsdCircle />, labelKey: 'Bill Pay' },
  { href: '/receivables', icon: <IconReceipt />, labelKey: 'Invoicing' },
  {
    href: '/ai-assistant',
    icon: <IconBolt />,
    labelKey: 'AI Assistant',
    showOnlyInDev: true,
  },
  { href: '/projects', icon: <IconBag />, labelKey: 'Projects' },
  { href: '/counterparts', icon: <IconUniversity />, labelKey: 'Counterparts' },
  { href: '/products', icon: <IconBox />, labelKey: 'Products & Services' },
];

const settingsNavigationItems: NavigationItemConfig[] = [
  { href: '/invoice-design', icon: <IconBrush />, labelKey: 'Document Design' },
  {
    href: '/user-roles',
    icon: <IconPostcard />,
    labelKey: 'Roles & Approvals',
  },
  { href: '/tags', icon: <IconFilesLandscapes />, labelKey: 'Tags' },
];

const helpNavigationItems: NavigationItemConfig[] = [
  {
    href: 'https://docs.monite.com/',
    icon: <IconQuestionCircle />,
    labelKey: 'Get Help',
    target: '_blank',
  },
];

interface NavigationSectionProps {
  items: NavigationItemConfig[];
  isClient: boolean;
  isDevEnvironment: boolean;
  i18n?: any;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({
  items,
  isClient,
  isDevEnvironment,
  i18n,
}) => {
  const getLabel = (labelKey: string) => {
    return isClient && i18n ? i18n._(labelKey) : labelKey;
  };

  return (
    <>
      {items.map((item) => {
        if (item.showOnlyInDev && !isDevEnvironment) {
          return null;
        }

        return (
          <NavigationListItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            target={item.target}
          >
            {getLabel(item.labelKey)}
          </NavigationListItem>
        );
      })}
    </>
  );
};

export const NavigationList = () => {
  const { i18n } = useLingui();
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsDevEnvironment(
        window.location.hostname.includes('localhost') ||
          window.location.hostname.includes('dev')
      );
    }
  }, []);

  const getLabel = (labelKey: string) => {
    return isClient && i18n ? i18n._(labelKey) : labelKey;
  };

  return (
    <>
      <List className="NavigationList" disablePadding>
        <NavigationSection
          items={mainNavigationItems}
          isClient={isClient}
          isDevEnvironment={isDevEnvironment}
          i18n={i18n}
        />
      </List>

      <Typography
        variant="h6"
        className="NavigationListTitle"
        sx={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#3E424A',
          margin: '16px 0 8px 0',
          padding: '8px 16px 0 16px',
        }}
      >
        {getLabel('Settings')}
      </Typography>

      <List className="NavigationList" disablePadding>
        <NavigationSection
          items={settingsNavigationItems}
          isClient={isClient}
          isDevEnvironment={isDevEnvironment}
          i18n={i18n}
        />
      </List>

      <Box
        display="flex"
        flexGrow="1"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <List className="NavigationList" disablePadding>
          <NavigationSection
            items={helpNavigationItems}
            isClient={isClient}
            isDevEnvironment={isDevEnvironment}
            i18n={i18n}
          />
        </List>
      </Box>
    </>
  );
};
