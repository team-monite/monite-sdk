import { AllowedCountries } from '@/enums/AllowedCountries';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import { VatIDTypeEnum } from '@/enums/VatIDTypeEnum';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { z } from 'zod';

export const getEntityBankAccountValidationSchema = (
  i18n: I18n,
  isUpdateSchema?: boolean
) => {
  const baseSchema = z.object({
    country: z.enum([...AllowedCountries, ''] as const).meta({ title: t(i18n)`Country` }),
    
    currency: z.enum([...CurrencyEnum, ''] as const).meta({ title: t(i18n)`Currency` }),
    
    account_holder_name: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`Account holder name`,
        description: t(i18n)`Required for USD and GBP currencies`
      }),
    
    account_number: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`Account number`,
        description: t(i18n)`Bank account number (not required for EUR)`
      }),
    
    bank_name: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`Bank name`,
        description: t(i18n)`The name of the bank institution`
      }),
    
    bic: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`SWIFT / BIC`,
        description: t(i18n)`Bank Identifier Code for international transfers`
      }),
    
    display_name: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`Display name`,
        description: t(i18n)`A friendly name for this bank account`
      }),
    
    iban: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`IBAN`,
        description: t(i18n)`International Bank Account Number (required for EUR)`
      }),
    
    is_default_for_currency: z.boolean(),
    
    routing_number: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`Routing number`,
        description: t(i18n)`Required for non-EUR and non-GBP currencies`
      }),
    
    sort_code: z
      .string()
      .optional()
      .meta({ 
        title: t(i18n)`Sort code`,
        description: t(i18n)`6-digit code required for non-EUR and non-USD currencies`
      }),
  });

  const schemaWithValidation = baseSchema
    .refine(
      (data) => {
        if (isUpdateSchema) return true;
        return data.country !== '';
      },
      {
        message: t(i18n)`Country is required`,
        path: ['country'],
      }
    )
    .refine(
      (data) => {
        if (isUpdateSchema) return true;
        return data.currency !== '';
      },
      {
        message: t(i18n)`Currency is required`,
        path: ['currency'],
      }
    )
    .refine(
      (data) => {
        if (data.currency === 'EUR' || data.currency === '') {
          return true;
        }
        return data.account_number && data.account_number.length > 0;
      },
      {
        message: t(i18n)`Account number is required`,
        path: ['account_number'],
      }
    )
    .refine(
      (data) => {
        if (data.currency === 'USD' || data.currency === 'GBP') {
          return data.account_holder_name && data.account_holder_name.length > 0;
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
        if (data.currency !== 'EUR' && data.currency !== 'GBP' && data.currency !== '') {
          return data.routing_number && data.routing_number.length > 0;
        }
        return true;
      },
      {
        message: t(i18n)`Routing number is required`,
        path: ['routing_number'],
      }
    )
    .refine(
      (data) => {
        if (data.currency !== 'EUR' && data.currency !== 'USD' && data.currency !== '') {
          return data.sort_code && data.sort_code.length === 6;
        }
        return true;
      },
      {
        message: t(i18n)`Sort code is required and must be exactly 6 characters`,
        path: ['sort_code'],
      }
    )
    .refine(
      (data) => {
        if (data.currency === 'EUR') {
          return data.iban && data.iban.length > 0;
        }
        return true;
      },
      {
        message: t(i18n)`IBAN is required`,
        path: ['iban'],
      }
    );

  return schemaWithValidation;
};

export type EntityBankAccountFormValues = z.infer<
  ReturnType<typeof getEntityBankAccountValidationSchema>
>;

/**
 * Utility function to extract field title from a Zod schema
 * Usage: getFieldTitle(schema, 'fieldName') -> returns the title from .meta()
 */
export const getFieldTitle = (schema: z.ZodTypeAny, fieldName: string): string | undefined => {
  try {
    if ('shape' in schema && schema.shape && typeof schema.shape === 'object') {
      const shape = schema.shape as Record<string, any>;
      const field = shape[fieldName];
      if (field && 'meta' in field && typeof field.meta === 'function') {
        const metadata = field.meta();
        return metadata?.title;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console, lingui/no-unlocalized-strings
    console.warn('Could not extract title for field:', fieldName, error);
  }
  return undefined;
};

/**
 * Utility function to extract field description from a Zod schema
 * Usage: getFieldDescription(schema, 'fieldName') -> returns the description from .meta()
 */
export const getFieldDescription = (schema: z.ZodTypeAny, fieldName: string): string | undefined => {
  try {
    if ('shape' in schema && schema.shape && typeof schema.shape === 'object') {
      const shape = schema.shape as Record<string, any>;
      const field = shape[fieldName];
      if (field && 'meta' in field && typeof field.meta === 'function') {
        const metadata = field.meta();
        return metadata?.description;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console, lingui/no-unlocalized-strings
    console.warn('Could not extract description for field:', fieldName, error);
  }
  return undefined;
};

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

export const manualPaymentRecordValidationSchema = (
  i18n: I18n,
  amount_due: number
) =>
  z.object({
    amount: z
      .number()
      .meta({ title: t(i18n)`Amount` })
      .min(0, t(i18n)`Can't be a negative number`)
      .max(amount_due, t(i18n)`Can't be more than the amount due`),
    payment_date: z.date().meta({ title: t(i18n)`Date` }),
    payment_time: z.date().meta({ title: t(i18n)`Time` }),
  });

export type ManualPaymentRecordFormValues = z.infer<
  ReturnType<typeof manualPaymentRecordValidationSchema>
>;

export const getEmailInvoiceDetailsSchema = (i18n: I18n) =>
  z.object({
    to: z.string().min(1, t(i18n)`To is required`),
    subject: z.string().min(1, t(i18n)`Subject is required`),
    body: z.string().min(1, t(i18n)`Body is required`),
  });

export type EmailInvoiceDetailsFormValues = z.infer<
  ReturnType<typeof getEmailInvoiceDetailsSchema>
>;