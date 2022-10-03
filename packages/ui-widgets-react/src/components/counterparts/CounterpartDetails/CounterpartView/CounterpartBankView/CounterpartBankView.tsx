import React from 'react';
import {
  LabelText,
  Card,
  Button,
  UPen,
  UTrashAlt,
} from '@team-monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';

import ConfirmDeleteDialogue, {
  useConfirmDeleteDialogue,
} from '../../../ConfirmDeleteDialogue';

import { CounterpartContainer } from '../../styles';

import useCounterpartBankView, {
  CounterpartBankViewProps,
} from './useCounterpartBankView';

const CounterpartBankView = (props: CounterpartBankViewProps) => {
  const { t } = useComponentsContext();
  const { deleteBank, onEdit, isLoading } = useCounterpartBankView(props);

  const { showDialogue, hideDialogue, isDialogueOpen } =
    useConfirmDeleteDialogue();

  const {
    bank: { name, bic, iban },
  } = props;

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
          <Button
            onClick={showDialogue}
            size={'sm'}
            variant={'text'}
            color={'danger'}
            leftIcon={<UTrashAlt />}
          >
            {t('counterparts:actions.delete')}
          </Button>
        </>
      }
    >
      <CounterpartContainer>
        {name && <LabelText label={t('counterparts:bank.name')} text={name} />}
        {bic && <LabelText label={t('counterparts:bank.bic')} text={bic} />}
        {iban && <LabelText label={t('counterparts:bank.iban')} text={iban} />}
      </CounterpartContainer>

      {isDialogueOpen && (
        <ConfirmDeleteDialogue
          isLoading={isLoading}
          onClose={hideDialogue}
          onDelete={deleteBank}
          type={t('counterparts:titles.bank')}
          name={name ? name : ''}
        />
      )}
    </Card>
  );
};

export default CounterpartBankView;
