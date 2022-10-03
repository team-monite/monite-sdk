import styled from '@emotion/styled';
import { Box, Flex } from '@team-monite/ui-kit-react';

export * from './CounterpartDetailsBlock';

export const CounterpartHeader = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.neutral80};
`;

export const CounterpartFooter = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.neutral80};
  align-items: flex-end;
`;

export const CounterpartForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

export const CounterpartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

export const CounterpartContactName = styled(Flex)`
  width: 100%;
  gap: 24px;
  justify-content: space-between;

  > * {
    width: 50%;
  }
`;

export const CounterpartEntityTitle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
