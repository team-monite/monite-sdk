import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';
import { getReadableAmount } from 'core/utils';
import { useCounterpartById } from 'core/queries/useCounterpart';
import { useEntityById } from 'core/queries/useEntity';
import { useCallback } from 'react';
import { getCounterpartName } from '../../counterparts/helpers';
import { getEntityName } from '../helpers';

export type UsePayableDetailsProps = {
  payment: PaymentsPaymentLinkResponse;
};

export default function usePaymentDetails({
  payment: { recipient, currency, amount, payment_reference, invoice },
}: UsePayableDetailsProps) {
  const {
    data: counterpart,
    error: counterpartError,
    isLoading: isCounterpartLoading,
  } = useCounterpartById(
    recipient.type === 'counterpart' ? recipient.id : undefined
  );

  const {
    data: entity,
    error: entityError,
    isLoading: isEntityLoading,
  } = useEntityById(recipient.type === 'entity' ? recipient.id : undefined);

  const getRecipient = useCallback(() => {
    if (!(entity || counterpart)) return '';
    if (entity) return getEntityName(entity);
    if (counterpart) return getCounterpartName(counterpart);
  }, [entity, counterpart]);

  return {
    isLoading: isCounterpartLoading || isEntityLoading,
    error: counterpartError || entityError,
    recipient: getRecipient(),
    paymentReference: payment_reference,
    amount: getReadableAmount(amount, currency),
    invoice,
  };
}
