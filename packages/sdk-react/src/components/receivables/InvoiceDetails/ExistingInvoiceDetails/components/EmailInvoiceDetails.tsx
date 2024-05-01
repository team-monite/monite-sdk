import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { getEmailInvoiceDetailsSchema } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/EmailInvoiceDetails.form';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useIssueReceivableById, useSendReceivableById } from '@/core/queries';
import { useEntityPaymentMethods } from '@/core/queries/useEntities';
import { useCreatePaymentLink } from '@/core/queries/usePayments';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  PaymentAccountType,
  PaymentMethodStatus,
  PaymentObjectType,
} from '@monite/sdk-api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

interface EmailInvoiceDetailsProps {
  invoiceId: string;
  onClose: () => void;
}

export const EmailInvoiceDetails = (props: EmailInvoiceDetailsProps) => (
  <MoniteStyleProvider>
    <EmailInvoiceDetailsBase {...props} />
  </MoniteStyleProvider>
);

const EmailInvoiceDetailsBase = ({
  invoiceId,
  onClose,
}: EmailInvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(getEmailInvoiceDetailsSchema(i18n)),
    defaultValues: {
      subject: '',
      body: '',
    },
  });
  const sendMutation = useSendReceivableById();
  const issueMutation = useIssueReceivableById();
  const createPaymentLinkMutation = useCreatePaymentLink();

  const { data: paymentMethods } = useEntityPaymentMethods();

  const handleIssueAndSend = useCallback(
    (e: React.BaseSyntheticEvent) => {
      e.preventDefault();
      const createPaymentLink = createPaymentLinkMutation.mutateAsync;
      const issue = issueMutation.mutateAsync;
      const sendEmail = sendMutation.mutate;

      handleSubmit(async (values) => {
        const availablePaymentMethods = paymentMethods
          ? paymentMethods.data.filter(
              (method) => method.status === PaymentMethodStatus.ACTIVE
            )
          : [];

        /**
         * We can't create a payment link if no payment methods are available.
         * As an MVP approach, we should show a message to the user and prevent the email from being sent.
         */
        if (availablePaymentMethods.length === 0) {
          toast.error(
            t(
              i18n
            )`No active payment methods available. The email will be sent without a payment link`
          );
        } else {
          await issue(invoiceId);

          /**
           * We need to create a payment link for the invoice before sending the email.
           * Otherwise, the recipient won't be able to pay the invoice.
           *
           * The link will be automatically attached to the email because we provide `object` field
           *  with the invoice id and type.
           *
           * For more information, you could check Monite API documentation:
           * @see {@link https://docs.monite.com/docs/payment-links#22-payment-link-for-a-receivable}
           */
          await createPaymentLink({
            recipient: {
              id: monite.entityId,
              type: PaymentAccountType.ENTITY,
            },
            payment_methods: availablePaymentMethods.map(
              (method) => method.type
            ),
            object: {
              id: invoiceId,
              type: PaymentObjectType.RECEIVABLE,
            },
          });
        }

        /**
         * If `payment methods` available, we should create a payment link.
         * If not, we should send the email without a payment link.
         */
        sendEmail(
          {
            receivableId: invoiceId,
            body: {
              subject_text: values.subject,
              body_text: values.body,
            },
          },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      })(e);
    },
    [
      createPaymentLinkMutation.mutateAsync,
      issueMutation.mutateAsync,
      handleSubmit,
      i18n,
      invoiceId,
      monite.entityId,
      onClose,
      paymentMethods,
      sendMutation.mutate,
    ]
  );

  return (
    <>
      <DialogTitle>
        <Toolbar>
          <Grid container>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={onClose}
                  startIcon={<ArrowBackIcon />}
                  disabled={
                    sendMutation.isPending ||
                    createPaymentLinkMutation.isPending
                  }
                >{t(i18n)`Back`}</Button>
                <Typography variant="h3">{t(i18n)`Compose email`}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                spacing={2}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  form="emailInvoiceDetailsForm"
                  disabled={sendMutation.isPending}
                >{t(i18n)`Issue and send`}</Button>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </DialogTitle>
      <DialogContent>
        <form
          id="emailInvoiceDetailsForm"
          noValidate
          onSubmit={handleIssueAndSend}
        >
          <Stack spacing={3}>
            <Stack spacing={2}>
              <Typography
                variant="subtitle2"
                color={formState.errors.subject ? 'error' : 'text.primary'}
              >{t(i18n)`Subject`}</Typography>
              <Controller
                name="subject"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    id={field.name}
                    variant="outlined"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    required
                    disabled={sendMutation.isPending}
                    {...field}
                  />
                )}
              />
            </Stack>
            <Stack>
              <Typography
                variant="subtitle2"
                color={formState.errors.body ? 'error' : 'text.primary'}
              >{t(i18n)`Body`}</Typography>
              <Controller
                name="body"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    id={field.name}
                    variant="outlined"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    required
                    multiline
                    rows={8}
                    disabled={sendMutation.isPending}
                    {...field}
                  />
                )}
              />
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </>
  );
};
