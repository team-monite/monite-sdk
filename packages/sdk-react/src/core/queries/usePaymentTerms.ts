'use client';

import { PaymentTermsService, PaymentTermsListResponse } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const PAYMENT_TERM_QUERY_ID = 'paymentTerm';

export const usePaymentTerms = (
  ...args: Parameters<PaymentTermsService['getAll']>
) => {
  const { monite } = useMoniteContext();

  return useQuery<PaymentTermsListResponse, Error>({
    queryKey: [PAYMENT_TERM_QUERY_ID, { variables: args }],

    queryFn: () => monite.api.paymentTerms.getAll(...args),
  });
};
