import { Box, useTheme } from '@mui/material';

type FinanceProgressBarProps = {
  progress: number;
};

export const FinanceProgressBar = ({ progress }: FinanceProgressBarProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.divider,
        width: '100%',
        height: '6px',
        borderRadius: 0.5,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          width: `${progress}%`,
          height: '6px',
          borderRadius: 0.5,
        }}
      />
    </Box>
  );
};
