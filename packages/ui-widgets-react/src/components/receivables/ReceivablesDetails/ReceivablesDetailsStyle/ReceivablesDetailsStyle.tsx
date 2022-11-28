import styled from '@emotion/styled';
import {
  Box,
  Card,
  Flex,
  FormField,
  List,
  Table,
  TableProps,
} from '@team-monite/ui-kit-react';

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
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const StyledItemsList = styled(List)<{ isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
  ${({ isLoading }) =>
    isLoading &&
    'position: relative;'} // HACK: infinite-scroll works wierd with position relative in parent element

  .infinite-scroll-component__outerdiv {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow: auto;
  }
`;

export const StyledItemsLoaderWrapper = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
`;

export const ItemsFilterWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  gap: 8px;
`;

export const StyledItemsTable = styled(Table)<TableProps>`
  td {
    vertical-align: middle;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ItemsTableError = styled(Box)`
  color: ${({ theme }) => theme.error50};
`;
