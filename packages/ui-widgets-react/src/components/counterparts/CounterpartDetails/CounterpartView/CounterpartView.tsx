import React, { useCallback } from 'react';
import { CounterpartType } from '@monite/sdk-api';
import {
  Button,
  Header,
  IconButton,
  ModalLayout,
  Text,
  UMultiply,
  UPen,
} from '@monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import {
  useCounterpartById,
  useCounterpartContactList,
  useDeleteCounterpartContact,
} from 'core/queries';
import {
  getName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '../../helpers';

import { CounterpartDetailsBlock, CounterpartHeader } from '../styles';

import CounterpartOrganizationView from './CounterpartOrganizationView';
import CounterpartIndividualView from './CounterpartIndividualView';
import CounterpartContactView from './CounterpartContactView';

import { prepareCounterpartIndividual } from '../CounterpartIndividualForm';
import { prepareCounterpartOrganization } from '../CounterpartOrganizationForm';
import { prepareCounterpartContact } from '../CounterpartContactForm';

type CounterpartViewProps = {
  id: string;
  onClose?: () => void;
  onEdit: (type: CounterpartType) => void;
  onDelete?: () => void;
  onContactCreate: () => void;
  onContactEdit: (id: string) => void;
  onContactDelete?: () => void;
};

const CounterpartView = ({
  id,
  onEdit,
  onClose,
  onContactEdit,
  onContactCreate,
  onContactDelete,
}: CounterpartViewProps) => {
  const { t } = useComponentsContext();
  const { data: counterpart } = useCounterpartById(id);
  const { data: contacts } = useCounterpartContactList(id);
  const contactDeleteMutation = useDeleteCounterpartContact(id);

  const deleteContact = useCallback(async () => {
    return await contactDeleteMutation.mutateAsync(id, {
      onSuccess: () => {
        onContactDelete && onContactDelete();
      },
    });
  }, [contactDeleteMutation]);

  if (counterpart) {
    return (
      <ModalLayout
        scrollableContent
        size={'md'}
        isDrawer
        header={
          <CounterpartHeader>
            <Header
              rightBtn={
                <IconButton onClick={onClose} color={'black'}>
                  <UMultiply size={18} />
                </IconButton>
              }
            >
              <Text textSize={'h3'}>{getName(counterpart)}</Text>
            </Header>
          </CounterpartHeader>
        }
      >
        <CounterpartDetailsBlock sx={{ gap: '32px !important', padding: 24 }}>
          {isOrganizationCounterpart(counterpart) && (
            <CounterpartOrganizationView
              actions={
                <>
                  <Button
                    onClick={() => onEdit(counterpart.type)}
                    size={'sm'}
                    variant={'text'}
                    leftIcon={<UPen />}
                  >
                    {t('counterparts:actions.edit')}
                  </Button>
                </>
              }
              counterpart={prepareCounterpartOrganization(
                counterpart.organization
              )}
            />
          )}

          {isIndividualCounterpart(counterpart) && (
            <CounterpartIndividualView
              counterpart={prepareCounterpartIndividual(counterpart.individual)}
              actions={
                <Button
                  onClick={() => onEdit(counterpart.type)}
                  size={'sm'}
                  variant={'text'}
                  leftIcon={<UPen />}
                >
                  {t('counterparts:actions.edit')}
                </Button>
              }
            />
          )}

          {isOrganizationCounterpart(counterpart) && (
            <CounterpartDetailsBlock
              title={t('counterparts:contactPersons')}
              action={
                <Button
                  onClick={() => onContactCreate()}
                  size={'sm'}
                  variant={'text'}
                  leftIcon={<UPen />}
                >
                  {t('counterparts:actions.addContactPerson')}
                </Button>
              }
            >
              {contacts?.map((contact) => (
                <CounterpartContactView
                  key={contact.id}
                  contact={prepareCounterpartContact(contact)}
                  actions={
                    <>
                      <Button
                        onClick={() => onContactEdit(contact.id)}
                        size={'sm'}
                        variant={'text'}
                        leftIcon={<UPen />}
                      >
                        {t('counterparts:actions.edit')}
                      </Button>
                      <Button
                        onClick={deleteContact}
                        size={'sm'}
                        variant={'text'}
                        color={'danger'}
                        leftIcon={<UPen />}
                      >
                        Delete
                      </Button>
                    </>
                  }
                />
              ))}
            </CounterpartDetailsBlock>
          )}
        </CounterpartDetailsBlock>
      </ModalLayout>
    );
  }

  return null;
};

export default CounterpartView;
