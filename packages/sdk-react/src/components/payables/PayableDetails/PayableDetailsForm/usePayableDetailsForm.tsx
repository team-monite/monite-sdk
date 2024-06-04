import { useCounterpartList } from '@/core/queries/useCounterpart';
import { useCounterpartsAddresses } from '@/core/queries/useCounterpartsAddresses';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';
import { useTagListQuery } from '@/core/queries/useTag';

export type UsePayableDetailsFormProps = {
  currentCounterpartId: string;
};

export function usePayableDetailsForm({
  currentCounterpartId,
}: UsePayableDetailsFormProps) {
  const tagQuery = useTagListQuery();
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
