import { Paper, styled, useMediaQuery, useScrollTrigger } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useOnboardingRequirementsContext } from '../../context';
import { OnboardingProgress } from '../OnboardingProgress';

export function OnboardingHeader() {
  const { progress, isEditMode } = useOnboardingRequirementsContext();

  const shouldRenderProgress = !isEditMode;

  return (
    <StyledHeader square>
      {shouldRenderProgress && <OnboardingProgress value={progress} />}
    </StyledHeader>
  );
}

const StyledHeader = styled(Paper)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  width: 100%;
  border-radius: 0;
  box-shadow: none;
  padding: ${({ theme }) => theme.spacing(0, 1)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
`;
