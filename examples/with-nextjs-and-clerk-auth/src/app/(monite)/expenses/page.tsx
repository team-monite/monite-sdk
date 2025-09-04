import { Expenses } from '@/components/MoniteComponents';
import { Box } from '@mui/material';

export default async function ExpensesPage() {
  return (
    <Box className="Monite-PageContainer Monite-Expenses">
      <Expenses />
    </Box>
  );
}
