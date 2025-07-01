import { Control, Controller } from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { DocumentNumberFormValues } from '../types';

type Props = {
  control: Control<DocumentNumberFormValues>;
};

export const CommonSettingsBlock = ({ control }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <div className="mtw:flex mtw:flex-col mtw:gap-4">
      <div className="mtw:flex mtw:gap-2">
        <Controller
          name="min_digits"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              id={field.name}
              label={t(i18n)`Min number of digits`}
              type="number"
              variant="outlined"
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="separator"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl variant="standard" fullWidth error={Boolean(error)}>
              <InputLabel htmlFor={field.name}>
                {t(i18n)`Prefix separator`}
              </InputLabel>
              <Select
                {...field}
                id={field.name}
                labelId={field.name}
                label={t(i18n)`Prefix separator`}
                MenuProps={{ container: root }}
              >
                <MenuItem value="-">{t(i18n)`-`}</MenuItem>
                <MenuItem value="|">{t(i18n)`|`}</MenuItem>
                <MenuItem value=".">{t(i18n)`.`}</MenuItem>
                <MenuItem value="/">{t(i18n)`/`}</MenuItem>
                <MenuItem value="">{t(i18n)`No separator`}</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="prefix"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              id={field.name}
              label={t(i18n)`Custom prefix`}
              variant="outlined"
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
        />
      </div>

      <div className="mtw:bg-neutral-95 mtw:w-full mtw:px-4 mtw:py-1 mtw:rounded-md">
        <Controller
          name="include_date"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              sx={{
                mx: 0,
                alignItems: 'center !important',
                '& .MuiFormControlLabel-label': {
                  padding: '0 !important',
                },
              }}
              control={
                <Checkbox
                  {...field}
                  checked={field.value ?? false}
                  size="small"
                />
              }
              label={t(i18n)`Include current year prefix`}
            />
          )}
        />
      </div>
    </div>
  );
};
