import React from 'react';
import styled from '@emotion/styled';
import { Box, Flex } from '../Box';

type LabelTextProps = {
  label: string;
  text: string;
};

const LabelTextRoot = styled(Flex)``;

const Label = styled(Box)`
  font-family: ${({ theme }) => theme.labelText.fontFamilyLabel};
  font-size: ${({ theme }) => theme.labelText.fontSizeLabel};
  font-weight: ${({ theme }) => theme.labelText.fontWeightLabel};

  color: ${({ theme }) => theme.labelText.textColorLabel};

  min-width: 132px;
`;

const Text = styled(Box)`
  font-family: ${({ theme }) => theme.labelText.fontFamilyText};
  font-size: ${({ theme }) => theme.labelText.fontSizeText};
  font-weight: ${({ theme }) => theme.labelText.fontWeightText};

  color: ${({ theme }) => theme.labelText.textColorText};

  flex-grow: 1;
`;

const LabelText = ({ label, text }: LabelTextProps) => (
  <LabelTextRoot>
    <Label>{label}:</Label>
    <Text>{text}</Text>
  </LabelTextRoot>
);

export default LabelText;
