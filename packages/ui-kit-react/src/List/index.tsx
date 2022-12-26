import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.neutral80};
`;

type ListProps = {
  children: React.ReactNode;
  className?: string;
};

const List = ({ className, children }: ListProps) => {
  return <Wrapper className={className}>{children}</Wrapper>;
};

export default List;
