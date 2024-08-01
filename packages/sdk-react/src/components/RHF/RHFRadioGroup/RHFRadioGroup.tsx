import { Fragment } from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import {
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

interface RHFRadioGroupProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}

export const RHFRadioGroup = <F extends FieldValues>({
  label,
  name,
  control,
  options,
  ...other
}: RHFRadioGroupProps<F>) => {
  return <>
    <Typography variant="caption" sx={{ marginBottom: 1 }} component="div">
      {label}
    </Typography>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RadioGroup
          aria-labelledby={`${name}-type-radio-buttons-group-label`}
          {...field}
          {...other}
        >
          <List
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
            }}
            disablePadding
          >
            {options.map((option, index) => (
              <Fragment key={option.value}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                      sx={{ width: '100%' }}
                      checked={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  </ListItemButton>
                </ListItem>
                {index < options.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        </RadioGroup>
      )}
    />
  </>;
};
