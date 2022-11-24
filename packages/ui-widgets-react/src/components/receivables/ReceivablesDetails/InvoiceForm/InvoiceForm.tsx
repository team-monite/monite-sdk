import React, { useState } from 'react';
import { Controller, ControllerFieldState, useForm } from 'react-hook-form';
import { TFunction } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ReceivablesProductServiceResponse,
  ReceivablesReceivableFacadeCreatePayload,
  ReceivablesReceivableFacadeCreateInvoicePayload,
  ReceivablesCurrencyEnum,
} from '@team-monite/sdk-api';
import {
  Box,
  Button,
  DropdownMenuItem,
  Flex,
  Input,
  List,
  ListItem,
  Select,
  Text,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';
import {
  useCounterpartList,
  usePaymentTerms,
  useCounterpartBankAccounts,
  useCreateReceivable,
} from 'core/queries';
import { counterpartsToSelect } from '../../../payables/PayableDetails/PayableDetailsForm/helpers';
import AddItemsModal from '../AddItemsModal';
import {
  StyledCard,
  StyledItemsCard,
  FormItem,
  StyledItemsTable,
} from '../ReceivablesDetailsStyle';

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

interface SelectedItem extends ReceivablesProductServiceResponse {
  quantity: number;
}

const InvoiceForm = () => {
  const { t, monite } = useComponentsContext();
  const counterpartQuery = useCounterpartList();
  const paymentTermsQuery = usePaymentTerms(monite.entityId);
  const createReceivableMutation = useCreateReceivable();

  const [modalItemsIsOpen, setModalItemsIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const { control, watch, handleSubmit } = useForm<FormFields>({
    resolver: yupResolver(getValidationSchema(t)),
  });
  const currentCounterpart = watch('customer');

  const counterpartBankAccountsQuery = useCounterpartBankAccounts(
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

  // TODO create real methods
  const onSubmit = (data: FormFields) => {
    const preparedData: ReceivablesReceivableFacadeCreatePayload = {
      ...data,
      counterpart_id: data.customer.value,
      type: ReceivablesReceivableFacadeCreateInvoicePayload.type.INVOICE,
      currency: ReceivablesCurrencyEnum.USD, // TODO set currency from Items
      line_items: selectedItems.map((item) => ({
        quantity: item.quantity,
        product_id: item.id || '',
        vat_rate_id: '8d4c2c10-f7d7-4d7c-a1f5-5f3a9d56371e', // TODO set real VAT id
      })),
    };

    createReceivableMutation.mutateAsync(preparedData, {
      onSuccess: () => console.log('create ok'),
      onError: () => console.log('create fail'),
    });
  };
  const onError = (errors: any) => console.error(errors);

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

  return (
    <>
      <form id="createInvoice" onSubmit={handleSubmit(onSubmit, onError)}>
        <Box mb={16}>
          <Text textSize="h3">{t('receivables:details')}</Text>
        </Box>
        <StyledCard>
          <Flex sx={{ gap: 24 }}>
            <Box width={1 / 2} minWidth={300}>
              <Controller
                name="customer"
                control={control}
                render={({
                  field,
                  fieldState: { error },
                }: any & {
                  fieldState: {
                    error: ControllerFieldState & {
                      value?: { message?: string };
                      label?: { message?: string };
                    };
                  };
                }) => (
                  <FormItem
                    id={field.name}
                    label={t('common:customer')}
                    required
                    error={error?.value?.message || error?.label?.message}
                  >
                    <Select
                      {...field}
                      options={counterpartsToSelect(
                        counterpartQuery?.data?.data
                      )}
                      isInvalid={!!error}
                    />
                  </FormItem>
                )}
              />
            </Box>
            <Box width={1 / 2} />
          </Flex>
          <Flex sx={{ gap: 24 }}>
            <Box width={1 / 2}>
              <Controller
                name="billingAddress"
                control={control}
                render={({ field }) => (
                  <FormItem
                    id={field.name}
                    label={t('receivables:billingAddress')}
                  >
                    <Select {...field} options={[]} />
                  </FormItem>
                )}
              />
            </Box>
            <Box width={1 / 2}>
              <Controller
                name="shippingAddress"
                control={control}
                render={({ field }) => (
                  <FormItem
                    id={field.name}
                    label={t('receivables:shippingAddress')}
                  >
                    <Select {...field} options={[]} />
                  </FormItem>
                )}
              />
            </Box>
          </Flex>
          <Flex sx={{ gap: 24 }}>
            <Box width={1 / 2} minWidth={300}>
              <Controller
                name="purchaseOrder"
                control={control}
                render={({ field }) => (
                  <FormItem
                    id={field.name}
                    label={t('receivables:purchaseOrder')}
                  >
                    <Input {...field} id={field.name} />
                  </FormItem>
                )}
              />
            </Box>
            <Box width={1 / 2} />
          </Flex>
          <Controller
            name="message"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormItem
                id={field.name}
                label={t('receivables:message')}
                required
                error={error?.message}
              >
                <Input
                  {...field}
                  id={field.name}
                  textarea
                  rows={5}
                  error={error?.message}
                  isInvalid={!!error}
                />
              </FormItem>
            )}
          />
          <Controller
            name="termsAndConditions"
            control={control}
            render={({ field }) => (
              <FormItem
                id={field.name}
                label={t('receivables:termsAndConditions')}
              >
                <Input {...field} id={field.name} textarea rows={5} />
              </FormItem>
            )}
          />
        </StyledCard>
        <Box mb={16}>
          <Text textSize="h3">{t('receivables:payment')}</Text>
        </Box>
        <StyledCard>
          <Flex sx={{ gap: 24 }}>
            <Box width={1 / 2}>
              <Controller
                name="paymentTerm"
                control={control}
                render={({
                  field,
                  fieldState: { error },
                }: any & {
                  fieldState: {
                    error: ControllerFieldState & {
                      value?: { message?: string };
                      label?: { message?: string };
                    };
                  };
                }) => (
                  <FormItem
                    id={field.name}
                    label={t('receivables:paymentTerm')}
                    required
                    error={error?.value?.message || error?.label?.message}
                  >
                    <Select
                      {...field}
                      options={paymentTermsQuery.data?.data?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      isInvalid={!!error}
                    />
                  </FormItem>
                )}
              />
            </Box>
            <Box width={1 / 2}>
              <Controller
                name="bankAccount"
                control={control}
                render={({
                  field,
                  fieldState: { error },
                }: any & {
                  fieldState: {
                    error: ControllerFieldState & {
                      value?: { message?: string };
                      label?: { message?: string };
                    };
                  };
                }) => (
                  <FormItem
                    id={field.name}
                    label={t('receivables:bankAccount')}
                    required
                    error={error?.value?.message || error?.label?.message}
                  >
                    <Select
                      {...field}
                      options={counterpartBankAccountsQuery.data?.data?.map(
                        (item) => ({
                          label: item.name,
                          value: item.id,
                        })
                      )}
                      isInvalid={!!error}
                    />
                  </FormItem>
                )}
              />
            </Box>
          </Flex>
        </StyledCard>
        <Box mb={16}>
          <Text textSize="h3">{t('receivables:items')}</Text>
        </Box>
        <StyledItemsCard>
          <Box mb={16}>
            {selectedItems.length ? (
              <StyledItemsTable
                columns={[
                  {
                    dataIndex: 'name',
                    key: 'name',
                    title: t('receivables:itemsColumns.itemName'),
                  },
                  {
                    dataIndex: 'quantity',
                    key: 'quantity',
                    title: t('receivables:itemsColumns.amount'),
                    render: (value) => value,
                  },
                  {
                    dataIndex: 'unit',
                    key: 'unit',
                    title: t('receivables:itemsColumns.unit'),
                  },
                  {
                    dataIndex: 'vat',
                    key: 'vat',
                    title: t('receivables:itemsColumns.VAT'),
                  },
                  {
                    dataIndex: 'price',
                    key: 'price',
                    title: t('receivables:itemsColumns.cost'),
                    render: (price) => `${price.value} ${price.currency}`,
                  },
                  {
                    dataIndex: 'total',
                    key: 'total',
                    title: t('receivables:itemsColumns.total'),
                    render: (_, record) => {
                      const { price, quantity } = record as SelectedItem;

                      if (price?.value && quantity)
                        return `${price?.value * quantity} ${price.currency}`;

                      return null;
                    },
                  },
                ]}
                data={selectedItems}
                renderDropdownActions={(record: SelectedItem) => (
                  <>
                    <DropdownMenuItem
                      onClick={() => record.id && handleDeleteItem(record.id)}
                    >
                      {t('common:delete')}
                    </DropdownMenuItem>
                  </>
                )}
              />
            ) : null}
            <Button variant="text" onClick={() => setModalItemsIsOpen(true)}>
              {t('receivables:addNewItem')}
            </Button>
          </Box>
        </StyledItemsCard>
        <Box mb={16}>
          <Text textSize="h3">{t('receivables:total')}</Text>
        </Box>
        <List>
          <ListItem>
            <Flex justifyContent="space-between">
              <span>{t('receivables:subtotal')}</span>
              <span>{`${subtotal} EUR`}</span>
            </Flex>
          </ListItem>
          <ListItem>
            <Flex justifyContent="space-between">
              <span>{t('receivables:totalVAT')}</span>
              <span>{`${totalVAT} EUR`}</span>
            </Flex>
          </ListItem>
          <ListItem>
            <Flex justifyContent="space-between">
              <span>{t('receivables:total')}</span>
              <span>{`${total} EUR`}</span>
            </Flex>
          </ListItem>
        </List>
      </form>
      {modalItemsIsOpen && (
        <AddItemsModal
          onSubmit={handleItemsSubmit}
          onClose={() => setModalItemsIsOpen(false)}
        />
      )}
    </>
  );
};

export default InvoiceForm;
