import React, {
  lazy,
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { compileLinguiDynamicMessages } from '@/utils/compile-lingui-dynamic-messages';
import { type I18n, type Messages, setupI18n } from '@lingui/core';
import { I18nProvider as I18nProviderBase } from '@lingui/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import type { Locale } from 'date-fns';
import type DateFNSLocales from 'date-fns/locale';
import enGB from 'date-fns/locale/en-GB';
import deepEqual from 'deep-eql';

import { messages as enLocaleMessages } from '../i18n/locales/en/messages';

type MoniteSupportedMessages = Messages;

export type MoniteLocale = {
  /**
   * `code` responsible for internationalised Widgets language, internationalised number and currency formatting.
   * By default it uses `navigator.language` as a fallback in MoniteProvider.
   * Intl format values are accepted and won't cause any trouble.
   *
   * E.g. 'en-GB', 'de-DE', etc.
   */
  code: string;
  /**
   * `messages` responsible for internationalised Widgets translation.
   * By default it uses `enLocaleMessages` as a fallback in MoniteProvider.
   */
  messages?: MoniteSupportedMessages;
};

export const I18nLocaleProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useMoniteContext();

  return (
    <LinguiI18nProvider i18n={i18n}>
      <DatePickerI18nProvider localeCode={i18n.locale}>
        {children}
      </DatePickerI18nProvider>
    </LinguiI18nProvider>
  );
};

/**
 * Provides a dynamic `i18n` for the children components.
 * Under the hood, it compiles the provided `locale.messages` by the Customer
 * to the format that `@lingui` can understand.
 *
 * @example
 * ```tsx
 * <LinguiDynamicI18n locale={locale}>
 *   {(i18n) => <I18nProvider i18n={i18n}>{children}</I18nProvider>}
 * </LinguiDynamicI18n>
 * ```
 */
export const LinguiDynamicI18n = ({
  locale,
  children,
}: {
  locale: MoniteLocale;
  children: (i18n: I18n) => ReactNode;
}) => {
  const previousLocaleMessages = useRef(locale.messages);

  const stableLocaleMessages = useMemo(() => {
    if (deepEqual(locale.messages, previousLocaleMessages.current))
      return previousLocaleMessages.current;
    return (previousLocaleMessages.current = locale.messages);
  }, [locale.messages]);

  const Provider = useMemo(() => {
    return lazy(async () => ({
      default: await createLinguiDynamicI18nProvider({
        code: locale.code,
        messages: stableLocaleMessages,
      }),
    }));
  }, [locale.code, stableLocaleMessages]);

  return (
    <Suspense>
      <Provider>{children}</Provider>
    </Suspense>
  );
};

const createLinguiDynamicI18nProvider = async (locale: MoniteLocale) => {
  const compiledMessages = locale.messages
    ? await compileLinguiDynamicMessages(locale.messages)
    : undefined;

  return function CompiledLinguiI18n({
    children,
  }: {
    children: (i18n: I18n) => ReactNode;
  }) {
    const i18n = useMemo(() => {
      return setupI18n({
        locale: locale.code,
        messages: {
          [locale.code]: {
            ...enLocaleMessages, // We must provide EN messages as a fallback dictionary
            ...compiledMessages,
          },
        },
      });
    }, []);

    return <>{children(i18n)}</>;
  };
};

const LinguiI18nProvider = ({
  i18n,
  children,
}: {
  i18n: I18n;
  children: ReactNode;
}) => {
  return (
    <I18nProviderBase
      key={i18n.locale} // Due to the imperative nature of the I18nProvider, it is necessary to add a `key` for Realtime language change
      i18n={i18n}
    >
      {children}
    </I18nProviderBase>
  );
};

const DatePickerI18nProvider = ({
  children,
  localeCode,
}: {
  children: ReactNode;
  localeCode: MoniteLocale['code'];
}) => {
  const [adapterLocale, setAdapterLocale] = useState<Locale>(enGB);

  useEffect(() => {
    const localCodeParts = localeCode.split('-');
    const localCodeCommon = localCodeParts[0];
    const localCodeFull = localCodeParts.join('');

    const isDateFnsLocaleSupported = (
      code: string
    ): code is keyof typeof dateFnsLocales => code in dateFnsLocales;

    (isDateFnsLocaleSupported(localCodeFull)
      ? dateFnsLocales[localCodeFull]()
      : isDateFnsLocaleSupported(localCodeCommon)
      ? dateFnsLocales[localCodeCommon]()
      : dateFnsLocales.enGB()
    )
      .catch((e) => {
        console.error('Locale has not been loaded: ', e);
        return dateFnsLocales.enGB();
      })
      .then((dateFnsLocaleModule) =>
        setAdapterLocale(dateFnsLocaleModule.default)
      );
  }, [localeCode]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={adapterLocale}
    >
      {children}
    </LocalizationProvider>
  );
};

export const isEmptyMultipleKeysObject = (obj: object) => {
  for (const prop in obj) if (obj.hasOwnProperty(prop)) return false;
  return true;
};

const dateFnsLocales: Record<
  keyof typeof DateFNSLocales,
  () => Promise<{ default: Locale }>
