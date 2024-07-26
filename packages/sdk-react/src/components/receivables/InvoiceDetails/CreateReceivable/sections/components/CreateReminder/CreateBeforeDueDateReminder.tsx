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
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { ReminderFormLayout } from './ReminderFormLayout';
import { getBeforeDueDateValidationSchema } from './validation';

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
      getBeforeDueDateValidationSchema(i18n, {
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
              <ReminderFormLayout
                title={t(i18n)`Due date`}
                daysBeforeInput={
                  <>
                    <InputLabel htmlFor="term_final_reminder.days_before">
                      <Typography>{t(i18n)`Remind`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_final_reminder.days_before"
                      // todo::add min max logic on input (???) inputProps.inputProps.min={1} seem not working
                      type="number"
                      control={control}
                      size="small"
                      sx={{ width: 60 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {t(i18n)`days before`}
                    </Typography>
                  </>
                }
                subjectInput={
                  <RHFTextField
                    label={t(i18n)`Subject`}
                    name="term_final_reminder.subject"
                    control={control}
                    fullWidth
                    required
                  />
                }
                bodyInput={
                  <RHFTextField
                    label={t(i18n)`Body`}
                    name="term_final_reminder.body"
                    control={control}
                    fullWidth
                    required
                    multiline
                    rows={5}
                  />
                }
                onDelete={() => toggleReminderState('isDueDate')}
              />
            )}
            {reminderStates.isDiscountDate1 && (
              <ReminderFormLayout
                title={t(i18n)`Discount date 1`}
                daysBeforeInput={
                  <>
                    <InputLabel htmlFor="term_1_reminder.days_before">
                      <Typography>{t(i18n)`Remind`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_1_reminder.days_before"
                      // todo::add min max logic on input (???) inputProps.inputProps.min={1} seem not working
                      type="number"
                      control={control}
                      size="small"
                      sx={{ width: 60 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {t(i18n)`days before`}
                    </Typography>
                  </>
                }
                subjectInput={
                  <RHFTextField
                    label={t(i18n)`Subject`}
                    name="term_1_reminder.subject"
                    control={control}
                    fullWidth
                    required
                  />
                }
                bodyInput={
                  <RHFTextField
                    label={t(i18n)`Body`}
                    name="term_1_reminder.body"
                    control={control}
                    fullWidth
                    required
                    multiline
                    rows={5}
                  />
                }
                onDelete={() => toggleReminderState('isDiscountDate1')}
              />
            )}
            {reminderStates.isDiscountDate2 && (
              <ReminderFormLayout
                title={t(i18n)`Discount date 2`}
                daysBeforeInput={
                  <>
                    <InputLabel htmlFor="term_2_reminder.days_before">
                      <Typography>{t(i18n)`Remind`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_2_reminder.days_before"
                      // todo::add min max logic on input (???) inputProps.inputProps.min={1} seem not working
                      type="number"
                      control={control}
                      size="small"
                      sx={{ width: 60 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {t(i18n)`days before`}
                    </Typography>
                  </>
                }
                subjectInput={
                  <RHFTextField
                    label={t(i18n)`Subject`}
                    name="term_2_reminder.subject"
                    control={control}
                    fullWidth
                    required
                  />
                }
                bodyInput={
                  <RHFTextField
                    label={t(i18n)`Body`}
                    name="term_2_reminder.body"
                    control={control}
                    fullWidth
                    required
                    multiline
                    rows={5}
                  />
                }
                onDelete={() => toggleReminderState('isDiscountDate2')}
              />
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
