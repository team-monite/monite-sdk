import {
  CounterpartIndividualRootResponse,
  CounterpartOrganizationRootResponse,
  CounterpartResponse,
  CounterpartType,
} from '@monite/sdk-api';

export function isIndividualCounterpart(
  counterpart: CounterpartResponse
): counterpart is CounterpartIndividualRootResponse {
  return counterpart.type === CounterpartType.INDIVIDUAL;
}

export function isOrganizationCounterpart(
  counterpart: CounterpartResponse
): counterpart is CounterpartOrganizationRootResponse {
  return counterpart.type === CounterpartType.ORGANIZATION;
}

export function getIndividualName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function getCounterpartName(counterpart?: CounterpartResponse): string {
  if (!counterpart) {
    return '';
  }

  if (isIndividualCounterpart(counterpart)) {
    const {
      individual: { first_name, last_name },
    } = counterpart as CounterpartIndividualRootResponse;

    return getIndividualName(first_name, last_name);
  }

  if (isOrganizationCounterpart(counterpart)) {
    const {
      organization: { legal_name },
    } = counterpart as CounterpartOrganizationRootResponse;

    return legal_name;
  }

  return '';
}
