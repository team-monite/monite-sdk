import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { components } from '@/api';
import { useDiscardChangesContext } from '@/core/context/DiscardChangesContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

import { usePatchEntitySettings } from '../hooks';
import { getDocumentNumberFormSchema } from '../schemas';
import { DocumentNumberFormValues } from '../types';
import { CommonSettingsBlock } from './CommonSettingsBlock';
import { PerDocumentBlock } from './PerDocumentBlock';

type Props = {
  entityId: string;
  entitySettings: components['schemas']['SettingsResponse'];
  nextNumbers: components['schemas']['NextDocumentNumbers'];
};

export const DocumentNumberForm = ({
  entityId,
  entitySettings,
  nextNumbers,
}: Props) => {
  const { i18n } = useLingui();
  const { handleShowModal } = useDiscardChangesContext();
  const { mutate: updateSettings, isPending: isUpdating } =
    usePatchEntitySettings(entityId);

  const methods = useForm<DocumentNumberFormValues>({
    resolver: zodResolver(getDocumentNumberFormSchema(i18n, nextNumbers)),
    defaultValues: {
      credit_note:
        entitySettings?.document_ids?.document_type_prefix?.credit_note ?? 'CN',
      credit_note_number: nextNumbers?.credit_note ?? 1,
      delivery_note:
        entitySettings?.document_ids?.document_type_prefix?.delivery_note ??
        'DN',
      delivery_note_number: nextNumbers?.delivery_note ?? 1,
      invoice:
        entitySettings?.document_ids?.document_type_prefix?.invoice ?? 'INV',
      invoice_number: nextNumbers?.invoice ?? 1,
      purchase_order:
        entitySettings?.document_ids?.document_type_prefix?.purchase_order ??
        'PO',
      purchase_order_number: nextNumbers?.purchase_order ?? 1,
      quote: entitySettings?.document_ids?.document_type_prefix?.quote ?? 'Q',
      quote_number: nextNumbers?.quote ?? 1,
      include_date: entitySettings?.document_ids?.include_date ?? false,
      min_digits: entitySettings?.document_ids?.min_digits ?? 5,
      prefix: entitySettings?.document_ids?.prefix ?? '',
      separator: entitySettings?.document_ids?.separator ?? '-',
    },
  });

  const { control, handleSubmit, formState, reset } = methods;

  const handleUpdateSettings = (values: DocumentNumberFormValues) => {
    updateSettings(
      {
        path: { entity_id: entityId },
        body: {
          ...entitySettings,
          document_ids: {
            document_type_prefix: {
              invoice: values.invoice,
              credit_note: values.credit_note,
              delivery_note: values.delivery_note,
              purchase_order: values.purchase_order,
              quote: values.quote,
            },
            next_number: {
              invoice: values.invoice_number,
              credit_note: values.credit_note_number,
              delivery_note: values.delivery_note_number,
              purchase_order: values.purchase_order_number,
              quote: values.quote_number,
            },
            min_digits: values.min_digits,
            separator: values.separator,
            include_date: values.include_date,
            prefix: values.prefix || null,
          },
        },
      },
      {
        onSuccess: () => {
          reset(methods.getValues());
        },
      }
    );
  };

  useEffect(() => {
    handleShowModal(formState?.isDirty);
  }, [formState?.isDirty, handleShowModal]);

  return (
    <FormProvider {...methods}>
      <form
        className="mtw:flex mtw:flex-col mtw:max-w-[680px] mtw:gap-8"
        onSubmit={handleSubmit(handleUpdateSettings)}
      >
        <CommonSettingsBlock control={control} />

        <PerDocumentBlock control={control} />

        <Button
          variant="contained"
          type="submit"
          sx={{
            width: 'fit-content',
            height: 40,
          }}
          disabled={isUpdating || !formState?.isDirty}
        >
          {t(i18n)`Save changes`}
        </Button>
      </form>
    </FormProvider>
  );
};
