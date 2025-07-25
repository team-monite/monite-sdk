import { Products } from '@/components/MoniteComponents';
import { Box } from '@mui/material';

export default async function ProductsPage() {
  return (
    <Box className="Monite-PageContainer Monite-Purchases">
      <Products />
    </Box>
  );
}
