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
      <List className="NavigationList" disablePadding>
        <NavigationListItem href="/" icon={<IconApps />}>
          {t(i18n)`Dashboard`}
        </NavigationListItem>
        <NavigationListItem href="/payables" icon={<IconUsdCircle />}>
          {t(i18n)`Purchases`}
        </NavigationListItem>
        <NavigationListItem href="/receivables" icon={<IconReceipt />}>
          {t(i18n)`Sales`}
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
          <NavigationListItem icon={<IconUserCircle />}>
            {t(i18n)`My Profile`}
          </NavigationListItem>
          <NavigationListItem icon={<IconUsersAlt />}>
            {t(i18n)`Team`}
          </NavigationListItem>
          <NavigationListItem icon={<IconBuilding />}>
            {t(i18n)`Company`}
          </NavigationListItem>
          <NavigationListItem href="/user-roles" icon={<IconPostcard />}>
            {t(i18n)`Roles & Approvals`}
          </NavigationListItem>
          <NavigationListItem icon={<IconSync />}>
            {t(i18n)`Integrations`}
          </NavigationListItem>
          <NavigationListItem icon={<IconFileHeart />}>
            {t(i18n)`Invoice Design`}
          </NavigationListItem>
          <NavigationListItem icon={<IconFilesLandscapes />}>
            {t(i18n)`Message Templates`}
          </NavigationListItem>
          <NavigationListItem icon={<IconEnvelopeHeart />}>
            {t(i18n)`Email Templates`}
          </NavigationListItem>
          <NavigationListItem href="/tags" icon={<IconFilesLandscapes />}>
            {t(i18n)`Tags`}
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
