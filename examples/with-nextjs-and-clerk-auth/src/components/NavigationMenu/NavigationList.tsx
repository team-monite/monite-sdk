'use client';

import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import BrushIcon from '@mui/icons-material/Brush';
import { Box } from '@mui/material';
import { List } from '@mui/material';

import { NavigationListCollapse } from '@/components/NavigationMenu/NavigationListCollapse';
import { NavigationListItem } from '@/components/NavigationMenu/NavigationListItem';
import {
  IconApps,
  IconBag,
  IconBox,
  IconCog,
  IconFilesLandscapes,
  IconPostcard,
  IconQuestionCircle,
  IconReceipt,
  IconUniversity,
  IconUsdCircle,
  IconBolt,
} from '@/icons';

export const NavigationList = () => {
  const { i18n } = useLingui();

  return (
    <>
      <List className="NavigationList" disablePadding>
        <NavigationListItem href="/" icon={<IconApps />}>
          {t(i18n)`Dashboard`}
        </NavigationListItem>
        <NavigationListItem href="/ai-assistant" icon={<IconBolt />}>
          {t(i18n)`AI Assistant`}
        </NavigationListItem>
        <NavigationListItem href="/payables" icon={<IconUsdCircle />}>
          {t(i18n)`Bill Pay`}
        </NavigationListItem>
        <NavigationListItem href="/receivables" icon={<IconReceipt />}>
          {t(i18n)`Invoicing`}
        </NavigationListItem>
        <NavigationListItem href="/projects" icon={<IconBag />}>
          {t(i18n)`Projects`}
        </NavigationListItem>
        <NavigationListItem href="/counterparts" icon={<IconUniversity />}>
          {t(i18n)`Counterparts`}
        </NavigationListItem>
        <NavigationListItem href="/products" icon={<IconBox />}>
          {t(i18n)`Products & Services`}
        </NavigationListItem>
        <NavigationListCollapse icon={<IconCog />} label="Settings">
          <NavigationListItem href="/user-roles" icon={<IconPostcard />}>
            {t(i18n)`Roles & Approvals`}
          </NavigationListItem>
          <NavigationListItem href="/tags" icon={<IconFilesLandscapes />}>
            {t(i18n)`Tags`}
          </NavigationListItem>
          <NavigationListItem href="/invoice-design" icon={<BrushIcon />}>
            {t(i18n)`Document Design`}
          </NavigationListItem>
        </NavigationListCollapse>
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
