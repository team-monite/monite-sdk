import { CenteredContentBox } from '@/ui/box';
import { CircularProgress } from '@mui/material';

export const LoadingPage = () => (
  <CenteredContentBox className="Monite-LoadingPage">
    <CircularProgress />
  </CenteredContentBox>
);
