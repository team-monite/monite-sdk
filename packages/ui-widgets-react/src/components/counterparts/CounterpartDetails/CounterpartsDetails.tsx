import React from 'react';

import { CounterpartResponse as Counterpart } from '@monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';

import CounterpartsCompany from './CounterpartCompany';
import CounterpartsContact from './CounterpartContact';
import CounterpartsOrganization from './CounterpartOrganization';

import {
  getAddress,
  getFullName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '../helpers';

type CounterpartsDetailsProps = {
  counterPart: Counterpart;
  onEdit: () => void;
};

const CounterpartsDetails = ({
  counterPart,
  onEdit,
}: CounterpartsDetailsProps) => {
  const { t } = useComponentsContext();

  const getCounterpartType = (
    isCustomer: boolean,
    isVendor: boolean
  ): string => {
    if (isCustomer) return t('counterparts:customer');
    if (isVendor) return t('counterparts:vendor');
    return '';
  };

  if (isIndividualCounterpart(counterPart)) {
    const {
      first_name,
      last_name,
      is_customer,
      is_vendor,
      residential_address,
      phone,
      email,
      tax_id,
    } = counterPart.individual;

    return (
      <CounterpartsCompany
        companyName={getFullName(first_name, last_name)}
        type={getCounterpartType(is_customer, is_vendor)}
        address={getAddress(residential_address)}
        phone={phone}
        email={email}
        taxId={tax_id}
        onEdit={onEdit}
      />
    );
  }

  if (isOrganizationCounterpart(counterPart)) {
    const {
      legal_name,
      registered_address,
      vat_number,
      is_customer,
      is_vendor,
      phone,
      email,
      contacts,
    } = counterPart.organization;

    return (
      <CounterpartsOrganization
        company={
          <CounterpartsCompany
            companyName={legal_name}
            type={getCounterpartType(is_customer, is_vendor)}
            address={getAddress(registered_address)}
            phone={phone}
            email={email}
            // todo what is vat_number?
            taxId={vat_number}
            onEdit={onEdit}
          />
        }
        contacts={contacts?.map(
          ({ last_name, first_name, address, email, phone }) => (
            <CounterpartsContact
              key={email}
              fullName={getFullName(first_name, last_name)}
              address={getAddress(address)}
              email={email}
              phone={phone}
            />
          )
        )}
      />
    );
  }

  return null;
};

export default CounterpartsDetails;
