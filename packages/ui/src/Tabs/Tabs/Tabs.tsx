import React from 'react';
import styled from '@emotion/styled';
import { Tabs as ReactTabs, TabsProps } from 'react-tabs';

import {
  disabledTab,
  selectedTab,
  selectedTabPanel,
  tabs,
} from '../TabsClassNames';
import { ReactTabsFC } from '../typings';

const StyledTabs = styled(ReactTabs)<TabsProps>`
  -webkit-tap-highlight-color: transparent;
`;

const Tabs: ReactTabsFC<TabsProps> = ({ children, ...props }) => {
  return (
    <StyledTabs
      className={tabs}
      selectedTabPanelClassName={selectedTabPanel}
      selectedTabClassName={selectedTab}
      disabledTabClassName={disabledTab}
      {...props}
    >
      {children}
    </StyledTabs>
  );
};

Tabs.tabsRole = 'Tabs';

export default Tabs;
