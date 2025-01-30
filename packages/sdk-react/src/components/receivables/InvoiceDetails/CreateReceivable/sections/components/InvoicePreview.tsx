import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useCounterpartById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useCreateInvoiceProductsTable } from '../../components/useCreateInvoiceProductsTable';
import './InvoicePreview.css';

export const InvoicePreview = ({
  currency,
  data,
  entityData,
  address,
  paymentTerms,
  entityVatIds,
  isNonVatSupported,
  counterpartVats,
}: any) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay, getSymbolFromCurrency } = useCurrencies();
  const currencySymbol = getSymbolFromCurrency(currency);
  const fulfillmentDate = data?.fulfillment_date;
  const items = data?.line_items;
  const memo = data?.memo;
  // const discount = data?.discount?.amount;
  const { data: counterpart } = useCounterpartById(data?.counterpart_id);
  const counterpartName = counterpart ? getCounterpartName(counterpart) : '';
  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term: any) => term.id === data?.payment_terms_id
  );
  const { subtotalPrice, totalPrice, totalTaxes } =
    useCreateInvoiceProductsTable({
      lineItems: [...data?.line_items],
      formatCurrencyToDisplay,
      isNonVatSupported,
    });
  const dateTime = i18n.date(new Date(), locale.dateFormat);

  return (
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
                <p className="not-set">{t(i18n)`Not set`}</p>
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
            <div>{counterpart?.organization?.email}</div>
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
                <span>
                  {fulfillmentDate ? (
                    i18n.date(fulfillmentDate, locale.dateFormat)
                  ) : (
                    <span className="not-set">{t(i18n)`Not set`}</span>
                  )}
                </span>
              </li>
            </ul>
            <ul>
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
                    {t(i18n)`${selectedPaymentTerm.term_1.discount}% discount`}
                  </p>
                )}
                {selectedPaymentTerm?.term_2 && (
                  <span>
                    {t(
                      i18n
                    )`Pay in the first ${selectedPaymentTerm.term_2.number_of_days} days`}{' '}
                    {t(i18n)`${selectedPaymentTerm.term_2.discount}% discount`}
                  </span>
                )}
                {selectedPaymentTerm?.term_final && (
                  <span>
                    {t(i18n)`Payment due`}{' '}
                    {t(
                      i18n
                    )`${selectedPaymentTerm.term_final?.number_of_days} days`}
                  </span>
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
                <th>{t(i18n)`Disc.`}</th>
                <th>
                  {t(i18n)`Amount`} ({currencySymbol})
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
                    <td>{item?.discount}</td>
                    <td>{item?.amount}</td>
                    <td>{item?.tax_rate_value || item?.vat_rate_value}</td>
                  </tr>
                ))
              ) : (
                <tr className="no-items">
                  <td colSpan={7}>
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
                  <td>
                    {subtotalPrice?.toString()}
                    {
                      //currency
                    }
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <span>{t(i18n)`Total Tax`} (0%)</span>
                  </td>
                  <td>
                    {totalTaxes?.toString()} {currency}
                  </td>
                </tr>
                <tr className="total">
                  <td colSpan={4}>
                    <span>{t(i18n)`Total`}</span>
                  </td>
                  <td>
                    <span>
                      {totalPrice?.toString()}
                      {currency}
                    </span>
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
                  <span>
                    <b>{t(i18n)`Payment Details`}:</b>
                  </span>
                </div>
                <div>
                  <span>
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
  );
};
