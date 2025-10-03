import type { PurchaseOrderLineItem } from '../../validation';
import purchaseOrderStyles from './PurchaseOrderPreviewMonite.module.css';
import { components } from '@/api';
import {
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { useCreateInvoiceProductsTable } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/useCreateInvoiceProductsTable';
import {
  getCountryName,
  getCounterpartPhone,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/InvoicePreview.utils';
import styles from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/InvoicePreviewMonite.module.css';
import type { SanitizableLineItem } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/types';
import { sanitizeLineItems } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/utils';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { rateMajorToMinor } from '@/core/utils/currencies';
import type { Price } from '@/core/utils/price';
import { vatRateBasisPointsToPercentage } from '@/core/utils/vatUtils';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export interface PurchaseOrderPreviewMoniteProps {
  purchaseOrderData: {
    line_items?: PurchaseOrderLineItem[];
    message?: string;
  };
  counterpart?: components['schemas']['CounterpartResponse'] | null;
  currency?: CurrencyEnum;
  entityData?: components['schemas']['EntityResponse'] | null;
  counterpartAddress?: components['schemas']['CounterpartAddress'] | null;
  expiryDate: Date;
  isNonVatSupported?: boolean;
}

export const PurchaseOrderPreviewMonite = ({
  purchaseOrderData,
  counterpart,
  currency,
  entityData,
  counterpartAddress,
  expiryDate,
  isNonVatSupported = false,
}: PurchaseOrderPreviewMoniteProps) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const { line_items = [], message } = purchaseOrderData;

  const counterpartName = counterpart ? getCounterpartName(counterpart) : '';
  const dateTime = i18n.date(new Date(), locale.dateFormat);

  const convertedLineItems =
    line_items?.map(
      (item): SanitizableLineItem => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        currency: item.currency as CurrencyEnum,
        vat_rate_id: item.vat_rate_id,
        vat_rate_value: item.vat_rate_value,
        tax_rate_value: item.tax_rate_value,
      })
    ) || [];
  const sanitizedItems = sanitizeLineItems(
    convertedLineItems as ReadonlyArray<SanitizableLineItem> | undefined,
    { treatFlatPricesAsMajorUnits: true }
  );

  const { subtotalPrice, totalPrice, taxesByVatRate } =
    useCreateInvoiceProductsTable({
      lineItems: sanitizedItems,
      formatCurrencyToDisplay,
      isNonVatSupported,
      actualCurrency: currency ?? 'USD',
      isInclusivePricing: false,
    });

  const priceToMinorUnits = (price?: Price | undefined) => {
    return price ? price.getValue() : null;
  };

  return (
    <div
      className={cn(
        styles.invoicePreviewMonite,
        purchaseOrderStyles.purchaseOrderPreview
      )}
    >
      <header className={styles.header}>
        <div className={styles.documentTitle}>
          <h1 className={styles.invoiceTitle}>
            {t(i18n)`Purchase Order`}{' '}
            <span className={styles.invoiceNumber}>(#{t(i18n)`Draft`})</span>
          </h1>
        </div>
        <div
          className={cn(
            styles.logoWrapper,
            !entityData?.logo?.url && styles.noLogo
          )}
        >
          {entityData?.logo?.url ? (
            <img
              className={styles.logoImage}
              src={entityData.logo.url}
              alt={t(i18n)`Logo`}
            />
          ) : (
            <span className={styles.logoText}>{t(i18n)`No logo`}</span>
          )}
        </div>
      </header>

      <div
        className={cn(
          styles.mainInfoSection,
          purchaseOrderStyles.mainInfoSectionOverride
        )}
      >
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
                {counterpartAddress && (
                  <p className={cn(styles.columnText, styles.address)}>
                    {counterpartAddress.line1}
                    {counterpartAddress.line2 && ` ${counterpartAddress.line2}`}
                    {counterpartAddress.postal_code &&
                      `, ${counterpartAddress.postal_code}`}
                    {counterpartAddress.city && ` ${counterpartAddress.city}`}
                    {counterpartAddress.country &&
                      `, ${getCountryName(i18n, counterpartAddress.country)}`}
                  </p>
                )}

                {counterpart && getCounterpartPhone(counterpart) && (
                  <p className={cn(styles.columnText, styles.phone)}>
                    {getCounterpartPhone(counterpart)}
                  </p>
                )}

                {counterpart &&
                  isOrganizationCounterpart(counterpart) &&
                  counterpart.organization.email && (
                    <p className={cn(styles.columnText, styles.email)}>
                      {counterpart.organization.email}
                    </p>
                  )}
                {counterpart &&
                  isIndividualCounterpart(counterpart) &&
                  counterpart.individual.email && (
                    <p className={cn(styles.columnText, styles.email)}>
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
                {t(i18n)`Expiry date`}:&nbsp;
              </span>
              <span className={styles.detailValue}>
                {i18n.date(expiryDate, locale.dateFormat)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={styles.memoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeaderTitle}>{t(i18n)`Message`}</h2>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.sectionText}>{message}</p>
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
              <th className={styles.colAmount}>{t(i18n)`Amount`}</th>
              <th className={styles.colTax}>{t(i18n)`Tax (%)`}</th>
            </tr>
          </thead>
          <tbody>
            {sanitizedItems.length > 0 ? (
              sanitizedItems.map((item, index) => {
                const quantity = item?.quantity ?? 1;
                const priceMajor = item?.product?.price?.value ?? 0;
                const totalAmountMajor = priceMajor * quantity;

                const vatRate = item.tax_rate_value
                  ? item.tax_rate_value
                  : item.vat_rate_value
                    ? vatRateBasisPointsToPercentage(item.vat_rate_value)
                    : 0;

                return (
                  <tr
                    key={item.id || `item-${index}`}
                    className={styles.itemRow}
                  >
                    <td className={styles.colNumber}>{index + 1}</td>
                    <td className={styles.colProduct}>
                      <div className={styles.productName}>
                        {item?.product?.name}
                      </div>
                    </td>
                    <td className={styles.colQty}>
                      <span className={styles.quantityValue}>{quantity}</span>{' '}
                      <span className={styles.quantityUnit}>
                        {item?.product?.measure_unit_id || 'unit'}
                      </span>
                    </td>
                    <td className={styles.colPrice}>
                      {formatCurrencyToDisplay(
                        rateMajorToMinor(priceMajor),
                        currency ?? 'USD',
                        true
                      )}
                    </td>
                    <td className={styles.colAmount}>
                      {formatCurrencyToDisplay(
                        rateMajorToMinor(totalAmountMajor),
                        currency || 'USD',
                        true
                      )}
                    </td>
                    <td className={styles.colTax}>
                      {vatRate > 0 ? `${vatRate.toFixed(2)}%` : ''}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className={styles.noItemsRow}>
                <td colSpan={6} className={styles.noItemsCell}>
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
                {formatCurrencyToDisplay(
                  priceToMinorUnits(subtotalPrice) ?? 0,
                  currency ?? 'USD',
                  true
                )}
              </span>
            </div>

            {Object.entries(taxesByVatRate).map(([rate, taxAmount]) => (
              <div className={styles.totalRow} key={rate}>
                <span className={styles.totalLabel}>
                  {t(i18n)`Total tax`} ({Number(rate).toFixed(2)}%)
                </span>
                <span className={styles.totalValue}>
                  {currency &&
                    formatCurrencyToDisplay(
                      rateMajorToMinor(taxAmount as number),
                      currency,
                      true
                    )}
                </span>
              </div>
            ))}

            {totalPrice && (
              <div className={cn(styles.totalRow, styles.finalTotal)}>
                <span className={styles.totalLabel}>
                  {t(i18n)`TOTAL`} ({currency || 'USD'})
                </span>
                <span className={styles.totalValue}>
                  {formatCurrencyToDisplay(
                    priceToMinorUnits(totalPrice) ?? 0,
                    currency || 'USD',
                    true
                  )}
                </span>
              </div>
            )}
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
                  `, ${getCountryName(i18n, entityData.address.country)}`}
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
            <div className={styles.qrCodeSection}>
              <div className={styles.qrCodeData}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
