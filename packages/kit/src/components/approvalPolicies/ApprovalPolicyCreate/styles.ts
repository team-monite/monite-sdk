import styled from '@emotion/styled';
import { FormField, Text } from '@monite/ui';

export const TextSecondary = styled(Text)`
  color: ${({ theme }) => theme.colors.lightGrey1};
`;

export const FormItem = styled(FormField)`
  margin-bottom: 24px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CardTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr:not(:last-child) {
    td {
      border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey2};
    }
  }
`;

export const CardTableHeaderCell = styled.th`
  padding: 16px 12px;
  color: ${({ theme }) => theme.colors.grey};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey2};
`;

export const CardTableBodyCell = styled.td`
  padding: 16px 12px;
`;
