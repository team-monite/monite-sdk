import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import ReactTooltip, { TooltipProps } from 'react-tooltip';

import { Button, Tooltip, InfoIcon } from '..';

import type { TooltipProps as DataTooltipProp } from '../types';

const Wrapper = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: row;

  > div {
    flex: 1;
  }

  > button {
    color: ${({ theme }) => theme.colors.lightGrey1};
    width: 20px;
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
      {onClickInfo ? (
        <Button
          type="button"
          noPadding
          color="link"
          onClick={onClickInfo}
          icon={<InfoIcon />}
        />
      ) : null}
      {reactTooltip ? (
        <Tooltip
          overridePosition={(position, _event, _target, _ref, place) => ({
            left: position.left,
            top: place === 'bottom' ? position.top - 15 : position.top + 15,
          })}
          {...reactTooltip}
        />
      ) : null}
    </Wrapper>
  );
};

export default ListItem;
