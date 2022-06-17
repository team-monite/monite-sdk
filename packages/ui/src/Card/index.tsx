import React from 'react';

import { Box, BoxProps } from '../Box';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & BoxProps;

const Card: React.FC<CardProps> = ({
  children,
  className,
  ...props
}: CardProps) => {
  return (
    <Box
      sx={{
        boxShadow: '0px 4px 8px 0px #1111110f',
        background: 'white',
        borderRadius: '8px',
      }}
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Card;
