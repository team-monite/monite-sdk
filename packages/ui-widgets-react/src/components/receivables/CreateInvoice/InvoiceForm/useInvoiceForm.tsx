import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ReceivablesCurrencyEnum,
  ReceivablesProductServiceResponse,
  ReceivablesReceivableFacadeCreateInvoicePayload,
  ReceivablesReceivableFacadeCreatePayload,
} from '@team-monite/sdk-api';

import {
  useCounterpartList,
  useCreateReceivable,
  useMeasureUnits,
  usePaymentTerms,
  useVATRates,
  useCounterpartBankList,
} from 'core/queries';
import { useComponentsContext } from 'core/context/ComponentsContext';
import getValidationSchema from './validation';

type FormFields = {
  customer: { label: string; value: string };
  billingAddress: undefined;
  shippingAddress: undefined;
  purchaseOrder: string;
  message: string;
  termsAndConditions: string;
  paymentTerm: { label: string; value: string };
  bankAccount: { label: string; value: string };
};

export interface SelectedItem extends ReceivablesProductServiceResponse {
  quantity: number;
}

interface Props {
  setIsCreating: (isCreating: boolean) => void;
  onClose: () => void;
}

export default function useInvoiceForm({ setIsCreating, onClose }: Props) {
  const { t, monite } = useComponentsContext();
  const { data: counterparts } = useCounterpartList();
  const { data: paymentTerms } = usePaymentTerms();
  const { data: measureUnits } = useMeasureUnits(monite.entityId);
  const createReceivableMutation = useCreateReceivable();

  const formMethods = useForm<FormFields>({
    resolver: yupResolver(getValidationSchema(t)),
  });
  const { watch } = formMethods;

  const [modalItemsIsOpen, setModalItemsIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  useEffect(() => {
    setIsCreating(createReceivableMutation.isLoading);
  }, [createReceivableMutation.isLoading]);

  const currentCounterpart = watch('customer');

  const { data: counterpartBankAccounts } = useCounterpartBankList(
    currentCounterpart?.value
  );

  const VATRatesQuery = useVATRates(
    !!currentCounterpart?.value,
    currentCounterpart?.value
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce((total, current) => {
        const { price, quantity } = current;
        if (price) return total + quantity * price.value;
        return 0;
      }, 0),
    [selectedItems]
  );
  const totalVAT = 0;
  const total = subtotal + totalVAT;

  const handleDeleteItem = useCallback(
    (id: string) => {
      setSelectedItems(selectedItems.filter((item) => item.id !== id));
    },
    [selectedItems, setSelectedItems]
  );

  const handleItemsSubmit = useCallback(
    (items: ReceivablesProductServiceResponse[]) => {
      const newItems = [...selectedItems];

      items.forEach((item) => {
        const selectedIndex = selectedItems.findIndex((i) => i.id === item.id);
        const newQuantity = item.smallest_amount
          ? Math.ceil(item.smallest_amount)
          : 1;
        if (selectedIndex === -1) {
          newItems.push({ ...item, quantity: newQuantity });
        } else {
          newItems[selectedIndex].quantity++;
        }
      });

      setSelectedItems(newItems);
    },
    [selectedItems, setSelectedItems]
  );

  const onSubmit = useCallback(
    (data: FormFields) => {
      const entityBankAccount = counterpartBankAccounts?.find(
        (account) => account.id === data.bankAccount.value
      );
      const preparedData: ReceivablesReceivableFacadeCreatePayload = {
        type: ReceivablesReceivableFacadeCreateInvoicePayload.type.INVOICE,
        currency:
          selectedItems[0]?.price?.currency || ReceivablesCurrencyEnum.USD, // TODO currency in items could be different
        line_items: selectedItems.map((item) => ({
          quantity: item.quantity,
          product_id: item.id || '',
          vat_rate_id: VATRatesQuery.data?.data[0].id || '', // TODO set real VAT id from select
        })),
        counterpart_id: data.customer.value,
        commercial_condition_description: data.termsAndConditions,
        entity_bank_account:
          entityBankAccount &&
          entityBankAccount.name &&
          entityBankAccount.bic &&
          entityBankAccount.iban
            ? {
                bank_name: entityBankAccount.name,
                bic: entityBankAccount.bic,
                iban: entityBankAccount.iban,
              }
            : undefined,
        memo: data.message,
        counterpart_shipping_address: undefined,
        counterpart_billing_address: undefined,
        payment_terms_id: data.paymentTerm.value,
        purchase_order: data.purchaseOrder,
      };

      createReceivableMutation.mutateAsync(preparedData, {
        onSuccess: () => {
          onClose();
          // TODO update list
        },
      });
    },
    [VATRatesQuery, createReceivableMutation, selectedItems, onClose]
  );

  return {
    formMethods,
    counterparts,
    paymentTerms,
    measureUnits,
    counterpartBankAccounts,
    VATRatesQuery,
    currentCounterpart,
    modalItemsIsOpen,
    setModalItemsIsOpen,
    selectedItems,
    handleDeleteItem,
    subtotal,
    totalVAT,
    total,
    handleItemsSubmit,
    onSubmit,
  };
}
