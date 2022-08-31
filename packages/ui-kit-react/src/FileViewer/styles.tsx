import styled from '@emotion/styled';
import { Flex } from '../Box';

export const ControlPanel = styled(Flex)<{ isPdf: boolean }>`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: ${({ isPdf }) => (isPdf ? 'space-between' : 'flex-end')};
`;

export const StyledScroll = styled.div`
  width: 100%;
  overflow: auto;
`;
