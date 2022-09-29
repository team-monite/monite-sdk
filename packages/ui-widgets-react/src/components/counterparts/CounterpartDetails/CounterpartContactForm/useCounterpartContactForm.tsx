import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  useCounterpartById,
  useCounterpartContactById,
  useCreateCounterpartContact,
  useUpdateCounterpartContact,
} from 'core/queries/useCounterpart';

import { useComponentsContext } from 'core/context/ComponentsContext';

import {
  CounterpartOrganizationResponse,
  CreateCounterpartContactPayload,
  UpdateCounterpartContactPayload,
} from '@monite/sdk-api';

import {
  CounterpartContactFields,
  prepareCounterpartContact,
  prepareCounterpartContactSubmit,
} from './mapper';

import { useForm } from 'react-hook-form';
import getValidationSchema from './validation';
import { yupResolver } from '@hookform/resolvers/yup';

export type CounterpartContactFormProps = {
  counterpartId: string;
  contactId?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
};

export default function useCounterpartContactForm({
  counterpartId,
  contactId,
  onCreate,
  onUpdate,
}: CounterpartContactFormProps) {
  const { t } = useComponentsContext();
  const formRef = useRef<HTMLFormElement>(null);

  const { data: counterpartResponse } = useCounterpartById(counterpartId);
  const { data: contact } = useCounterpartContactById(counterpartId, contactId);

  const contactCreateMutation = useCreateCounterpartContact(counterpartId);
  const contactUpdateMutation = useUpdateCounterpartContact(counterpartId);

  const counterpart = counterpartResponse as CounterpartOrganizationResponse;

  const methods = useForm<CounterpartContactFields>({
    resolver: yupResolver(getValidationSchema(t)),
    defaultValues: useMemo(() => prepareCounterpartContact(contact), [contact]),
  });

  useEffect(() => {
    methods.reset(prepareCounterpartContact(contact));
  }, [contact]);

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
    [contactCreateMutation]
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
    [contactUpdateMutation]
  );

  const saveContact = useCallback(
    async (values: CounterpartContactFields) => {
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
      contactCreateMutation.isLoading || contactUpdateMutation.isLoading,
    error: contactCreateMutation.error || contactUpdateMutation.error,
  };
}
