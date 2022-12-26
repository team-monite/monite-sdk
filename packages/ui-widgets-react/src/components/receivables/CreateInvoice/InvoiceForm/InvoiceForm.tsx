import React from 'react';
import { Controller, ControllerFieldState } from 'react-hook-form';

import {
  Box,
  Button,
  DropdownMenuItem,
  Flex,
  Input,
  List,
  ListItem,
  Select,
  Spinner,
  Text,
} from '@team-monite/ui-kit-react';

import { useComponentsContext } from 'core/context/ComponentsContext';
import { counterpartsToSelect } from '../../../payables/PayableDetails/PayableDetailsForm/helpers';
import useInvoiceForm, { SelectedItem } from './useInvoiceForm';
import AddItemsModal from '../AddItemsModal';
import {
  StyledCard,
  StyledItemsCard,
  FormItem,
  StyledItemsTable,
  ItemsTableError,
} from '../CreateInvoiceStyle';
import { currencyFormatter } from '../helpers';

interface Props {
  setIsCreating: (isCreating: boolean) => void;
  onClose: () => void;
}

// TODO remove formatter with hardcoded currency
const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const InvoiceForm = ({ setIsCreating, onClose }: Props) => {
  const { t } = useComponentsContext();
  const {
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
  } = useInvoiceForm({ setIsCreating, onClose });
  const { control, handleSubmit } = formMethods;

  return (
    <>
      <form id="createInvoice" onSubmit={handleSubmit(onSubmit)}>
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
                      options={counterpartsToSelect(counterparts?.data)}
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
                      options={paymentTerms?.data?.map((item) => ({
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
                      options={counterpartBankAccounts?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
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
                    dataIndex: 'measure_unit_id',
                    key: 'measure_unit_id',
                    title: t('receivables:itemsColumns.unit'),
                    render: (value) => {
                      const currentMeasureUnit = measureUnits?.data.find(
                        (measureUnit) => measureUnit.id === value
                      );

                      return currentMeasureUnit?.name || null;
                    },
                  },
                  {
                    dataIndex: 'vat',
                    key: 'vat',
                    title: t('receivables:itemsColumns.VAT'),
                    render: () => {
                      if (VATRatesQuery.isLoading)
                        return <Spinner pxSize={16} />;
                      if (!currentCounterpart)
                        return (
                          <ItemsTableError sx={{ whiteSpace: 'break-spaces' }}>
                            {t('receivables:errors.selectCounterpart')}
                          </ItemsTableError>
                        );

                      if (
                        !VATRatesQuery.data ||
                        VATRatesQuery.data.data.length === 0
                      )
                        return '—';

                      return VATRatesQuery.data.data[0].value;
                    },
                  },
                  {
                    dataIndex: 'price',
                    key: 'price',
                    title: t('receivables:itemsColumns.cost'),
                    render: (price) => {
                      if (price)
                        return currencyFormatter(price.currency).format(
                          price.value
                        );

                      return null;
                    },
                  },
                  {
                    dataIndex: 'total',
                    key: 'total',
                    title: t('receivables:itemsColumns.total'),
                    render: (_, record) => {
                      const { price, quantity } = record as SelectedItem;

                      if (price?.value && quantity)
                        return currencyFormatter(price.currency).format(
                          price?.value * quantity
                        );

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
        <Box mb={40}>
          <List>
            <ListItem>
              <Flex justifyContent="space-between">
                <span>{t('receivables:subtotal')}</span>
                <span>{formatter.format(subtotal)}</span>
              </Flex>
            </ListItem>
            <ListItem>
              <Flex justifyContent="space-between">
                <span>{t('receivables:totalVAT')}</span>
                <span>{formatter.format(totalVAT)}</span>
              </Flex>
            </ListItem>
            <ListItem>
              <Flex justifyContent="space-between" alignItems="center">
                <span>{t('receivables:total')}</span>
                <Text textSize="h3">{formatter.format(total)}</Text>
              </Flex>
            </ListItem>
          </List>
        </Box>
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
