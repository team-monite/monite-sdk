import React from 'react';
import { Box } from '@mui/material';
import { CountryType } from '../../Countries';
import { AutocompleteRenderOptionState } from '@mui/material/Autocomplete/Autocomplete';

export type OnboardingCountryOptionProps = {
  option: CountryType;
  props: React.HTMLAttributes<HTMLLIElement>;
  state: AutocompleteRenderOptionState;
};

export default function OnboardingCountryOption({
  option,
  props,
}: OnboardingCountryOptionProps) {
  return (
    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
      <img
        loading="lazy"
        width="20"
        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
        alt={option.label}
      />
      {`${option.label} (${option.code})`}
    </Box>
  );
}
