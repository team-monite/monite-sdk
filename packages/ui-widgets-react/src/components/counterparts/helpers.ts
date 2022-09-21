import {
  CounterpartAddress,
  CounterpartIndividualResponse as CounterpartIndividual,
  CounterpartOrganizationResponse as CounterpartOrganization,
  CounterpartResponse,
  CounterpartType,
} from '@monite/sdk-api';

export function isIndividualCounterpart(
  counterpart: CounterpartResponse
): counterpart is CounterpartIndividual {
  return counterpart.type === CounterpartType.INDIVIDUAL;
}

export function isOrganizationCounterpart(
  counterpart: CounterpartResponse
): counterpart is CounterpartOrganization {
  return counterpart.type === CounterpartType.ORGANIZATION;
}

// todo how to generate the full address?
export function getAddress({
  line1,
  line2,
  postal_code,
  city,
  country,
  state,
}: CounterpartAddress): string {
  const street2 = line2 ? `${line2}, ` : '';

  return `${line1}, ${street2}${postal_code} ${city}, ${state}, ${country}`;
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
