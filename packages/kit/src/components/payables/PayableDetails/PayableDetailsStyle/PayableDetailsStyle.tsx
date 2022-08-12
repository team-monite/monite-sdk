import styled from '@emotion/styled';
import { Box, Flex, FormField, Text } from '@monite/ui';

export const FormItem = styled(FormField)`
  margin-bottom: 24px;
`;

export const FormSection = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
`;

export const FormTitle = styled(Text)`
  margin-bottom: 24px;
`;

export const StyledHeaderContent = styled(Flex)`
  align-items: center;
  gap: 24px;
`;

export const StyledHeaderActions = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

export const StyledContent = styled(Flex)`
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.secondary};
  gap: 76px;
`;

export const StyledSection = styled(Box)`
  width: 50%;
`;

export const CurrencyAddon = styled(Text)`
  position: absolute;
  right: 10px;
  top: 50%;
  display: flex;
  justify-content: center;
  transform: translateY(-50%);
`;
