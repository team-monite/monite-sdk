import type { PayableDetailsFormFields } from './types';
import { components } from '@/api';
import { getCurrencyEnum } from '@/components/receivables/validation';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

export type Option = { label: string; value: string };

export const isFieldRequiredByValidations = (
  fieldName: PayablesFieldsAllowedForValidate,
  payablesValidations?: PayableValidationsResource
): boolean => {
  return Boolean(payablesValidations?.required_fields?.includes(fieldName));
};

const getPayableDetailsFormSchemaInternal = (i18n: I18n) => {
  const lineItemsSchema = z
    .array(
      z.object({
        id: z.string().meta({ title: t(i18n)`Item ID` }),
        name: z
          .string()
          .min(1, t(i18n)`Item name is required`)
          .meta({ title: t(i18n)`Item Name` }),
        quantity: z.coerce
          .number()
          .positive(t(i18n)`Item quantity must be positive`)
          .meta({ title: t(i18n)`Quantity` }),
        price: z.coerce
          .number()
          .min(0, t(i18n)`Item price cannot be negative`)
          .meta({ title: t(i18n)`Price` }),
        tax: z.coerce
          .number()
          .min(0, t(i18n)`Item tax cannot be negative`)
          .max(100, t(i18n)`Item tax cannot exceed 100%`)
          .meta({ title: t(i18n)`Tax` }),
        ledger_account_id: z
          .string()
          .optional()
          .meta({ title: t(i18n)`Ledger Account` }),
      })
    )
    .meta({ title: t(i18n)`Line Items` });

  const tagSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    category: z
      .enum([
        'document_type',
        'department',
        'project',
        'cost_center',
        'vendor_type',
        'payment_method',
        'approval_status',
      ])
      .optional(),
    created_by_entity_user_id: z.string().optional(),
    description: z.string().optional(),
    name: z.string(),
  });

  return z.object({
    invoiceNumber: z
      .string()
      .min(1, t(i18n)`Invoice Number is required`)
      .meta({ title: t(i18n)`Invoice Number` }),
    counterpart: z.string().meta({ title: t(i18n)`Counterpart` }),
    counterpartBankAccount: z
      .string()
      .optional()
      .meta({ title: t(i18n)`Counterpart Bank Account` }),
    invoiceDate: z
      .preprocess((v) => (v === null ? undefined : v), z.date())
      .optional()
      .meta({ title: t(i18n)`Invoice Date` }),
    dueDate: z
      .preprocess((v) => (v === null ? undefined : v), z.date())
      .optional()
      .meta({ title: t(i18n)`Due Date` }),
    currency: getCurrencyEnum(i18n)
      .optional()
      .meta({ title: t(i18n)`Currency` }),
    tags: z.array(tagSchema).meta({ title: t(i18n)`Tags` }),
    lineItems: lineItemsSchema,
    discount: z
      .union([z.coerce.number().min(0), z.null()])
      .optional()
      .meta({ title: t(i18n)`Discount` }),
  });
};

export const getPayableDetailsFormSchema = (
  i18n: I18n,
  payablesValidations?: components['schemas']['PayableValidationsResource']
) =>
  getPayableDetailsFormSchemaInternal(i18n)
    .refine((v) => v.dueDate instanceof Date, {
      path: ['dueDate'],
      message: t(i18n)`Due date is required`,
    })
    .refine(
      (v) =>
        !isFieldRequiredByValidations('counterpart_id', payablesValidations) ||
        Boolean(v.counterpart),
      {
        path: ['counterpart'],
        message: t(i18n)`Counterpart is required`,
      }
    )
    .refine(
      (v) =>
        !isFieldRequiredByValidations(
          'counterpart_bank_account_id',
          payablesValidations
        ) || Boolean(v.counterpartBankAccount),
      {
        path: ['counterpartBankAccount'],
        message: t(i18n)`Counterpart bank account is required`,
      }
    )
    .refine(
      (v) =>
        !isFieldRequiredByValidations('issued_at', payablesValidations) ||
        v.invoiceDate instanceof Date,
      {
        path: ['invoiceDate'],
        message: t(i18n)`Invoice date is required`,
      }
    )
    .refine(
      (v) =>
        !isFieldRequiredByValidations('currency', payablesValidations) ||
        v.currency !== undefined,
      {
        path: ['currency'],
        message: t(i18n)`Currency is required`,
      }
    ) satisfies z.ZodType<PayableDetailsFormFields>;

export type PayableDetailsValidationFields = z.infer<
  ReturnType<typeof getPayableDetailsFormSchema>
>;

type PayablesFieldsAllowedForValidate =
  components['schemas']['PayablesFieldsAllowedForValidate'];
type PayableValidationsResource =
  components['schemas']['PayableValidationsResource'];
