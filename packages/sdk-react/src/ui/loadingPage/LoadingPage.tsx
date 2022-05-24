import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { CenteredContentBox } from '@/ui/box';
import { CircularProgress } from '@mui/material';

export const LoadingPage = () => (
  <MoniteStyleProvider>
    <CenteredContentBox>
      <CircularProgress />
    </CenteredContentBox>
  </MoniteStyleProvider>
);
