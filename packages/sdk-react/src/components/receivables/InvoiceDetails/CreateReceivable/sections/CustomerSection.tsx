import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { CreateCounterpartModal } from '@/components/counterparts/components';
import { CustomerType } from '@/components/counterparts/types';
import { CounterpartSelector } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CounterpartSelector';
import { useCounterpartAddresses } from '@/core/queries';
import { Stack } from '@mui/material';

import { CreateReceivablesFormProps } from '../validation';
import { EditCounterpartModal } from './components/EditCounterpartModal';
import { useDefaultCounterpartValues } from './components/useDefaultCounterpartValues';
import { SectionGeneralProps } from './Section.types';

export interface CustomerSectionProps extends SectionGeneralProps {
  counterpart: components['schemas']['CounterpartResponse'] | undefined;
  counterpartVats:
    | {
        data: components['schemas']['CounterpartVatIDResponse'][];
      }
    | undefined;
  isCounterpartLoading: boolean;
  isCounterpartVatsLoading: boolean;
  customerTypes?: CustomerType[];
}

export const CustomerSection = ({
  counterpart,
  counterpartVats,
  disabled,
  isCounterpartLoading,
  isCounterpartVatsLoading,
  customerTypes,
}: CustomerSectionProps) => {
  const { watch, setValue } = useFormContext<CreateReceivablesFormProps>();

  const counterpartId = watch('counterpart_id');

  const {
    data: counterpartAddresses,
    isLoading: _isCounterpartAddressesLoading,
  } = useCounterpartAddresses(counterpartId);

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

      <EditCounterpartModal
        counterpart={counterpart}
        counterpartVats={counterpartVats}
        isCounterpartLoading={isCounterpartLoading}
        isCounterpartVatsLoading={isCounterpartVatsLoading}
        disabled={disabled}
        open={isEditCounterpartOpened}
        onClose={() => setIsEditCounterpartOpened(false)}
      />
    </Stack>
  );
};
