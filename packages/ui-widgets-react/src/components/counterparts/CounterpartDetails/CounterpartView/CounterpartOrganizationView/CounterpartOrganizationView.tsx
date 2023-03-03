import React, { ReactNode } from 'react';
import { LabelText, Card } from '@team-monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { CounterpartOrganizationFields } from '../../CounterpartForm';
import { printCounterpartType } from '../../helpers';
import { CounterpartContainer } from '../../styles';

type CounterpartOrganizationViewProps = {
  actions: ReactNode;
  counterpart: CounterpartOrganizationFields;
};

const CounterpartOrganizationView = ({
  actions,
  counterpart: { companyName, phone, email, isVendor, isCustomer },
}: CounterpartOrganizationViewProps) => {
  const { t } = useComponentsContext();

  return (
    <Card actions={actions}>
      <CounterpartContainer>
        <LabelText
          label={t('counterparts:organization.companyName')}
          text={companyName}
        />
        <LabelText
          label={t('counterparts:columns.type')}
          text={printCounterpartType(
            isCustomer ? t('counterparts:customer') : undefined,
            isVendor ? t('counterparts:vendor') : undefined
          )}
        />
        {phone && (
          <LabelText
            label={t('counterparts:organization.phone')}
            text={phone}
          />
        )}
        {email && (
          <LabelText
            label={t('counterparts:organization.email')}
            text={email}
          />
        )}
      </CounterpartContainer>
    </Card>
  );
};

export default CounterpartOrganizationView;
