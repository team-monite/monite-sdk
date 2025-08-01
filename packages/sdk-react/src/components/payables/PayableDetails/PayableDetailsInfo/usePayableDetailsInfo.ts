import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';

export function usePayableDetailsInfo({
  currentCounterpartId,
  payableId,
}: {
  currentCounterpartId?: string;
  payableId: string;
}) {
  const { api } = useMoniteContext();

  const counterpartBankAccountQuery =
    useCounterpartsBankAccountsList(currentCounterpartId);
  const lineItemsQuery = api.payables.getPayablesIdLineItems.useQuery({
    path: { payable_id: payableId },
  });

  return {
    counterpartBankAccountQuery,
    lineItemsQuery,
  };
}
