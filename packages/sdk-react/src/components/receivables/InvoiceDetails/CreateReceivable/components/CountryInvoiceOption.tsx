import { components } from '@/api';
import { css } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useTheme } from '@mui/material/styles';

interface CountryOptionProps {
  code: components['schemas']['AllowedCountries'];
}

export function CountryInvoiceOption({ code }: CountryOptionProps) {
  const theme = useTheme();
  const { i18n } = useLingui();

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
