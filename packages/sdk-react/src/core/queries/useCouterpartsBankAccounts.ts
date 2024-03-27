import { useMoniteContext } from '@/core/context/MoniteContext';
import { ApiError, CounterpartBankAccountResourceList } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

export const COUNTERPARTS_BANK_ACCOUNTS_QUERY_ID = 'counterpartsBankAccounts';

export const counterpartsBankAccountsQueryKeys = {
  all: () => [COUNTERPARTS_BANK_ACCOUNTS_QUERY_ID],
  list: (counterpartId?: string) => [
    ...counterpartsBankAccountsQueryKeys.all(),
    'list',
    counterpartId,
  ],
};

export const useCounterpartsBankAccountsList = (counterpartId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<CounterpartBankAccountResourceList, ApiError>(
    [...counterpartsBankAccountsQueryKeys.list(counterpartId)],
    () => monite.api.counterparts.getBankAccounts(counterpartId!),
    {
      enabled: !!counterpartId,
    }
  );
};
