import { useMoniteContext } from '@/core/context/MoniteContext';
import { I18nProvider } from '@lingui/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReactNode } from 'react';

export const MoniteI18nProvider = ({ children }: { children: ReactNode }) => {
  const { i18n, dateFnsLocale } = useMoniteContext();

  return (
    <I18nProvider
      // Due to the imperative nature of the I18nProvider,
      // a `key` must be added to change the locale in real time
      key={i18n.locale}
      i18n={i18n}
    >
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={dateFnsLocale}
      >
        {children}
      </LocalizationProvider>
    </I18nProvider>
  );
};
