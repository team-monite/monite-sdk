import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isValid } from 'date-fns';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import {
  rateMinorToMajor,
} from '@/core/utils/vatUtils';
import {
  calculateDueDate,
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { useGetEntityBankAccountById } from '@/components/receivables/hooks';

import type { InvoicePreviewBaseProps } from './InvoicePreview.types';
import {
  getPaymentTermsDiscount,
  getMeasureUnitName,
  getRateValueForItem,
} from './InvoicePreview.utils';
import { useCreateInvoiceProductsTable } from '../../components/useCreateInvoiceProductsTable';
import { sanitizeLineItems, type SanitizableLineItem } from '../../utils';
import styles from './InvoicePreviewLegacy.module.css';

export const InvoicePreviewLegacy = ({
  address,
  counterpart,
  counterpartVats,
  currency,
  invoiceData,
  entityData,
  entityVatIds,
  isNonVatSupported,
  paymentTerms,
  measureUnits = [],
}: InvoicePreviewBaseProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay, getSymbolFromCurrency } = useCurrencies();
  const currencySymbol = currency ? getSymbolFromCurrency(currency) : '';

  const {
    fulfillment_date: fulfillmentDate,
    line_items: items,
    memo,
    entity_bank_account_id: entityBankAccountId = '',
    vat_mode: vatMode,
    payment_terms_id: paymentTermsId,
  } = invoiceData;
  const isInclusivePricing = vatMode === 'inclusive';
  const counterpartName = counterpart ? getCounterpartName(counterpart) : '';
  const { data: bankAccount } =
    useGetEntityBankAccountById(entityBankAccountId);

  const dateTime = i18n.date(new Date(), locale.dateFormat);

  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term) => term.id === paymentTermsId
  );
  const dueDate = selectedPaymentTerm && calculateDueDate(selectedPaymentTerm);

  const sanitizedItems = sanitizeLineItems(items as SanitizableLineItem[]);

  const { subtotalPrice, totalPrice, taxesByVatRate } =
    useCreateInvoiceProductsTable({
      lineItems: sanitizedItems,
      formatCurrencyToDisplay,
      isNonVatSupported,
      actualCurrency: currency,
      isInclusivePricing,
    });

  return (
    <div className={styles.invoicePreview}>
      <header className={styles.header}>
        <aside>
          <h1 className={styles.blockHeader}>{t(i18n)`Invoice`}</h1>
        </aside>
        <aside className={styles['header--flex-end-aside']}>
          <div className={styles.blockEntityLogo}>
            {entityData?.logo?.url ? (
              <img src={entityData.logo.url} alt={t(i18n)`Company logo`} />
            ) : (
              <span>{t(i18n)`No logo`}</span>
            )}
          </div>
        </aside>
        <aside>
          <div className={styles.blockCounterpartInfo}>
            <div>
              <b> {t(i18n)`Customer`}</b>
            </div>
            <div>
              {!counterpartName && (
                <span className={styles.notSet}>{t(i18n)`Not set`}</span>
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
        <aside className={styles['header--flex-end-aside']}>
          <div className={styles.blockReceivableDate}>
            <ul>
              <li>
                <span>{t(i18n)`Issue date`}: </span> <span>{dateTime}</span>
              </li>
              <li>
                <span>{t(i18n)`Due date`}: </span>{' '}
                {dueDate ? (
                  <span>{i18n.date(dueDate, locale.dateFormat)}</span>
                ) : (
                  <span className={styles.notSet}>{t(i18n)`Not set`}</span>
                )}
              </li>

              {fulfillmentDate && isValid(fulfillmentDate) && (
                <li>
                  <span>{t(i18n)`Fulfillment date`}: </span>{' '}
                  <span>{i18n.date(fulfillmentDate, locale.dateFormat)}</span>
                </li>
              )}
            </ul>
            <ul className={styles.paymentTerms}>
              <li>
                <span>
                  <b>{t(i18n)`Payment terms`}</b>
                </span>
              </li>
              <li>
                {!selectedPaymentTerm && (
                  <span className={styles.notSet}>{t(i18n)`Not set`}</span>
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
      <section className={styles.paymentDescription}>
        <div className={styles.blockMemo}>{memo}</div>
      </section>
      <article>
        <div className={styles.blockLineItems}>
          <table className={styles.lineItemsTable} cellSpacing="0">
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
              <tr className={styles.spacer}>
                <td colSpan={7} />
              </tr>
            </thead>
            <tbody className={styles.products}>
              {sanitizedItems.length > 0 ? (
                sanitizedItems.map((item) => {
                  const taxRate = getRateValueForItem(item, isNonVatSupported);
                  const quantity = item?.quantity ?? 1;
                  const price = item?.product?.price?.value ?? 0;
                  const discount = getPaymentTermsDiscount(selectedPaymentTerm);
                  const priceAfterDiscount = price * (1 - discount / 100);
                  const totalAmount = priceAfterDiscount * quantity;

                  return (
                    <tr key={item.id}>
                      <td style={{ maxWidth: '120px' }}>
                        {item?.product?.name}
                      </td>
                      <td>{item?.quantity}</td>
                      <td>
                        {item?.product?.measure_unit_id
                          ? getMeasureUnitName(item.product.measure_unit_id, measureUnits)
                          : item?.measure_unit?.name
                            ? item.measure_unit.name
                            : null}
                      </td>
                      <td>
                        {item.product?.price &&
                          formatCurrencyToDisplay(
                            isInclusivePricing
                              ? price / (1 + taxRate / 100)
                              : price,
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
                                price,
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
                <tr className={styles.noItems}>
                  <td colSpan={isInclusivePricing ? 7 : 6}>
                    <p className={styles.notSet}> {t(i18n)`No items`}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {sanitizedItems?.length > 0 && (
            <table
              cellPadding={0}
              cellSpacing={0}
              className={styles.totalsTable}
            >
              <tbody>
                <tr className={styles.subtotal}>
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
                <tr className={styles.total}>
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
          <aside className={`${styles.footerAside} ${styles.footerAsideStart}`}>
            <div className={styles.blockEntityInfo}>
              <div>
                <div></div>
                <div>
                  <b>
                    {entityData && 'organization' in entityData
                      ? entityData.organization?.legal_name
                      : ''}
                  </b>
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
          <aside className={`${styles.footerAside} ${styles.footerAsideEnd}`}>
            <aside>
              <div>
                <div>
                  <span>{t(i18n)`Payment Details`}</span>
                </div>
                <div>
                  {!bankAccount ? (
                    <span className={styles.notSet}>
                      {t(
                        i18n
                      )`Set up bank account to add payment info and set a QR code`}
                    </span>
                  ) : (
                    <div>
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
                          {t(i18n)`Account number`}:{' '}
                          {bankAccount?.account_number}
                        </p>
                      )}
                      {bankAccount?.routing_number && (
                        <p>
                          {t(i18n)`Routing number`}:{' '}
                          {bankAccount?.routing_number}
                        </p>
                      )}
                      {bankAccount?.sort_code && (
                        <p>
                          {t(i18n)`Sort code`}: {bankAccount?.sort_code}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </aside>
            <aside>
              <div className={styles.qrCodeData}></div>
            </aside>
          </aside>
        </section>
      </footer>
    </div>
  );
};
