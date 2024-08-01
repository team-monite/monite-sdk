import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

type OnboardingRepresentativeRoleProps = {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function OnboardingRepresentativeRole({
  title,
  value,
  onChange,
}: OnboardingRepresentativeRoleProps) {
  const { i18n } = useLingui();
  return (
    <FormControl>
      <FormLabel>{title}</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={(_, value) => onChange(value === 'true')}
      >
        <FormControlLabel
          sx={{ typography: 'overline' }}
          value="true"
          control={<Radio />}
          label={t(i18n)`Yes`}
        />
        <FormControlLabel
          value="false"
          control={<Radio />}
          label={t(i18n)`No`}
        />
      </RadioGroup>
    </FormControl>
  );
}
