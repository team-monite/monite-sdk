import React, { useState, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useDialog } from '@/components';
import { RHFTextField } from '@/components/RHF/RHFTextField';
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
  Switch,
  Typography,
  FormControlLabel,
} from '@mui/material';

export const CreateBeforeDueDateReminder = () => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  const methods = useForm();
  const { control, handleSubmit, formState } = methods;

  const formName = `Monite-Form-approvalPolicyDetails-${useId()}`;

  const [isDiscountDate1, setIsDiscountDate1] = useState<boolean>(false);
  const [isDiscountDate2, setIsDiscountDate2] = useState<boolean>(false);
  const [isDueDate, setIsDueDate] = useState<boolean>(false);

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
              <Card variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                <FormControlLabel
                  sx={{ width: '100%' }}
                  control={<Switch />}
                  label={t(i18n)`Discount date 1`}
                  onChange={() => setIsDiscountDate1(!isDiscountDate1)}
                />
                {isDiscountDate1 && 'add date 1'}
              </Card>
              <Card variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                <FormControlLabel
                  sx={{ width: '100%' }}
                  control={<Switch />}
                  label={t(i18n)`Discount date 2`}
                  onChange={() => setIsDiscountDate2(!isDiscountDate2)}
                />
                {isDiscountDate2 && 'add date 2'}
              </Card>
              <Card variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                <FormControlLabel
                  sx={{ width: '100%' }}
                  control={<Switch />}
                  label={t(i18n)`Due date`}
                  onChange={() => setIsDueDate(!isDueDate)}
                />
                {isDueDate && 'add due date'}
              </Card>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined">{t(i18n)`Cancel`}</Button>
        <Button variant="contained" color="primary">
          {t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};
