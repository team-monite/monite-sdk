import React from 'react';
import styled from '@emotion/styled';
import { Tab as ReactTab, TabProps as ReactTabProps } from 'react-tabs';

import Text from 'Text';
import { tab, disabledTab, selectedTab } from '../TabsClassNames';
import { ReactTabsFC } from '../typings';
import { Theme } from '../../index';

type TabProps = ReactTabProps & {
  textSize?: keyof Theme['typographyStyles'];
  count?: string | number;
};

const Counter = styled.div`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.red};
  font-weight: 600;
  font-size: 8px;
  line-height: 20px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.white};
  margin-left: 8px;
`;

const StyledTab = styled(ReactTab)<TabProps>`
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-bottom: none;
  position: relative;
  list-style: none;
  padding: 0;
  height: 38px;
  cursor: pointer;
  color: ${({ theme }) => theme.neutral50};
  transition: color 0.2s;
  white-space: nowrap;

  &:focus {
    outline: none;
  }

  &:hover {
    color: ${({ theme }) => theme.black};
  }

  &.${selectedTab} {
    color: ${({ theme }) => theme.black};

    &:after {
      border-radius: 5px 5px 0 0;
      content: '';
      position: absolute;
      height: 4px;
      left: 0;
      right: 0;
      bottom: -4px;
      background-color: ${({ theme }) => theme.black};
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
  count,
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
      {count && <Counter>{count}</Counter>}
    </StyledTab>
  );
};

Tab.tabsRole = 'Tab';

export default Tab;
