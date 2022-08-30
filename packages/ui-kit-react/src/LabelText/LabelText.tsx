import React from 'react';
import styled from '@emotion/styled';
import { Box, Flex } from '../Box';

type LabelTextProps = {
  label: string;
  text: string;
};

const LabelTextRoot = styled(Flex)`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled(Box)`
  width: 132px;
  font-size: 14px;
  color: #707070;
`;

const Text = styled(Box)`
  flex-grow: 1;
  color: #111111;
`;

const LabelText = ({ label, text }: LabelTextProps) => (
  <LabelTextRoot>
    <Label>{label}:</Label>
    <Text>{text}</Text>
  </LabelTextRoot>
);

export default LabelText;
