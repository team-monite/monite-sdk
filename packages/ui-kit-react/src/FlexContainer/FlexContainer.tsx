import React from 'react';
import type { Property } from 'csstype';
import { BoxProps, Flex } from '../Box';

type FlexContainerProps = {
  gap?: number;
  position?: Property.Position;
} & BoxProps;

const FlexContainer = ({
  children,
  gap,
  position,
  ...other
}: FlexContainerProps) => (
  <Flex sx={{ gap, position }} {...other}>
    {children}
  </Flex>
);

export default FlexContainer;
