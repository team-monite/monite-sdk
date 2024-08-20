import { Box } from '@mui/material';

import { Products } from '@/components/MoniteComponents';

export default async function ProductsPage() {
  return (
    <Box className="Monite-PageContainer Monite-Purchases">
      <Products />
    </Box>
  );
}
