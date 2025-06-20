import { components } from '@/api';
import {
  calculateDueDate,
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { useGetEntityBankAccountById } from '@/components/receivables/hooks';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import {
  getRateValueForDisplay,
  rateMinorToMajor,
} from '@/core/utils/vatUtils';
import styled from '@emotion/styled';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { isValid } from 'date-fns';

import { useCreateInvoiceProductsTable } from '../../components/useCreateInvoiceProductsTable';
import { sanitizeLineItems } from '../../utils';
import type {
  CreateReceivablesFormProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from '../../validation';
// @ts-expect-error Importing css file from a different package is not supported
import invoicePreviewStyles from './InvoicePreview.css';

interface InvoicePreviewProps {
  address:
    | components['schemas']['CounterpartAddressResponseWithCounterpartID']
    | null;
  counterpart?: components['schemas']['CounterpartResponse'];
  counterpartVats:
    | {
        data: components['schemas']['CounterpartVatIDResponse'][];
      }
    | undefined;
  currency?: components['schemas']['CurrencyEnum'];
  watch: <T extends keyof CreateReceivablesFormProps>(
    field: T
  ) => CreateReceivablesFormProps[T];
  entityData: any; //temporary
  entityVatIds?: {
    data: components['schemas']['EntityVatIDResponse'][];
  };
  isNonVatSupported: boolean;
  paymentTerms:
    | {
        data?: components['schemas']['PaymentTermsResponse'][];
      }
    | undefined;
}

const StyledInvoicePreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  min-height: 100%;
  min-width: fit-content;
  ${invoicePreviewStyles}
`;

export const InvoicePreview = ({
  address,
  counterpart,
  counterpartVats,
  currency,
  watch,
  entityData,
  entityVatIds,
  isNonVatSupported,
  paymentTerms,
}: InvoicePreviewProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay, getSymbolFromCurrency } = useCurrencies();
  const currencySymbol = currency ? getSymbolFromCurrency(currency) : '';
  const fulfillmentDate = watch('fulfillment_date');
  const items = watch('line_items');
  const memo = watch('memo');
  const entityBankAccountId = watch('entity_bank_account_id') ?? '';
  const vatMode = watch('vat_mode');
  const isInclusivePricing = vatMode === 'inclusive';
  const counterpartName = counterpart ? getCounterpartName(counterpart) : '';
  const { data: bankAccount } =
    useGetEntityBankAccountById(entityBankAccountId);

  const dateTime = i18n.date(new Date(), locale.dateFormat);

  const paymentTermsId = watch('payment_terms_id');
  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term) => term.id === paymentTermsId
  );
  const dueDate = selectedPaymentTerm && calculateDueDate(selectedPaymentTerm);

  const sanitizedItems = sanitizeLineItems(items);

  const { subtotalPrice, totalPrice, taxesByVatRate } =
    useCreateInvoiceProductsTable({
      lineItems: sanitizedItems,
      formatCurrencyToDisplay,
      isNonVatSupported,
      actualCurrency: currency,
      isInclusivePricing,
    });

  const getRateValueForItem = (
    item: CreateReceivablesFormBeforeValidationLineItemProps
  ) => {
    return getRateValueForDisplay(
      isNonVatSupported,
      item.vat_rate_value ?? 0,
      item.tax_rate_value ?? 0
    );
  };

  const renderBankAccountDetails = () => {
    if (!bankAccount) {
      return (
        <div>
          <span className="not-set">
            {t(i18n)`Set up bank account to add payment info
        and set a QR code`}{' '}
          </span>
        </div>
      );
    }

    return (
      <div className="mtw:flex mtw:flex-col">
        {bankAccount?.bank_name && (
          <p>
            {t(i18n)`Bank name`}: {bankAccount?.bank_name}
          </p>
        )}
        {bankAccount?.iban && (
          <p>
            {t(i18n)`IBAN`}: {bankAccount?.iban}
          </p>
        )}
        {bankAccount?.bic && (
          <p>
            {t(i18n)`BIC`}: {bankAccount?.bic}
          </p>
        )}
        {bankAccount?.account_number && (
          <p>
            {t(i18n)`Account number`}: {bankAccount?.account_number}
          </p>
        )}
        {bankAccount?.routing_number && (
          <p>
            {t(i18n)`Routing number`}: {bankAccount?.routing_number}
          </p>
        )}
        {bankAccount?.sort_code && (
          <p>
            {t(i18n)`Sort code`}: {bankAccount?.sort_code}
          </p>
        )}
      </div>
    );
  };

  return (
    <StyledInvoicePreview>
      <div className="invoice-preview">
        <header className="header">
          <aside>
            <h1 className="block-header">{t(i18n)`Invoice`}</h1>
          </aside>
          <aside className="header--flex-end-aside">
            {' '}
            <div className="block-entity-logo">
              {entityData?.logo?.url ? (
                <img src={entityData.logo.url} />
              ) : (
                <span>{t(i18n)`No logo`}</span>
              )}
            </div>
          </aside>
          <aside>
            <div className="block-counterpart-info">
              <div>
                <b> {t(i18n)`Customer`}</b>
              </div>
              <div>
                {!counterpartName && (
                  <span className="not-set">{t(i18n)`Not set`}</span>
                )}
              </div>
              <div>{counterpartName}</div>
              {address && (
                <div>
                  <div>
                    {address.line1} {address.line2}
                    {address.postal_code} {address.city} {address.country}
                  </div>
                </div>
              )}

              <hr style={{ height: '5pt', visibility: 'hidden' }} />
              <div>
                {counterpart && isOrganizationCounterpart(counterpart)
                  ? counterpart.organization.email
                  : counterpart && isIndividualCounterpart(counterpart)
                  ? counterpart.individual.email
                  : ''}
              </div>

              {counterpart?.tax_id && (
                <div>
                  {t(i18n)`TAX ID`} {counterpart?.tax_id}
                </div>
              )}
              {counterpartVats?.data[0]?.id && (
                <div>
                  {t(i18n)`VAT ID`} {counterpartVats.data[0].value}
                </div>
              )}
            </div>
          </aside>
          <aside className="header--flex-end-aside">
            <div className="block-receivable-date">
              <ul>
                <li>
                  <span>{t(i18n)`Issue date`}: </span> <span>{dateTime}</span>
                </li>
                <li>
                  <span>{t(i18n)`Due date`}: </span>{' '}
                  {dueDate ? (
                    <span>{i18n.date(dueDate, locale.dateFormat)}</span>
                  ) : (
                    <span className="not-set">{t(i18n)`Not set`}</span>
                  )}
                </li>

                {fulfillmentDate && isValid(fulfillmentDate) && (
                  <li>
                    <span>{t(i18n)`Fulfillment date`}: </span>{' '}
                    <span>{i18n.date(fulfillmentDate, locale.dateFormat)}</span>
                  </li>
                )}
              </ul>
              <ul className="payment-terms">
                <li>
                  <span>
                    <b>{t(i18n)`Payment terms`}</b>
                  </span>
                </li>
                <li>
                  {!selectedPaymentTerm && (
                    <span className="not-set">{t(i18n)`Not set`}</span>
                  )}
                </li>
                <li>
                  {selectedPaymentTerm?.term_1 && (
                    <p>
                      {t(
                        i18n
                      )`Pay in the first ${selectedPaymentTerm.term_1.number_of_days} days`}{' '}
                      {selectedPaymentTerm.term_1.discount && (
                        <span>
                          <br />
                          {t(i18n)`${rateMinorToMajor(
                            selectedPaymentTerm.term_1.discount
                          )}% discount`}
                        </span>
                      )}
                    </p>
                  )}
                  {selectedPaymentTerm?.term_2 && (
                    <p>
                      {t(
                        i18n
                      )`Pay in the first ${selectedPaymentTerm.term_2.number_of_days} days`}{' '}
                      {selectedPaymentTerm.term_2.discount && (
                        <span>
                          <br />
                          {t(i18n)`${rateMinorToMajor(
                            selectedPaymentTerm.term_2.discount
                          )}%discount`}
                        </span>
                      )}
                    </p>
                  )}
                  {selectedPaymentTerm?.term_final && (
                    <p>
                      {t(i18n)`Payment due`}{' '}
                      {t(
                        i18n
                      )`${selectedPaymentTerm.term_final?.number_of_days} days`}
                    </p>
                  )}
                </li>
              </ul>
            </div>
          </aside>
        </header>
        <section className="payment-description">
          <div className="block-memo">{memo}</div>
        </section>
        <article>
          <div className="block-line-items">
            <table className="line-items-table" cellSpacing="0">
              <thead>
                <tr>
                  <th>{t(i18n)`Product`}</th>
                  <th>{t(i18n)`Qty`}</th>
                  <th>{t(i18n)`Units`}</th>
                  <th>
                    {t(i18n)`Price`} ({currencySymbol})
                  </th>
                  {isInclusivePricing && (
                    <>
                      <th>{t(i18n)`Tax`} (%)</th>
                      <th>
                        {t(i18n)`Incl. tax`} ({currencySymbol})
                      </th>
                    </>
                  )}
                  <th>
                    {t(i18n)`Amount`} ({currencySymbol})
                  </th>
                  {!isInclusivePricing && <th>{t(i18n)`Tax`} (%)</th>}
                </tr>
                <tr className="spacer">
                  <td colSpan={7} />
                </tr>
              </thead>
              <tbody className="products">
                {sanitizedItems.length > 0 ? (
                  sanitizedItems.map((item) => {
                    const taxRate = getRateValueForItem(item);
                    const totalAmount =
                      (item?.product?.price?.value || 0) *
                      (item?.quantity || 1);

                    return (
                      <tr key={item.id}>
                        <td style={{ maxWidth: '120px' }}>
                          {item?.product?.name}
                        </td>
                        <td>{item?.quantity}</td>
                        <td>
                          {item?.product?.measure_unit_id ? (
                            <MeasureUnit
                              unitId={item.product.measure_unit_id}
                            />
                          ) : item?.measure_unit?.name ? (
                            item.measure_unit.name
                          ) : null}
                        </td>
                        <td>
                          {item.product?.price &&
                            formatCurrencyToDisplay(
                              isInclusivePricing
                                ? totalAmount / (1 + taxRate / 100)
                                : item.product.price.value,
                              item.product.price.currency,
                              false
                            )}
                        </td>
                        {isInclusivePricing && (
                          <>
                            <td>{taxRate}%</td>
                            <td>
                              {item.product?.price &&
                                formatCurrencyToDisplay(
                                  totalAmount -
                                    totalAmount / (1 + taxRate / 100),
                                  item.product.price.currency,
                                  false
                                )}
                            </td>
                          </>
                        )}
                        <td>
                          {item.product?.price &&
                            formatCurrencyToDisplay(
                              totalAmount,
                              item.product.price.currency,
                              false
                            )}
                        </td>
                        {!isInclusivePricing && <td>{taxRate}%</td>}
                      </tr>
                    );
                  })
                ) : (
                  <tr className="no-items">
                    <td colSpan={isInclusivePricing ? 7 : 6}>
                      <p className="not-set"> {t(i18n)`No items`}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {sanitizedItems?.length > 0 && (
              <table cellPadding={0} cellSpacing={0} className="totals-table">
                <tbody>
                  <tr className="subtotal">
                    <td colSpan={4}>
                      <span>{t(i18n)`Subtotal${
                        isInclusivePricing ? ' excl. tax' : ''
                      }`}</span>
                    </td>
                    <td>{subtotalPrice?.toString()}</td>
                  </tr>
                  {Object.entries(taxesByVatRate).map(
                    ([rate, totalTax], index) => (
                      <tr key={index}>
                        <td colSpan={4}>
                          <span>
                            {t(i18n)`Total Tax`} ({rate}%)
                          </span>
                        </td>
                        <td>
                          {currency &&
                            formatCurrencyToDisplay(totalTax, currency, true)}
                        </td>
                      </tr>
                    )
                  )}
                  <tr className="total">
                    <td colSpan={4}>
                      <span>{t(i18n)`Total`}</span>
                    </td>
                    <td>
                      <span>{totalPrice?.toString()}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </article>
        <footer>
          <section style={{ gap: '15mm' }}>
            <aside className="footer-aside footer-aside__start">
              <div className="block-entity-info">
                <div>
                  <div></div>
                  <div>
                    <b>{entityData?.organization?.legal_name}</b>
                  </div>
                  <div>
                    <div>
                      {entityData?.address?.line1} {entityData?.address?.line2}
                      {entityData?.address?.city} {entityData?.address?.country}
                    </div>
                  </div>
                </div>
              </div>{' '}
              <div>
                <hr style={{ height: '5pt', visibility: 'hidden' }} />

                {entityData?.tax_id && (
                  <div>
                    {t(i18n)`TAX ID`} {entityData?.tax_id}
                  </div>
                )}
                {entityVatIds?.data[0]?.id && (
                  <div>
                    {t(i18n)`VAT ID`} {entityVatIds.data[0].value}
                  </div>
                )}
                <div>{entityData?.phone}</div>
                <div>{entityData?.email}</div>
              </div>
            </aside>
            <aside className="footer-aside footer-aside__end">
              <aside>
                <div>
                  <div>
                    <span>{t(i18n)`Payment Details`}</span>
                  </div>
                  {renderBankAccountDetails()}
                </div>
              </aside>
              <aside>
                <div className="qr-code-data"></div>
              </aside>
            </aside>
          </section>
        </footer>
      </div>
    </StyledInvoicePreview>
  );
};
