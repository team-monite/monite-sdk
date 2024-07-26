import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { classNames } from '@/utils/css-utils';
import { Box } from '@mui/material';

export const CenteredContentBox = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Box
    className={classNames(ScopedCssBaselineContainerClassName, className)}
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
