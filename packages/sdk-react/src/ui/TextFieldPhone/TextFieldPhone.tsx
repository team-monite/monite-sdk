import { useMemo } from 'react';
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { useLingui } from '@lingui/react';
import {
  type BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

export type TextFieldPhoneProps = BaseTextFieldProps & {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: CountryIso2;
};

export const TextFieldPhone = ({
  value,
  onChange,
  defaultCountry: defaultCountryIso2,
  SelectProps,
  ...restProps
}: TextFieldPhoneProps) => {
  const { i18n } = useLingui();

  const { root } = useRootElements();

  const defaultCountry =
    defaultCountryIso2 ||
    i18n.locale.split('-')[1]?.toLowerCase() ||
    i18n.locale;

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      value,
      defaultCountry,
      disableDialCodePrefill: true,
      countries: defaultCountries,
      onChange: ({ phone }) => onChange(phone),
    });

  const inputProps = useMemo(() => {
    if (!inputValue) return undefined;

    return {
      startAdornment: (
        <TextFieldPhoneSelect
          value={country.iso2}
          onChange={(country) => setCountry(country)}
        />
      ),
    };
  }, [inputValue, country.iso2, setCountry]);

  return (
    <TextField
      type="tel"
      value={inputValue}
      onChange={handlePhoneValueChange}
      inputRef={inputRef}
      InputProps={inputProps}
      SelectProps={{
        ...SelectProps,
        MenuProps: {
          ...SelectProps?.MenuProps,
          container: root,
        },
      }}
      {...restProps}
    />
  );
};

const TextFieldPhoneSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (country: string) => void;
}) => {
  const { root } = useRootElements();

  return (
    <InputAdornment
      position="start"
      style={{ marginRight: '2px', marginLeft: '-8px' }}
    >
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        MenuProps={{
          container: root,
          style: {
            height: '300px',
            width: '360px',
            top: '10px',
            left: '-34px',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
        sx={{
          width: 'max-content',

          // Remove default outline (display only on focus)
          fieldset: {
            display: 'none',
          },

          // Update default spacing
          '.MuiSelect-select': {
            padding: '8px',
            paddingRight: '24px !important',
          },
          svg: {
            right: 0,
          },
        }}
        renderValue={(value) => (
          <FlagImage
            iso2={value}
            style={{ display: 'flex', marginRight: 8, width: 24 }}
          />
        )}
      >
        {defaultCountries.map((country) => {
          const { iso2, dialCode, name } = parseCountry(country);

          return (
            <MenuItem key={iso2} value={iso2}>
              <FlagImage iso2={iso2} style={{ marginRight: 8, width: 24 }} />
              <Typography marginRight="8px">{name}</Typography>
              <Typography color="gray">+{dialCode}</Typography>
            </MenuItem>
          );
        })}
      </Select>
    </InputAdornment>
  );
};