> = {
  af: () => import('date-fns/locale/af'),
  ar: () => import('date-fns/locale/ar'),
  arDZ: () => import('date-fns/locale/ar-DZ'),
  arEG: () => import('date-fns/locale/ar-EG'),
  arMA: () => import('date-fns/locale/ar-MA'),
  arSA: () => import('date-fns/locale/ar-SA'),
  arTN: () => import('date-fns/locale/ar-TN'),
  az: () => import('date-fns/locale/az'),
  be: () => import('date-fns/locale/be'),
  beTarask: () => import('date-fns/locale/be-tarask'),
  bg: () => import('date-fns/locale/bg'),
  bn: () => import('date-fns/locale/bn'),
  bs: () => import('date-fns/locale/bs'),
  ca: () => import('date-fns/locale/ca'),
  cs: () => import('date-fns/locale/cs'),
  cy: () => import('date-fns/locale/cy'),
  da: () => import('date-fns/locale/da'),
  de: () => import('date-fns/locale/de'),
  deAT: () => import('date-fns/locale/de-AT'),
  el: () => import('date-fns/locale/el'),
  enAU: () => import('date-fns/locale/en-AU'),
  enCA: () => import('date-fns/locale/en-CA'),
  enGB: () => import('date-fns/locale/en-GB'),
  enIE: () => import('date-fns/locale/en-IE'),
  enIN: () => import('date-fns/locale/en-IN'),
  enNZ: () => import('date-fns/locale/en-NZ'),
  enUS: () => import('date-fns/locale/en-US'),
  enZA: () => import('date-fns/locale/en-ZA'),
  eo: () => import('date-fns/locale/eo'),
  es: () => import('date-fns/locale/es'),
  et: () => import('date-fns/locale/et'),
  eu: () => import('date-fns/locale/eu'),
  faIR: () => import('date-fns/locale/fa-IR'),
  fi: () => import('date-fns/locale/fi'),
  fr: () => import('date-fns/locale/fr'),
  frCA: () => import('date-fns/locale/fr-CA'),
  frCH: () => import('date-fns/locale/fr-CH'),
  fy: () => import('date-fns/locale/fy'),
  gd: () => import('date-fns/locale/gd'),
  gl: () => import('date-fns/locale/gl'),
  gu: () => import('date-fns/locale/gu'),
  he: () => import('date-fns/locale/he'),
  hi: () => import('date-fns/locale/hi'),
  hr: () => import('date-fns/locale/hr'),
  ht: () => import('date-fns/locale/ht'),
  hu: () => import('date-fns/locale/hu'),
  hy: () => import('date-fns/locale/hy'),
  id: () => import('date-fns/locale/id'),
  is: () => import('date-fns/locale/is'),
  it: () => import('date-fns/locale/it'),
  itCH: () => import('date-fns/locale/it-CH'),
  ja: () => import('date-fns/locale/ja'),
  jaHira: () => import('date-fns/locale/ja-Hira'),
  ka: () => import('date-fns/locale/ka'),
  kk: () => import('date-fns/locale/kk'),
  km: () => import('date-fns/locale/km'),
  kn: () => import('date-fns/locale/kn'),
  ko: () => import('date-fns/locale/ko'),
  lb: () => import('date-fns/locale/lb'),
  lt: () => import('date-fns/locale/lt'),
  lv: () => import('date-fns/locale/lv'),
  mk: () => import('date-fns/locale/mk'),
  mn: () => import('date-fns/locale/mn'),
  ms: () => import('date-fns/locale/ms'),
  mt: () => import('date-fns/locale/mt'),
  nb: () => import('date-fns/locale/nb'),
  nl: () => import('date-fns/locale/nl'),
  nlBE: () => import('date-fns/locale/nl-BE'),
  nn: () => import('date-fns/locale/nn'),
  oc: () => import('date-fns/locale/oc'),
  pl: () => import('date-fns/locale/pl'),
  pt: () => import('date-fns/locale/pt'),
  ptBR: () => import('date-fns/locale/pt-BR'),
  ro: () => import('date-fns/locale/ro'),
  ru: () => import('date-fns/locale/ru'),
  sk: () => import('date-fns/locale/sk'),
  sl: () => import('date-fns/locale/sl'),
  sq: () => import('date-fns/locale/sq'),
  sr: () => import('date-fns/locale/sr'),
  srLatn: () => import('date-fns/locale/sr-Latn'),
  sv: () => import('date-fns/locale/sv'),
  ta: () => import('date-fns/locale/ta'),
  te: () => import('date-fns/locale/te'),
  th: () => import('date-fns/locale/th'),
  tr: () => import('date-fns/locale/tr'),
  ug: () => import('date-fns/locale/ug'),
  uk: () => import('date-fns/locale/uk'),
  uz: () => import('date-fns/locale/uz'),
  uzCyrl: () => import('date-fns/locale/uz-Cyrl'),
  vi: () => import('date-fns/locale/vi'),
  zhCN: () => import('date-fns/locale/zh-CN'),
  zhHK: () => import('date-fns/locale/zh-HK'),
  zhTW: () => import('date-fns/locale/zh-TW'),
};
