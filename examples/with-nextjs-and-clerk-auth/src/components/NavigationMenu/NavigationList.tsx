'use client';

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
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';
import { List } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const NavigationList = () => {
  const { i18n } = useLingui();
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDevEnvironment(
        window.location.hostname.includes('localhost') ||
          window.location.hostname.includes('dev') ||
          window.location.hostname.includes('sandbox')
      );
    }
  }, []);

  return (
    <>
      <List className="NavigationList" disablePadding>
        <NavigationListItem href="/" icon={<IconApps />}>
          {t(i18n)`Dashboard`}
        </NavigationListItem>
        <NavigationListItem href="/payables" icon={<IconUsdCircle />}>
          {t(i18n)`Bill Pay`}
        </NavigationListItem>
        <NavigationListItem href="/receivables" icon={<IconReceipt />}>
          {t(i18n)`Invoicing`}
        </NavigationListItem>
        {isDevEnvironment && (
          <NavigationListItem href="/ai-assistant" icon={<IconBolt />}>
            {t(i18n)`AI Assistant`}
          </NavigationListItem>
        )}
        <NavigationListItem href="/projects" icon={<IconBag />}>
          {t(i18n)`Projects`}
        </NavigationListItem>
        <NavigationListItem href="/counterparts" icon={<IconUniversity />}>
          {t(i18n)`Counterparts`}
        </NavigationListItem>
        <NavigationListItem href="/products" icon={<IconBox />}>
          {t(i18n)`Products & Services`}
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
        {t(i18n)`Settings`}
      </Typography>

      <List className="NavigationList" disablePadding>
        <NavigationListItem href="/template-settings" icon={<IconBrush />}>
          {t(i18n)`Template settings`}
        </NavigationListItem>
        <NavigationListItem href="/user-roles" icon={<IconPostcard />}>
          {t(i18n)`Roles & Approvals`}
        </NavigationListItem>
        <NavigationListItem href="/tags" icon={<IconFilesLandscapes />}>
          {t(i18n)`Tags`}
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
            {t(i18n)`Get Help`}
          </NavigationListItem>
        </List>
      </Box>
    </>
  );
};
