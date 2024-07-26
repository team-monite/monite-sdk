import { components } from '@/api';
import { CurrencyEnum } from '@/enums/CurrencyEnum';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

import * as yup from 'yup';

export const getCreateInvoiceProductsValidationSchema = (i18n: I18n) =>
  yup.object({
    currency: yup
      .mixed<(typeof CurrencyEnum)[number]>()
      .oneOf(CurrencyEnum)
      .label(t(i18n)`Currency`)
      .required(),
    items: yup
      .array()
      .min(1, t(i18n)`Please, add at least 1 item to proceed with this invoice`)
      .required(),
  });

export type CreateReceivablesProductsFormProps = yup.InferType<
  ReturnType<typeof getCreateInvoiceProductsValidationSchema>
>;

const getLineItemsSchema = (i18n: I18n) =>
  yup
    .array()
    .of(
      yup.object({
        quantity: yup
          .number()
          .min(1)
          .label(t(i18n)`Quantity`)
          .when('smallest_amount', (smallestAmount, schema) => {
            if (!smallestAmount) {
              return schema;
            }

            return schema.min(
              smallestAmount,
              t(
                i18n
              )`Quantity must be greater than or equal to the smallest amount`
            );
          })
          .required(),
        product_id: yup
          .string()
          .label(t(i18n)`Product`)
          .required(),
        vat_rate_id: yup
          .string()
          .label(t(i18n)`VAT`)
          .required(),
        vat_rate_value: yup
          .number()
          .label(t(i18n)`VAT`)
          .required(),
        name: yup
          .string()
          .label(t(i18n)`Name`)
          .required(),
        price: yup
          .object({
            currency: yup
              .string()
              .label(t(i18n)`Currency`)
              .required(),
            value: yup
              .number()
              .label(t(i18n)`Price`)
              .required(),
          })
          .label(t(i18n)`Price`),
        measure_unit_id: yup
          .string()
          .label(t(i18n)`Measure unit`)
          .required(),
        smallest_amount: yup
          .number()
          .nullable()
          .label(t(i18n)`Smallest amount`),
      })
    )
    .min(1, t(i18n)`Please, add at least 1 item to proceed with this invoice`)
    .required();

export const getCreateInvoiceValidationSchema = (i18n: I18n) =>
  yup.object({
    type: yup.string().required(),
    counterpart_id: yup
      .string()
      .label(t(i18n)`Counterpart`)
      .required(),
    entity_bank_account_id: yup.string().label(t(i18n)`Bank account`),
    entity_vat_id_id: yup
      .string()
      .label(t(i18n)`VAT ID`)
      .required(),
    counterpart_vat_id_id: yup.string().label(t(i18n)`Counterpart VAT ID`),
    fulfillment_date: yup
      .date()
      .label(t(i18n)`Fulfillment date`)
      .nullable(),
    purchase_order: yup.string().label(t(i18n)`Purchase order`),
    default_billing_address_id: yup
      .string()
      .label(t(i18n)`Billing address`)
      .required(),
    default_shipping_address_id: yup.string().label(t(i18n)`Shipping address`),
    vat_exemption_rationale: yup
      .string()
      .label(t(i18n)`VAT exemption rationale`),
    payment_terms_id: yup
      .string()
      .label(t(i18n)`Payment terms`)
      .required(),
    line_items: getLineItemsSchema(i18n),
    overdue_reminder_id: yup
      .string()
      .optional()
      .label(t(i18n)`Overdue reminder`),
    payment_reminder_id: yup
      .string()
      .optional()
      .label(t(i18n)`Payment reminder`),
  });

export const getUpdateInvoiceValidationSchema = (i18n: I18n) =>
  yup.object({
    counterpart_id: yup
      .string()
      .label(t(i18n)`Counterpart`)
      .required(),
    entity_bank_account_id: yup.string().label(t(i18n)`Bank account`),
    entity_vat_id_id: yup
      .string()
      .label(t(i18n)`VAT ID`)
      .required(),
    counterpart_vat_id_id: yup.string().label(t(i18n)`Counterpart VAT ID`),
    fulfillment_date: yup
      .date()
      .label(t(i18n)`Fulfillment date`)
      .nullable(),
    purchase_order: yup.string().label(t(i18n)`Purchase order`),
    default_billing_address_id: yup
      .string()
      .label(t(i18n)`Billing address`)
      .required(),
    default_shipping_address_id: yup.string().label(t(i18n)`Shipping address`),
    vat_exemption_rationale: yup
      .string()
      .label(t(i18n)`VAT exemption rationale`),
    payment_terms_id: yup
      .string()
      .label(t(i18n)`Payment terms`)
      .required(),
    line_items: getLineItemsSchema(i18n),
    overdue_reminder_id: yup
      .string()
      .optional()
      .label(t(i18n)`Overdue reminder`),
    payment_reminder_id: yup
      .string()
      .optional()
      .label(t(i18n)`Payment reminder`),
  });

export interface CreateReceivablesFormBeforeValidationLineItemProps {
  quantity: number;
  product_id: string;
  vat_rate_id?: string;
  vat_rate_value?: number;
  smallest_amount?: number;
  name: string;
  price?: components['schemas']['Price'];
  measure_unit_id?: string;
}

export interface CreateReceivablesFormBeforeValidationProps {
  type: string;
  counterpart_id: string;
  line_items: Array<CreateReceivablesFormBeforeValidationLineItemProps>;
  vat_exemption_rationale?: string;
}

/** Describes a final version of the form (AFTER the user filled all required fields) */
export type CreateReceivablesFormProps = yup.InferType<
  ReturnType<typeof getCreateInvoiceValidationSchema>
>;
