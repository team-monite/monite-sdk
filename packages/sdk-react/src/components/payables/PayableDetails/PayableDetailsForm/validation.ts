import { components } from '@/api';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export const isFieldRequiredByValidations = (
  fieldName: PayablesFieldsAllowedForValidate,
  payablesValidations?: PayableValidationsResource
): boolean => {
  return Boolean(payablesValidations?.required_fields?.includes(fieldName));
};

const requiredString = (i18n: I18n, label: string) => 
  z.string()
    .min(1, t(i18n)`${label} is required`)
    .refine(val => val.trim().length > 0, {
      message: t(i18n)`${label} cannot be empty or only whitespace`
    })
    .meta({ title: label });

export const getPayableDetailsValidationSchema = (
  i18n: I18n, 
  payablesValidations?: PayableValidationsResource
) => {
  const lineItemSchema = z.object({
    id: z.string(),
    name: requiredString(i18n, t(i18n)`Item name`),
    
    quantity: z.number()
      .int(t(i18n)`Item quantity must be a whole number`)
      .positive(t(i18n)`Item quantity must be greater than 0`)
      .meta({ 
        title: t(i18n)`Item quantity`,
        description: t(i18n)`Number of items`,
        examples: [1, 2, 5, 10]
      }),
    
    price: z.number()
      .min(0, t(i18n)`Item price cannot be negative`)
      .meta({ 
        title: t(i18n)`Item price`,
        description: t(i18n)`Price per unit`,
        examples: [10.99, 25.50, 100.00]
      }),
    
    tax: z.number()
      .min(0, t(i18n)`Tax rate cannot be negative`)
      .max(100, t(i18n)`Tax rate cannot exceed 100%`)
      .meta({ 
        title: t(i18n)`Item tax percentage`,
        description: t(i18n)`Tax rate as percentage (0-100)`,
        examples: [0, 7.7, 19, 21]
      }),
  });

  const tagSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    category: z.enum([
      "document_type",
      "department", 
      "project",
      "cost_center",
      "vendor_type",
      "payment_method",
      "approval_status"
    ]).optional(),
    created_by_entity_user_id: z.string().optional(),
    description: z.string().optional(),
    name: z.string(),
  });

  const baseSchema = z.object({
    invoiceNumber: requiredString(i18n, t(i18n)`Invoice number`),
    
    counterpart: z.string(),
    
    counterpartBankAccount: z.string()
      .optional()
      .meta({ 
        title: t(i18n)`Counterpart bank account ID`,
        description: t(i18n)`ID of counterpart's bank account`
      }),
    
    invoiceDate: z.date()
      .optional()
      .meta({ 
        title: t(i18n)`Invoice issue date`,
        description: t(i18n)`Date when the invoice was issued`
      }),
    
    dueDate: z.date()
      .optional(),
    
    currency: z.enum(CurrencyEnum as [components['schemas']['CurrencyEnum'], ...components['schemas']['CurrencyEnum'][]])
      .meta({ 
        title: t(i18n)`Invoice currency`,
        description: t(i18n)`Currency for the invoice amount`,
        examples: ['EUR', 'USD', 'GBP']
      }),
    
    discount: z.number()
      .min(0, t(i18n)`Discount cannot be negative`)
      .nullable()
      .optional(),
    
    lineItems: z.array(lineItemSchema),
    
    tags: z.array(tagSchema),

    counterpartAddressId: z.string().optional(),
  });

  return baseSchema
    .refine((data) => {
      if (isFieldRequiredByValidations('counterpart_id', payablesValidations)) {
        return data.counterpart.trim().length > 0;
      }
      return true;
    }, {
      message: t(i18n)`Counterpart is required`,
      path: ['counterpart'],
    })
    .refine((data) => {
      if (isFieldRequiredByValidations('counterpart_bank_account_id', payablesValidations)) {
        return (data.counterpartBankAccount?.trim().length ?? 0) > 0;
      }
      return true;
    }, {
      message: t(i18n)`Counterpart bank account is required`,
      path: ['counterpartBankAccount'],
    })
    .refine((data) => {
      if (isFieldRequiredByValidations('issued_at', payablesValidations)) {
        return data.invoiceDate instanceof Date;
      }
      return true;
    }, {
      message: t(i18n)`Invoice date is required`,
      path: ['invoiceDate'],
    })
    .refine((data) => {
      if (isFieldRequiredByValidations('currency', payablesValidations)) {
        return data.currency.trim().length > 0;
      }
      return true;
    }, {
      message: t(i18n)`Currency is required`,
      path: ['currency'],
    });
};

export type PayableDetailsValidationFields = z.infer<ReturnType<typeof getPayableDetailsValidationSchema>>;

type PayablesFieldsAllowedForValidate = components['schemas']['PayablesFieldsAllowedForValidate'];
type PayableValidationsResource = components['schemas']['PayableValidationsResource'];
