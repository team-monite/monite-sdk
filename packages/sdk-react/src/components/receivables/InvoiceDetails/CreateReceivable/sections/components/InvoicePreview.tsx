import { components } from '@/api';
import {
  calculateDueDate,
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { CreateReceivablesFormBeforeValidationLineItemProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import styled from '@emotion/styled';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { isValid } from 'date-fns';

import { useCreateInvoiceProductsTable } from '../../components/useCreateInvoiceProductsTable';
import { CreateReceivablesFormProps } from '../../validation';
// @ts-ignore
import invoicePreviewStyles from './InvoicePreview.css';

interface InvoicePreviewProps {
  address: components['schemas']['CounterpartAddressResponseWithCounterpartID'];
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
  const counterpartName = counterpart ? getCounterpartName(counterpart) : '';

  const dateTime = i18n.date(new Date(), locale.dateFormat);

  const paymentTermsId = watch('payment_terms_id');
  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term) => term.id === paymentTermsId
  );
  const dueDate = selectedPaymentTerm && calculateDueDate(selectedPaymentTerm);

  // the below is currently used to fix TS error "Types of property 'smallest_amount' are incompatible."
  const sanitizedItems = items.map((item) => ({
    ...item,
    smallest_amount: item.smallest_amount ?? undefined,
  }));

  const { subtotalPrice, totalPrice } = useCreateInvoiceProductsTable({
    lineItems: sanitizedItems,
    formatCurrencyToDisplay,
    isNonVatSupported,
  });

  const getApplicableTaxRate = (
    item: CreateReceivablesFormBeforeValidationLineItemProps
  ): number => {
    if (item.price?.currency === 'EUR') {
      return item.vat_rate_value || 0;
    }
    return item.tax_rate_value || 0;
  };

  const groupItemsByTaxRate = (
    items: Array<CreateReceivablesFormBeforeValidationLineItemProps>
  ): Record<number, CreateReceivablesFormBeforeValidationLineItemProps[]> => {
    return items.reduce((acc, item) => {
      const taxRate = getApplicableTaxRate(item);
      if (taxRate === 0) {
        return acc;
      }
      if (!acc[taxRate]) {
        acc[taxRate] = [];
      }
      acc[taxRate].push(item);
      return acc;
    }, {} as Record<number, CreateReceivablesFormBeforeValidationLineItemProps[]>);
  };

  const calculateTotalTaxesByRate = (
    groupedItems: Record<
      number,
      CreateReceivablesFormBeforeValidationLineItemProps[]
    >
  ): Array<{ taxRate: number; totalTax: number }> => {
    return Object.keys(groupedItems).map((taxRateKey) => {
      const taxRate = Number(taxRateKey);
      const items = groupedItems[taxRate];
      const totalTax = items.reduce((sum, item) => {
        const itemPrice = item.price?.value || 0;
        const itemTax = (itemPrice * item.quantity * taxRate) / 10000;
        return sum + itemTax;
      }, 0);
      return { taxRate: taxRate / 100, totalTax };
    });
  };

  const groupedItems = groupItemsByTaxRate(sanitizedItems);
  const totalTaxesByRate = calculateTotalTaxesByRate(groupedItems);

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
                          {t(
                            i18n
                          )`${selectedPaymentTerm.term_1.discount}% discount`}
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
                          {t(
                            i18n
                          )`${selectedPaymentTerm.term_2.discount}%discount`}
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
                  <th>{t(i18n)`Tax`} (%)</th>
                </tr>
                <tr className="spacer">
                  <td colSpan={7} />
                </tr>
              </thead>
              <tbody className="products">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr>
                      <td style={{ maxWidth: '120px' }}>{item?.name}</td>
                      <td>{item?.quantity}</td>
                      <td>
                        {item?.measure_unit_id && (
                          <MeasureUnit unitId={item.measure_unit_id} />
                        )}
                      </td>
                      <td>
                        {formatCurrencyToDisplay(
                          item.price.value,
                          item.price.currency,
                          false
                        )}
                      </td>
                      <td>
                        {((item.price.currency === 'EUR'
                          ? item.vat_rate_value
                          : item.tax_rate_value) || 0) / 100}
                        %
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-items">
                    <td colSpan={6}>
                      <p className="not-set"> {t(i18n)`No items`}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {items?.length > 1 && (
              <table cellPadding={0} cellSpacing={0} className="totals-table">
                <tbody>
                  <tr className="subtotal">
                    <td colSpan={4}>
                      <span>{t(i18n)`Subtotal`}</span>
                    </td>
                    <td>{subtotalPrice?.toString()}</td>
                  </tr>
                  {totalTaxesByRate.map((tax, index) => (
                    <tr key={index}>
                      <td colSpan={4}>
                        <span>
                          {t(i18n)`Total Tax`} ({tax.taxRate}%)
                        </span>
                      </td>
                      <td>
                        {currency &&
                          formatCurrencyToDisplay(tax.totalTax, currency, true)}
                      </td>
                    </tr>
                  ))}
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
          <section>
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
                    <span>{t(i18n)`Payment Details`}:</span>
                  </div>
                  <div>
                    <span className="not-set">
                      {t(i18n)`Set up bank account to add payment info
                  and set a QR code`}{' '}
                    </span>
                  </div>
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
