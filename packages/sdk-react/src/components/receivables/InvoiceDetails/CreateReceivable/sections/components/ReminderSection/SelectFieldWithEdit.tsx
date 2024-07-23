import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { RHFSelectField } from '@/components/RHF/RHFSelectField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, Grid, MenuItem, SelectChangeEvent } from '@mui/material';

import { ReminderDetail, ReminderDetails } from './ReminderDetail';

interface CustomSelectFieldProps extends FieldValues {
  handleSelectChange: (
    field: ControllerRenderProps<FieldValues, string>
  ) => (event: SelectChangeEvent<string | number>) => void;
  details: ReminderDetail | undefined;
  options: Array<{ id: string | number; name: string }>;
}

export const SelectFieldWithEdit = ({
  field,
  label,
  noOptionsText,
  disabled,
  options,
  handleSelectChange,
  control,
  details,
  createOptionLabel,
}: CustomSelectFieldProps) => {
  const { i18n } = useLingui();

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={10}>
        <RHFSelectField
          control={control}
          name={field.name}
          label={label}
          noOptionsText={noOptionsText}
          handleSelectChange={handleSelectChange}
          disabled={disabled}
          createFnOption={() =>
            // eslint-disable-next-line lingui/no-unlocalized-strings
            alert('You have selected Create a reminder preset')
          }
          createOptionLabel={createOptionLabel}
        >
          {options.length > 0 ? (
            options.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              {noOptionsText}
            </MenuItem>
          )}
        </RHFSelectField>
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="outlined"
          disabled={disabled}
          onClick={() => {
            // eslint-disable-next-line lingui/no-unlocalized-strings
            alert('You have selected Edit');
          }}
          fullWidth
        >
          {t(i18n)`Edit`}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <ReminderDetails details={details} />
      </Grid>
    </Grid>
  );
};
