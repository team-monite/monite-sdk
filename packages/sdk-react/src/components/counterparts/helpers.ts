import { components } from '@/api';
import { QCounterpartResponse } from '@/core/queries';

export function isIndividualCounterpart(counterpart: QCounterpartResponse) {
  return counterpart.type === 'individual';
}

export function isOrganizationCounterpart(counterpart: QCounterpartResponse) {
  return counterpart.type === 'organization';
}

export function getIndividualName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function getCounterpartName(counterpart?: QCounterpartResponse): string {
  if (!counterpart) {
    return '';
  }

  if (isIndividualCounterpart(counterpart)) {
    const {
      individual: { first_name, last_name },
    } =
      counterpart as components['schemas']['CounterpartIndividualRootResponse'];

    return getIndividualName(first_name, last_name);
  }

  if (isOrganizationCounterpart(counterpart)) {
    const {
      organization: { legal_name },
    } =
      counterpart as components['schemas']['CounterpartOrganizationRootResponse'];

    return legal_name;
  }

  return '';
}
