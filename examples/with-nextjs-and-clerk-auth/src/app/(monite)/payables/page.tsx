import { Payables } from '@/components/MoniteComponents';
import { Box } from '@mui/material';

export default async function PayablesPage() {
  return (
    <Box className="Monite-PageContainer Monite-Purchases">
      <Payables />
    </Box>
  );
}
