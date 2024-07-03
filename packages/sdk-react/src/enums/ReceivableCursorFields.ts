import { components } from '@/api';

const schema: {
  [key in components['schemas']['ReceivableCursorFields']]: key;
} = {
  counterpart_name: 'counterpart_name',
  counterpart_id: 'counterpart_id',
  amount: 'amount',
  status: 'status',
  due_date: 'due_date',
  issue_date: 'issue_date',
  document_id: 'document_id',
  created_at: 'created_at',
};

export const ReceivableCursorFields = Object.values(schema);
