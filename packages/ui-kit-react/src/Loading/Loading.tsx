import React from 'react';
import { Spinner, Flex } from '../';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

export const StyledLoading = styled(Flex)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  z-index: 1;
  background-color: ${({ theme }) => theme.loading.backgroundColor};
  color: ${({ theme }) => theme.loading.color};
`;

const Loading = () => {
  const theme = useTheme();

  return (
    <StyledLoading>
      <Spinner pxSize={theme.loading.size as number} />
    </StyledLoading>
  );
};

export default Loading;
