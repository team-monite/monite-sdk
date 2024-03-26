import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import {
  useCounterpartById,
  useCounterpartContactById,
  useCreateCounterpartContact,
  useUpdateCounterpartContact,
} from '@/core/queries/useCounterpart';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLingui } from '@lingui/react';
import {
  CounterpartOrganizationRootResponse,
  CreateCounterpartContactPayload,
  UpdateCounterpartContactPayload,
} from '@monite/sdk-api';

import {
  CounterpartContactFields,
  prepareCounterpartContact,
  prepareCounterpartContactSubmit,
} from './mapper';
import { getValidationSchema } from './validation';

export type CounterpartContactFormProps = {
  counterpartId: string;
  contactId?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
};

export function useCounterpartContactForm({
  counterpartId,
  contactId,
  onCreate,
  onUpdate,
}: CounterpartContactFormProps) {
  const { i18n } = useLingui();
  const formRef = useRef<HTMLFormElement>(null);

  const { data: counterpartResponse } = useCounterpartById(counterpartId);
  const { data: contact, isInitialLoading } = useCounterpartContactById(
    counterpartId,
    contactId
  );

  const contactCreateMutation = useCreateCounterpartContact(counterpartId);
  const contactUpdateMutation = useUpdateCounterpartContact(counterpartId);

  const counterpart =
    counterpartResponse as CounterpartOrganizationRootResponse;

  const methods = useForm<CounterpartContactFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(
      () => prepareCounterpartContact(contact, i18n),
      [i18n, contact]
    ),
  });

  useEffect(() => {
    methods.reset(prepareCounterpartContact(contact, i18n));
  }, [i18n, methods, contact]);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const createContact = useCallback(
    async (req: CreateCounterpartContactPayload) => {
      return await contactCreateMutation.mutateAsync(req, {
        onSuccess: ({ id }) => {
          onCreate && onCreate(id);
        },
      });
    },
    [contactCreateMutation, onCreate]
  );

  const updateContact = useCallback(
    async (payload: UpdateCounterpartContactPayload) => {
      if (!contact) return;

      return await contactUpdateMutation.mutateAsync(
        {
          contactId: contact.id,
          payload,
        },
        {
          onSuccess: () => {
            onUpdate && onUpdate(contact.id);
          },
        }
      );
    },
    [contactUpdateMutation, contact, onUpdate]
  );

  const saveContact = useCallback(
    (values: CounterpartContactFields) => {
      const payload = prepareCounterpartContactSubmit(values);

      return !!contact
        ? updateContact(payload as UpdateCounterpartContactPayload)
        : createContact(payload as CreateCounterpartContactPayload);
    },
    [contact, updateContact, createContact]
  );

  return {
    methods,
    saveContact,
    counterpart,
    contact,
    formRef,
    submitForm,
    isLoading:
      contactCreateMutation.isPending ||
      contactUpdateMutation.isPending ||
      isInitialLoading,
    error: contactCreateMutation.error || contactUpdateMutation.error,
  };
}
