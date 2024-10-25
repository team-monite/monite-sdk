import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { components } from '@/api';
import { RHFCheckbox } from '@/components/RHF/RHFCheckbox';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useMarkInvoiceAsPaid,
  usePatchEntitiesIdSettings,
} from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
};

type UpdatePDFFormValues = {
  auto_update_pdf: boolean;
};

export const UpdatePDFModal: React.FC<Props> = ({ invoice }) => {
  const { i18n } = useLingui();
  const [modalOpen, setModalOpen] = useState(false);
  const { api, monite } = useMoniteContext();
  const { root } = useRootElements();
  const closeModal = () => setModalOpen(false);
  const { handleSubmit, control } = useForm<{
    auto_update_pdf: boolean;
  }>({
    defaultValues: {
      auto_update_pdf: false,
    },
  });

  const markInvoiceAsPaid = useMarkInvoiceAsPaid(invoice.id);

  const { mutateAsync, isPending: isUpdatingEntitiesIdSettings } =
    usePatchEntitiesIdSettings();

  const updatePdfWithPaymentInfo = async ({
    auto_update_pdf,
  }: UpdatePDFFormValues) => {
    markInvoiceAsPaid.mutate(
      {},
      {
        onSuccess: async () => {
          // Ideally, we shouldn't require to refetch the entity settings here
          const { data: entitySettings } =
            await api.entities.getEntitiesIdSettings.useQuery(
              {
                path: {
                  entity_id: monite.entityId,
                },
              },
              { enabled: true }
            );

          //  Ideally the fields other than generate_paid_invoice_pdf should be optional, but the types are not allowing it
          await mutateAsync({
            vat_mode: entitySettings!.vat_mode,
            allow_purchase_order_autolinking:
              entitySettings!.allow_purchase_order_autolinking,
            payment_priority: entitySettings!.payment_priority,
            quote_signature_required: entitySettings!.quote_signature_required,
            receivable_edit_flow: entitySettings!.receivable_edit_flow,
            generate_paid_invoice_pdf: auto_update_pdf,
          });

          closeModal();
        },
      }
    );
  };
  const isLoading = markInvoiceAsPaid.isPending || isUpdatingEntitiesIdSettings;

  return (
    <>
      <Button onClick={() => setModalOpen(true)} variant="contained">{t(
        i18n
      )`Update`}</Button>

      <Dialog
        open={modalOpen}
        onClose={closeModal}
        container={root}
        aria-labelledby="dialog-title"
        fullWidth={true}
        maxWidth="sm"
        component="form"
        onSubmit={handleSubmit(updatePdfWithPaymentInfo)}
      >
        <DialogTitle sx={{ px: 4, pt: 4 }} variant="h3" id="dialog-title">{t(
          i18n
        )`Update PDF File`}</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Alert severity="warning">
            <Typography variant="body2">{t(
              i18n
            )`Already updated PDFs can't be reverted to the default view`}</Typography>
          </Alert>
          <Typography sx={{ marginTop: 4 }} variant="body2">{t(
            i18n
          )`Are you sure you want to regenerate this PDF file to contain the amount paid and amount due sums?`}</Typography>
          <Box
            sx={{
              marginTop: 4,
              paddingTop: 1,
              paddingBottom: 1,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <RHFCheckbox
              disabled={isLoading}
              control={control}
              label={t(i18n)`Automatically update all future PDF files`}
              name="auto_update_pdf"
            />
            <Typography sx={{ paddingLeft: 4 }} variant="body2">{t(
              i18n
            )`You can disable it later in the PDF settings`}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button autoFocus onClick={closeModal}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="warning" /> : null
            }
            type="submit"
          >
            {t(i18n)`Update`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
