import React from 'react';
import styled from '@emotion/styled';
import {
  ReactTabsFunctionComponent as ReactTabsFC,
  TabList as ReactTabList,
  TabListProps as ReactTabListProps,
} from 'react-tabs';
import { tabList } from '../TabsClassNames';

type TabListProps = ReactTabListProps & {
  scrollable?: boolean;
};

const StyledTabList = styled(ReactTabList)<TabListProps>`
  padding: 0 0 4px;
  margin: 0;
  display: flex;
  gap: 30px;
`;

const Scrollable = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const TabList: ReactTabsFC<TabListProps> = ({
  children,
  scrollable,
  ref: _,
  ...props
}) => {
  if (scrollable) {
    return (
      <Scrollable>
        <StyledTabList className={tabList} {...props}>
          {children}
        </StyledTabList>
      </Scrollable>
    );
  }
  return (
    <StyledTabList className={tabList} {...props}>
      {children}
    </StyledTabList>
  );
};

TabList.tabsRole = 'TabList';

export default TabList;
