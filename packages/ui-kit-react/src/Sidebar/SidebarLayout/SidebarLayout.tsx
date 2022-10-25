import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  flex: 0 0 auto;
  padding: 30px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.neutral80};
`;

const Content = styled.div`
  flex: 1 1 auto;
  padding: 30px 32px;
  overflow-y: auto;
`;

const Footer = styled.div`
  flex: 0 0 auto;
  padding: 16px 32px;
  border-top: 1px solid ${({ theme }) => theme.neutral80};
`;

interface Props {
  header: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}

const SidebarLayout = ({ header, content, footer }: Props) => {
  return (
    <Wrapper>
      <Header>{header}</Header>
      <Content>{content}</Content>
      <Footer>{footer}</Footer>
    </Wrapper>
  );
};

export default SidebarLayout;
