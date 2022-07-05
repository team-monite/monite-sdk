import React from 'react';
import styled from '@emotion/styled';
import {
  ReactTabsFunctionComponent as ReactTabsFC,
  TabPanel as ReactTabPanel,
  TabPanelProps as ReactTabPanelProps,
} from 'react-tabs';
import { tabPanel, selectedTabPanel } from '../TabsClassNames';

type TabPanelProps = ReactTabPanelProps & {};

const StyledTabPanel = styled(ReactTabPanel)<TabPanelProps>`
  display: none;

  &.${selectedTabPanel} {
    display: block;
  }
`;

const TabPanel: ReactTabsFC<TabPanelProps> = ({
  children,
  ref: _,
  ...props
}) => {
  return (
    <StyledTabPanel className={tabPanel} {...props}>
      {children}
    </StyledTabPanel>
  );
};

TabPanel.tabsRole = 'TabPanel';

export default TabPanel;
