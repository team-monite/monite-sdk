import styled from '@emotion/styled';
import { Box } from '@monite/ui-kit-react';

export * from './CounterpartDetailsBlock';

export const CounterpartHeader = styled(Box)`
  border-bottom: 1px solid #dddddd;
`;

export const CounterpartFooter = styled(Box)`
  border-top: 1px solid #dddddd;
  align-items: flex-end;
`;

export const CounterpartForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;
