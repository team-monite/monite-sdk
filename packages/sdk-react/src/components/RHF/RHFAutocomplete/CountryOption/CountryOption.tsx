import { HTMLAttributes } from 'react';

import { CountryType } from '@/core/utils';
import { css } from '@emotion/react';
import { AutocompleteRenderOptionState } from '@mui/material/Autocomplete/Autocomplete';

export type CountryOptionProps = {
  option: CountryType;
  props: HTMLAttributes<HTMLLIElement>;
  state: AutocompleteRenderOptionState;
};

export function CountryOption({ option, props }: CountryOptionProps) {
  return (
    <li
      css={css`
        & > img {
          margin-right: 8px;
          flex-shrink: 0;
        }
      `}
      {...props}
    >
      <img
        loading="lazy"
        width="20"
        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
        alt={option.label}
      />
      {`${option.label} (${option.code})`}
    </li>
  );
}
