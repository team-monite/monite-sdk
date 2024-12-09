import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, FieldError } from 'react-hook-form';

import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';

import { TermField, PaymentTermsFields } from './types';

export interface DiscountFormProps {
  field: TermField;
  index: number;
  isLast: boolean;
  remove: () => void;
  register: UseFormRegister<PaymentTermsFields>;
  errors: FieldErrors<PaymentTermsFields>;
}

export const DiscountForm = ({
  field,
  index,
  isLast,
  remove,
  register,
  errors,
}: DiscountFormProps) => {
  const [error, setError] = useState<string | undefined>('');

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const flatErrors = Object.values(errors[field] || {}).map(
        (error) => (error as FieldError)?.message
      );

      setError(flatErrors[0]);
    } else {
      setError('');
    }
  }, [errors, field]);

  return (
    <>
      {!!error && (
        <Alert severity="error" sx={{ my: 1 }}>
          {error}
        </Alert>
      )}
      <Card>
        <CardHeader
          title={t(i18n)`Discount ${index + 1}`}
          titleTypographyProps={{
            variant: 'subtitle1',
          }}
          action={
            <Button
              variant="text"
              color="error"
              size="small"
              disabled={!isLast}
              startIcon={<DeleteIcon />}
              onClick={remove}
            >
              {t(i18n)`Delete`}
            </Button>
          }
        />
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} useFlexGap>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{t(
              i18n
            )`Pay in`}</Typography>
            <TextField
              {...register(`${field}.number_of_days`)}
              type="number"
              error={!!errors?.[field]?.number_of_days}
              InputProps={{
                endAdornment: t(i18n)`days`,
              }}
            />
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{t(
              i18n
            )`to get discount`}</Typography>
            <TextField
              {...register(`${field}.discount`)}
              type="number"
              error={!!errors?.[field]?.discount}
              InputProps={{
                endAdornment: '%',
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
