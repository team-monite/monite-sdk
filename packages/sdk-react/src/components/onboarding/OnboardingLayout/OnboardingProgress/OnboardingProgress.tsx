import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepIconProps,
  StepConnector,
  stepConnectorClasses,
} from '@mui/material';

export type OnboardingProgressProps = {
  value: number;
};

const StyledBox = styled(Box)`
  width: 100%;
  max-width: 300px;
  padding: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(2, 0)};
  }
`;

const StepperConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const StepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? theme.palette.primary.main : '#fff',
  zIndex: 1,
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid',
  borderColor:
    ownerState.active || ownerState.completed
      ? theme.palette.primary.main
      : '#ccc',
  color: '#fff',
}));

const StepDot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: ownerState.active ? theme.palette.primary.main : '#ccc',
}));

const CheckmarkIcon = styled(CheckIcon)({
  fontSize: 16,
});

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? (
        <CheckmarkIcon />
      ) : (
        <StepDot ownerState={{ completed, active }} />
      )}
    </StepIconRoot>
  );
}

export function OnboardingProgress({ value }: OnboardingProgressProps) {
  if (value < 0 || value > 100) return null;

  // Convert percentage to active step (0, 1, or 2)
  const getActiveStep = () => {
    if (value < 33.4) return 0;
    if (value < 66.7) return 1;
    return 2;
  };

  const steps = [1, 2, 3];
  const activeStep = getActiveStep();

  return (
    <StyledBox>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<StepperConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}></StepLabel>
          </Step>
        ))}
      </Stepper>
    </StyledBox>
  );
}
