import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { Box } from '@mui/material';

export const CenteredContentBox = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Box
    className={ScopedCssBaselineContainerClassName}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    }}
  >
    {children}
  </Box>
);
