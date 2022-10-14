import React from 'react';
import {
  LabelText,
  Card,
  Button,
  UPen,
  UTrashAlt,
  useModal,
} from '@team-monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { printAddress } from '../../CounterpartAddressForm';
import { getIndividualName } from '../../../helpers';
import { CounterpartContainer } from '../../styles';

import ConfirmDeleteDialogue from '../../../ConfirmDeleteDialogue';

import { prepareCounterpartContact } from '../../CounterpartContactForm';

import {
  useCounterpartContactView,
  CounterpartContactViewProps,
} from './useCounterpartContactView';

const CounterpartContactView = (props: CounterpartContactViewProps) => {
  const { t } = useComponentsContext();

  const { show, hide, isOpen } = useModal();

  const {
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
  } = prepareCounterpartContact(props.contact);

  const { deleteContact, onEdit, isLoading } = useCounterpartContactView(props);

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
            onClick={show}
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

      {isOpen && (
        <ConfirmDeleteDialogue
          isLoading={isLoading}
          onClose={hide}
          onDelete={deleteContact}
          type={t('counterparts:titles.contact')}
          name={getIndividualName(firstName, lastName)}
        />
      )}
    </Card>
  );
};

export default CounterpartContactView;
