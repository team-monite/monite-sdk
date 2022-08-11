import React, { useState, useEffect } from 'react';
import { UArrowUp, UArrowDown } from '../unicons';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover > span {
    opacity: 1;
  }
`;

export const SortArrow = styled.span<{ $active: boolean }>`
  position: relative;
  width: 16px;
  height: 16px;
  ${({ $active }) => !$active && 'opacity: 0.5;'}

  svg {
    position: absolute;
    top: 0;
  }
`;

type Order = 'asc' | 'desc' | null;

interface Props {
  title?: string;
  onChangeOrder: (order: Order) => void;
}

export const HeadCellSort = ({ title, onChangeOrder }: Props) => {
  // TODO control state outside component
  const [order, setOrder] = useState<Order>(null);

  useEffect(() => {
    onChangeOrder(order);
  }, [order]);

  const renderArrow = () => {
    switch (order) {
      case null:
      case 'asc':
        return <UArrowDown width={16} height={16} />;
      case 'desc':
        return <UArrowUp width={16} height={16} />;
    }
  };

  return (
    <Wrapper
      onClick={() =>
        setOrder((prevState) => {
          switch (prevState) {
            case null:
              return 'asc';
            case 'asc':
              return 'desc';
            case 'desc':
              return null;
          }
        })
      }
    >
      {title}
      <SortArrow $active={order !== null}>{renderArrow()}</SortArrow>
    </Wrapper>
  );
};
