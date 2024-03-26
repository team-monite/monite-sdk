import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { CurrencyEnum, Price } from '@monite/sdk-api';

import * as yup from 'yup';

export const getCreateInvoiceProductsValidationSchema = (i18n: I18n) =>
  yup.object({
    currency: yup
      .mixed<CurrencyEnum>()
      .oneOf(Object.values(CurrencyEnum))
      .label(t(i18n)`Currency`)
      .required(),
    items: yup
      .array()
      .min(1, t(i18n)`Please, add at least 1 item to proceed with this invoice`)
      .required(),
  });

export type ICreateReceivablesProductsForm = yup.InferType<
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
  });

export interface ICreateReceivablesFormBeforeValidationLineItem {
  quantity: number;
  product_id: string;
  vat_rate_id?: string;
  vat_rate_value?: number;
  name: string;
  price?: Price;
  measure_unit_id: string;
}

export interface ICreateReceivablesFormBeforeValidation {
  type: string;
  counterpart_id: string;
  line_items: Array<ICreateReceivablesFormBeforeValidationLineItem>;
  vat_exemption_rationale?: string;
}

/** Describes a final version of the form (AFTER the user filled all required fields) */
export type ICreateReceivablesForm = yup.InferType<
  ReturnType<typeof getCreateInvoiceValidationSchema>
>;
