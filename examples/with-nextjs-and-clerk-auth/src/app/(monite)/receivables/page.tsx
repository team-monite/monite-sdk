import { Box } from '@mui/material';

import { Receivables } from '@/components/MoniteComponents';

export default async function ReceivablesPage() {
  return (
    <Box className="Monite-PageContainer Monite-Receivables">
      <Receivables />
    </Box>
  );
}
