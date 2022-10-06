import React, { useState, useEffect } from 'react';
import { UArrowUp, UArrowDown } from '../unicons';
import styled from '@emotion/styled';
import { SortOrderEnum } from '../types';

export const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    z-index: 1;

    &:after {
      position: absolute;
      content: '';
      width: 140%;
      height: 140%;
      left: -20%;
      top: -20%;
      background-color: ${({ theme }) =>
        theme.tableHeader.backgroundColorHover};
      z-index: -1;
    }

    > span {
      opacity: 1;
    }
  }

  &:active {
    &:after {
      position: absolute;
      content: '';
      width: 140%;
      height: 140%;
      left: -20%;
      top: -20%;
      background-color: ${({ theme }) =>
        theme.tableHeader.backgroundColorActive};
      z-index: -1;
    }
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
  onChangeOrder: (order: SortOrderEnum | null) => void;
}

export const HeadCellSort = ({ title, isActive, onChangeOrder }: Props) => {
  const [order, setOrder] = useState<SortOrderEnum | null>(null);

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
              return SortOrderEnum.ASC;
            case SortOrderEnum.ASC:
              return SortOrderEnum.DESC;
            case SortOrderEnum.DESC:
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
