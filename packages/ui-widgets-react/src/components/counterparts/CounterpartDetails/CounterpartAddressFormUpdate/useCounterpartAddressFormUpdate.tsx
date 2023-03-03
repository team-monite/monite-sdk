import { useCallback, useMemo, useRef } from 'react';
import { CounterpartUpdateAddress } from '@team-monite/sdk-api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useComponentsContext } from 'core/context/ComponentsContext';
import {
  useCounterpartAddress,
  useUpdateCounterpartAddress,
} from 'core/queries/useCounterpart';

import getAddressValidationSchema from '../CounterpartAddressForm/validation';
import {
  CounterpartAddressFormFields,
  prepareCounterpartAddress,
} from '../CounterpartAddressForm';

export interface CounterpartAddressFormUpdateProps {
  counterpartId: string;
  addressId: string;
  onUpdate?: (id: string) => void;
  onCancel?: () => void;
}
export default function useCounterpartAddressFormUpdate({
  counterpartId,
  addressId,
  onUpdate,
  onCancel,
}: CounterpartAddressFormUpdateProps) {
  const { t } = useComponentsContext();
  const { data: address } = useCounterpartAddress(counterpartId);

  const formRef = useRef<HTMLFormElement>(null);

  const methods = useForm<CounterpartAddressFormFields>({
    resolver: yupResolver(yup.object().shape(getAddressValidationSchema(t))),
    defaultValues: useMemo(
      () => address && prepareCounterpartAddress(address[0]),
      [address]
    ),
  });

  const addressUpdateMutation = useUpdateCounterpartAddress(
    addressId,
    counterpartId
  );

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const updateAddress = useCallback(
    (payload: CounterpartUpdateAddress) => {
      if (!address) return;

      return addressUpdateMutation.mutate(payload, {
        onSuccess: () => {
          onUpdate && onUpdate(address[0].id);
        },
      });
    },
    [addressUpdateMutation, address, onUpdate]
  );

  return {
    methods,
    formRef,
    submitForm,
    updateAddress,
    isLoading: addressUpdateMutation.isLoading,
  };
}
