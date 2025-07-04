import { components } from '@/api';

const filters: {
  [key in components['schemas']['package__receivables__v2024_05_25__receivables__ReceivableCursorFields']]: key;
} = {
  counterpart_name: 'counterpart_name',
  counterpart_id: 'counterpart_id',
  amount: 'amount',
  total_amount: 'total_amount',
  status: 'status',
  due_date: 'due_date',
  issue_date: 'issue_date',
  document_id: 'document_id',
  created_at: 'created_at',
  project_id: 'project_id',
};

export const ReceivableCursorFields = Object.values(filters);
