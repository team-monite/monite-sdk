import styled from '@emotion/styled';
import { Box, Flex, Text, TextProps } from '@team-monite/ui-kit-react';

export const Title = styled(Text)`
  margin-bottom: 12px;
`;

export const StyledHeaderContent = styled(Flex)`
  align-items: center;
  gap: 24px;
`;

export const StyledContent = styled(Box)`
  padding-top: 32px;
  margin: 0 32px;
`;

export const StyledInfoTable = styled(Box)`
  border: 1px solid ${({ theme }) => theme.neutral80};
  border-radius: 6px;
`;

export const StyledInfoRow = styled(Box)`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.neutral80};
  align-items: flex-start;
  padding: 11px 16px;

  &:last-child {
    border-bottom: none;
  }
`;

export const StyledInfoLabel = styled(Text)<TextProps>`
  width: 50%;
  color: ${({ theme, $color }) => ($color ? $color : theme.colors.black)};
`;

export const StyledInfoValue = styled(Text)`
  width: 50%;
`;

export const ReceivableDetailsHeader = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.neutral80};
`;
