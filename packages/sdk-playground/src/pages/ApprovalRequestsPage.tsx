import { AppMoniteProvider } from '@/components/app-monite-provider';
import { ApprovalRequests } from '@monite/sdk-react';

export function ApprovalRequestsPage() {
  return (
    <AppMoniteProvider>
      <ApprovalRequests />
    </AppMoniteProvider>
  );
}
