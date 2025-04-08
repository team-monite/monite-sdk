import {
  useFinancing,
  useGetFinanceOffers,
} from '@/components/financing/hooks';
import { CircularProgress, Stack } from '@mui/material';

import { FinancedInvoicesTable } from './FinancedInvoicesTable';
import { FinanceWidget } from './FinanceWidget';

export const FinanceTab = ({
  onRowClick,
}: {
  onRowClick?: (invoice_id: string) => void;
}) => {
  const { isLoading: isLoadingOffers, data } = useGetFinanceOffers();
  const { isLoading, isEnabled } = useFinancing();

  if (isLoading || isLoadingOffers) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <Stack mt={4} gap={4}>
      {data?.offers && data.offers.length > 0 && (
        <FinanceWidget offers={data.offers} />
      )}
      <FinancedInvoicesTable onRowClick={onRowClick} offers={data?.offers} />
    </Stack>
  );
};
