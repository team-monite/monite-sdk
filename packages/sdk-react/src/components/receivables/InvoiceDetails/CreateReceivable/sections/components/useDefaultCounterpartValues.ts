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
      const billingAddressId = counterpartAddresses.data[0].id;
      setValue('default_billing_address_id', billingAddressId);

      const shippingAddressId = counterpartAddresses.data[0].id;
      setValue('default_shipping_address_id', shippingAddressId);
    }
  }, [counterpartAddresses, setValue, getValues]);

  useEffect(() => {
    if (counterpartVats && counterpartVats.data.length === 1) {
      setValue('counterpart_vat_id_id', counterpartVats.data[0].id);
    }
  }, [counterpartVats, setValue]);
};
