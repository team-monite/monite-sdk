import React from 'react';

import { Paper, styled } from '@mui/material';

import { ElevationScroll } from '../../components';
import { useOnboardingRequirementsContext } from '../../context';
import { OnboardingProgress } from '../OnboardingProgress';

const StyledHeader = styled(Paper)`
  display: flex;
  align-items: center;
  z-index: 2;
  width: 100%;
  justify-content: center;
  height: ${({ theme }) => theme.spacing(9)};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(0, 4)};
    position: sticky;
    left: 0;
    top: 0;
    justify-content: flex-start;
  }

  ${({ elevation }) =>
    elevation && 'box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px;'}
`;

export function OnboardingHeader() {
  const { progress, isEditMode } = useOnboardingRequirementsContext();

  const shouldRenderProgress = !isEditMode;

  return (
    <ElevationScroll endElevation={1}>
      <StyledHeader square>
        {shouldRenderProgress && <OnboardingProgress value={progress} />}
      </StyledHeader>
    </ElevationScroll>
  );
}
