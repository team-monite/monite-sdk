import { Box } from '@mui/material';

import { Payables } from '@/components/MoniteComponents';

export default async function PayablesPage() {
  return (
    <Box className="Monite-PageContainer Monite-Purchases">
      <Payables />
    </Box>
  );
}
