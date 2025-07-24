import { prepareCounterpartAddress } from '../CounterpartAddressForm';
import type { CounterpartAddressFormFields } from '../CounterpartAddressForm/validation';
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

export interface CounterpartAddressFormUpdateProps {
  counterpartId: string;
  addressId: string;
  onUpdate?: (id: string) => void;
  onCancel?: () => void | undefined;
  payableCounterpartRawData?: components['schemas']['CounterpartRawData'];
}
export function useCounterpartAddressFormUpdate({
  counterpartId,
  addressId,
  onUpdate,
  payableCounterpartRawData,
}: CounterpartAddressFormUpdateProps) {
  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const { data: address } = useCounterpartAddresses(counterpartId);

  const formRef = useRef<HTMLFormElement>(null);

  const { i18n } = useLingui();
  const methods = useForm<
    CounterpartAddressFormFields,
    any,
    CounterpartAddressFormFields
  >({
    resolver: zodResolver(getAddressValidationSchema(i18n)),
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
    payableCounterpartRawData,
  };
}
