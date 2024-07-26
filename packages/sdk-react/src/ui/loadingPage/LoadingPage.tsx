import { CenteredContentBox } from '@/ui/box';
import { CircularProgress } from '@mui/material';

export const LoadingPage = () => (
  <CenteredContentBox className="Monite__LoadingPage">
    <CircularProgress />
  </CenteredContentBox>
);
