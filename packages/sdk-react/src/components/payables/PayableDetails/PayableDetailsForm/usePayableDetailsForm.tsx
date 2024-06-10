import { useAPI } from '@/api/client';
import { useCounterpartList } from '@/core/queries/useCounterpart';
import { useCounterpartsAddresses } from '@/core/queries/useCounterpartsAddresses';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';

export type UsePayableDetailsFormProps = {
  currentCounterpartId: string;
};

export function usePayableDetailsForm({
  currentCounterpartId,
}: UsePayableDetailsFormProps) {
  const { api } = useAPI();
  const tagQuery = api.tags.getTags.useQuery({});

  const counterpartQuery = useCounterpartList();
  const counterpartAddressQuery =
    useCounterpartsAddresses(currentCounterpartId);
  const counterpartBankAccountQuery =
    useCounterpartsBankAccountsList(currentCounterpartId);

  return {
    tagQuery,
    counterpartQuery,
    counterpartAddressQuery,
    counterpartBankAccountQuery,
  };
}
