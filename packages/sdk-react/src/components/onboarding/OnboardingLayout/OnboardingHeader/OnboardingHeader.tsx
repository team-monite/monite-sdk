import { Paper, styled, useMediaQuery, useScrollTrigger } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useOnboardingRequirementsContext } from '../../context';
import { OnboardingProgress } from '../OnboardingProgress';

export function OnboardingHeader() {
  const theme = useTheme();
  const moreThanSM = useMediaQuery(theme.breakpoints.up('sm'));

  const { progress, isEditMode } = useOnboardingRequirementsContext();

  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const shouldRenderProgress = !isEditMode;
  const startElevation = 0;
  const endElevation = 4;

  const elevation = scrollTrigger && moreThanSM ? endElevation : startElevation;

  return (
    <StyledHeader elevation={elevation} square>
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
  padding: ${({ theme }) => theme.spacing(4, 4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    position: sticky;
    left: 0;
    top: 0;
  }

  ${({ elevation }) =>
    elevation && 'box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px;'}
`;
