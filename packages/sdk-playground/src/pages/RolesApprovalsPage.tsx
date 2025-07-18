import { AppMoniteProvider } from '@/components/app-monite-provider';
import { RolesAndApprovalPolicies } from '@monite/sdk-react';

export function RolesApprovalsPage() {
  return (
    <AppMoniteProvider>
      <RolesAndApprovalPolicies />
    </AppMoniteProvider>
  );
}
