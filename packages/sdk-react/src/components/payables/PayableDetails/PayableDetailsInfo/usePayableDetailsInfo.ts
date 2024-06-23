'use client';

import { useCounterpartById } from '@/core/queries/useCounterpart';
import { useCounterpartsBankAccountsList } from '@/core/queries/useCouterpartsBankAccounts';
import { usePayableLineItemsList } from '@/core/queries/usePayableLineItems';

export function usePayableDetailsInfo({
  currentCounterpartId,
  payableId,
}: {
  currentCounterpartId?: string;
  payableId: string;
}) {
  const counterpartQuery = useCounterpartById(currentCounterpartId);
  const counterpartBankAccountQuery =
    useCounterpartsBankAccountsList(currentCounterpartId);
  const lineItemsQuery = usePayableLineItemsList(payableId);

  return {
    counterpartQuery,
    counterpartBankAccountQuery,
    lineItemsQuery,
  };
}
