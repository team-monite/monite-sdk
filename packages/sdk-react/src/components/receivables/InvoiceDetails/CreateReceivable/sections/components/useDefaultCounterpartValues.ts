import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '../../validation';

interface DefaultValuesProps {
  counterpartAddresses?: { data: { id: string }[] };
  counterpartVats?: { data: { id: string }[] };
}

export const useDefaultCounterpartValues = ({
  counterpartAddresses,
  counterpartVats,
}: DefaultValuesProps) => {
  const { setValue } = useFormContext<CreateReceivablesFormProps>();

  useEffect(() => {
    if (counterpartAddresses && counterpartAddresses.data.length === 1) {
      const id = counterpartAddresses.data[0].id;
      setValue('default_shipping_address_id', id);
      setValue('default_billing_address_id', id);
    }
  }, [counterpartAddresses, setValue]);

  useEffect(() => {
    if (counterpartVats && counterpartVats.data.length === 1) {
      setValue('counterpart_vat_id_id', counterpartVats.data[0].id);
    }
  }, [counterpartVats, setValue]);
};
