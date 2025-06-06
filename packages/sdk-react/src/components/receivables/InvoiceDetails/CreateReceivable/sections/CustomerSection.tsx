import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { CreateCounterpartModal } from '@/components/counterparts/components';
import { CustomerType } from '@/components/counterparts/types';
import { CounterpartSelector } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CounterpartSelector';
import { useCounterpartAddresses, useCounterpartVatList } from '@/core/queries';
import { Stack } from '@mui/material';

import { CreateReceivablesFormProps } from '../validation';
import { EditCounterpartModal } from './components/EditCounterpartModal';
import { useDefaultCounterpartValues } from './components/useDefaultCounterpartValues';

export interface CustomerSectionProps {
  disabled: boolean;
  customerTypes?: CustomerType[];
  isEditModalOpen?: boolean;
  handleEditModal?: (isOpen: boolean) => void;
}

export const CustomerSection = ({
  disabled,
  customerTypes,
  isEditModalOpen,
  handleEditModal,
}: CustomerSectionProps) => {
  const { watch, setValue } = useFormContext<CreateReceivablesFormProps>();

  const counterpartId = watch('counterpart_id');

  const { data: counterpartAddresses } = useCounterpartAddresses(counterpartId);
  const { data: counterpartVats } = useCounterpartVatList(counterpartId);

  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [isEditCounterpartOpened, setIsEditCounterpartOpened] =
    useState<boolean>(false);

  const className = 'Monite-CreateReceivable-CustomerSection';

  useDefaultCounterpartValues({ counterpartAddresses, counterpartVats });

  return (
    <Stack spacing={2} className={className}>
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
          initialCounterpartId={counterpartId}
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
    </Stack>
  );
};
