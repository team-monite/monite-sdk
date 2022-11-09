import React from 'react';
import styled from '@emotion/styled';

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
`;

type Props = { children: React.ReactNode };

export const TableFooter = ({ children }: Props) => {
  return <Footer>{children}</Footer>;
};
