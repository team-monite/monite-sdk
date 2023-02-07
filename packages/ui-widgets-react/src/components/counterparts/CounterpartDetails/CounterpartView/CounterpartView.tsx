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
  Loading,
  FlexContainer,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';

import ConfirmDeleteDialogue from '../../ConfirmDeleteDialogue';

import {
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '../../helpers';

import { CounterpartHeader } from '../styles';

import {
  prepareCounterpartIndividual,
  prepareCounterpartOrganization,
} from '../CounterpartForm';

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
    onEdit,
    title,
  } = useCounterpartView(props);

  const { show, hide, isOpen } = useModal();

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
      loading={isLoading && <Loading />}
      header={
        <CounterpartHeader>
          <Header
            rightBtn={
              <IconButton onClick={props.onClose} color={'black'}>
                <UMultiply size={18} />
              </IconButton>
            }
          >
            <Text textSize={'h3'}>{title}</Text>
          </Header>
        </CounterpartHeader>
      }
    >
      <FlexContainer
        flexDirection={'column'}
        position={'relative'}
        gap={32}
        p={24}
      >
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
          <FlexContainer flexDirection={'column'} gap={20}>
            <Text textSize={'h4'}>
              {t('counterparts:titles.contactPersons')}
            </Text>

            {contacts?.map((contact) => (
              <CounterpartContactView
                key={contact.id}
                contact={contact}
                onEdit={props.onContactEdit}
                onDelete={props.onContactDelete}
              />
            ))}

            <Button
              onClick={props.onContactCreate}
              size={'sm'}
              variant={'text'}
              leftIcon={<UPlusCircle />}
            >
              {t('counterparts:actions.addContactPerson')}
            </Button>
          </FlexContainer>
        )}

        {counterpart && props.showBankAccounts && (
          <FlexContainer flexDirection={'column'} gap={20}>
            <Text textSize={'h4'}>{t('counterparts:titles.bankAccounts')}</Text>

            {banks?.map((bank) => (
              <CounterpartBankView
                key={bank.id}
                bank={bank}
                onEdit={props.onBankEdit}
                onDelete={props.onBankDelete}
              />
            ))}

            <Button
              onClick={props.onBankCreate}
              size={'sm'}
              variant={'text'}
              leftIcon={<UPlusCircle />}
            >
              {t('counterparts:actions.addBankAccount')}
            </Button>
          </FlexContainer>
        )}
      </FlexContainer>
    </ModalLayout>
  );
};

export default CounterpartView;
