import React, { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
import { RHFSwitch } from '@/components/RHF/RHFSwitch';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Card,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import { getValidationSchema } from './validation';

type PaymentReminder = components['schemas']['PaymentReminder'];

interface CreateBeforeDueDateReminderFormFields extends PaymentReminder {
  is_discount_date_1: boolean;
  is_discount_date_2: boolean;
  is_due_date: boolean;
}

export const CreateBeforeDueDateReminder = () => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { api, queryClient } = useMoniteContext();

  const methods = useForm<CreateBeforeDueDateReminderFormFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
  });
  const { control, handleSubmit, watch } = methods;

  const formName = `Monite-Form-createBeforeDueDateReminder-${useId()}`;

  const isDiscountDate1 = watch('is_discount_date_1');
  const isDiscountDate2 = watch('is_discount_date_2');
  const isDueDate = watch('is_due_date');

  const createBeforeDueDateReminderMutation =
    api.paymentReminders.postPaymentReminders.useMutation(undefined, {
      onSuccess: async () => {
        dialogContext?.onClose?.();

        await api.paymentReminders.getPaymentReminders.invalidateQueries(
          queryClient
        );

        toast.success(t(i18n)`Reminder has been created`);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">
            {t(i18n)`Create “Before due date” reminder`}
          </Typography>
          {dialogContext?.isDialogContent && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close reminder's creation`}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <FormProvider {...methods}>
          <form id={formName} noValidate>
            <Stack spacing={3}>
              <Typography variant="subtitle2" mb={1}>
                {t(i18n)`Preset name`}
              </Typography>
              <RHFTextField
                label={t(i18n)`Preset name`}
                name="name"
                control={control}
                fullWidth
                required
              />
              <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <RHFSwitch
                  name="is_discount_date_1"
                  label={
                    <Typography variant="subtitle2">
                      {t(i18n)`Discount date 1`}
                    </Typography>
                  }
                />
                {isDiscountDate1 && (
                  <Stack spacing={2} mt={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>{t(i18n)`Remind`}</Typography>
                      <RHFTextField
                        name="term_1_reminder.days_before"
                        type="number"
                        size="small"
                        sx={{ width: 60 }}
                      />
                      <Typography>{t(i18n)`days before`}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        {t(i18n)`Subject`}
                      </Typography>
                      <RHFTextField
                        label={t(i18n)`Subject`}
                        name="term_1_reminder.subject"
                        control={control}
                        fullWidth
                        required
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        {t(i18n)`Body`}
                      </Typography>
                      <RHFTextField
                        label={t(i18n)`Body`}
                        name="term_1_reminder.body"
                        control={control}
                        fullWidth
                        required
                        multiline
                        rows={5}
                      />
                    </Box>
                  </Stack>
                )}
              </Card>
              <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <RHFSwitch
                  name="is_discount_date_2"
                  label={
                    <Typography variant="subtitle2">
                      {t(i18n)`Discount date 2`}
                    </Typography>
                  }
                />
                {isDiscountDate2 && (
                  <Stack spacing={2} mt={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>{t(i18n)`Remind`}</Typography>
                      <RHFTextField
                        name="term_2_reminder.days_before"
                        type="number"
                        size="small"
                        sx={{ width: 60 }}
                      />
                      <Typography>{t(i18n)`days before`}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        {t(i18n)`Subject`}
                      </Typography>
                      <RHFTextField
                        label={t(i18n)`Subject`}
                        name="term_2_reminder.subject"
                        control={control}
                        fullWidth
                        required
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        {t(i18n)`Body`}
                      </Typography>
                      <RHFTextField
                        label={t(i18n)`Body`}
                        name="term_2_reminder.body"
                        control={control}
                        fullWidth
                        required
                        multiline
                        rows={5}
                      />
                    </Box>
                  </Stack>
                )}
              </Card>
              <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <RHFSwitch
                  name="is_due_date"
                  label={
                    <Typography variant="subtitle2">
                      {t(i18n)`Due date`}
                    </Typography>
                  }
                />
                {isDueDate && (
                  <Stack spacing={2} mt={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>{t(i18n)`Remind`}</Typography>
                      <RHFTextField
                        name="term_final_reminder.days_before"
                        type="number"
                        size="small"
                        sx={{ width: 60 }}
                      />
                      <Typography>{t(i18n)`days before`}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        {t(i18n)`Subject`}
                      </Typography>
                      <RHFTextField
                        label={t(i18n)`Subject`}
                        name="term_final_reminder.subject"
                        control={control}
                        fullWidth
                        required
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" mb={1}>
                        {t(i18n)`Body`}
                      </Typography>
                      <RHFTextField
                        label={t(i18n)`Body`}
                        name="term_final_reminder.body"
                        control={control}
                        fullWidth
                        required
                        multiline
                        rows={5}
                      />
                    </Box>
                  </Stack>
                )}
              </Card>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined">{t(i18n)`Cancel`}</Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form={formName}
          disabled={createBeforeDueDateReminderMutation.isPending}
          onClick={(e) => {
            e.preventDefault();

            handleSubmit((values) => {
              const {
                is_discount_date_1,
                is_discount_date_2,
                is_due_date,
                ...body
              } = values;

              createBeforeDueDateReminderMutation.mutate({
                body,
              });
            })(e);
          }}
        >
          {t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
