import {
  Box,
  LinearProgress,
  linearProgressClasses,
  styled,
} from '@mui/material';

export type OnboardingProgressProps = {
  value: number;
};

const StyledBox = styled(Box)`
  height: 4px;
  width: 100%;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing(9)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    z-index: 3;
    position: relative;
    height: 8px;
    border-radius: 100px;
    left: 50%;
    width: 120px;
    transform: translateX(-50%);
    margin: 0;
  }
`;

const BorderLinearProgress = styled(LinearProgress)({
  height: 8,
  borderRadius: 0,

  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
  },
});

export function OnboardingProgress({ value }: OnboardingProgressProps) {
  if (value < 0 || value > 100) return null;

  return (
    <StyledBox>
      <BorderLinearProgress
        variant="determinate"
        value={value}
        color="secondary"
      />
    </StyledBox>
  );
}
