import React from 'react';
import { Button, Card, LabelText, UPen } from '@team-monite/ui-kit-react';

import { CounterpartContainer } from '../../styles';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { countries } from 'core/utils/countries';

import useCounterpartAddressView, {
  CounterpartAddressViewProps,
} from './useCounterpartAddressView';

const CounterpartAddressView = (props: CounterpartAddressViewProps) => {
  const { t } = useComponentsContext();
  const { onEdit } = useCounterpartAddressView(props);

  const { line1, line2, city, postal_code, state, country } = props.address;

  return (
    <Card
      actions={
        <>
          <Button
            onClick={onEdit}
            size={'sm'}
            variant={'text'}
            leftIcon={<UPen />}
          >
            {t('counterparts:actions.edit')}
          </Button>
        </>
      }
    >
      <CounterpartContainer>
        {line1 && (
          <LabelText label={t('counterparts:address.line1')} text={line1} />
        )}
        {line2 && (
          <LabelText label={t('counterparts:address.line2')} text={line2} />
        )}
        {city && (
          <LabelText label={t('counterparts:address.city')} text={city} />
        )}
        {postal_code && (
          <LabelText
            label={t('counterparts:address.postalCode')}
            text={postal_code}
          />
        )}
        {state && (
          <LabelText
            label={t('counterparts:address.stateShort')}
            text={state}
          />
        )}
        {country && (
          <LabelText
            label={t('counterparts:address.country')}
            text={countries[country]}
          />
        )}
      </CounterpartContainer>
    </Card>
  );
};

export default CounterpartAddressView;
