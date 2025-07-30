import { useCounterpartList } from '@/core/queries/useCounterpart';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';

export type UsePayableDetailsFormProps = {
  currentCounterpartId?: string;
};

export function usePayableDetailsForm({
  currentCounterpartId,
}: UsePayableDetailsFormProps) {
  const counterpartQuery = useCounterpartList();

  const counterpartBankAccountQuery =
    useCounterpartsBankAccountsList(currentCounterpartId);

  return {
    counterpartQuery,
    counterpartBankAccountQuery,
  };
}
