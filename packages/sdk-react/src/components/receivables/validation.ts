import { AllowedCountries } from '@/enums/AllowedCountries';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import { VatIDTypeEnum } from '@/enums/VatIDTypeEnum';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { z } from 'zod';

export type { EntityBankAccountFields } from './types';

export const getCurrencyEnum = (_i18n: I18n) =>
  z.enum(CurrencyEnum as [string, ...string[]]);

const entityBankAccountSchema = z.object({
  account_holder_name: z.string().optional(),
  account_number: z.string().optional(),
  bank_name: z.string().optional(),
  bic: z.string().optional(),
  country: z.string(),
  currency: z.enum(CurrencyEnum),
  display_name: z.string().optional(),
  iban: z.string().optional(),
  is_default_for_currency: z.boolean(),
  routing_number: z.string().optional(),
  sort_code: z.string().optional(),
});

const getCreateBankAccountSchema = (i18n: I18n) =>
  entityBankAccountSchema
    .extend({
      country: z.string().min(1, t(i18n)`Country is required`),
      currency: z.enum(CurrencyEnum),
      is_default_for_currency: z.boolean(),
      display_name: z
        .string()
        .max(200, t(i18n)`Display name must be 200 characters or less`)
        .optional(),
    })
    .refine(
      (data) => {
        // Account number: required for all currencies except EUR
        if (data.currency === 'EUR') {
          return true;
        }
        return Boolean(data.account_number?.length);
      },
      {
        message: t(i18n)`Account number is required`,
        path: ['account_number'],
      }
    )
    .refine(
      (data) => {
        // Account holder name: required for USD and GBP
        if (data.currency === 'USD' || data.currency === 'GBP') {
          return Boolean(data.account_holder_name?.length);
        }
        return true;
      },
      {
        message: t(i18n)`Account holder name is required`,
        path: ['account_holder_name'],
      }
    )
    .refine(
      (data) => {
        // Routing number: required for all currencies except EUR and GBP
        if (data.currency === 'EUR' || data.currency === 'GBP') {
          return true;
        }
        return Boolean(data.routing_number?.length);
      },
      {
        message: t(i18n)`Routing number is required`,
        path: ['routing_number'],
      }
    )
    .refine(
      (data) => {
        // Sort code: required for all currencies except EUR and USD (must be 6 characters)
        if (data.currency === 'EUR' || data.currency === 'USD') {
          return Boolean(data.sort_code?.length === 6);
        }

        return true;
      },
      {
        message: t(i18n)`Sort code must be 6 characters`,
        path: ['sort_code'],
      }
    )
    .refine(
      (data) => {
        // IBAN: required for EUR
        if (data.currency === 'EUR') {
          return Boolean(data.iban?.length);
        }
        return true;
      },
      {
        message: t(i18n)`IBAN is required`,
        path: ['iban'],
      }
    );

const getUpdateBankAccountSchema = (i18n: I18n) => {
  return z
    .object({
      display_name: z
        .string()
        .max(200, t(i18n)`Display name must be 200 characters or less`)
        .optional(),
      account_holder_name: z.string().optional(),
    })
    .loose();
};

export const getEntityBankAccountValidationSchema = (
  i18n: I18n,
  isUpdateSchema?: boolean
) => {
  return isUpdateSchema
    ? getUpdateBankAccountSchema(i18n)
    : getCreateBankAccountSchema(i18n);
};

export { getCreateBankAccountSchema, getUpdateBankAccountSchema };

export const getEntityProfileValidationSchema = (i18n: I18n) => {
  return z.object({
    title: z.string().optional().meta({ title: t(i18n)`Title` }),
    name: z.string().optional().meta({ title: t(i18n)`Name` }),
    surname: z.string().optional().meta({ title: t(i18n)`Surname` }),
    email: z
      .email(t(i18n)`Invalid email format`)
      .optional()
      .meta({ 
        title: t(i18n)`Email`,
        description: t(i18n)`Email address for notifications and communication`
      }),
    tax_id: z.string().optional().meta({ 
      title: t(i18n)`Tax ID`,
      description: t(i18n)`Tax identification number`
    }),
    vat_id: z.string().optional().meta({ 
      title: t(i18n)`VAT ID`,
      description: t(i18n)`Value Added Tax identification number`
    }),
    vat_type: z
      .enum(VatIDTypeEnum as [string, ...string[]])
      .optional()
      .meta({ 
        title: t(i18n)`VAT Type`,
        description: t(i18n)`Type of VAT identification`
      }),
    vat_country: z
      .enum(AllowedCountries as [string, ...string[]])
      .optional()
      .meta({ 
        title: t(i18n)`VAT Country`,
        description: t(i18n)`Country where VAT is registered`
      }),
    address_line_1: z
      .string()
      .min(1, t(i18n)`Address line 1 is required`)
      .meta({ 
        title: t(i18n)`Address Line 1`,
        description: t(i18n)`Primary address line`
      }),
    address_line_2: z.string().optional().meta({ 
      title: t(i18n)`Address Line 2`,
      description: t(i18n)`Secondary address line (optional)`
    }),
    city: z
      .string()
      .min(1, t(i18n)`City is required`)
      .meta({ title: t(i18n)`City` }),
    postal_code: z
      .string()
      .min(1, t(i18n)`Postal code is required`)
      .meta({ 
        title: t(i18n)`Postal Code`,
        description: t(i18n)`ZIP or postal code`
      }),
    state: z.string().optional().meta({ 
      title: t(i18n)`State`,
      description: t(i18n)`State or province (if applicable)`
    }),
    country: z
      .enum(AllowedCountries as [string, ...string[]])
      .optional()
      .meta({ title: t(i18n)`Country` }),
    phone: z.string().optional().meta({ 
      title: t(i18n)`Phone`,
      description: t(i18n)`Contact phone number`
    }),
    website: z.url().optional().meta({ 
      title: t(i18n)`Website`,
      description: t(i18n)`Company or personal website URL`
    }),
  });
};

export type EntityProfileFormValues = z.infer<
  ReturnType<typeof getEntityProfileValidationSchema>
>;
