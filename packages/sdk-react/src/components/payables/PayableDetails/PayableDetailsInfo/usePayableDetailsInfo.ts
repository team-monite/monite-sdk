import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById } from '@/core/queries/useCounterpart';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';

export function usePayableDetailsInfo({
  currentCounterpartId,
  payableId,
}: {
  currentCounterpartId?: string;
  payableId: string;
}) {
  const { api } = useMoniteContext();

  const counterpartQuery = useCounterpartById(currentCounterpartId);
  const counterpartBankAccountQuery =
    useCounterpartsBankAccountsList(currentCounterpartId);
  const lineItemsQuery = api.payables.getPayablesIdLineItems.useQuery({
    path: { payable_id: payableId },
  });

  return {
    counterpartQuery,
    counterpartBankAccountQuery,
    lineItemsQuery,
  };
}
