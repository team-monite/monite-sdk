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
import { components } from '@monite/sdk-api/src/api';

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
  const { data: contact, isLoading } = useCounterpartContactById(
    counterpartId,
    contactId
  );

  const contactCreateMutation = useCreateCounterpartContact();
  const contactUpdateMutation = useUpdateCounterpartContact();

  const counterpart = counterpartResponse;

  const methods = useForm<CounterpartContactFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(() => prepareCounterpartContact(contact), [contact]),
  });

  useEffect(() => {
    methods.reset(prepareCounterpartContact(contact));
  }, [i18n, methods, contact]);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const createContact = useCallback(
    async (req: components['schemas']['CreateCounterpartContactPayload']) => {
      return await contactCreateMutation.mutateAsync(
        {
          path: {
            counterpart_id: counterpartId,
          },
          body: req,
        },
        {
          onSuccess: ({ id }) => {
            onCreate && onCreate(id);
          },
        }
      );
    },
    [contactCreateMutation, counterpartId, onCreate]
  );

  const updateContact = useCallback(
    async (
      payload: components['schemas']['UpdateCounterpartContactPayload']
    ) => {
      if (!contact) return;

      return await contactUpdateMutation.mutateAsync(
        {
          path: {
            counterpart_id: contact.counterpart_id,
            contact_id: contact.id,
          },
          body: payload,
        },
        {
          onSuccess: (updatedContact) => {
            onUpdate && onUpdate(updatedContact.id);
          },
        }
      );
    },
    [contactUpdateMutation, contact, onUpdate]
  );

  const saveContact = useCallback(
    (values: CounterpartContactFields) => {
      const payload = prepareCounterpartContactSubmit(values);

      return contact ? updateContact(payload) : createContact(payload);
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
      isLoading,
    error: contactCreateMutation.error || contactUpdateMutation.error,
  };
}
