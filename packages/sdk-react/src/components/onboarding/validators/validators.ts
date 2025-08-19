import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { differenceInCalendarYears, isValid } from 'date-fns';
import { electronicFormatIBAN, extractIBAN, isValidIBAN } from 'ibantools';
import { parsePhoneNumber } from 'libphonenumber-js';
import { z, type ZodObject, type ZodRawShape } from 'zod';

interface ZodCustomIssue {
  code: 'custom';
  message: string;
  path?: (string | number)[];
  input?: unknown;
  params?: Record<string, unknown>;
}

import { getRegionName } from '../utils';

export type ValidatorType =
  | ReturnType<typeof stringValidator>
  | ReturnType<typeof numberValidator>
  | ReturnType<typeof booleanValidator>
  | ReturnType<typeof emailValidator>
  | ReturnType<typeof urlValidator>
  | ReturnType<typeof ibanValidator>
  | ReturnType<typeof dateOfBirthValidator>
  | ReturnType<typeof phoneValidator>;

export type ValidationSchema<T> = Partial<Record<keyof T, ValidatorType>>;

export const stringValidator = () => z.string().nullable();

export const numberValidator = () => z.coerce.number().nullable();

export const booleanValidator = () => z.boolean();

export const emailValidator = (i18n: I18n) =>
  z.email(t(i18n)`Please enter a valid email address.`).nullable();

export const urlValidator = (i18n: I18n) =>
  z
    .url(
      t(
        i18n
      )`Invalid URL. Please ensure it starts with 'http://' or 'https://'.`
    )
    .nullable();



export const ibanValidator = (i18n: I18n, countryCode?: components['schemas']['AllowedCountries']) =>
  stringValidator().check((payload) => {
    validateIBAN(i18n, countryCode, payload, payload.value);
  });

/**
 * Validates the IBAN string based on format, validity and country consistency.
 *
 * @param i18n - LinguiJS i18n instance for localized error messages.
 * @param countryCode - Expected country code for IBAN validation.
 * @param payload - The Zod check payload with value and issues array.
 * @param iban - The IBAN string to be validated.
 * @returns void - Issues are added to the payload.
 */
function validateIBAN(
  i18n: I18n,
  countryCode: components['schemas']['AllowedCountries'] | undefined,
  payload: { value: string | null; issues: Array<Record<string, unknown>> },
  iban?: string | null
): void {
  if (!iban) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Please enter your IBAN number.`,
      input: iban,
    } satisfies ZodCustomIssue);
    return;
  }

  const formattedIban = electronicFormatIBAN(iban);

  if (!formattedIban) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Invalid IBAN`,
      input: iban,
    } satisfies ZodCustomIssue);
    return;
  }

  if (!isValidIBAN(formattedIban)) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Invalid IBAN`,
      input: iban,
    } satisfies ZodCustomIssue);
    return;
  }

  const extractedIBAN = extractIBAN(iban);

  if (countryCode && extractedIBAN.countryCode !== countryCode) {
    const country = getRegionName(countryCode);

    payload.issues.push({
      code: 'custom',
      message: t(i18n)`The IBAN should correspond to the chosen country - ${country}.`,
      input: iban,
      params: { countryCode, expectedCountry: country },
    } satisfies ZodCustomIssue);
  }
}



export const dateOfBirthValidator = (i18n: I18n) =>
  stringValidator().check((payload) => {
    validateDateOfBirth(payload, payload.value, i18n);
  });

/**
 * Validates the date of birth string based on the business profile validation context.
 *
 * @param payload - The Zod check payload with value and issues array.
 * @param value - The date of birth string to be validated.
 * @param i18n - LinguiJS i18n instance for localized error messages.
 * @returns void - Issues are added to the payload.
 */
function validateDateOfBirth(
  payload: { value: string | null; issues: Record<string, unknown>[] },
  value: string | null | undefined,
  i18n: I18n
): void {
  if (!value) return;

  const currentDate = new Date();
  const valueDate = new Date(value);

  if (!isValid(valueDate)) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Please provide a valid date.`,
      input: value,
    } satisfies ZodCustomIssue);
    return;
  }

  const difference = differenceInCalendarYears(currentDate, valueDate);

  if (difference === null) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Please provide a valid date.`,
      input: value,
    } satisfies ZodCustomIssue);
    return;
  }

  if (difference < 18) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Managers and owners must be at least 18 years old to use this service.`,
      input: value,
      params: { minimumAge: 18, actualAge: difference },
    } satisfies ZodCustomIssue);
    return;
  }

  if (difference > 120) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Managers and owners must be under 120 years old.`,
      input: value,
      params: { maximumAge: 120, actualAge: difference },
    } satisfies ZodCustomIssue);
  }
}



export const phoneValidator = (i18n: I18n) =>
  stringValidator().check((payload) => {
    validatePhone(i18n, payload, payload.value);
  });

/**
 * Validates the phone number string for proper format and possibility.
 *
 * @param i18n - LinguiJS i18n instance for localized error messages.
 * @param payload - The Zod check payload with value and issues array.
 * @param value - The phone number string to be validated.
 * @returns void - Issues are added to the payload.
 */
function validatePhone(
  i18n: I18n,
  payload: { value: string | null; issues: Array<Record<string, unknown>> },
  value: string | null | undefined
): void {
  if (value === null || value === undefined) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Please enter a phone number.`,
      input: value,
    } satisfies ZodCustomIssue);
    return;
  }

  try {
    const phoneNumber = parsePhoneNumber(value);

    if (phoneNumber && !phoneNumber.isPossible()) {
      payload.issues.push({
        code: 'custom',
        message: t(i18n)`Please enter a valid phone number.`,
        input: value,
        params: { isPossible: false },
      } satisfies ZodCustomIssue);
    }
  } catch {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`It looks like the phone number is too short.`,
      input: value,
      params: { parseError: true },
    } satisfies ZodCustomIssue);
  }
}

/**
 * Attach an object-level refinement to ensure IBAN country matches the selected country.
 * Reusable across schemas that include `iban` and `country` fields.
 */
export const withIbanCountryConsistency = <T extends ZodObject<ZodRawShape>>(
  schema: T,
  i18n: I18n,
  options: { ibanKey?: string; countryKey?: string } = {}
): T => {
  const { ibanKey = 'iban', countryKey = 'country' } = options;

  return schema.refine(
    (data: Record<string, unknown>) => {
      const iban = data[ibanKey] as string | undefined | null;
      const country = data[countryKey] as string | undefined | null;

      if (!iban || !country) return true;

      const formatted = electronicFormatIBAN(String(iban));
      const ibanCountry = formatted?.slice(0, 2);

      return !(ibanCountry && ibanCountry !== country);
    },
    {
      message: t(i18n)`IBAN country code must match the selected country.`,
      path: [ibanKey],
    }
  ) as T;
};
