import { useCallback, useMemo } from 'react';

import { CounterpartVatForm } from '@/components/counterparts/CounterpartDetails/CounterpartVatForm';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';

import { CounterpartAddressFormUpdate } from './CounterpartAddressFormUpdate';
import { CounterpartBankForm } from './CounterpartBankForm';
import { CounterpartContactForm } from './CounterpartContactForm';
import {
  CounterpartIndividualForm,
  CounterpartOrganizationForm,
} from './CounterpartForm';
import { CounterpartView } from './CounterpartView';
import {
  COUNTERPART_VIEW,
  CounterpartsDetailsProps,
  useCounterpartDetails,
} from './useCounterpartDetails';

export const CounterpartDetails = (props: CounterpartsDetailsProps) => (
  <MoniteScopedProviders>
    <CounterpartDetailsBase {...props} />
  </MoniteScopedProviders>
);

const CounterpartDetailsBase = (props: CounterpartsDetailsProps) => {
  const {
    counterpartId,
    counterpartView,
    onCreate,
    onUpdate,
    onEdit,
    addressId,
    onAddressCancel,
    onAddressEdit,
    onAddressUpdate,
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
    vatId,
    onVatEdit,
    onVatCreate,
    onVatUpdate,
    onVatCancel,
    actions: { showView, showContactForm, showBankAccountForm, showVatForm },
  } = useCounterpartDetails(props);

  if (!(props.id || props.type)) {
    throw new Error('CounterpartDetails: `id` or `type` is required');
  }

  const { showCategories = true, showBankAccounts = true } = props;
  const defaultValues = props.type ? props.defaultValues : undefined;

  const renderSubResource = useCallback(() => {
    if (!counterpartId) return null;

    switch (counterpartView) {
      case COUNTERPART_VIEW.view:
        return (
          <CounterpartView
            id={counterpartId}
            showCategories={showCategories}
            showBankAccounts={showBankAccounts}
            onEdit={onEdit}
            onDelete={props.onDelete}
            onAddressEdit={onAddressEdit}
            onContactEdit={onContactEdit}
            onContactCreate={showContactForm}
            onContactDelete={props.onContactDelete}
            onBankEdit={onBankEdit}
            onBankCreate={showBankAccountForm}
            onBankDelete={props.onBankDelete}
            onVatEdit={onVatEdit}
            onVatCreate={showVatForm}
            onVatDelete={props.onVatDelete}
          />
        );

      case COUNTERPART_VIEW.addressForm:
        if (!addressId) return null;

        return (
          <CounterpartAddressFormUpdate
            counterpartId={counterpartId}
            addressId={addressId}
            onCancel={onAddressCancel}
            onUpdate={onAddressUpdate}
          />
        );

      case COUNTERPART_VIEW.contactForm:
        return (
          <CounterpartContactForm
            counterpartId={counterpartId}
            contactId={contactId}
            onCancel={onContactCancel}
            onCreate={onContactCreate}
            onUpdate={onContactUpdate}
          />
        );

      case COUNTERPART_VIEW.vatForm:
        return (
          <CounterpartVatForm
            counterpartId={counterpartId}
            vatId={vatId}
            onCancel={onVatCancel}
            onCreate={onVatCreate}
            onUpdate={onVatUpdate}
          />
        );

      case COUNTERPART_VIEW.bankAccountForm:
        return (
          <CounterpartBankForm
            counterpartId={counterpartId}
            bankId={bankId}
            onCancel={onBankCancel}
            onCreate={onBankCreate}
            onUpdate={onBankUpdate}
          />
        );

      default:
        return null;
    }
  }, [
    addressId,
    bankId,
    contactId,
    counterpartId,
    counterpartView,
    onAddressCancel,
    onAddressEdit,
    onAddressUpdate,
    onBankCancel,
    onBankCreate,
    onBankEdit,
    onBankUpdate,
    onContactCancel,
    onContactCreate,
    onContactEdit,
    onContactUpdate,
    onEdit,
    onVatCancel,
    onVatCreate,
    onVatEdit,
    onVatUpdate,
    props.onBankDelete,
    props.onContactDelete,
    props.onDelete,
    props.onVatDelete,
    showBankAccountForm,
    showBankAccounts,
    showCategories,
    showContactForm,
    showVatForm,
    vatId,
  ]);

  return useMemo(() => {
    switch (counterpartView) {
      case COUNTERPART_VIEW.individualForm:
        return (
          <CounterpartIndividualForm
            id={counterpartId}
            onCancel={showView}
            onCreate={onCreate}
            onUpdate={onUpdate}
            showCategories={showCategories}
            defaultValues={defaultValues}
          />
        );

      case COUNTERPART_VIEW.organizationForm:
        return (
          <CounterpartOrganizationForm
            id={counterpartId}
            onCancel={showView}
            onCreate={onCreate}
            onUpdate={onUpdate}
            showCategories={showCategories}
            defaultValues={defaultValues}
          />
        );

      default:
        return renderSubResource();
    }
  }, [
    counterpartId,
    counterpartView,
    defaultValues,
    onCreate,
    onUpdate,
    renderSubResource,
    showCategories,
    showView,
  ]);
};
