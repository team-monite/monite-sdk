import { useMoniteContext } from '@/core/context/MoniteContext';

export const useRecurrenceByInvoiceId = (receivable_id: string = '') => {
  const { api } = useMoniteContext();

  const { data: receivable } = api.receivables.getReceivablesId.useQuery(
    { path: { receivable_id } },
    { enabled: Boolean(receivable_id) }
  );

  const recurrence_id =
    receivable?.type === 'invoice' ? receivable.recurrence_id : undefined;

  return api.recurrences.getRecurrencesId.useQuery(
    { path: { recurrence_id: recurrence_id ?? '' } },
    { enabled: Boolean(recurrence_id) }
  );
};
