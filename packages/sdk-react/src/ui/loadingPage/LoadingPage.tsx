import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { CenteredContentBox } from '@/ui/box';
import { CircularProgress } from '@mui/material';

export const LoadingPage = () => (
  <CenteredContentBox>
    <CircularProgress />
  </CenteredContentBox>
);
