import { useForm } from 'react-hook-form';
import { TFunction } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ReceivablesCurrencyEnum,
  ReceivablesProductServiceResponse,
  ReceivablesReceivableFacadeCreateInvoicePayload,
  ReceivablesReceivableFacadeCreatePayload,
} from '@team-monite/sdk-api';
import {
  useCounterpartBankAccounts,
  useCounterpartList,
  useCreateReceivable,
  useMeasureUnits,
  usePaymentTerms,
  useVATRates,
} from 'core/queries';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { useState } from 'react';

const getValidationSchema = (t: TFunction) =>
  yup
    .object()
    .shape({
      customer: yup
        .object()
        .shape({
          value: yup
            .string()
            .required(`${t('common:customer')}${t('errors:requiredField')}`),
          label: yup.string().required(),
        })
        .required(),
      message: yup
        .string()
        .required(`${t('receivables:message')}${t('errors:requiredField')}`),
      paymentTerm: yup
        .object()
        .shape({
          value: yup
            .string()
            .required(
              `${t('receivables:paymentTerm')}${t('errors:requiredField')}`
            ),
          label: yup.string().required(),
        })
        .required(),
      bankAccount: yup
        .object()
        .shape({
          value: yup
            .string()
            .required(
              `${t('receivables:bankAccount')}${t('errors:requiredField')}`
            ),
          label: yup.string().required(),
        })
        .required(),
    })
    .required();

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
  onClose?: () => void;
}

export default function useInvoiceForm({ onClose }: Props) {
  const { t, monite } = useComponentsContext();
  const { data: counterparts } = useCounterpartList();
  const { data: paymentTerms } = usePaymentTerms(monite.entityId);
  const { data: measureUnits } = useMeasureUnits(monite.entityId);
  const createReceivableMutation = useCreateReceivable();

  const formMethods = useForm<FormFields>({
    resolver: yupResolver(getValidationSchema(t)),
  });
  const { watch } = formMethods;

  const [modalItemsIsOpen, setModalItemsIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const currentCounterpart = watch('customer');

  const { data: counterpartBankAccounts } = useCounterpartBankAccounts(
    !!currentCounterpart?.value,
    currentCounterpart?.value,
    monite.entityId
  );

  const VATRatesQuery = useVATRates(
    !!currentCounterpart?.value,
    currentCounterpart?.value,
    monite.entityId
  );

  const subtotal = selectedItems.reduce((total, current) => {
    const { price, quantity } = current;
    if (price) return total + quantity * price.value;
    return 0;
  }, 0);
  const totalVAT = 0;
  const total = subtotal + totalVAT;

  const handleDeleteItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const handleItemsSubmit = (items: ReceivablesProductServiceResponse[]) => {
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
  };

  const onSubmit = (data: FormFields) => {
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
      entity_bank_account: undefined, // TODO save bank account full object
      memo: data.message,
      counterpart_shipping_address: undefined,
      counterpart_billing_address: undefined,
      payment_terms_id: data.paymentTerm.value,
      purchase_order: data.purchaseOrder,
    };

    createReceivableMutation.mutateAsync(preparedData, {
      onSuccess: () => {
        onClose && onClose();
        // TODO update list
      },
      onError: () => console.log('create fail'), // TODO remove before commit
    });
  };

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
