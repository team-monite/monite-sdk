import { CreateReceivablesFormProps } from '../InvoiceDetails/CreateReceivable/validation';
import { components } from '@/api';
import { CreateCounterpartModal } from '@/components/counterparts/components';
import { CustomerType } from '@/components/counterparts/types';
import { CounterpartSelector } from '@/components/receivables/components/CounterpartSelector';
import { EditCounterpartModal } from '@/components/receivables/components/EditCounterpartModal';
import { useCounterpartAddresses, useCounterpartVatList } from '@/core/queries';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface CustomerSectionProps {
  disabled: boolean;
  customerTypes?: CustomerType[];
  isEditModalOpen?: boolean;
  handleEditModal?: (isOpen: boolean) => void;
  counterpart?: components['schemas']['CounterpartResponse'];
}

export const CustomerSection = ({
  disabled,
  customerTypes,
  isEditModalOpen,
  handleEditModal,
  counterpart,
}: CustomerSectionProps) => {
  const { watch, setValue } = useFormContext<CreateReceivablesFormProps>();

  const selectedBillingAddressId = watch('default_billing_address_id');
  const selectedShippingAddressId = watch('default_shipping_address_id');

  const { data: counterpartAddresses } = useCounterpartAddresses(
    counterpart?.id
  );
  const { data: counterpartVats } = useCounterpartVatList(counterpart?.id);

  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [isEditCounterpartOpened, setIsEditCounterpartOpened] =
    useState<boolean>(false);

  useEffect(() => {
    if (!counterpartAddresses?.data?.length) return;

    if (!selectedBillingAddressId) {
      const billingAddressId =
        counterpart?.default_billing_address_id ||
        (counterpartAddresses.data.length === 1
          ? counterpartAddresses.data[0].id
          : '');
      setValue('default_billing_address_id', billingAddressId);
    }

    if (!selectedShippingAddressId) {
      const shippingAddressId = counterpart?.default_shipping_address_id || '';
      setValue('default_shipping_address_id', shippingAddressId);
    }
  }, [
    counterpartAddresses,
    setValue,
    counterpart,
    selectedBillingAddressId,
    selectedShippingAddressId,
  ]);

  useEffect(() => {
    if (counterpartVats && counterpartVats.data.length === 1) {
      setValue('counterpart_vat_id_id', counterpartVats.data[0].id);
    }
  }, [counterpartVats, setValue]);

  return (
    <div className="mtw:w-full">
      <CounterpartSelector
        setIsCreateCounterpartOpened={setIsCreateCounterpartOpened}
        setIsEditCounterpartOpened={setIsEditCounterpartOpened}
        disabled={disabled}
        counterpartAddresses={counterpartAddresses}
      />

      <CreateCounterpartModal
        open={isCreateCounterpartOpened}
        onClose={() => {
          setIsCreateCounterpartOpened(false);
        }}
        onCreate={(newCounterpartId: string) => {
          setValue('counterpart_id', newCounterpartId);
        }}
        customerTypes={customerTypes}
        isInvoiceCreation
      />

      {(isEditModalOpen || isEditCounterpartOpened) && (
        <EditCounterpartModal
          initialCounterpartId={counterpart?.id || ''}
          initialBillingAddressId={selectedBillingAddressId}
          initialShippingAddressId={selectedShippingAddressId}
          disabled={disabled}
          open={isEditModalOpen || isEditCounterpartOpened}
          onClose={() => {
            if (handleEditModal) {
              handleEditModal(false);
            }
            setIsEditCounterpartOpened(false);
          }}
        />
      )}
    </div>
  );
};
