import React from 'react';
import { Box, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';

export type OnboardingProgressProps = {
  value: number;
};

const StyledProgress = styled(Box)`
  height: 4px;
  width: 100%;
  background-color: ${palette.neutral80};
  position: fixed;
  overflow: hidden;
  z-index: 3;
  left: 0;
  bottom: 81px;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: 8px;
    border-radius: 100px;
    left: 50%;
    top: calc(72px / 2);
    width: 120px;
    transform: translateX(-50%);
  }
`;

const StyledProgressValue = styled(Box)`
  height: 100%;
  background-color: ${palette.neutral10};
  transition: width 0.3s ease-in-out;
  display: flex;
  justify-content: flex-end;
  position: relative;

  &:after {
    position: absolute;
    right: -2px;
    top: 0;
    content: '';
    height: 100%;
    width: 2px;
    background-color: ${palette.neutral100};
  }
`;

export default function OnboardingProgress({ value }: OnboardingProgressProps) {
  if (value < 0 || value > 100) return null;

  return (
    <StyledProgress>
      {value > 0 && <StyledProgressValue sx={{ width: `${value}%` }} />}
    </StyledProgress>
  );
}
