import { useCounterpartList } from '@/core/queries/useCounterpart';
import { useCounterpartsAddresses } from '@/core/queries/useCounterpartsAddresses';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';
import { useTagList } from '@/core/queries/useTag';

export type UsePayableDetailsFormProps = {
  currentCounterpartId: string;
};

export function usePayableDetailsForm({
  currentCounterpartId,
}: UsePayableDetailsFormProps) {
  const tagQuery = useTagList();
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
