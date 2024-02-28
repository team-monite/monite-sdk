import React, { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { getEmailInvoiceDetailsSchema } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/components/EmailInvoiceDetails.form';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useSendReceivableById } from '@/core/queries';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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

interface IEmailInvoiceDetailsProps {
  invoiceId: string;
  onClose: () => void;
}

export const EmailInvoiceDetails = ({
  invoiceId,
  onClose,
}: IEmailInvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(getEmailInvoiceDetailsSchema(i18n)),
    defaultValues: {
      subject: '',
      body: '',
    },
  });
  const sendMutation = useSendReceivableById();

  const handleIssueAndSend = useCallback(
    (e: React.BaseSyntheticEvent) => {
      e.preventDefault();

      handleSubmit((values) => {
        sendMutation.mutate(
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
    [handleSubmit, invoiceId, onClose, sendMutation]
  );

  return (
    <MoniteStyleProvider>
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
                  disabled={sendMutation.isLoading}
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
                  disabled={sendMutation.isLoading}
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
                    disabled={sendMutation.isLoading}
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
                    disabled={sendMutation.isLoading}
                    {...field}
                  />
                )}
              />
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </MoniteStyleProvider>
  );
};
