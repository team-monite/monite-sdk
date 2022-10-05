import React from 'react';
import {
  Button,
  Header,
  IconButton,
  ModalLayout,
  Text,
  UMultiply,
  UPen,
  UTrashAlt,
  UPlusCircle,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';

import {
  getName,
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
import ConfirmDeleteDialogue, {
  useConfirmDeleteDialogue,
} from '../../ConfirmDeleteDialogue';

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

  const { showDialogue, hideDialogue, isDialogueOpen } =
    useConfirmDeleteDialogue();

  const renderTitle = (): string => {
    if (isLoading) return t('counterparts:actions.loading');
    if (counterpartError) return counterpartError.message;
    if (counterpart) return getName(counterpart);
    return '';
  };

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
        {counterpart && isDialogueOpen && (
          <ConfirmDeleteDialogue
            isLoading={isLoading}
            onClose={hideDialogue}
            onDelete={deleteCounterpart}
            type={t('counterparts:titles.counterpart')}
            name={getName(counterpart)}
          />
        )}

        {counterpart && isOrganizationCounterpart(counterpart) && (
          <CounterpartOrganizationView
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
            counterpart={prepareCounterpartOrganization(
              counterpart.organization
            )}
          />
        )}

        {counterpart && isIndividualCounterpart(counterpart) && (
          <CounterpartIndividualView
            counterpart={prepareCounterpartIndividual(counterpart.individual)}
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
