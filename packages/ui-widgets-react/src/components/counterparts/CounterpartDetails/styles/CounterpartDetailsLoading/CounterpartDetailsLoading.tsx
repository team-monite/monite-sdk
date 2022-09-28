import React from 'react';
import { Spinner } from '@monite/ui-kit-react';
import styled from '@emotion/styled';

export const StyledLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  background-color: #ffffffb8;
  color: ${({ theme }) => theme.colors.primary};
  z-index: 1;
`;

export const CounterpartDetailsLoading = () => {
  return (
    <StyledLoading>
      <Spinner color={'primary'} pxSize={45} />
    </StyledLoading>
  );
};
