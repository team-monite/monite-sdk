import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import ReactTooltip, { TooltipProps } from 'react-tooltip';

import { IconButton, Tooltip, UInfoCircle } from '..';

import type { TooltipProps as DataTooltipProp } from '../types';

const Wrapper = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: row;

  :not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.neutral80};
  }

  > div {
    flex: 1;
  }
`;

type ListItemProps = {
  tooltip?: DataTooltipProp;
  reactTooltip?: TooltipProps;
  children: React.ReactNode;
  className?: string;
  onClickInfo?: (e: React.BaseSyntheticEvent) => void;
};

const ListItem = ({
  children,
  onClickInfo,
  tooltip,
  reactTooltip,
  className,
}: ListItemProps) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const tooltipAttributes = tooltip
    ? Object.keys(tooltip).reduce<Record<string, any>>((acc, key) => {
        acc[`data-${key}`] = tooltip[key];
        return acc;
      }, {})
    : {};

  return (
    <Wrapper {...tooltipAttributes} className={className}>
      <div>{children}</div>
      {onClickInfo && (
        <IconButton color={'lightGrey1'} onClick={onClickInfo}>
          <UInfoCircle />
        </IconButton>
      )}
      {reactTooltip && (
        <Tooltip
          overridePosition={(position, _event, _target, _ref, place) => ({
            left: position.left,
            top: place === 'bottom' ? position.top - 15 : position.top + 15,
          })}
          {...reactTooltip}
        />
      )}
    </Wrapper>
  );
};

export default ListItem;
