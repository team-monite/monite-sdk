import React, { useState, useEffect } from 'react';
import { UArrowUp, UArrowDown } from '../unicons';
import styled from '@emotion/styled';
import { OrderEnum } from '@monite/js-sdk';

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
  ${({ $active }) => !$active && 'opacity: 0.3;'}

  svg {
    position: absolute;
    top: 0;
  }
`;

interface Props {
  isActive: boolean;
  title?: string;
  onChangeOrder: (order: OrderEnum | null) => void;
}

export const HeadCellSort = ({ title, isActive, onChangeOrder }: Props) => {
  const [order, setOrder] = useState<OrderEnum | null>(null);

  useEffect(() => {
    onChangeOrder(order);
  }, [order]);

  useEffect(() => {
    !isActive && setOrder(null);
  }, [isActive]);

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
              return OrderEnum.ASC;
            case OrderEnum.ASC:
              return OrderEnum.DESC;
            case OrderEnum.DESC:
              return null;
            default:
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
