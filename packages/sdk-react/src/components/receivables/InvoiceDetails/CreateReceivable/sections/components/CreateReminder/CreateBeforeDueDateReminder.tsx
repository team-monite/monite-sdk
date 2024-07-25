import { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMenuButton } from '@/core/hooks';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  Card,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { ReminderForm } from './ReminderForm';
import { getValidationSchema } from './validation';

interface ReminderStates {
  isDueDate: boolean;
  isDiscountDate1: boolean;
  isDiscountDate2: boolean;
}

export const CreateBeforeDueDateReminder = () => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { api, queryClient } = useMoniteContext();
  const { buttonProps, menuProps, open } = useMenuButton();

  const [reminderStates, setReminderStates] = useState<ReminderStates>({
    isDueDate: true,
    isDiscountDate1: false,
    isDiscountDate2: false,
  });

  const toggleReminderState = (key: keyof ReminderStates) => {
    setReminderStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const methods = useForm({
    resolver: yupResolver(
      getValidationSchema(i18n, {
        term_final_reminder: reminderStates.isDueDate,
        term_1_reminder: reminderStates.isDiscountDate1,
        term_2_reminder: reminderStates.isDiscountDate2,
      })
    ),
    defaultValues: ((): components['schemas']['PaymentReminder'] => ({
      name: '',
      term_1_reminder: undefined,
      term_2_reminder: undefined,
      recipients: undefined,
      term_final_reminder: undefined,
    }))(),
  });
  const { control, handleSubmit, watch } = methods;

  const formName = `Monite-Form-createBeforeDueDateReminder-${useId()}`;

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
            {t(i18n)`Create “Before due date” preset`}
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
        <form
          id={formName}
          noValidate
          onSubmit={handleSubmit((body) =>
            createBeforeDueDateReminderMutation.mutate({
              body,
            })
          )}
        >
          <Stack spacing={3}>
            <RHFTextField
              label={t(i18n)`Preset name`}
              name="name"
              control={control}
              fullWidth
              required
            />
            {reminderStates.isDueDate && (
              <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <ReminderForm
                  control={control}
                  termKey="term_final_reminder"
                  onDelete={() => toggleReminderState('isDueDate')}
                />
              </Card>
            )}
            {reminderStates.isDiscountDate1 && (
              <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <ReminderForm
                  control={control}
                  termKey="term_1_reminder"
                  onDelete={() => toggleReminderState('isDiscountDate1')}
                />
              </Card>
            )}
            {reminderStates.isDiscountDate2 && (
              <Card variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <ReminderForm
                  control={control}
                  termKey="term_2_reminder"
                  onDelete={() => toggleReminderState('isDiscountDate2')}
                />
              </Card>
            )}
            {!(
              reminderStates.isDiscountDate1 &&
              reminderStates.isDiscountDate2 &&
              reminderStates.isDueDate
            ) && (
              <>
                <Button
                  {...buttonProps}
                  sx={{ alignSelf: 'start' }}
                  variant="contained"
                  endIcon={
                    open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                  }
                >{t(i18n)`Add reminder`}</Button>
                <Menu {...menuProps}>
                  {!reminderStates.isDueDate && (
                    <MenuItem>
                      <ListItemText
                        onClick={() => toggleReminderState('isDueDate')}
                      >
                        {t(i18n)`Due date`}
                      </ListItemText>
                    </MenuItem>
                  )}
                  {!reminderStates.isDiscountDate1 && (
                    <MenuItem>
                      <ListItemText
                        onClick={() => toggleReminderState('isDiscountDate1')}
                      >
                        {t(i18n)`Discount date 1`}
                      </ListItemText>
                    </MenuItem>
                  )}
                  {!reminderStates.isDiscountDate2 && (
                    <MenuItem>
                      <ListItemText
                        onClick={() => toggleReminderState('isDiscountDate2')}
                      >
                        {t(i18n)`Discount date 2`}
                      </ListItemText>
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Stack>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={dialogContext?.onClose}>{t(
          i18n
        )`Cancel`}</Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form={formName}
          disabled={createBeforeDueDateReminderMutation.isPending}
        >
          {t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
