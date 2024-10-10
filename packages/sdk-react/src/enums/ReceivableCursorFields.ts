import { components } from '@/api';

const filters: Record<
  components['schemas']['ReceivableCursorFields'],
  components['schemas']['ReceivableCursorFields']
> = {
  counterpart_name: 'counterpart_name',
  counterpart_id: 'counterpart_id',
  amount: 'amount',
  status: 'status',
  due_date: 'due_date',
  issue_date: 'issue_date',
  document_id: 'document_id',
  created_at: 'created_at',
  project_id: 'project_id',
};

export const ReceivableCursorFields = Object.values(filters);
