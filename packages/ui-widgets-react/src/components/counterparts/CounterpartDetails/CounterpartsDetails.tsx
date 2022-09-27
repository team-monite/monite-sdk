import React from 'react';
import { Modal } from '@monite/ui-kit-react';

import useCounterpartDetails, {
  COUNTERPART_VIEW,
  CounterpartsDetailsProps,
} from './useCounterpartDetails';

import {
  CounterpartOrganizationForm,
  CounterpartIndividualForm,
} from './CounterpartForm';

import CounterpartView from './CounterpartView';
import CounterpartContactForm from './CounterpartContactForm';
import CounterpartBankForm from './CounterpartBankForm';

const CounterpartsDetails = (props: CounterpartsDetailsProps) => {
  const {
    counterpartId,
    counterpartView,
    onCreate,
    onUpdate,
    onEdit,
    contactId,
    onContactEdit,
    onContactCreate,
    onContactUpdate,
    onContactCancel,
    bankId,
    onBankEdit,
    onBankCreate,
    onBankUpdate,
    onBankCancel,
    actions: { showView, showContactForm, showBankAccountForm },
  } = useCounterpartDetails(props);

  if (!(props.id || props.type)) return null;

  return (
    <Modal onClose={props.onClose} anchor={'right'}>
      {counterpartView === COUNTERPART_VIEW.organizationForm && (
        <CounterpartOrganizationForm
          id={counterpartId}
          onClose={props.onClose}
          onCancel={showView}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}

      {counterpartView === COUNTERPART_VIEW.individualForm && (
        <CounterpartIndividualForm
          id={counterpartId}
          onClose={props.onClose}
          onCancel={showView}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}

      {counterpartId && counterpartView === COUNTERPART_VIEW.contactForm && (
        <CounterpartContactForm
          counterpartId={counterpartId}
          contactId={contactId}
          onCancel={onContactCancel}
          onCreate={onContactCreate}
          onUpdate={onContactUpdate}
        />
      )}

      {counterpartId &&
        counterpartView === COUNTERPART_VIEW.bankAccountForm && (
          <CounterpartBankForm
            counterpartId={counterpartId}
            bankId={bankId}
            onCancel={onBankCancel}
            onCreate={onBankCreate}
            onUpdate={onBankUpdate}
          />
        )}

      {counterpartId && counterpartView === COUNTERPART_VIEW.view && (
        <CounterpartView
          id={counterpartId}
          onEdit={onEdit}
          onContactEdit={onContactEdit}
          onContactCreate={showContactForm}
          onBankEdit={onBankEdit}
          onBankCreate={showBankAccountForm}
          onClose={props.onClose}
        />
      )}
    </Modal>
  );
};

export default CounterpartsDetails;
