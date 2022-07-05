import React from 'react';
import styled from '@emotion/styled';
import {
  ReactTabsFunctionComponent as ReactTabsFC,
  Tab as ReactTab,
  TabProps as ReactTabProps,
} from 'react-tabs';

import Text, { STYLES } from 'Text';
import { tab, disabledTab, selectedTab } from '../TabsClassNames';

type TabProps = ReactTabProps & {
  textSize?: keyof typeof STYLES;
};

const StyledTab = styled(ReactTab)<TabProps>`
  display: flex;
  border: 1px solid transparent;
  border-bottom: none;
  position: relative;
  list-style: none;
  padding: 6px 12px;
  background-color: #91d5ff;
  height: 38px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grey};

  &:focus {
    outline: none;
  }

  &.${selectedTab} {
    color: ${({ theme }) => theme.colors.black};
    cursor: default;

    &:after {
      border-radius: 5px 5px 0 0;
      content: '';
      position: absolute;
      height: 4px;
      left: -4px;
      right: -4px;
      bottom: 0;
      background: ${({ theme }) => theme.colors.black};
    }
  }

  &.${disabledTab} {
    color: GrayText;
    cursor: default;
  }
`;

const Tab: ReactTabsFC<TabProps> = ({
  children,
  ref: _,
  textSize = 'smallBold',
  ...props
}) => {
  return (
    <StyledTab
      className={tab}
      disabledClassName={disabledTab}
      selectedClassName={selectedTab}
      {...props}
    >
      <Text textSize={textSize}>{children}</Text>
    </StyledTab>
  );
};

Tab.tabsRole = 'Tab';

export default Tab;
