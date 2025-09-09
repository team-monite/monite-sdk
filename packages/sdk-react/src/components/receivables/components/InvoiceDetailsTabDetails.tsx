import { InvoiceDetailsSummary } from './InvoiceDetailsSummary';
import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { getCountries } from '@/core/utils';
import { rateMinorToMajor } from '@/core/utils/vatUtils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type OverviewBlockProps = {
  label: string;
  value: ReactNode;
  status?: components['schemas']['ReceivablesStatusEnum'];
};

const OverviewBlock = ({ label, value, status }: OverviewBlockProps) => {
  return (
    <div className="mtw:flex mtw:flex-col">
      <h3 className="mtw:text-neutral-10 mtw:text-sm mtw:font-medium mtw:leading-5">
        {label}
      </h3>
      <p
        className={twMerge(
          'mtw:text-sm mtw:font-normal mtw:leading-5',
          status && status === 'overdue'
            ? 'mtw:text-danger-10'
            : 'mtw:text-neutral-50'
        )}
      >
        {value}
      </p>
    </div>
  );
};

type InvoiceDetailsTabDetailsProps = {
  invoice?: components['schemas']['ReceivableResponse'];
};

export const InvoiceDetailsTabDetails = ({
  invoice,
}: InvoiceDetailsTabDetailsProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  const isInclusivePricing = invoice?.vat_mode === 'inclusive';

  if (invoice?.type !== 'invoice') {
    return null;
  }

  return (
    <>
      <div className="mtw:flex mtw:flex-col mtw:gap-4">
        <h2 className="mtw:text-lg mtw:font-semibold mtw:leading-6">
          {t(i18n)`Customer`}
        </h2>

        <div className="mtw:grid mtw:grid-cols-2 mtw:gap-4">
          <OverviewBlock
            label={t(i18n)`Name`}
            value={invoice?.counterpart_name ?? '-'}
          />
          {invoice?.counterpart_vat_id?.value && (
            <OverviewBlock
              label={t(i18n)`Tax ID`}
              value={invoice?.counterpart_vat_id?.value}
            />
          )}
          <OverviewBlock
            label={t(i18n)`Billing address`}
            value={`${invoice?.counterpart_billing_address?.line1}${
              invoice?.counterpart_billing_address?.line2
                ? ` ${invoice?.counterpart_billing_address?.line2}`
                : ''
            }, ${invoice?.counterpart_billing_address?.postal_code}, ${
              invoice?.counterpart_billing_address?.city
            }, ${
              getCountries(i18n)[
                invoice?.counterpart_billing_address?.country ?? ''
              ]
            }`}
          />
          <OverviewBlock
            label={t(i18n)`Contact person`}
            value={`${invoice?.counterpart_contact?.first_name} ${invoice?.counterpart_contact?.last_name}`}
          />
        </div>
      </div>

      <div className="mtw:w-full mtw:h-px mtw:bg-border" />

      <div className="mtw:flex mtw:flex-col">
        <h2 className="mtw:text-lg mtw:font-semibold mtw:leading-6">
          {t(i18n)`Items`}
        </h2>

        <div className="mtw:flex mtw:flex-col mtw:gap-5">
          <table className="mtw:w-full">
            <thead>
              <tr className="mtw:border-b-1 mtw:border-border mtw:h-10 mtw:text-neutral-10 mtw:text-sm mtw:leading-5">
                <th className="mtw:w-full mtw:text-left mtw:pr-2 mtw:whitespace-nowrap mtw:font-medium">
                  {t(i18n)`Item name`}
                </th>
                <th className="mtw:text-left mtw:px-2 mtw:whitespace-nowrap mtw:font-medium">
                  {t(i18n)`Qty x Price`}
                </th>
                <th className="mtw:text-right mtw:px-2 mtw:whitespace-nowrap mtw:font-medium">
                  {t(i18n)`Amount`}
                </th>
                <th className="mtw:text-right mtw:pl-2 mtw:whitespace-nowrap mtw:font-medium">
                  {t(i18n)`Sales tax`}
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice?.line_items?.length > 0 &&
                invoice?.line_items?.map((item, index) => {
                  return (
                    <tr
                      key={`${item?.product?.id}-${index}`}
                      className="mtw:border-b-1 mtw:border-border mtw:h-10 mtw:text-neutral-10 mtw:text-sm mtw:leading-5"
                    >
                      <td className="mtw:py-4 mtw:pr-2 mtw:font-normal">
                        {item?.product?.name}
                      </td>
                      <td className="mtw:py-4 mtw:px-2 mtw:font-normal mtw:whitespace-nowrap">
                        {t(i18n)`${item?.quantity} x ${formatCurrencyToDisplay(
                          isInclusivePricing
                            ? item?.product?.price_after_vat?.value
                            : item?.product?.price?.value,
                          item?.product?.price?.currency
                        )}`}
                      </td>
                      <td className="mtw:py-4 mtw:px-2 mtw:font-normal mtw:text-right mtw:whitespace-nowrap">
                        {formatCurrencyToDisplay(
                          isInclusivePricing
                            ? item?.total_after_vat
                            : item?.product?.price?.value * item?.quantity,
                          item?.product?.price?.currency
                        )}
                      </td>
                      <td className="mtw:py-4 mtw:pl-2 mtw:font-normal mtw:text-right">
                        {rateMinorToMajor(item?.product?.vat_rate?.value)}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <InvoiceDetailsSummary invoice={invoice} />
        </div>
      </div>

      <div className="mtw:w-full mtw:h-px mtw:bg-border" />

      <div className="mtw:flex mtw:flex-col mtw:gap-4">
        <h2 className="mtw:text-lg mtw:font-semibold mtw:leading-6">
          {t(i18n)`Payment info`}
        </h2>

        <div className="mtw:grid mtw:grid-cols-2 mtw:gap-4">
          <OverviewBlock
            label={t(i18n)`Payment terms`}
            value={invoice?.payment_terms?.name ?? '-'}
          />
          <OverviewBlock
            label={t(i18n)`Payment details`}
            value={
              <>
                <span>
                  {t(i18n)`Bank name:`}{' '}
                  {invoice?.entity_bank_account?.bank_name ?? '-'}
                </span>
                <br />
                <span>
                  {t(i18n)`IBAN:`} {invoice?.entity_bank_account?.iban ?? '-'}
                </span>
                <br />
                <span>
                  {t(i18n)`BIC/SWIFT:`}{' '}
                  {invoice?.entity_bank_account?.bic ?? '-'}
                </span>
              </>
            }
          />
        </div>
      </div>
    </>
  );
};
