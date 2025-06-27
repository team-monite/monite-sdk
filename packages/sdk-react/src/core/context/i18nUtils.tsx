import React, { lazy, ReactNode, Suspense, useMemo, useRef } from 'react';

import { type I18n, type Messages, setupI18n } from '@lingui/core';

import type { Locale as DateFnsLocale } from 'date-fns';
import type DateFNSLocalesObject from 'date-fns/locale';
// Renamed to avoid conflict
import deepEqual from 'deep-eql';

import { messages as enLocaleMessages } from '../i18n/locales/en/messages';

// Types
//-----------------------------------------------------------------------------
type MoniteSupportedMessages = Messages;

export type MoniteLocale = {
  code?: string;
  messages?: MoniteSupportedMessages;
  currencyNumberFormat?: {
    display?: 'symbol' | 'code' | 'name';
    localeCode?: string;
  };
  dateFormat?: Pick<
    Intl.DateTimeFormatOptions,
    | 'weekday'
    | 'year'
    | 'month'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'timeZoneName'
    | 'hour12'
    | 'timeZone'
  >;
};

export type MoniteLocaleWithRequired = DeepRequired<
  Omit<MoniteLocale, 'messages' | 'dateFormat'>
> &
  Partial<Pick<MoniteLocale, 'messages' | 'dateFormat'>> & {
    dateTimeFormat?: Intl.DateTimeFormatOptions;
  };

type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

// Date FNS Locales
//-----------------------------------------------------------------------------
const dateFnsLocales: Record<
  keyof typeof DateFNSLocalesObject | 'en',
  () => Promise<{ default: DateFnsLocale }>
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
  en: () => import('date-fns/locale/en-US'), // date-fns does not have a locale for `en`
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

// I18n Loader and Helpers
//-----------------------------------------------------------------------------
const loadDateFnsLocale = async (localeCode: string) => {
  const localeCodeParts = localeCode.split('-');
  const localeCodeCommon = localeCodeParts[0];
  const localeCodeFull = localeCodeParts.join('');

  const isDateFnsLocaleSupported = (
    code: string
  ): code is keyof typeof dateFnsLocales => code in dateFnsLocales;

  try {
    if (isDateFnsLocaleSupported(localeCodeFull)) {
      return dateFnsLocales[localeCodeFull]().then((module) => module.default);
    }

    if (isDateFnsLocaleSupported(localeCodeCommon)) {
      return dateFnsLocales[localeCodeCommon]().then(
        (module) => module.default
      );
    }
  } catch (error) {
    console.error('DateFnsLocale has not been loaded: ', error);
  }

  return dateFnsLocales.en().then((module) => module.default);
};

const createDynamicI18nProvider = async (
  locale: Pick<MoniteLocaleWithRequired, 'code' | 'messages'>
) => {
  const [linguiCompiledMessages, dateFnsLocale] = await Promise.all([
    locale.messages
      ? Promise.resolve(locale.messages)
      : Promise.resolve(undefined), // Ensure it resolves with a value
    loadDateFnsLocale(locale.code),
  ]);

  return function CompiledLinguiI18n({
    children,
  }: {
    children: (i18n: I18n, dateFnsLocale: DateFnsLocale) => ReactNode;
  }) {
    const i18n = useMemo(() => {
      return setupI18n({
        locale: locale.code,
        messages: {
          [locale.code]: {
            ...enLocaleMessages, // We must provide EN messages as a fallback dictionary
            ...(linguiCompiledMessages || {}), // Handle undefined linguiCompiledMessages
          },
        },
      });
    }, []);

    return <>{children(i18n, dateFnsLocale)}</>;
  };
};

export const I18nLoader = ({
  locale,
  children,
}: {
  locale: MoniteLocaleWithRequired;
  children: (i18n: I18n, dateFnsLocale: DateFnsLocale) => ReactNode;
}) => {
  const previousLocaleMessages = useRef(locale.messages);

  const stableLocaleMessages = useMemo(() => {
    if (deepEqual(locale.messages, previousLocaleMessages.current)) {
      return previousLocaleMessages.current;
    }
    previousLocaleMessages.current = locale.messages;
    return locale.messages;
  }, [locale.messages]);

  const Provider = useMemo(() => {
    return lazy(async () => ({
      default: await createDynamicI18nProvider({
        code: locale.code,
        messages: stableLocaleMessages,
      }),
    }));
  }, [locale.code, stableLocaleMessages]);

  return (
    <Suspense fallback={null}>
      <Provider>{children}</Provider>
    </Suspense>
  );
};

export function getLocaleWithDefaults(
  locale: MoniteLocale | undefined
): MoniteLocaleWithRequired {
  const getDefaultLocaleCode = () => {
    if (typeof navigator === 'undefined') {
      return 'en';
    }
    return navigator.language;
  };

  const code = locale?.code ?? getDefaultLocaleCode();

  return {
    ...locale,
    code,
    currencyNumberFormat: {
      localeCode: locale?.currencyNumberFormat?.localeCode ?? code,
      display: locale?.currencyNumberFormat?.display ?? 'symbol',
    },
    dateFormat: {
      ...(locale?.dateFormat?.weekday && {
        weekday: locale?.dateFormat?.weekday,
      }),
      year: locale?.dateFormat?.year ?? 'numeric',
      month: locale?.dateFormat?.month ?? 'short',
      day: locale?.dateFormat?.day ?? '2-digit',
    },
    dateTimeFormat: {
      ...(locale?.dateFormat?.weekday && {
        weekday: locale?.dateFormat?.weekday,
      }),
      year: locale?.dateFormat?.year ?? 'numeric',
      month: locale?.dateFormat?.month ?? 'short',
      day: locale?.dateFormat?.day ?? '2-digit',
      hour: locale?.dateFormat?.hour ?? '2-digit',
      minute: locale?.dateFormat?.minute ?? '2-digit',
      ...(locale?.dateFormat?.second && {
        second: locale?.dateFormat?.second,
      }),
      ...(locale?.dateFormat?.timeZoneName && {
        timeZoneName: locale?.dateFormat?.timeZoneName,
      }),
      ...(locale?.dateFormat?.hour12 && {
        hour12: locale?.dateFormat?.hour12,
      }),
      ...(locale?.dateFormat?.timeZone && {
        timeZone: locale?.dateFormat?.timeZone,
      }),
    },
  };
}
