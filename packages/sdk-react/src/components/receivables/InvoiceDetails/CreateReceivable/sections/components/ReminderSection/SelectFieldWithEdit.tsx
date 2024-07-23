import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { RHFSelectField } from '@/components/RHF/RHFSelectField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, Grid, SelectChangeEvent } from '@mui/material';

import { ReminderDetail, ReminderDetails } from './ReminderDetail';

interface CustomSelectFieldProps extends FieldValues {
  handleSelectChange: (
    field: ControllerRenderProps<FieldValues, string>
  ) => (event: SelectChangeEvent<string | number>) => void;
  details: ReminderDetail | undefined;
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
}: CustomSelectFieldProps) => {
  const { i18n } = useLingui();

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={10}>
        <RHFSelectField
          control={control}
          name={field.name}
          label={label}
          options={options}
          noOptionsText={noOptionsText}
          handleSelectChange={handleSelectChange}
          disabled={disabled}
          onChange={(event: SelectChangeEvent<unknown>) =>
            handleSelectChange(field)(event as SelectChangeEvent<string>)
          }
          createFnOption={() =>
            // eslint-disable-next-line lingui/no-unlocalized-strings
            alert('You have selected Create a reminder preset')
          }
        />
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
