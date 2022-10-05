import styled from '@emotion/styled';
import { Box, Flex, FormField, Text } from '@team-monite/ui-kit-react';

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
  padding: 40px 40px 0 40px;
  background-color: ${({ theme }) => theme.colors.secondary};
  gap: 48px;
  height: 100%;
`;

export const StyledSection = styled(Box)`
  width: 50%;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const StyledScrollContent = styled(Box)`
  height: 100%;
  position: relative;
`;

export const StyledScroll = styled(Box)`
  overflow: auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const CurrencyAddon = styled(Text)`
  position: absolute;
  right: 10px;
  top: 50%;
  display: flex;
  justify-content: center;
  transform: translateY(-50%);
`;

export const StyledLoading = styled(Text)`
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

export const StyledTabs = styled(Box)`
  padding-left: 16px;
`;

export const StyledInfoScroll = styled(StyledScroll)`
  padding-top: 48px;
`;

export const StyledInfoTable = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.lightGrey2};
  border-radius: 6px;
`;

export const StyledInfoRow = styled(Box)`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey2};
  align-items: center;
  padding: 11px 16px;

  &:last-child {
    border-bottom: none;
  }
`;

export const StyledInfoLabel = styled(Text)`
  width: 50%;
  color: ${({ theme }) => theme.colors.black};
`;

export const StyledInfoValue = styled(Text)`
  width: 50%;
`;

export const StyledTags = styled(StyledInfoValue)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
