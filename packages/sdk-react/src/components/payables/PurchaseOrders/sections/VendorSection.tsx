import { VendorSelector } from '../components/VendorSelector';
import { CreatePurchaseOrderFormProps } from '../validation';
import { components } from '@/api';
import { CreateCounterpartModal } from '@/components/counterparts/components';
import { CustomerType } from '@/components/counterparts/types';
import { EditCounterpartModal } from '@/components/receivables/components/EditCounterpartModal';
import { useCounterpartAddresses } from '@/core/queries';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface VendorSectionProps {
  disabled: boolean;
  vendorTypes?: CustomerType[];
  counterpart?: components['schemas']['CounterpartResponse'];
  isEditModalOpen?: boolean;
  isEditProfileOpen?: boolean;
  handleEditModal?: (isOpen: boolean) => void;
  handleEditProfileState?: (isOpen: boolean) => void;
}

export const VendorSection = ({
  disabled,
  vendorTypes,
  counterpart,
  isEditModalOpen,
  isEditProfileOpen,
  handleEditModal,
  handleEditProfileState,
}: VendorSectionProps) => {
  const { watch, setValue } = useFormContext<CreatePurchaseOrderFormProps>();
  const counterpartIdRef = useRef<string | undefined>('');
  const selectedAddressId = watch('counterpart_address_id');

  const { data: counterpartAddresses } = useCounterpartAddresses(
    counterpart?.id
  );

  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [isEditCounterpartOpened, setIsEditCounterpartOpened] =
    useState<boolean>(false);

  useEffect(() => {
    if (!counterpartAddresses?.data?.length) return;

    if (!selectedAddressId) {
      counterpartIdRef.current = counterpart?.id;
      const addressId =
        counterpart?.default_billing_address_id ||
        (counterpartAddresses.data.length === 1
          ? counterpartAddresses.data[0].id
          : '');
      setValue('counterpart_address_id', addressId);
    }

    if (selectedAddressId && counterpartIdRef.current !== counterpart?.id) {
      counterpartIdRef.current = counterpart?.id;
      const addressId =
        counterpart?.default_billing_address_id ||
        (counterpartAddresses.data.length === 1
          ? counterpartAddresses.data[0].id
          : '');
      setValue('counterpart_address_id', addressId);
    }
  }, [counterpartAddresses, setValue, counterpart, selectedAddressId]);

  return (
    <div className="mtw:w-full">
      <VendorSelector
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
        customerTypes={vendorTypes}
        isInvoiceCreation
      />

      {(isEditModalOpen || isEditCounterpartOpened) && (
        <EditCounterpartModal
          initialCounterpartId={counterpart?.id || ''}
          initialBillingAddressId={selectedAddressId as string}
          initialShippingAddressId={selectedAddressId as string}
          disabled={disabled}
          isEditProfileOpen={isEditProfileOpen}
          open={isEditModalOpen || isEditCounterpartOpened}
          onClose={() => {
            if (handleEditModal) {
              handleEditModal(false);
            }

            if (handleEditProfileState) {
              handleEditProfileState(false);
            }

            setIsEditCounterpartOpened(false);
          }}
        />
      )}
    </div>
  );
};
