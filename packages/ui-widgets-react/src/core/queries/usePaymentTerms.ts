import { useQuery } from 'react-query';
import {
  PaymentTermsService,
  ReceivablesReceivablesReceivablesPaymentTermsListResponse,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';

const PAYMENT_TERM_QUERY_ID = 'paymentTerm';

export const usePaymentTerms = (
  ...args: Parameters<PaymentTermsService['getPaymentTerms']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<
    ReceivablesReceivablesReceivablesPaymentTermsListResponse,
    Error
  >([PAYMENT_TERM_QUERY_ID, { variables: args }], () =>
    monite.api!.paymentTerms.getPaymentTerms(...args)
  );
};
