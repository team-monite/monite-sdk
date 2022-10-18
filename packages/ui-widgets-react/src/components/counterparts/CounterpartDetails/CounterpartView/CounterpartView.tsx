import React from 'react';
import {
  Button,
  Header,
  IconButton,
  ModalLayout,
  useModal,
  Text,
  UMultiply,
  UPen,
  UTrashAlt,
  UPlusCircle,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';

import ConfirmDeleteDialogue from '../../ConfirmDeleteDialogue';

import {
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '../../helpers';

import { CounterpartDetailsBlock, CounterpartHeader } from '../styles';

import {
  prepareCounterpartIndividual,
  prepareCounterpartOrganization,
} from '../CounterpartForm';
import { CounterpartDetailsLoading } from '../styles/CounterpartDetailsLoading';

import CounterpartOrganizationView from './CounterpartOrganizationView';
import CounterpartIndividualView from './CounterpartIndividualView';
import CounterpartContactView from './CounterpartContactView';
import CounterpartBankView from './CounterpartBankView';
import useCounterpartView, { CounterpartViewProps } from './useCounterpartView';

const CounterpartView = (props: CounterpartViewProps) => {
  const { t } = useComponentsContext();
  const {
    counterpart,
    banks,
    contacts,
    deleteCounterpart,
    isLoading,
    counterpartError,
    onEdit,
  } = useCounterpartView(props);

  const { show, hide, isOpen } = useModal();

  const renderTitle = (): string => {
    if (isLoading) return t('counterparts:actions.loading');
    if (counterpartError) return counterpartError.message;
    if (counterpart) return getCounterpartName(counterpart);
    return '';
  };

  const actions = (
    <>
      <Button onClick={onEdit} size={'sm'} variant={'text'} leftIcon={<UPen />}>
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
  );

  return (
    <ModalLayout
      scrollableContent
      size={'md'}
      isDrawer
      loading={isLoading && <CounterpartDetailsLoading />}
      header={
        <CounterpartHeader>
          <Header
            rightBtn={
              <IconButton onClick={props.onClose} color={'black'}>
                <UMultiply size={18} />
              </IconButton>
            }
          >
            <Text textSize={'h3'}>{renderTitle()}</Text>
          </Header>
        </CounterpartHeader>
      }
    >
      <CounterpartDetailsBlock sx={{ gap: '32px !important', padding: 24 }}>
        {counterpart && isOpen && (
          <ConfirmDeleteDialogue
            isLoading={isLoading}
            onClose={hide}
            onDelete={deleteCounterpart}
            type={t('counterparts:titles.counterpart')}
            name={getCounterpartName(counterpart)}
          />
        )}

        {counterpart && isOrganizationCounterpart(counterpart) && (
          <CounterpartOrganizationView
            actions={actions}
            counterpart={prepareCounterpartOrganization(
              counterpart.organization
            )}
          />
        )}

        {counterpart && isIndividualCounterpart(counterpart) && (
          <CounterpartIndividualView
            actions={actions}
            counterpart={prepareCounterpartIndividual(counterpart.individual)}
          />
        )}

        {counterpart && isOrganizationCounterpart(counterpart) && (
          <CounterpartDetailsBlock
            title={t('counterparts:contactPersons')}
            action={
              <Button
                onClick={props.onContactCreate}
                size={'sm'}
                variant={'text'}
                leftIcon={<UPlusCircle />}
              >
                {t('counterparts:actions.addContactPerson')}
              </Button>
            }
          >
            {contacts?.map((contact) => (
              <CounterpartContactView
                key={contact.id}
                contact={contact}
                onEdit={props.onContactEdit}
                onDelete={props.onContactDelete}
              />
            ))}
          </CounterpartDetailsBlock>
        )}

        {counterpart && (
          <CounterpartDetailsBlock
            title={t('counterparts:bankAccounts')}
            action={
              <Button
                onClick={props.onBankCreate}
                size={'sm'}
                variant={'text'}
                leftIcon={<UPlusCircle />}
              >
                {t('counterparts:actions.addBankAccount')}
              </Button>
            }
          >
            {banks?.map((bank) => (
              <CounterpartBankView
                key={bank.id}
                bank={bank}
                onEdit={props.onBankEdit}
                onDelete={props.onBankDelete}
              />
            ))}
          </CounterpartDetailsBlock>
        )}
      </CounterpartDetailsBlock>
    </ModalLayout>
  );
};

export default CounterpartView;
