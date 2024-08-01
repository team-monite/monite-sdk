import { ReactNode } from 'react';

import { styled, Typography } from '@mui/material';

export type OnboardingSubTitleProps = {
  children: ReactNode;
  action?: ReactNode;
};

const StylesSubTitle = styled(Typography)`
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function OnboardingSubTitle({
  children,
  action,
}: OnboardingSubTitleProps) {
  return (
    <StylesSubTitle>
      {children}
      {action}
    </StylesSubTitle>
  );
}
