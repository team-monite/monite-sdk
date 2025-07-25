import { components } from '@/api';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import { z } from 'zod';

export const getCreateInvoiceProductsValidationSchema = (i18n: I18n) =>
  z.object({
    currency: z.enum(CurrencyEnum as [string, ...string[]]),
    items: z
      .array(z.any())
      .min(
        1,
        t(i18n)`Please, add at least 1 item to proceed with this invoice`
      ),
  });

export type CreateReceivablesProductsFormProps = z.infer<
  ReturnType<typeof getCreateInvoiceProductsValidationSchema>
>;

const getLineItemsSchema = (i18n: I18n, isNonVatSupported: boolean) => {
  const baseLineItemSchema = z
    .object({
      id: z.string().optional(),
      quantity: z.number().min(0.1, t(i18n)`Quantity is a required field`),
      product_id: z.string().optional(),
      product: z.object({
        name: z.string().min(1, t(i18n)`Name is a required field`),
        description: z.string().optional(),
        price: z.object({
          currency: z.enum(CurrencyEnum as [string, ...string[]]),
          value: z.number(),
        }),
        measure_unit_id: z
          .string()
          .min(1, t(i18n)`Measure unit is a required field`),
        smallest_amount: z.number().optional(),
        type: z.enum(['product', 'service']),
      }),
    })
    .refine(
      (data) =>
        Boolean(
          data.product.smallest_amount &&
            data.quantity >= data.product.smallest_amount
        ),
      {
        error: t(
          i18n
        )`Quantity must be greater than or equal to the smallest amount`,
        path: ['quantity'],
      }
    );

  const nonVatLineItemSchema = baseLineItemSchema.extend({
    vat_rate_value: z.number().optional(),
    vat_rate_id: z.string().optional(),
    tax_rate_value: z
      .number()
      .min(0, t(i18n)`Tax rate is a required field`)
      .max(100),
  });

  const vatLineItemSchema = baseLineItemSchema.extend({
    tax_rate_value: z.number().min(0).max(100).optional(),
    vat_rate_value: z
      .number({ error: t(i18n)`VAT is a required field` })
      .min(0),
    vat_rate_id: z
      .string({ error: t(i18n)`VAT is a required field` })
      .min(1, t(i18n)`VAT is a required field`),
  });

  return z
    .array(isNonVatSupported ? nonVatLineItemSchema : vatLineItemSchema)
    .min(1, t(i18n)`Please, add at least 1 item to proceed with this invoice`);
};

const getBaseInvoiceSchema = (
  i18n: I18n,
  isNonVatSupported: boolean,
  isNonCompliantFlow: boolean
) =>
  z.object({
    counterpart_id: z.string().min(1, t(i18n)`Customer is a required field`),
    entity_vat_id_id:
      isNonCompliantFlow || isNonVatSupported
        ? z.string().optional()
        : z.string().min(1, t(i18n)`Entity VAT is a required field`),
    counterpart_vat_id_id: z.string().optional(),
    fulfillment_date: z.date().nullable().optional(),
    purchase_order: z.string().optional(),
    terms_and_conditions: z.string().optional(),
    default_billing_address_id: z
      .string()
      .min(
        1,
        t(i18n)`Set a billing address for this customer to issue invoice`
      ),
    default_shipping_address_id: z.string().optional(),
    vat_exemption_rationale: z.string().optional(),
    memo: z.string().optional(),
    payment_terms_id: z
      .string()
      .min(1, t(i18n)`Payment terms is a required field`),
    line_items: getLineItemsSchema(i18n, isNonVatSupported),
    overdue_reminder_id: z.string().nullable().optional(),
    payment_reminder_id: z.string().nullable().optional(),
    vat_mode: z.enum(['exclusive', 'inclusive']),
  });

export const getCreateInvoiceValidationSchema = (
  i18n: I18n,
  isNonVatSupported: boolean,
  isNonCompliantFlow: boolean,
  shouldEnableBankAccount: boolean
) => {
  const baseInvoiceSchema = getBaseInvoiceSchema(
    i18n,
    isNonVatSupported,
    isNonCompliantFlow
  );

  return baseInvoiceSchema.extend({
    type: z.string(),
    entity_bank_account_id: shouldEnableBankAccount
      ? z.string().min(1, t(i18n)`Choose how to get paid.`)
      : z.string().optional(),
  });
};

export type CreateReceivablesFormProps = z.infer<
  ReturnType<typeof getCreateInvoiceValidationSchema>
>;

export const getUpdateInvoiceValidationSchema = (
  i18n: I18n,
  isNonVatSupported: boolean,
  isNonCompliantFlow: boolean
) => {
  const baseInvoiceSchema = getBaseInvoiceSchema(
    i18n,
    isNonVatSupported,
    isNonCompliantFlow
  );

  return baseInvoiceSchema.extend({
    entity_bank_account_id: z.string().optional(),
  });
};

export type UpdateReceivablesFormProps = z.infer<
  ReturnType<typeof getUpdateInvoiceValidationSchema>
>;

export interface CreateReceivablesFormBeforeValidationLineItemProps {
  id: string;
  quantity: number;
  product_id?: string;
  name?: string;
  price?: components['schemas']['PriceFloat'];
  measure_unit_id?: string;
  product?: {
    name: string;
    description?: string;
    price?: components['schemas']['PriceFloat'];
    measure_unit_id?: string;
    measure_unit_name?: string;
    type: 'product' | 'service';
  };
  measure_unit?: {
    name: string;
    id: null;
  };
  vat_rate_id?: string;
  vat_rate_value?: number;
  tax_rate_value?: number;
  smallest_amount?: number;
  vat_mode?: components['schemas']['VatModeEnum'];
}

export interface CreateReceivablesFormBeforeValidationProps {
  type: string;
  counterpart_id: string;
  line_items: Array<CreateReceivablesFormBeforeValidationLineItemProps>;
  vat_exemption_rationale?: string;
  vat_mode?: components['schemas']['VatModeEnum'];
}
