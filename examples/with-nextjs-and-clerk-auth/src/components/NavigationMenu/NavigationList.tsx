'use client';

import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box } from '@mui/material';
import { List } from '@mui/material';

import { NavigationListCollapse } from '@/components/NavigationMenu/NavigationListCollapse';
import { NavigationListItem } from '@/components/NavigationMenu/NavigationListItem';
import {
  IconApps,
  IconBag,
  IconBox,
  IconBuilding,
  IconCog,
  IconEnvelopeHeart,
  IconFileHeart,
  IconFilesLandscapes,
  IconPostcard,
  IconQuestionCircle,
  IconReceipt,
  IconSync,
  IconUniversity,
  IconUsdCircle,
  IconUserCircle,
  IconUsersAlt,
} from '@/icons';

export const NavigationList = () => {
  const { i18n } = useLingui();

  return (
    <>
      <List className="navigation-list" disablePadding>
        <NavigationListItem href="/" icon={<IconApps />}>
          {t(i18n)`Dashboard`}
        </NavigationListItem>
        <NavigationListItem href="/payables" icon={<IconUsdCircle />}>
          {t(i18n)`Purchases`}
        </NavigationListItem>
        <NavigationListItem href="/receivables" icon={<IconReceipt />}>
          {t(i18n)`Sales`}
        </NavigationListItem>
        <NavigationListItem href="#" icon={<IconBag />}>
          {t(i18n)`Projects`}
        </NavigationListItem>
        <NavigationListItem href="/counterparts" icon={<IconUniversity />}>
          {t(i18n)`Counterparts`}
        </NavigationListItem>
        <NavigationListItem href="/products" icon={<IconBox />}>
          {t(i18n)`Products & Services`}
        </NavigationListItem>
        <NavigationListCollapse icon={<IconCog />} label="Settings">
          <NavigationListItem href="#" icon={<IconUserCircle />}>
            {t(i18n)`My Profile`}
          </NavigationListItem>
          <NavigationListItem href="#" icon={<IconUsersAlt />}>
            {t(i18n)`Team`}
          </NavigationListItem>
          <NavigationListItem href="#" icon={<IconBuilding />}>
            {t(i18n)`Company`}
          </NavigationListItem>
          <NavigationListItem href="/user-roles" icon={<IconPostcard />}>
            {t(i18n)`Roles & Approvals`}
          </NavigationListItem>
          <NavigationListItem href="#" icon={<IconSync />}>
            {t(i18n)`Integrations`}
          </NavigationListItem>
          <NavigationListItem href="#" icon={<IconFileHeart />}>
            {t(i18n)`Invoice Design`}
          </NavigationListItem>
          <NavigationListItem href="#" icon={<IconFilesLandscapes />}>
            {t(i18n)`Message Templates`}
          </NavigationListItem>
          <NavigationListItem href="#" icon={<IconEnvelopeHeart />}>
            {t(i18n)`Email Templates`}
          </NavigationListItem>
        </NavigationListCollapse>
      </List>
      <Box
        display="flex"
        flexGrow="1"
        flexDirection="column"
        justifyContent="flex-end"
      >
        <List className="navigation-list" disablePadding>
          <NavigationListItem href="#" icon={<IconQuestionCircle />}>
            {t(i18n)`Get Help`}
          </NavigationListItem>
        </List>
      </Box>
    </>
  );
};
