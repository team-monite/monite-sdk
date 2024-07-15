import { useMoniteContext } from '@/core/context/MoniteContext';
import type { ErrorType } from '@/core/queries/types';
import { ApiError, EntityBankAccountPaginationResponse } from '@monite/sdk-api';
import { useMutation, useQuery } from '@tanstack/react-query';

const BANK_ACCOUNTS_QUERY_ID = 'bankAccounts';

const bankAccountsQueryKeys = {
  all: () => [BANK_ACCOUNTS_QUERY_ID],
};

/** Get all bank accounts of the current entity */
export const useBankAccounts = () => {
  const { monite } = useMoniteContext();

  return useQuery<EntityBankAccountPaginationResponse, ApiError>({
    queryKey: [...bankAccountsQueryKeys.all()],
    queryFn: () => monite.api.bankAccounts.getAll(),
  });
};

export const useDeleteBankAccount = () => {
  const { monite } = useMoniteContext();

  return useMutation<void, ErrorType, string>({
    mutationFn: (bankAccountId) =>
      monite.api.bankAccounts.delete(bankAccountId),
  });
};
