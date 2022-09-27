import React, { ReactNode } from 'react';
import { LabelText, Card } from '@monite/ui-kit-react';
import { CounterpartBankAccountResponse } from '@monite/sdk-api';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { CounterpartContainer } from '../../styles';

type CounterpartBankViewProps = {
  actions: ReactNode;
  bank: CounterpartBankAccountResponse;
};

const CounterpartBankView = ({
  actions,
  bank: { name, bic, iban },
}: CounterpartBankViewProps) => {
  const { t } = useComponentsContext();

  return (
    <Card actions={actions}>
      <CounterpartContainer>
        {name && <LabelText label={t('counterparts:bank.name')} text={name} />}
        {bic && <LabelText label={t('counterparts:bank.bic')} text={bic} />}
        {iban && <LabelText label={t('counterparts:bank.iban')} text={iban} />}
      </CounterpartContainer>
    </Card>
  );
};

export default CounterpartBankView;
