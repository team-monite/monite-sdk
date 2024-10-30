import { useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import {
  useCounterpartAddresses,
  useUpdateCounterpartAddress,
} from '@/core/queries/useCounterpart';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';

import * as yup from 'yup';

import {
  CounterpartAddressFormFields,
  prepareCounterpartAddress,
} from '../CounterpartAddressForm';
import { getAddressValidationSchema } from '../CounterpartAddressForm/validation';

export interface CounterpartAddressFormUpdateProps {
  counterpartId: string;
  addressId: string;
  onUpdate?: (id: string) => void;
  onCancel?: () => void | undefined;
}
export function useCounterpartAddressFormUpdate({
  counterpartId,
  addressId,
  onUpdate,
}: CounterpartAddressFormUpdateProps) {
  const { data: address } = useCounterpartAddresses(counterpartId);

  const formRef = useRef<HTMLFormElement>(null);

  const { i18n } = useLingui();
  const methods = useForm<CounterpartAddressFormFields>({
    resolver: yupResolver(yup.object().shape(getAddressValidationSchema(i18n))),
    defaultValues: useMemo(
      () => address && prepareCounterpartAddress(address.data[0]),
      [address]
    ),
  });

  const addressUpdateMutation = useUpdateCounterpartAddress({
    counterpartId,
    addressId,
  });

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const updateAddress = useCallback(
    (payload: components['schemas']['CounterpartUpdateAddress']) => {
      if (!address) return;

      return addressUpdateMutation.mutate(payload, {
        onSuccess: () => {
          onUpdate?.(addressId);
        },
      });
    },
    [address, addressUpdateMutation, onUpdate, addressId]
  );

  return {
    methods,
    formRef,
    submitForm,
    updateAddress,
    isLoading: addressUpdateMutation.isPending,
  };
}
