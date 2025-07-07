import { useCallback, useMemo } from 'react';

import { CounterpartVatForm } from '@/components/counterparts/CounterpartDetails/CounterpartVatForm';
import type {
  DefaultValuesOCRIndividual,
  DefaultValuesOCROrganization,
} from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { CircularProgress } from '@mui/material';

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
  const { componentSettings } = useMoniteContext();
  const isInvoiceCreation = props.isInvoiceCreation ?? false;
  const {
    addressId,
    counterpartId,
    counterpartView,
    onCreate,
    onUpdate,
    onEdit,
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

  const { showBankAccounts = true, customerTypes } = props;
  const defaultValues = props.type ? props.defaultValues : undefined;

  const shouldShowCategories = Boolean(
    (customerTypes?.length ?? 0) > 1 ||
      (!customerTypes &&
        (componentSettings?.counterparts?.customerTypes?.length ?? 0) > 1)
  );

  const renderSubResource = useCallback(() => {
    if (!counterpartView || !counterpartId) {
      return <CircularProgress color="inherit" size={20} />;
    }

    switch (counterpartView) {
      case COUNTERPART_VIEW.view:
        return (
          <CounterpartView
            id={counterpartId}
            showCategories={shouldShowCategories}
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
            payableCounterpartRawData={props.payableCounterpartRawData}
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
            payableCounterpartRawData={props.payableCounterpartRawData}
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
    props.payableCounterpartRawData,
    showBankAccountForm,
    showBankAccounts,
    shouldShowCategories,
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
            onClose={props.onClose}
            onCreate={onCreate}
            onReturn={props.onReturn}
            onUpdate={onUpdate}
            isInvoiceCreation={isInvoiceCreation}
            showCategories={shouldShowCategories}
            defaultValues={defaultValues}
            defaultValuesOCR={
              props.defaultValuesOCR as DefaultValuesOCRIndividual
            }
            payableCounterpartRawData={props.payableCounterpartRawData}
          />
        );

      case COUNTERPART_VIEW.organizationForm:
        return (
          <CounterpartOrganizationForm
            id={counterpartId}
            onCancel={showView}
            onClose={props.onClose}
            onCreate={onCreate}
            onReturn={props.onReturn}
            onUpdate={onUpdate}
            isInvoiceCreation={isInvoiceCreation}
            showCategories={shouldShowCategories}
            defaultValues={defaultValues}
            defaultValuesOCR={
              props.defaultValuesOCR as DefaultValuesOCROrganization
            }
            payableCounterpartRawData={props.payableCounterpartRawData}
          />
        );

      default:
        return renderSubResource();
    }
  }, [
    counterpartId,
    counterpartView,
    defaultValues,
    isInvoiceCreation,
    onCreate,
    onUpdate,
    renderSubResource,
    shouldShowCategories,
    showView,
    props.defaultValuesOCR,
    props.payableCounterpartRawData,
    props.onClose,
    props.onReturn,
  ]);
};
