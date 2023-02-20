import React from 'react';
import { Paper, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';

export type OnboardingTitleProps = {
  step: string;
  title: string;
  description: string;
};

const StyledCard = styled(Paper)`
  text-align: center;
  padding: 32px;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    border-radius: 12px;
  }
`;

const StyledText = styled('span')`
  color: ${palette.neutral10};
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
`;

const StyledDescription = styled(StyledText)`
  color: ${palette.neutral50};
`;

const StyledHeading = styled('h1')`
  color: ${palette.neutral10};
  font-weight: 600;
  font-size: 24px;
  line-height: ${({ theme }) => theme.spacing(4)};
  margin-bottom: 12px;
`;

export default function OnboardingTitle({
  step,
  title,
  description,
}: OnboardingTitleProps) {
  return (
    <StyledCard square elevation={0}>
      <StyledText>{step}</StyledText>
      <StyledHeading>{title}</StyledHeading>
      <StyledDescription>{description}</StyledDescription>
    </StyledCard>
  );
}
