import { components } from '@/api';
import { CounterpartResponse } from '@/core/queries';

export const isIndividualCounterpart = (
  counterpart: CounterpartResponse
): counterpart is components['schemas']['CounterpartIndividualRootResponse'] =>
  counterpart.type === 'individual';

export const isOrganizationCounterpart = (
  counterpart: CounterpartResponse
): counterpart is components['schemas']['CounterpartOrganizationRootResponse'] =>
  counterpart.type === 'organization';

export function getIndividualName(name: {
  first_name: string | undefined;
  last_name: string | undefined;
}): string;
export function getIndividualName(
  firstName: string | undefined,
  lastName: string | undefined
): string;
export function getIndividualName(
  firstName:
    | string
    | undefined
    | {
        first_name: string | undefined;
        last_name: string | undefined;
      },
  lastName?: string
): string {
  const { first_name, last_name } =
    firstName && typeof firstName === 'object'
      ? firstName
      : {
          first_name: firstName,
          last_name: lastName,
        };

  return `${first_name?.trim() ?? ''} ${last_name?.trim() ?? ''}`.trim();
}

export function getCounterpartName(counterpart?: CounterpartResponse): string {
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
