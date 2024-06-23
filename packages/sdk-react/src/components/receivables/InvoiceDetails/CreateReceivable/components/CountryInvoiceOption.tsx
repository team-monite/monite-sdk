'use client';

import React from 'react';

import { css } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AllowedCountries } from '@monite/sdk-api';
import { useTheme } from '@mui/material/styles';

interface CountryOptionProps {
  code?: AllowedCountries;
}

export function CountryInvoiceOption({ code }: CountryOptionProps) {
  const theme = useTheme();
  const { i18n } = useLingui();

  if (!code) {
    return null;
  }

  return (
    <img
      css={css`
        margin-right: ${theme.spacing(1)};
      `}
      loading="lazy"
      width="25"
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
      alt={t(i18n)`Country flag`}
    />
  );
}
