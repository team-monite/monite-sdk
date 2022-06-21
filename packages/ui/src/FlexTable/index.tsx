import React from 'react';
import styled from '@emotion/styled';

import List from '../List';

const Wrapper = styled(List)`
  > div {
    padding: 12px 16px;
    align-items: center;
    align-content: center;
    position: relative;

    &:first-child {
      padding: 14px 16px;

      font-size: 14px;
      font-weight: 500;
      line-height: 20px;

      color: ${({ theme }) => theme.colors.lightGrey1};
    }

    > * + * {
      margin-left: 12px;
    }

    > div {
      min-width: 0;
      overflow: hidden;

      display: inline-flex;
      flex-wrap: wrap;

      position: relative;

      > * {
        max-width: 100%;
      }
    }
  }
`;

type FlexTableProps = {
  children: React.ReactNode;
  className?: string;
};

const FlexTable = ({ className, children }: FlexTableProps) => {
  return <Wrapper className={className}>{children}</Wrapper>;
};

export default FlexTable;
