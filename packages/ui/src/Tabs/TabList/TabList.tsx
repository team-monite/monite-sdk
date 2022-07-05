import React from 'react';
import styled from '@emotion/styled';
import {
  ReactTabsFunctionComponent as ReactTabsFC,
  TabList as ReactTabList,
  TabListProps as ReactTabListProps,
} from 'react-tabs';
import { tabList } from '../TabsClassNames';

type TabListProps = ReactTabListProps & {};

const StyledTabList = styled(ReactTabList)<TabListProps>`
  padding: 0;
  margin: 0;
  display: flex;
`;

const TabList: ReactTabsFC<TabListProps> = ({ children, ref: _, ...props }) => {
  return (
    <StyledTabList className={tabList} {...props}>
      {children}
    </StyledTabList>
  );
};

TabList.tabsRole = 'TabList';

export default TabList;
