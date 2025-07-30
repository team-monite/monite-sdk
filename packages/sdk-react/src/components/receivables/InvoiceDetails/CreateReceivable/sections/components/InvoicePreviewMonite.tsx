import { useCreateInvoiceProductsTable } from '../../components/useCreateInvoiceProductsTable';
import { sanitizeLineItems, type SanitizableLineItem } from '../../utils';
import { CreateReceivablesFormBeforeValidationLineItemProps } from '../../validation';
import type { InvoicePreviewBaseProps } from './InvoicePreview.types';
import {
  getPaymentTermsDiscount,
  getMeasureUnitName,
  getRateValueForItem,
} from './InvoicePreview.utils';
import styles from './InvoicePreviewMonite.module.css';
import {
  calculateDueDate,
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { INVOICE_DOCUMENT_AUTO_ID } from '@/components/receivables/consts';
import { useGetEntityBankAccountById } from '@/components/receivables/hooks';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { rateMinorToMajor } from '@/core/utils/vatUtils';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isValid } from 'date-fns';

export const InvoicePreviewMonite = ({
  address,
  counterpart,
  currency,
  invoiceData,
  entityData,
  isNonVatSupported,
  paymentTerms,
  measureUnits = [],
}: InvoicePreviewBaseProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const {
    document_id: documentId,
    payment_terms_id: paymentTermsId,
    line_items: items,
    fulfillment_date: fulfillmentDate,
    memo,
    entity_bank_account_id: entityBankAccountId = '',
    vat_mode: vatMode,
  } = invoiceData;

  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term) => term.id === paymentTermsId
  );
  const dueDate = selectedPaymentTerm && calculateDueDate(selectedPaymentTerm);
  const discount = getPaymentTermsDiscount(selectedPaymentTerm);

  const sanitizedItems = sanitizeLineItems(items as SanitizableLineItem[]).map(
    (item, index) => ({
      ...item,
      id: item.id || `item-${index + 1}`,
    })
  );

  const isInclusivePricing = vatMode === 'inclusive';
  const counterpartName = counterpart ? getCounterpartName(counterpart) : '';
  const { data: bankAccount } =
    useGetEntityBankAccountById(entityBankAccountId);

  const dateTime = i18n.date(new Date(), locale.dateFormat);

  const { subtotalPrice, totalPrice, taxesByVatRate } =
    useCreateInvoiceProductsTable({
      lineItems:
        sanitizedItems as CreateReceivablesFormBeforeValidationLineItemProps[],
      formatCurrencyToDisplay,
      isNonVatSupported,
      actualCurrency: currency,
      isInclusivePricing,
    });

  return (
    <div className={styles.invoicePreviewMonite}>
      <header className={styles.header}>
        <div className={styles.documentTitle}>
          <h1 className={styles.invoiceTitle}>
            {t(i18n)`Invoice`}{' '}
            <span className={styles.invoiceNumber}>
              (#{documentId || t(i18n)`${INVOICE_DOCUMENT_AUTO_ID}`})
            </span>
          </h1>
        </div>
        <div className={cn(styles.logoWrapper, !entityData?.logo?.url && styles.noLogo)}>
          {entityData?.logo?.url ? (
            <img className={styles.logoImage} src={entityData.logo.url} alt={t(i18n)`Logo`} />
          ) : (
            <span className={styles.logoText}>{t(i18n)`Logo`}</span>
          )}
        </div>
      </header>

      <div className={styles.mainInfoSection}>
        <div className={styles.infoColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnHeaderTitle}>{t(i18n)`To`}</h2>
          </div>
          <div className={styles.columnContent}>
            {!counterpartName ? (
              <p className={cn(styles.columnText, styles.notSet)}>{t(
                i18n
              )`Not set`}</p>
            ) : (
              <>
                <p className={cn(styles.columnText, styles.companyName)}>
                  {counterpartName}
                </p>
                {address && (
                  <p className={cn(styles.columnText, styles.address)}>
                    {address.line1}
                    {address.line2 && ` ${address.line2}`}
                    {address.postal_code && `, ${address.postal_code}`}
                    {address.city && ` ${address.city}`}
                    {address.country && `, ${address.country}`}
                  </p>
                )}
                {counterpart &&
                  isOrganizationCounterpart(counterpart) &&
                  counterpart.organization.email && (
                    <p className={cn(styles.columnTextm, styles.email)}>
                      {counterpart.organization.email}
                    </p>
                  )}
                {counterpart &&
                  isIndividualCounterpart(counterpart) &&
                  counterpart.individual.email && (
                    <p className={cn(styles.columnTextm, styles.email)}>
                      {counterpart.individual.email}
                    </p>
                  )}
              </>
            )}
          </div>
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnHeaderTitle}>{t(i18n)`Details`}</h2>
          </div>
          <div className={styles.columnContent}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>
                {t(i18n)`Issue date`}:&nbsp;
              </span>
              <span className={styles.detailValue}>{dateTime}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>
                {t(i18n)`Due date`}:&nbsp;
              </span>
              <span className={styles.detailValue}>
                {dueDate ? (
                  i18n.date(dueDate, locale.dateFormat)
                ) : (
                  <span className={styles.notSet}>{t(i18n)`Not set`}</span>
                )}
              </span>
            </div>
            {fulfillmentDate && isValid(fulfillmentDate) && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  {t(i18n)`Fulfillment date`}:&nbsp;
                </span>
                <span className={styles.detailValue}>
                  {i18n.date(fulfillmentDate, locale.dateFormat)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.columnHeader}>
            <h2 className={styles.columnHeaderTitle}>{t(
              i18n
            )`Payment terms`}</h2>
          </div>
          <div className={styles.columnContent}>
            {selectedPaymentTerm ? (
              <>
                {selectedPaymentTerm.term_1 && (
                  <p className={cn(styles.columnText, styles.paymentTerm)}>
                    {t(
                      i18n
                    )`Pay in the first ${selectedPaymentTerm.term_1.number_of_days} days`}
                    {selectedPaymentTerm.term_1.discount && (
                      <>
                        ,{' '}
                        {rateMinorToMajor(selectedPaymentTerm.term_1.discount)}%{' '}
                        {t(i18n)`discount`}
                      </>
                    )}
                  </p>
                )}
                {selectedPaymentTerm.term_2 && (
                  <p className={cn(styles.columnText, styles.paymentTerm)}>
                    {t(
                      i18n
                    )`Pay in the first ${selectedPaymentTerm.term_2.number_of_days} days`}
                    {selectedPaymentTerm.term_2.discount && (
                      <>
                        ,{' '}
                        {rateMinorToMajor(selectedPaymentTerm.term_2.discount)}%{' '}
                        {t(i18n)`discount`}
                      </>
                    )}
                  </p>
                )}
                {selectedPaymentTerm.term_final && (
                  <p className={cn(styles.columnText, styles.paymentTerm)}>
                    {t(i18n)`NET`}{' '}
                    {selectedPaymentTerm.term_final.number_of_days}{' '}
                    {t(i18n)`days`}
                  </p>
                )}
              </>
            ) : (
              <p className={cn(styles.columnText, styles.notSet)}>{t(
                i18n
              )`Not set`}</p>
            )}
          </div>
        </div>
      </div>

      {memo && (
        <div className={styles.memoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeaderTitle}>{t(i18n)`Memo`}</h2>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.sectionText}>{memo}</p>
          </div>
        </div>
      )}

      <div className={styles.lineItemsSection}>
        <table className={styles.lineItemsTable}>
          <thead>
            <tr>
              <th className={styles.colNumber}>#</th>
              <th className={styles.colProduct}>{t(i18n)`Product`}</th>
              <th className={styles.colQty}>{t(i18n)`Qty`}</th>
              <th className={styles.colPrice}>{t(i18n)`Price`}</th>
              <th className={styles.colDiscount}>{t(i18n)`Disc.`}</th>
              <th className={styles.colAmount}>{t(i18n)`Amount`}</th>
              <th className={styles.colTax}>{t(i18n)`Tax`}</th>
            </tr>
          </thead>
          <tbody>
            {sanitizedItems.length > 0 ? (
              sanitizedItems.map((item, index) => {
                const taxRate = getRateValueForItem(item, isNonVatSupported);
                const quantity = item?.quantity || 1;
                const price = item?.product?.price?.value || 0;
                const priceAfterDiscount = price * (1 - discount / 100);
                const totalAmount = priceAfterDiscount * quantity;

                return (
                  <tr key={item.id} className={styles.itemRow}>
                    <td className={styles.colNumber}>{index + 1}</td>
                    <td className={styles.colProduct}>
                      <div className={styles.productName}>
                        {item?.product?.name}
                      </div>
                      {item?.product?.description && (
                        <div className={styles.productDescription}>
                          {item.product.description}
                        </div>
                      )}
                    </td>
                    <td className={styles.colQty}>
                      <span className={styles.quantityValue}>{quantity}</span>{' '}
                      <span className={styles.quantityUnit}>
                        {item?.product?.measure_unit_id
                          ? getMeasureUnitName(
                              item.product.measure_unit_id,
                              measureUnits
                            )
                          : item?.measure_unit?.name
                            ? item.measure_unit.name
                            : null}
                      </span>
                    </td>
                    <td className={styles.colPrice}>
                      {item.product?.price
                        ? formatCurrencyToDisplay(
                            price,
                            item.product.price.currency,
                            true
                          )
                        : ''}
                    </td>
                    <td className={styles.colDiscount}>
                      {discount > 0 && item.product?.price
                        ? formatCurrencyToDisplay(
                            (price * quantity * discount) / 100,
                            item.product.price.currency,
                            true
                          )
                        : ''}
                    </td>
                    <td className={styles.colAmount}>
                      {item.product?.price
                        ? formatCurrencyToDisplay(
                            totalAmount,
                            item.product.price.currency,
                            true
                          )
                        : ''}
                    </td>
                    <td className={styles.colTax}>
                      {taxRate > 0 ? `${taxRate}%` : ''}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className={styles.noItemsRow}>
                <td colSpan={7} className={styles.noItemsCell}>
                  <p className={styles.notSet}>{t(i18n)`No items`}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sanitizedItems?.length > 0 && (
        <div className={styles.totalsSection}>
          <div className={styles.totalsTable}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>{t(i18n)`Subtotal`}</span>
              <span className={styles.totalValue}>
                {subtotalPrice?.toString()}
              </span>
            </div>

            {Object.entries(taxesByVatRate).map(([rate, totalTax], index) => (
              <div className={styles.totalRow} key={index}>
                <span className={styles.totalLabel}>
                  {t(i18n)`Total tax`} ({rate}%)
                </span>
                <span className={styles.totalValue}>
                  {currency &&
                    formatCurrencyToDisplay(totalTax, currency, true)}
                </span>
              </div>
            ))}

            <div className={cn(styles.totalRow, styles.finalTotal)}>
              <span className={styles.totalLabel}>
                {t(i18n)`TOTAL`} ({currency})
              </span>
              <span className={styles.totalValue}>
                {totalPrice?.toString()}
              </span>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footerSection}>
        <div className={styles.footerContent}>
          <div className={styles.companyInfo}>
            {entityData &&
              'organization' in entityData &&
              entityData.organization?.legal_name && (
                <p className={cn(styles.companyText, styles.companyName)}>
                  {entityData.organization.legal_name}
                </p>
              )}
            {entityData?.address && (
              <p className={cn(styles.companyText, styles.companyAddress)}>
                {entityData.address.line1}
                {entityData.address.line2 && ` ${entityData.address.line2}`}
                {entityData.address.city && `, ${entityData.address.city}`}
                {entityData.address.country &&
                  `, ${entityData.address.country}`}
              </p>
            )}
            {entityData?.phone && (
              <p className={cn(styles.companyText, styles.companyPhone)}>
                {entityData.phone}
              </p>
            )}
            {entityData?.email && (
              <p className={cn(styles.companyText, styles.companyEmail)}>
                {entityData.email}
              </p>
            )}
          </div>

          <div className={styles.paymentSection}>
            {bankAccount && (
              <div className={styles.paymentDetails}>
                <p className={styles.paymentLink}>
                  <span>
                    {t(i18n)`Pay`} {totalPrice?.toString()} {t(i18n)`via link`}
                  </span>
                </p>
                <div className={styles.paymentInfo}>
                  <p className={styles.paymentText}>{t(
                    i18n
                  )`Payment details`}</p>
                  {/* EU - prioritize IBAN/BIC/Bank name */}
                  {bankAccount?.iban && (
                    <p className={styles.paymentText}>
                      {t(i18n)`IBAN`}: {bankAccount.iban}
                    </p>
                  )}
                  {bankAccount?.bic && (
                    <p className={styles.paymentText}>
                      {t(i18n)`BIC`}: {bankAccount.bic}
                    </p>
                  )}
                  {bankAccount?.bank_name && (
                    <p className={styles.paymentText}>
                      {t(i18n)`Bank name`}: {bankAccount.bank_name}
                    </p>
                  )}
                  {/* US - fallback to account number/routing */}
                  {!bankAccount?.iban && bankAccount?.account_number && (
                    <p className={styles.paymentText}>
                      {t(i18n)`Account number`}: {bankAccount.account_number}
                    </p>
                  )}
                  {!bankAccount?.bic && bankAccount?.routing_number && (
                    <p className={styles.paymentText}>
                      {t(i18n)`Routing number`}: {bankAccount.routing_number}
                    </p>
                  )}
                  {bankAccount?.sort_code && (
                    <p className={styles.paymentText}>
                      {t(i18n)`Sort code`}: {bankAccount.sort_code}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className={styles.qrCodeSection}>
              <div className={styles.qrCodeData}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
