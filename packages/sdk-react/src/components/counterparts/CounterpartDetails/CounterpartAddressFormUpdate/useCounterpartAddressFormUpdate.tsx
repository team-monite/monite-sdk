import {
  CounterpartAddressFormFields,
  prepareCounterpartAddress,
} from '../CounterpartAddressForm';
import { getAddressValidationSchema } from '../CounterpartAddressForm/validation';
import { components } from '@/api';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useUpdateCounterpartAddress,
} from '@/core/queries/useCounterpart';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLingui } from '@lingui/react';
import { useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const { data: address } = useCounterpartAddresses(counterpartId);

  const formRef = useRef<HTMLFormElement>(null);

  const { i18n } = useLingui();
  const methods = useForm<CounterpartAddressFormFields>({
    resolver: zodResolver(z.object(getAddressValidationSchema(i18n))),
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
    counterpart,
    methods,
    formRef,
    submitForm,
    updateAddress,
    isLoading: addressUpdateMutation.isPending || isCounterpartLoading,
  };
}
