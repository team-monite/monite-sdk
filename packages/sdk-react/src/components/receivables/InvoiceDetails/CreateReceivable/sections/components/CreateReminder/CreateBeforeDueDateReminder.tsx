import { useState, useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMenuButton } from '@/core/hooks';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
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

interface BeforeDueDateReminderBasePropsProps {
  onClose?(): void;
}

interface CreateBeforeDueDateReminderProps
  extends BeforeDueDateReminderBasePropsProps {
  onCreate?(reminderId: string): void;
  reminderId?: never;
}

interface UpdateBeforeDueDateReminderProps
  extends BeforeDueDateReminderBasePropsProps {
  reminderId: string;
  onUpdate?(reminderId: string): void;
}

export const CreateBeforeDueDateReminder = ({
  reminderId,
  ...restProps
}: CreateBeforeDueDateReminderProps | UpdateBeforeDueDateReminderProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const {
    data: reminder,
    error,
    isError,
    isLoading,
  } = api.paymentReminders.getPaymentRemindersId.useQuery(
    {
      path: { payment_reminder_id: reminderId || '' },
    },
    { enabled: Boolean(reminderId) }
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <NotFound
        title={t(i18n)`Payment reminder error`}
        description={getAPIErrorMessage(i18n, error)}
      />
    );
  }

  if (reminderId && !reminder) {
    return (
      <NotFound
        title={t(i18n)`Reminder not found`}
        description={t(
          i18n
        )`There is no reminder by provided id: ${reminderId}`}
      />
    );
  }

  return (
    <CreateBeforeDueDateReminderComponent reminder={reminder} {...restProps} />
  );
};

