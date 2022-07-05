import React from 'react';
import styled from '@emotion/styled';
import {
  ReactTabsFunctionComponent as ReactTabsFC,
  Tabs as ReactTabs,
  TabsProps as ReactTabsProps,
} from 'react-tabs';

import {
  disabledTab,
  selectedTab,
  selectedTabPanel,
  tabs,
} from '../TabsClassNames';

type TabsProps = ReactTabsProps & {};

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
