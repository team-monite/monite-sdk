import { useEffect, useState } from 'react';
import { FieldError, useFormContext, Controller } from 'react-hook-form';

import { rateMinorToMajor, rateMajorToMinor } from '@/core/utils/vatUtils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
}

export const DiscountForm = ({
  field,
  index,
  isLast,
  remove,
}: DiscountFormProps) => {
  const [error, setError] = useState<string | undefined>('');
  const { i18n } = useLingui();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PaymentTermsFields>();

  const daysFieldName = `${field}.number_of_days` as const;
  const discountFieldName = `${field}.discount` as const;

  useEffect(() => {
    if (errors && errors[field]) {
      const fieldErrors = errors[field];
      const flatErrors = Object.values(fieldErrors ?? {})
        .map((error) => (error as FieldError)?.message)
        .filter(Boolean);

      setError(flatErrors[0] ?? '');
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
              {...register(daysFieldName)}
              type="number"
              error={!!errors?.[field]?.number_of_days}
              InputProps={{
                endAdornment: t(i18n)`days`,
              }}
            />
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{t(
              i18n
            )`to get discount`}</Typography>
            <Controller
              name={discountFieldName}
              control={control}
              render={({
                field: { onChange, onBlur, value, name },
                fieldState: { error: fieldError },
              }) => (
                <TextField
                  name={name}
                  type="number"
                  value={
                    value !== null && value !== undefined
                      ? rateMinorToMajor(value)
                      : ''
                  }
                  onBlur={onBlur}
                  onChange={(e) => {
                    const majorValue = e.target.value;
                    const minorValue =
                      majorValue === ''
                        ? null
                        : rateMajorToMinor(parseFloat(majorValue));
                    onChange(minorValue);
                  }}
                  error={!!fieldError}
                  InputProps={{
                    endAdornment: '%',
                  }}
                />
              )}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
