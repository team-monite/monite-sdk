import { getRegionName } from '../utils';
import { components } from '@/api';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { differenceInYears, isAfter, isValid } from 'date-fns';
import { electronicFormatIBAN, extractIBAN, isValidIBAN } from 'ibantools';
import { parsePhoneNumber } from 'libphonenumber-js';
import { z, type ZodObject, type ZodRawShape } from 'zod';

type ValidationPayload = {
  issues: Array<{
    code: string;
    message?: string;
    input?: unknown;
    path?: PropertyKey[];
    params?: Record<string, unknown>;
  }>;
  value: string | null;
};



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

export const ibanValidator = (
  i18n: I18n,
  countryCode?: components['schemas']['AllowedCountries']
) =>
  stringValidator().check((payload) => {
    if (!payload.value) return;
    validateIBAN(payload.value, i18n, countryCode, payload);
  });

/**
 * Validates the IBAN string based on format, validity and country consistency.
 *
 * @param iban - The IBAN string to be validated.
 * @param i18n - LinguiJS i18n instance for localized error messages.
 * @param countryCode - Expected country code for IBAN validation.
 * @param payload - Zod ParsePayload for adding issues.
 * @returns void - Issues are added to payload.issues.
 */
function validateIBAN(
  iban: string,
  i18n: I18n,
  countryCode: components['schemas']['AllowedCountries'] | undefined,
  payload: ValidationPayload
): void {
  const formattedIban = electronicFormatIBAN(iban);

  if (!formattedIban) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Invalid IBAN`,
      input: iban,
      path: [],
    });
    return;
  }

  if (!isValidIBAN(formattedIban)) {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`Invalid IBAN`,
      input: iban,
      path: [],
    });
    return;
  }

  const extractedIBAN = extractIBAN(iban);

  if (countryCode && extractedIBAN.countryCode !== countryCode) {
    const country = getRegionName(countryCode);

    payload.issues.push({
      code: 'custom',
      message: t(
        i18n
      )`The IBAN should correspond to the chosen country - ${country}.`,
      input: iban,
      path: [],
      params: { countryCode, expectedCountry: country },
    });
  }
}

export const dateOfBirthValidator = (i18n: I18n) =>
  stringValidator().check((payload) => {
    if (!payload.value) return;
    validateDateOfBirth(payload.value, i18n, payload);
  });

/**
 * Validates the date of birth string using Zod's modern check API.
 *
 * @param value - The date of birth string to be validated.
 * @param i18n - LinguiJS i18n instance for localized error messages.
 * @param payload - Zod ParsePayload for adding issues.
 * @returns void - Issues are added to payload.issues.
 */
function validateDateOfBirth(
  value: string,
  i18n: I18n,
  ctx: ValidationPayload
): void {
  const valueDate = new Date(value);
  const currentDate = new Date();

  if (!isValid(valueDate)) {
    ctx.issues.push({
      code: 'custom',
      message: t(i18n)`Please provide a valid date.`,
      input: value,
    });
    return;
  }

  if (isAfter(valueDate, currentDate)) {
    ctx.issues.push({
      code: 'custom',
      message: t(i18n)`Date of birth cannot be in the future.`,
      input: value,
    });
    return;
  }

  const difference = differenceInYears(currentDate, valueDate);

  if (difference < 18) {
    ctx.issues.push({
      code: 'custom',
      message: t(i18n)`Managers and owners must be at least 18 years old to use this service.`,
      input: value,
      params: { minimumAge: 18, actualAge: difference },
    });
    return;
  }

  if (difference > 120) {
    ctx.issues.push({
      code: 'custom',
      message: t(i18n)`Managers and owners must be under 120 years old.`,
      input: value,
      params: { maximumAge: 120, actualAge: difference },
    });
  }
}

export const phoneValidator = (i18n: I18n) =>
  stringValidator().check((payload) => {
    if (!payload.value) return;
    validatePhone(payload.value, i18n, payload);
  });

/**
 * Validates the phone number string using Zod's modern check API.
 *
 * @param value - The phone number string to be validated.
 * @param i18n - LinguiJS i18n instance for localized error messages.
 * @param payload - Zod ParsePayload for adding issues.
 * @returns void - Issues are added to payload.issues.
 */
function validatePhone(
  value: string,
  i18n: I18n,
  payload: ValidationPayload
): void {
  try {
    const phoneNumber = parsePhoneNumber(value);

    if (phoneNumber && !phoneNumber.isPossible()) {
      payload.issues.push({
        code: 'custom',
        message: t(i18n)`Please enter a valid phone number.`,
        input: value,
        path: [],
        params: { isPossible: false },
      });
    }
  } catch {
    payload.issues.push({
      code: 'custom',
      message: t(i18n)`It looks like the phone number is too short.`,
      input: value,
      path: [],
      params: { parseError: true },
    });
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
