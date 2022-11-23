import styled from '@emotion/styled';
import { Box, Card, Flex, FormField, Table } from '@team-monite/ui-kit-react';

export const StyledContent = styled(Flex)`
  padding: 24px 144px;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export const StyledCard = styled(Card)`
  padding: 24px 32px 8px;
  margin-bottom: 40px;
`;

export const StyledItemsCard = styled(Card)`
  padding: 16px 16px 0;
  margin-bottom: 40px;
`;

export const FormItem = styled(FormField)`
  margin-bottom: 24px;
`;

export const ItemsHeader = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.neutral80};
`;

export const ItemsFooter = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.neutral80};
  align-items: flex-end;
`;

export const StyledHeaderActions = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

export const ItemsContent = styled.div`
  padding: 32px;
`;

export const StyledItemsTable = styled(Table)`
  td {
    vertical-align: middle;
  }
`;
