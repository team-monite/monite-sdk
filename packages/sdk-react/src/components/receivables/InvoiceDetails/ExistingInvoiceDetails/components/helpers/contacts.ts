import { components } from '@/api';
import {
  isOrganizationCounterpart,
  getCounterpartName,
} from '@/components/counterparts/helpers';
import { GenericCounterpartContact } from '@/core/queries';

type CounterpartOrganizationRootResponse =
  components['schemas']['CounterpartOrganizationRootResponse'];

export type Contact = GenericCounterpartContact & {
  isOrganization?: boolean;
};

export const getOrganizationEmail = (
  counterpart: CounterpartOrganizationRootResponse | undefined
) => {
  return counterpart && isOrganizationCounterpart(counterpart)
    ? counterpart.organization?.email
    : undefined;
};

export const getDefaultContact = (
  contacts: Contact[] | undefined,
  counterpart: CounterpartOrganizationRootResponse | undefined
): Contact | undefined => {
  if (contacts && contacts.length) {
    return contacts.find((c) => c.is_default) ?? contacts[0];
  }

  if (!counterpart || !isOrganizationCounterpart(counterpart)) {
    return undefined;
  }

  const organizationEmail = counterpart.organization?.email;
  if (!organizationEmail) {
    return undefined;
  }

  return {
    id: 'organization',
    counterpart_id: counterpart.id,
    email: organizationEmail,
    is_default: true,
    first_name: getCounterpartName(counterpart),
    last_name: '',
    is_customer: counterpart.organization.is_customer,
    is_vendor: counterpart.organization.is_vendor,
    isOrganization: true,
  };
};

export const getContactList = (
  contacts: Contact[] | undefined,
  defaultContact: Contact | undefined
): Contact[] => {
  if (contacts?.length) {
    return contacts;
  }

  return defaultContact ? [defaultContact] : [];
};
