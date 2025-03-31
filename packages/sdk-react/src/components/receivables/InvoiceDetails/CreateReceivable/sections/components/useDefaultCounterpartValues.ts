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
  const { setValue, getValues } = useFormContext<CreateReceivablesFormProps>();

  useEffect(() => {
    if (counterpartAddresses && counterpartAddresses.data.length > 0) {
      const currentBillingAddress = getValues('default_billing_address_id');
      const currentShippingAddress = getValues('default_shipping_address_id');

      if (!currentBillingAddress) {
        const id = counterpartAddresses.data[0].id;
        setValue('default_billing_address_id', id);
      }

      if (!currentShippingAddress) {
        const id = counterpartAddresses.data[0].id;
        setValue('default_shipping_address_id', id);
      }
    }
  }, [counterpartAddresses, setValue, getValues]);

  useEffect(() => {
    if (counterpartVats && counterpartVats.data.length === 1) {
      setValue('counterpart_vat_id_id', counterpartVats.data[0].id);
    }
  }, [counterpartVats, setValue]);
};
