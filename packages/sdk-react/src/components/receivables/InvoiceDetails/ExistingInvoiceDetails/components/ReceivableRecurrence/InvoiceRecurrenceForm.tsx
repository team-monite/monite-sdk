import { useCallback, useEffect, useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { addMonths, getMonth, getYear, startOfMonth } from 'date-fns';
import * as yup from 'yup';
import type { SchemaOf } from 'yup';

import { useRecurrenceByInvoiceId } from './useInvoiceRecurrence';

export const InvoiceRecurrenceForm = ({
  invoiceId,
  onCancel,
}: {
  invoiceId: string;
  onCancel: () => void;
}) => {
  const { api, queryClient, i18n } = useMoniteContext();

  const { data: recurrence, isLoading: isRecurrenceLoading } =
    useRecurrenceByInvoiceId(invoiceId);

  const createRecurrenceMutation = api.recurrences.postRecurrences.useMutation(
    undefined,
    {
      onError(error) {
        toast.error(getAPIErrorMessage(i18n, error));
      },
      async onSuccess() {
        await Promise.all([
          api.receivables.getReceivablesId.invalidateQueries(
            {
              parameters: { path: { receivable_id: invoiceId } },
            },
            queryClient
          ),
          api.receivables.getReceivables.invalidateQueries(queryClient),
        ]);

        toast.success(t(i18n)`Recurrence has been created`);
      },
    }
  );

  const updateRecurrenceMutation =
    api.recurrences.patchRecurrencesId.useMutation(
      {
        path: {
          recurrence_id: recurrence?.id ?? '',
        },
      },
      {
        onError(error) {
          toast.error(getAPIErrorMessage(i18n, error));
        },
        async onSuccess(updatedRecurrence) {
          api.recurrences.getRecurrencesId.setQueryData(
            { path: { recurrence_id: updatedRecurrence.id } },
            (previousRecurrence) => ({
              ...previousRecurrence,
              ...updatedRecurrence,
            }),
            queryClient
          );

          await Promise.all([
            api.receivables.getReceivablesId.invalidateQueries(
              {
                parameters: { path: { receivable_id: invoiceId } },
              },
              queryClient
            ),
            api.receivables.getReceivables.invalidateQueries(queryClient),
          ]);

          toast.success(t(i18n)`Recurrence has been updated`);

          api.recurrences.getRecurrencesId.invalidateQueries(
            {
              parameters: { path: { recurrence_id: updatedRecurrence.id } },
            },
            queryClient
          );
        },
      }
    );

  const isLoading =
    createRecurrenceMutation.isPending || updateRecurrenceMutation.isPending;

  const createErrorMessage = createRecurrenceMutation.error
    ? getAPIErrorMessage(i18n, createRecurrenceMutation.error)
    : '';

  const updateErrorMessage = updateRecurrenceMutation.error
    ? getAPIErrorMessage(i18n, updateRecurrenceMutation.error)
    : '';

  const errorMessage = createErrorMessage || updateErrorMessage;

  const getDefaultValues = useCallback(
    () => ({
      day_of_month: recurrence?.day_of_month ? recurrence.day_of_month : null,
      startDate: recurrence
        ? new Date(recurrence.start_year, recurrence.start_month - 1, 1)
        : null,
      endDate: recurrence
        ? new Date(recurrence.end_year, recurrence.end_month - 1, 1)
        : null,
    }),
    [recurrence]
  );

  const { control, handleSubmit, watch, setValue, reset, trigger } = useForm({
    resolver: yupResolver(useValidationSchema()),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => void reset(getDefaultValues()), [reset, getDefaultValues]);

  const currentDate = useMemo(() => new Date(), []);

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const dayOfMonth = watch('day_of_month');

  useEffect(() => {
    if (isRecurrenceLoading) return;
    // Trigger validation of the "Issue at" field when "Period starts on" is changed
    if (dayOfMonth && startDate) trigger('day_of_month');
  }, [dayOfMonth, isRecurrenceLoading, startDate, trigger]);

  const getMinEndDate = () => {
    if (!startDate) return currentDate;
    if (startDate < currentDate) return currentDate;
    return startDate;
  };

  const minEndDate = addMonths(
    getMinEndDate(),
    dayOfMonth === 'last_day' ? 0 : 1
  );

  useEffect(() => {
    if (!startDate || !endDate) return;
    if (startDate <= endDate) return;

    setValue('endDate', null);
  }, [startDate, endDate, setValue]);

  const formId = `Monite-Form-recurrence-${useId()}`;

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {recurrence
              ? t(i18n)`Edit recurring settings`
              : t(i18n)`Convert invoice into recurring template`}
          </Typography>

          <IconButton
            edge="start"
            color="inherit"
            onClick={onCancel}
            aria-label={t(i18n)`Close recurrence details`}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack
          component="form"
          direction="row"
          flexWrap="wrap"
          useFlexGap
          noValidate
          spacing={3}
          id={formId}
          onSubmit={handleSubmit(
            async ({ startDate, endDate, day_of_month }) => {
              if (!startDate || !endDate || !day_of_month)
                throw new Error('Invalid incoming data');

              const start_month = getMonth(startDate) + 1;
              const start_year = getYear(startDate);

              const end_month = getMonth(endDate) + 1;
              const end_year = getYear(endDate);

              const response = recurrence
                ? await updateRecurrenceMutation.mutateAsync({
                    day_of_month,
                    end_month,
                    end_year,
                  })
                : await createRecurrenceMutation.mutateAsync({
                    body: {
                      invoice_id: invoiceId,
                      day_of_month,
                      end_month,
                      end_year,
                      start_month,
                      start_year,
                      body_text: '', // TODO: add support for body_text
                      subject_text: '', // TODO: add support for subject_text
                    },
                  });

              api.recurrences.getRecurrencesId.setQueryData(
                { path: { recurrence_id: response.id } },
                () => response,
                queryClient
              );

              onCancel();
            }
          )}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.primary">
                {!recurrence &&
                  t(
                    i18n
                  )`When you set up the recurrence all future invoices will be issued based on this invoice template. After that you won’t be able to change the invoice template.`}

                {recurrence &&
                  t(
                    i18n
                  )`You can set a different period length and the date of issuance. The starting date cannot be updated.`}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <RHFDatePicker
                control={control}
                label={t(i18n)`Period starts on`}
                views={['year', 'month']}
                name="startDate"
                minDate={currentDate}
                view="year"
                disabled={!!recurrence || isLoading}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <RHFDatePicker
                control={control}
                label={t(i18n)`Period ends on`}
                views={['year', 'month']}
                name="endDate"
                minDate={minEndDate}
                disabled={isLoading}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
          </Grid>

          <RHFTextField
            fullWidth
            name="day_of_month"
            control={control}
            label={t(i18n)`Issue at`}
            select
            disabled={isLoading}
          >
            <MenuItem
              value="first_day"
              // disabled={isIssuanceStartDateOptionDisabled}
            >{t(i18n)`First day of the month`}</MenuItem>

            <MenuItem value="last_day">{t(
              i18n
            )`Last day of the month`}</MenuItem>
          </RHFTextField>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">{t(
              i18n
            )`The first invoice is to be issued on the nearest date that matches the settings.`}</Typography>
          </Grid>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="outlined" onClick={onCancel}>
              {t(i18n)`Cancel`}
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              form={formId}
            >
              {recurrence ? t(i18n)`Save` : t(i18n)`Convert and activate`}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

const useValidationSchema = () => {
  const { i18n } = useLingui();

  const shape: SchemaOf<{
    startDate: Date | null;
    endDate: Date | null;
    day_of_month: 'first_day' | 'last_day' | null;
  }> = yup.object({
    startDate: yup
      .date()
      .nullable()
      .required(t(i18n)`Required`)
      .label(t(i18n)`Start date`),
    endDate: yup
      .date()
      .nullable()
      .required(t(i18n)`Required`)
      .label(t(i18n)`End date`),
    day_of_month: yup
      .mixed()
      .nullable()
      .oneOf(['first_day', 'last_day'], t(i18n)`Invalid issuance`)
      .required(t(i18n)`Required`)
      .when('startDate', {
        is: (startDate: Date | null) =>
          startDate
            ? new Date(startDate) < addMonths(startOfMonth(new Date()), 1)
            : false,
        then: () =>
          yup
            .mixed()
            .oneOf(
              ['last_day', null],
              t(
                i18n
              )`The start date for the recurrence shouldn't be in the past`
            )
            .required(t(i18n)`Required`),
      })
      .label(t(i18n)`Issue at`),
  });

  return shape;
};
