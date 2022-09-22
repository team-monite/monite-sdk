import {
  CounterpartIndividualResponse,
  CounterpartOrganizationResponse,
  CounterpartResponse,
  CounterpartType,
} from '@monite/sdk-api';

export function isIndividualCounterpart(
  counterpart: CounterpartResponse
): counterpart is CounterpartIndividualResponse {
  return counterpart.type === CounterpartType.INDIVIDUAL;
}

export function isOrganizationCounterpart(
  counterpart: CounterpartResponse
): counterpart is CounterpartOrganizationResponse {
  return counterpart.type === CounterpartType.ORGANIZATION;
}

export function getIndividualName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function getName(counterpart: CounterpartResponse): string {
  if (isIndividualCounterpart(counterpart)) {
    const {
      individual: { first_name, last_name },
    } = counterpart as CounterpartIndividualResponse;

    return getIndividualName(first_name, last_name);
  }

  if (isOrganizationCounterpart(counterpart)) {
    const {
      organization: { legal_name },
    } = counterpart as CounterpartOrganizationResponse;

    return legal_name;
  }

  return '';
}
