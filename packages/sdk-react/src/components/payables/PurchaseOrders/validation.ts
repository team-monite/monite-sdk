import { PURCHASE_ORDER_CONSTANTS } from './consts';
import { PURCHASE_ORDER_MEASURE_UNITS } from './types';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { z } from 'zod';

/**
 * Purchase Order line item validation schema
 * Supports both VAT and non-VAT modes like Receivables
 */
const getPurchaseOrderLineItemSchema = (i18n: I18n, isNonVatSupported: boolean) => {
  const baseLineItemSchema = z.object({
    id: z.string().optional(),
    name: z.preprocess(
      (val) => {
        if (typeof val === 'string') return val.trim();
        return '';
      },
      z.string().min(1, t(i18n)`Item name is a required field`)
    ),
    quantity: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === '')
          return PURCHASE_ORDER_CONSTANTS.DEFAULT_QUANTITY;

        const num = Number(val);

        return isNaN(num) || num <= 0
          ? PURCHASE_ORDER_CONSTANTS.DEFAULT_QUANTITY
          : num;
      },
      z.number().positive(t(i18n)`Quantity must be greater than 0`)
    ),
    unit: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === '') return 'unit';

        return val;
      },
      z.enum(PURCHASE_ORDER_MEASURE_UNITS, {
        message: t(i18n)`Please select a valid measure unit`,
      })
    ),
    price: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === '') return undefined;

        const num = Number(val);

        return isNaN(num) ? undefined : num;
      },
      z.number({
        message: t(i18n)`Price is a required field`
      }).min(0, t(i18n)`Price must be 0 or greater`)
    ),
    currency: z.preprocess(
      (val) => {
        if (val === undefined || val === null || val === '') return 'USD';

        return val;
      },
      z.enum(CurrencyEnum as [string, ...string[]])
    ),
  });

  // Non-VAT schema (tax is required)
  const nonVatLineItemSchema = baseLineItemSchema.extend({
    vat_rate_value: z.number().optional(),
    vat_rate_id: z.string().optional(),
    tax_rate_value: z
      .number({
        message: t(i18n)`Tax is a required field`
      })
      .min(0, t(i18n)`Tax rate must be 0 or greater`)
      .max(100, t(i18n)`Tax rate must be 100% or less`),
  });

  // VAT schema (VAT is required)
  const vatLineItemSchema = baseLineItemSchema.extend({
    tax_rate_value: z.number().min(0).max(100).optional(),
    vat_rate_value: z
      .number({ error: t(i18n)`VAT is a required field` })
      .min(0, t(i18n)`VAT rate must be 0 or greater`)
      .max(100, t(i18n)`VAT rate must be 100% or less`),
    vat_rate_id: z
      .string({ error: t(i18n)`VAT is a required field` })
      .min(1, t(i18n)`VAT is a required field`),
  });

  return isNonVatSupported ? nonVatLineItemSchema : vatLineItemSchema;
};

/**
 * Base Purchase Order validation schema
 * Simplified to match Figma design: Vendor + Items + Details (expiry date + message)
 */
const getBasePurchaseOrderSchema = (i18n: I18n, isNonVatSupported: boolean) =>
  z.object({
    counterpart_id: z.string().min(1, t(i18n)`Vendor is a required field`),
    line_items: z
      .array(getPurchaseOrderLineItemSchema(i18n, isNonVatSupported))
      .min(1, t(i18n)`Please add at least 1 item to proceed`),
    valid_for_days: z.number().positive().optional(),
    expiry_date: z.preprocess(
      (val) => {
        if (!val) return undefined;

        const date = val instanceof Date ? val : new Date(val as string);
        if (isNaN(date.getTime())) return undefined;

        date.setUTCHours(0, 0, 0, 0);

        return date;
      },
      z
        .date({
          message: t(i18n)`Expiry date is a required field`,
        })
        .refine(
          (date) => {
            if (!date) return false;

            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            return date >= today;
          },
          {
            message: t(i18n)`Expiry date must be today or in the future`,
          }
        )
    ),
    message: z.string().optional(),
    currency: z.enum(CurrencyEnum as [string, ...string[]], {
      message: t(i18n)`Currency is required`,
    }),
    vat_mode: z
      .enum(['inclusive', 'exclusive', 'no_vat'] as const)
      .optional()
      .default('exclusive'),
    entity_vat_id_id: z.string().optional(),
    counterpart_address_id: z.string().optional(),
    project_id: z.string().optional(),
  });

/**
 * Create Purchase Order validation schema
 */
export const getCreatePurchaseOrderValidationSchema = (i18n: I18n, isNonVatSupported: boolean = false) =>
  getBasePurchaseOrderSchema(i18n, isNonVatSupported);

/**
 * Update Purchase Order validation schema
 */
export const getUpdatePurchaseOrderValidationSchema = (i18n: I18n, isNonVatSupported: boolean = false) =>
  getBasePurchaseOrderSchema(i18n, isNonVatSupported);

/**
 * Email Purchase Order validation schema
 * Matches EmailInvoiceDetails pattern
 */
export const getEmailPurchaseOrderSchema = (i18n: I18n) =>
  z.object({
    to: z.email().min(1, t(i18n)`To is required`),
    subject: z.string().min(1, t(i18n)`Subject is required`),
    body: z.string().min(1, t(i18n)`Body is required`),
  });

/**
 * API Email Purchase Order validation schema
 */
export const getEmailPurchaseOrderValidationSchema = (i18n: I18n) =>
  z.object({
    subject_text: z.string().min(1, t(i18n)`Subject is a required field`),
    body_text: z.string().min(1, t(i18n)`Body is a required field`),
  });

/**
 * Create Purchase Order form type
 */
export type CreatePurchaseOrderFormProps = z.infer<
  ReturnType<typeof getCreatePurchaseOrderValidationSchema>
>;

/**
 * Update Purchase Order form type
 */
export type UpdatePurchaseOrderFormProps = z.infer<
  ReturnType<typeof getUpdatePurchaseOrderValidationSchema>
>;

/**
 * Email Purchase Order form type (matches EmailInvoiceDetails pattern)
 */
export type EmailPurchaseOrderFormValues = z.infer<
  ReturnType<typeof getEmailPurchaseOrderSchema>
>;

/**
 * Email Purchase Order API form type
 */
export type EmailPurchaseOrderFormProps = z.infer<
  ReturnType<typeof getEmailPurchaseOrderValidationSchema>
>;

/**
 * Purchase Order line item type (inferred from validation)
 */
export type PurchaseOrderLineItem = z.infer<
  ReturnType<typeof getPurchaseOrderLineItemSchema>
>;
