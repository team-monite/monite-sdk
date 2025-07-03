import { components } from '@/api';
import { CounterpartResponse } from '@/core/queries';
import { getIndividualName } from '@/core/utils';

import { addDays } from 'date-fns';

export const isIndividualCounterpart = (
  counterpart: CounterpartResponse
): counterpart is components['schemas']['CounterpartIndividualRootResponse'] =>
  counterpart.type === 'individual';

export const isOrganizationCounterpart = (
  counterpart: CounterpartResponse
): counterpart is components['schemas']['CounterpartOrganizationRootResponse'] =>
  counterpart.type === 'organization';

export function getCounterpartName(
  counterpart: CounterpartResponse | undefined
): string {
  if (!counterpart) {
    return '';
  }

  if (isIndividualCounterpart(counterpart)) {
    const {
      individual: { first_name, last_name },
    } = counterpart;

    return getIndividualName(first_name, last_name);
  }

  if (isOrganizationCounterpart(counterpart)) {
    const {
      organization: { legal_name },
    } = counterpart;

    return legal_name;
  }

  return '';
}

export type EntityResponse =
  | components['schemas']['EntityOrganizationResponse']
  | components['schemas']['EntityIndividualResponse'];

export const isIndividualEntity = (
  counterpart: EntityResponse | undefined
): counterpart is components['schemas']['EntityIndividualResponse'] =>
  counterpart?.type === 'individual';

export const isOrganizationEntity = (
  counterpart: EntityResponse | undefined
): counterpart is components['schemas']['EntityOrganizationResponse'] =>
  counterpart?.type === 'organization';

export function prepareAddressView({
  address,
}: {
  address:
    | components['schemas']['CounterpartAddressResponseWithCounterpartID']
    | undefined;
}) {
  if (address)
    return `${address.postal_code}, ${address.city}, ${address.line1}`;
  return '';
}

export function calculateDueDate(
  selectedPaymentTerm: components['schemas']['PaymentTermsResponse']
) {
  return selectedPaymentTerm?.term_final?.number_of_days
    ? addDays(new Date(), selectedPaymentTerm.term_final.number_of_days)
    : null;
}
