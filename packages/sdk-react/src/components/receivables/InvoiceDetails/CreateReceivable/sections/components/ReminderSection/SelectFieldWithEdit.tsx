import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
} from 'react-hook-form';

import { RHFSelectField } from '@/components/RHF/RHFSelectField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, Grid, SelectChangeEvent } from '@mui/material';

import { ReminderDetails } from './ReminderDetail';

interface CustomSelectFieldProps {
  field: any;
  error: FieldError | undefined;
  label: string;
  noOptionsText: string;
  disabled: boolean;
  options: any[];
  control: any;
  root: HTMLElement;
  handleSelectChange: (
    field: ControllerRenderProps<FieldValues, string>
  ) => (event: SelectChangeEvent<string | number>) => void;
}

const mockReminderDetails = [
  {
    event: 'Before due date',
    time: '10:00',
  },
  {
    event: 'Overdue reminders',
    time: '10:00',
  },
];

export const SelectFieldWithEdit = ({
  field,
  label,
  noOptionsText,
  disabled,
  options,
  handleSelectChange,
  control,
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
        <ReminderDetails details={mockReminderDetails} />
      </Grid>
    </Grid>
  );
};
