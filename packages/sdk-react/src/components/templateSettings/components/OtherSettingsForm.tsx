import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { components } from '@/api';
import { useDiscardChangesContext } from '@/core/context/DiscardChangesContext';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, Divider } from '@mui/material';

import { usePatchEntitySettings } from '../hooks';
import { OtherSettingsFormValues } from '../types';
import { DisplayBankSection } from './DisplayBankSection';
import { DisplaySignatureSection } from './DisplaySignatureSection';
import { UpdatePaidInvoiceSection } from './UpdatePaidInvoiceSection';

type Props = {
  entityId: string;
  entitySettings: components['schemas']['SettingsResponse'];
};

export const OtherSettingsForm = ({ entityId, entitySettings }: Props) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const { handleShowModal } = useDiscardChangesContext();
  const { mutate: updateSettings, isPending: isUpdating } =
    usePatchEntitySettings(entityId);

  const methods = useForm<OtherSettingsFormValues>({
    defaultValues: {
      invoice_bank_display:
        entitySettings?.document_rendering?.invoice
          ?.display_entity_bank_account ?? false,
      credit_note_bank_display:
        entitySettings?.document_rendering?.credit_note
          ?.display_entity_bank_account ?? false,
      quote_bank_display:
        entitySettings?.document_rendering?.quote
          ?.display_entity_bank_account ?? false,
      update_paid_invoices: entitySettings?.generate_paid_invoice_pdf ?? false,
      quote_signature_display:
        entitySettings?.document_rendering?.quote?.display_signature ?? false,
      quote_electronic_signature:
        entitySettings?.quote_signature_required ?? false,
    },
  });

  const { control, handleSubmit, formState, watch, reset } = methods;

  const handleUpdateSettings = (values: OtherSettingsFormValues) => {
    updateSettings(
      {
        path: { entity_id: entityId },
        body: {
          ...entitySettings,
          document_rendering: {
            invoice: {
              display_entity_bank_account: values.invoice_bank_display,
            },
            credit_note: {
              display_entity_bank_account: values.credit_note_bank_display,
            },
            quote: {
              display_entity_bank_account: values.quote_bank_display,
              display_signature: values.quote_signature_display,
            },
          },
          generate_paid_invoice_pdf: values.update_paid_invoices,
          quote_signature_required:
            values.quote_electronic_signature === 'true',
        },
      },
      {
        onSuccess: () => {
          reset(methods.getValues());
        },
      }
    );
  };

  const displayInvoiceBank = watch('invoice_bank_display');
  const displayCreditNoteBank = watch('credit_note_bank_display');
  const displayQuoteBank = watch('quote_bank_display');

  const shouldShowBankOptionsByDefault =
    displayInvoiceBank || displayCreditNoteBank || displayQuoteBank;

  useEffect(() => {
    handleShowModal(formState?.isDirty);
  }, [formState?.isDirty, handleShowModal]);

  return (
    <FormProvider {...methods}>
      <form
        className="mtw:flex mtw:flex-col mtw:max-w-[680px] mtw:gap-6"
        onSubmit={handleSubmit(handleUpdateSettings)}
      >
        <DisplayBankSection
          shouldShowBankOptionsByDefault={shouldShowBankOptionsByDefault}
        />

        <Divider />

        {componentSettings?.templateSettings?.availableARDocuments?.includes(
          'quote'
        ) && (
          <>
            <DisplaySignatureSection control={control} />
            <Divider />
          </>
        )}

        <UpdatePaidInvoiceSection control={control} />

        <Divider />

        <Button
          variant="contained"
          type="submit"
          sx={{
            width: 'fit-content',
            height: 40,
          }}
          disabled={
            isUpdating ||
            !formState?.isDirty ||
            Boolean(Object.keys(formState.errors).length)
          }
        >
          {t(i18n)`Save changes`}
        </Button>
      </form>
    </FormProvider>
  );
};
