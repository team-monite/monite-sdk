import React, { ReactNode } from 'react';
import { LabelText, Card } from '@monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { printAddress } from '../../CounterpartAddressForm';
import { CounterpartContactFields } from '../../CounterpartContactForm';
import { getIndividualName } from '../../../helpers';
import { CounterpartContainer } from '../../styles';

type CounterpartContactViewProps = {
  actions: ReactNode;
  contact: CounterpartContactFields;
};

const CounterpartContactView = ({
  actions,
  contact: {
    firstName,
    lastName,
    phone,
    email,
    line1,
    line2,
    postalCode,
    city,
    country,
    state,
  },
}: CounterpartContactViewProps) => {
  const { t } = useComponentsContext();

  return (
    <Card actions={actions}>
      <CounterpartContainer>
        <LabelText
          label={t('counterparts:contact.fullName')}
          text={getIndividualName(firstName, lastName)}
        />
        <LabelText
          label={t('counterparts:contact.address')}
          text={printAddress({
            line1,
            line2,
            postalCode,
            city,
            country,
            state,
          })}
        />
        {phone && (
          <LabelText label={t('counterparts:contact.phone')} text={phone} />
        )}
        {email && (
          <LabelText label={t('counterparts:contact.email')} text={email} />
        )}
      </CounterpartContainer>
    </Card>
  );
};

export default CounterpartContactView;
