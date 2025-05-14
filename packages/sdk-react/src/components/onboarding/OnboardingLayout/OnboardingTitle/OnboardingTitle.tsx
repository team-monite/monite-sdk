import { ReactNode } from 'react';

import { Paper, styled, Typography } from '@mui/material';

export type OnboardingTitleProps = {
  icon?: ReactNode;
  title: string;
  description: ReactNode;
};

const StyledPaper = styled(Paper)`
  text-align: left;
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.spacing(1.5)};
`;

export function OnboardingTitle({
  icon,
  title,
  description,
}: OnboardingTitleProps) {
  return (
    <StyledPaper variant="outlined">
      {icon}
      <Typography variant="h3" mb={1} fontSize="1.2rem">
        {title}
      </Typography>
      <Typography variant="body1">{description}</Typography>
    </StyledPaper>
  );
}
