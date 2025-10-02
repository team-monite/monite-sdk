import { Transactions } from '@/components/MoniteComponents';
import { Box } from '@mui/material';

export default async function TransactionsPage() {
  return (
    <Box className="Monite-PageContainer Monite-Transactions">
      <Transactions />
    </Box>
  );
}
