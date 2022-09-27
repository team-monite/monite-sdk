import React, { ReactNode } from 'react';
import { LabelText, Card } from '@monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { CounterpartIndividualFields } from '../../CounterpartIndividualForm';
import { printAddress } from '../../CounterpartAddressForm';
import { printCounterpartType } from '../../helpers';
import { getIndividualName } from '../../../helpers';
import { CounterpartContainer } from '../../styles';

type CounterpartIndividualViewProps = {
  actions: ReactNode;
  counterpart: CounterpartIndividualFields;
};

const CounterpartIndividualView = ({
  actions,
  counterpart: {
    firstName,
    lastName,
    phone,
    email,
    taxId,
    line1,
    line2,
    postalCode,
    city,
    country,
    state,
    isVendor,
    isCustomer,
  },
}: CounterpartIndividualViewProps) => {
  const { t } = useComponentsContext();

  return (
    <Card actions={actions}>
      <CounterpartContainer>
        <LabelText
          label={t('counterparts:individual.fullName')}
          text={getIndividualName(firstName, lastName)}
        />
        <LabelText
          label={t('counterparts:columns.type')}
          text={printCounterpartType(
            isCustomer ? t('counterparts:customer') : undefined,
            isVendor ? t('counterparts:vendor') : undefined
          )}
        />
        <LabelText
          label={t('counterparts:individual.address')}
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
          <LabelText label={t('counterparts:individual.phone')} text={phone} />
        )}
        {email && (
          <LabelText label={t('counterparts:individual.email')} text={email} />
        )}
        {taxId && (
          <LabelText label={t('counterparts:individual.taxId')} text={taxId} />
        )}
      </CounterpartContainer>
    </Card>
  );
};

export default CounterpartIndividualView;