const CreateBeforeDueDateReminderComponent = ({
  reminder,
  ...props
}: (
  | { onCreate?(reminderId: string): void }
  | { onUpdate?(reminderId: string): void }
) &
  BeforeDueDateReminderBasePropsProps & {
    reminder?: components['schemas']['PaymentReminderResponse'];
  }) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const { buttonProps, menuProps, open } = useMenuButton();

  const defaultTerm = {
    days_before: 1,
    body: '',
    subject: '',
  };

  const methods = useForm({
    resolver: yupResolver(getBeforeDueDateValidationSchema(i18n)),
    defaultValues: ((): components['schemas']['PaymentReminder'] => ({
      name: reminder?.name ?? '',
      // @ts-expect-error - back-end does not support `null` values
      term_1_reminder: reminder?.term_1_reminder ?? null,
      // @ts-expect-error - back-end does not support `null` values
      term_2_reminder: reminder?.term_2_reminder ?? null,
      // @ts-expect-error - back-end does not support `null` values
      term_final_reminder: reminder?.term_final_reminder ?? null,
    }))(),
  });

  const { control, handleSubmit, setValue, watch, formState } = methods;

  const [
    term1ReminderFieldValue,
    term2ReminderFieldValue,
    termFinalReminderFieldValue,
  ] = watch(['term_1_reminder', 'term_2_reminder', 'term_final_reminder']);

  const formName = `Monite-Form-createBeforeDueDateReminder-${useId()}`;

  const createBeforeDueDateReminderMutation =
    api.paymentReminders.postPaymentReminders.useMutation(undefined, {
      onSuccess: async (newReminder) => {
        await api.paymentReminders.getPaymentReminders.invalidateQueries(
          queryClient
        );

        toast.success(t(i18n)`Reminder has been created`);

        if ('onCreate' in props) props.onCreate?.(newReminder.id);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  const updateBeforeDueDateReminderMutation =
    api.paymentReminders.patchPaymentRemindersId.useMutation(
      {
        path: { payment_reminder_id: reminder?.id ?? '' },
      },
      {
        onSuccess: async (updatedReminder) => {
          api.paymentReminders.getPaymentRemindersId.setQueryData(
            {
              path: { payment_reminder_id: updatedReminder.id },
            },
            updatedReminder,
            queryClient
          );

          await api.paymentReminders.getPaymentReminders.invalidateQueries(
            queryClient
          );

          toast.success(t(i18n)`Reminder has been updated`);

          if ('onUpdate' in props) props.onUpdate?.(updatedReminder.id);
        },
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">
            {reminder
              ? t(i18n)`Update “Before due date” reminder`
              : t(i18n)`Create “Before due date” reminder`}
          </Typography>
          {props.onClose && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={(event) => {
                event.preventDefault();
                props.onClose?.();
              }}
              aria-label={t(i18n)`Close`}
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
          onSubmit={handleSubmit((body) => {
            if (reminder)
              return updateBeforeDueDateReminderMutation.mutate(body);
            return createBeforeDueDateReminderMutation.mutate({ body });
          })}
        >
          <Stack spacing={3}>
            <RHFTextField
              // todo::add position sticky(top:0) on the input field
              label={t(i18n)`Preset name`}
              name="name"
              control={control}
              fullWidth
              required
            />
            {Boolean(termFinalReminderFieldValue) && (
              <ReminderFormLayout
                title={t(i18n)`Due date`}
                daysBeforeInput={
                  <>
                    <InputLabel htmlFor="term_final_reminder.days_before">
                      <Typography>{t(i18n)`Remind`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_final_reminder.days_before"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, inputMode: 'numeric' },
                      }}
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
                onDelete={() =>
                  setValue(
                    'term_final_reminder',
                    // @ts-expect-error - back-end does not support `null` values
                    null
                  )
                }
              />
            )}
            {Boolean(term1ReminderFieldValue) && (
              <ReminderFormLayout
                title={t(i18n)`Discount date 1`}
                daysBeforeInput={
                  <>
                    <InputLabel htmlFor="term_1_reminder.days_before">
                      <Typography>{t(i18n)`Remind`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_1_reminder.days_before"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, inputMode: 'numeric' },
                      }}
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
                onDelete={() =>
                  setValue(
                    'term_1_reminder',
                    // @ts-expect-error - back-end does not support `null` values
                    null
                  )
                }
              />
            )}
            {Boolean(term2ReminderFieldValue) && (
              <ReminderFormLayout
                title={t(i18n)`Discount date 2`}
                daysBeforeInput={
                  <>
                    <InputLabel htmlFor="term_2_reminder.days_before">
                      <Typography>{t(i18n)`Remind`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_2_reminder.days_before"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, inputMode: 'numeric' },
                      }}
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
                onDelete={() =>
                  setValue(
                    'term_2_reminder',
                    // @ts-expect-error - back-end does not support `null` values
                    null
                  )
                }
              />
            )}
            {!(
              termFinalReminderFieldValue &&
              term1ReminderFieldValue &&
              term2ReminderFieldValue
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
                  {!termFinalReminderFieldValue && (
                    <MenuItem>
                      <ListItemText
                        onClick={() =>
                          setValue('term_final_reminder', defaultTerm)
                        }
                      >
                        {t(i18n)`Due date`}
                      </ListItemText>
                    </MenuItem>
                  )}
                  {!term1ReminderFieldValue && (
                    <MenuItem>
                      <ListItemText
                        onClick={() => setValue('term_1_reminder', defaultTerm)}
                      >
                        {t(i18n)`Discount date 1`}
                      </ListItemText>
                    </MenuItem>
                  )}
                  {!term2ReminderFieldValue && (
                    <MenuItem>
                      <ListItemText
                        onClick={() => setValue('term_2_reminder', defaultTerm)}
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
        {props?.onClose && (
          <Button
            variant="outlined"
            onClick={(event) => {
              event.preventDefault();
              props?.onClose?.();
            }}
          >
            {/* todo::should we really add an extra "Cancel" button? Does it make sense if we have "Cancel" for the invoices? */}
            {t(i18n)`Cancel`}
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form={formName}
          disabled={createBeforeDueDateReminderMutation.isPending}
        >
          {reminder ? t(i18n)`Update` : t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
