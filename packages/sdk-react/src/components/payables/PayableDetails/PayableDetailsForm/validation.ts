import { components } from '@/api';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';
import { CurrencyEnum } from '@/enums/CurrencyEnum';

export type Option = { label: string; value: string };

type PayableTag = { id: string; name: string } & Record<string, unknown>;

export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  tax: number;
};
export interface PayableDetailsFormFields {
  invoiceNumber: string;
  counterpart: string;
  counterpartBankAccount?: string;
  invoiceDate?: Date;
  dueDate?: Date;
  currency: components['schemas']['CurrencyEnum'];
  tags: PayableTag[];
  lineItems: LineItem[];
  discount?: number | null;
}

const getCurrencyEnum = () =>
  z.enum(CurrencyEnum);

const getPayableDetailsFormSchemaInternal = (i18n: I18n) =>
  z.object({
    invoiceNumber: z.string().min(1, t(i18n)`Invoice Number is required`),
    counterpart: z.string(),
    counterpartBankAccount: z.string().optional(),
    invoiceDate: z
      .preprocess((v) => (v === null ? undefined : v), z.date())
      .optional(),
    dueDate: z
      .preprocess((v) => (v === null ? undefined : v), z.date())
      .optional(),
    currency: getCurrencyEnum(),
    tags: z.array(z.object({ id: z.string(), name: z.string() }).loose()),
    lineItems: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1, t(i18n)`Item name is required`),
        quantity: z
          .coerce
          .number()
          .positive(t(i18n)`Item quantity must be positive`),
        price: z
          .coerce
          .number()
          .min(0, t(i18n)`Item price must be 0 or greater`),
        tax: z
          .coerce
          .number()
          .min(0, t(i18n)`Item tax must be 0 or greater`)
          .max(100, t(i18n)`Item tax must be 100 or less`),
      })
    ),
    discount: z
      .union([z.coerce.number().min(0), z.null()])
      .optional(),
  });

const isFieldRequiredByValidations = (
  fieldName: components['schemas']['PayablesFieldsAllowedForValidate'],
  payablesValidations:
    | components['schemas']['PayableValidationsResource']
    | undefined
): boolean => {
  if (payablesValidations && payablesValidations.required_fields) {
    return payablesValidations.required_fields.includes(fieldName);
  }
  return false;
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
      (v) => !isFieldRequiredByValidations('currency', payablesValidations) || v.currency !== undefined,
      {
        path: ['currency'],
        message: t(i18n)`Currency is required`,
      }
    ) satisfies z.ZodType<PayableDetailsFormFields>;
