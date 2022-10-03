import React from 'react';
import { Text } from '@team-monite/ui-widgets-react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

type PageHeaderProps = {
  title: string;
  extra?: React.ReactNode;
};
const PageHeader = ({ title, extra }: PageHeaderProps) => {
  return (
    <Wrapper>
      <div>
        <Text as="h1" textSize="h2">
          {title}
        </Text>
      </div>
      {extra ? <aside>{extra}</aside> : null}
    </Wrapper>
  );
};

export default PageHeader;
