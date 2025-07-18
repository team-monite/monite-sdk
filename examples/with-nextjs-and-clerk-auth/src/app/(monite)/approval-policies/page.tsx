import { ApprovalPolicies } from '@/components/MoniteComponents';
import { Box } from '@mui/material';

export default async function ApprovalPoliciesPage() {
  return (
    <Box className="Monite-PageContainer Monite-ApprovalPolicies">
      <ApprovalPolicies />
    </Box>
  );
}
