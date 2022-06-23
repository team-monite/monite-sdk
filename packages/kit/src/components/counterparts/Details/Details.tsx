import React from 'react';

import { CounterpartResponse as Counterpart } from '@monite/js-sdk';

import CounterPartCompany from './CounterPartCompany';
import CounterPartContact from './CounterPartContact';

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
  if (isIndividualCounterpart(counterPart)) {
    const {
      first_name,
      last_name,
      is_customer,
      residential_address,
      phone,
      email,
      tax_id,
    } = counterPart.individual;

    return (
      <CounterPartCompany
        companyName={getFullName(first_name, last_name)}
        type={is_customer ? 'Customer' : 'Not a customer'}
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
      phone,
      email,
      contacts,
    } = counterPart.organization;

    return (
      <>
        <CounterPartCompany
          companyName={legal_name}
          type={is_customer ? 'Customer' : 'Not a customer'}
          address={getAddress(registered_address)}
          phone={phone}
          email={email}
          // todo what is vat_number?
          taxId={vat_number}
          onEdit={onEdit}
        />

        {contacts.length > 0 && <h1>Contact persons</h1>}

        {contacts.map(({ last_name, first_name, address, email, phone }) => (
          <CounterPartContact
            fullName={getFullName(first_name, last_name)}
            address={getAddress(address)}
            email={email}
            phone={phone}
          />
        ))}
      </>
    );
  }

  return null;
};

export default CounterpartsDetails;
