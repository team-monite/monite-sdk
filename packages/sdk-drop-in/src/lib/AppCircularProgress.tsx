import { CircularProgress } from '@mui/material';

export const AppCircularProgress = ({
  color = 'secondary',
}: {
  color?: 'primary' | 'secondary';
}) => (
  <CircularProgress
    color={color}
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto',
    }}
  />
);
