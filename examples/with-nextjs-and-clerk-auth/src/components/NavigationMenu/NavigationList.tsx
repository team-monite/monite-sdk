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

export const NavigationList = () => {
  const { i18n } = useLingui();
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDevEnvironment(
        window.location.hostname.includes('localhost') ||
          window.location.hostname.includes('dev')
      );
    }
  }, []);

  return (
    <>
      <List className="NavigationList" disablePadding>
        <NavigationListItem href="/" icon={<IconApps />}>
          {i18n._('Dashboard')}
        </NavigationListItem>
        <NavigationListItem href="/payables" icon={<IconUsdCircle />}>
          {i18n._('Bill Pay')}
        </NavigationListItem>
        <NavigationListItem href="/receivables" icon={<IconReceipt />}>
          {i18n._('Invoicing')}
        </NavigationListItem>
        {isDevEnvironment && (
          <NavigationListItem href="/ai-assistant" icon={<IconBolt />}>
            {i18n._('AI Assistant')}
          </NavigationListItem>
        )}
        <NavigationListItem href="/projects" icon={<IconBag />}>
          {i18n._('Projects')}
        </NavigationListItem>
        <NavigationListItem href="/counterparts" icon={<IconUniversity />}>
          {i18n._('Counterparts')}
        </NavigationListItem>
        <NavigationListItem href="/products" icon={<IconBox />}>
          {i18n._('Products & Services')}
        </NavigationListItem>
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
        {i18n._('Settings')}
      </Typography>

      <List className="NavigationList" disablePadding>
        <NavigationListItem href="/template-settings" icon={<IconBrush />}>
          {i18n._('Document Design')}
        </NavigationListItem>
        <NavigationListItem href="/user-roles" icon={<IconPostcard />}>
          {i18n._('Roles & Approvals')}
        </NavigationListItem>
        <NavigationListItem href="/tags" icon={<IconFilesLandscapes />}>
          {i18n._('Tags')}
        </NavigationListItem>
      </List>
      <Box
        display="flex"
        flexGrow="1"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <List className="NavigationList" disablePadding>
          <NavigationListItem
            href="https://docs.monite.com/"
            target="_blank"
            icon={<IconQuestionCircle />}
          >
            {i18n._('Get Help')}
          </NavigationListItem>
        </List>
      </Box>
    </>
  );
};
