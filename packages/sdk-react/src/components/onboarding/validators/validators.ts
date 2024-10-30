import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { components } from '@monite/sdk-api/src/api';

import { differenceInCalendarYears, isValid } from 'date-fns';
import { electronicFormatIBAN, extractIBAN, isValidIBAN } from 'ibantools';
import { parsePhoneNumber } from 'libphonenumber-js';
import type { TestContext, ValidationError } from 'yup';
import { boolean, number, string } from 'yup';

import { getRegionName } from '../utils';

export type CustomValidationContext<T> = TestContext & {
  parent: T;
};

export type ValidatorType =
  | ReturnType<typeof stringValidator>
  | ReturnType<typeof numberValidator>
  | ReturnType<typeof booleanValidator>;

export type ValidationSchema<T> = Partial<Record<keyof T, ValidatorType>>;

export const stringValidator = () => string().nullable(true);

export const numberValidator = () => number().nullable(true);

export const booleanValidator = () => boolean();

export const ibanValidator = (i18n: I18n) =>
  stringValidator().test('iban', '', (value, ctx) =>
    validateIBAN(i18n, ctx.parent.country, ctx, value)
  );

export const dateOfBirthValidator = (i18n: I18n) =>
  stringValidator().test('dob', '', (value, ctx) =>
    validateDateOfBirth(ctx, value, i18n)
  );

export const phoneValidator = (i18n: I18n) =>
  stringValidator().test('phone', '', (value, ctx) =>
    validatePhone(i18n, ctx, value)
  );

function validateIBAN(
  i18n: I18n,
  countryCode: components['schemas']['AllowedCountries'],
  ctx: CustomValidationContext<string | null>,
  iban?: string | null
): true | ValidationError {
  if (!iban) {
    return ctx.createError({
      message: t(i18n)`Please enter your IBAN number.`,
    });
  }

  const formattedIban = electronicFormatIBAN(iban);

  if (!formattedIban)
    return ctx.createError({ message: t(i18n)`Invalid IBAN` });

  if (!isValidIBAN(formattedIban)) {
    return ctx.createError({ message: t(i18n)`Invalid IBAN` });
  }

  const extractedIBAN = extractIBAN(iban);

  if (countryCode && extractedIBAN.countryCode !== countryCode) {
    const country = getRegionName(countryCode);

    return ctx.createError({
      message: t(
        i18n
      )`The IBAN should correspond to the chosen country - ${country}.`,
    });
  }

  return true;
}

/**
 * Validates the date of birth string based on the business profile validation context.
 *
 * @param ctx - The business profile validation context.
 * @param value - The date of birth string to be validated.
 * @param i18n LinguiJS i18n instance.
 * @returns A ValidationError if the date of birth
 *  is invalid or does not meet age requirements,
 *  otherwise returns true.
 */
function validateDateOfBirth(
  ctx: CustomValidationContext<string>,
  value: string | null | undefined,
  i18n: I18n
): true | ValidationError {
  if (!value) return true;

  const currentDate = new Date();
  const valueDate = new Date(value);

  if (!isValid(valueDate)) {
    return ctx.createError({
      message: t(i18n)`Please provide a valid date.`,
    });
  }

  const difference = differenceInCalendarYears(currentDate, valueDate);

  if (difference === null) {
    return ctx.createError({
      message: t(i18n)`Please provide a valid date.`,
    });
  }

  if (difference < 18) {
    return ctx.createError({
      message: t(
        i18n
      )`Managers and owners must be at least 18 years old to use this service.`,
    });
  }

  if (difference > 120) {
    return ctx.createError({
      message: t(i18n)`Managers and owners must be under 120 years old.`,
    });
  }

  return true;
}

function validatePhone(
  i18n: I18n,
  ctx: CustomValidationContext<string>,
  value: string | null | undefined
): true | ValidationError {
  if (value === null || value === undefined) {
    return ctx.createError({
      message: t(i18n)`Please enter a phone number.`,
    });
  }

  try {
    const phoneNumber = parsePhoneNumber(value);

    if (phoneNumber && !phoneNumber.isPossible()) {
      return ctx.createError({
        message: t(i18n)`Please enter a valid phone number.`,
      });
    }
  } catch (_) {
    return ctx.createError({
      message: t(i18n)`It looks like the phone number is too short.`,
    });
  }

  return true;
}
