import styled from '@emotion/styled';

export const ViewerLayout = styled.div`
  background: ${({ theme }) => theme.colors.lightGrey3};
  padding: 72px;
  width: 762px;
  box-sizing: border-box;
`;

export const ControlPanel = styled.div`
  margin-bottom: 24px;
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
`;

export const Link = styled.a`
  height: 24px;
`;
