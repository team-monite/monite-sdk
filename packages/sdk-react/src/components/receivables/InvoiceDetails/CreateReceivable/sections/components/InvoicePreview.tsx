import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts';
import { MeasureUnit } from '@/components/MeasureUnit/MeasureUnit';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import './InvoicePreview.css';

/* const {
  counterpartAddressLine1,
  counterpartAddressLine2,
  counterpartAddressLine3,
  counterpartEmail,
  counterpartName,
  currency,
  items,
  subtotal,
  totalTax,
  total,
  logo,
} = data;
 */
export const InvoicePreview = ({
  data,
  entityData,
  address,
  paymentTerms,
}: any) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const fulfillmentDate = data?.fulfillment_date;
  const items = data?.line_items;
  const discount = data?.discount?.amount;
  const { data: counterpart } = useCounterpartById(data?.counterpart_id);
  const counterpartName = counterpart ? getCounterpartName(counterpart) : '';
  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term: any) => term.id === data?.payment_terms_id
  );
  //console.log('invoice preview', { data });
  const dateTime = i18n.date(new Date(), {
    ...locale.dateFormat,
    month: '2-digit',
  });
  const logo = '';

  return (
    <div className="invoice-preview">
      <header className="header">
        <aside>
          <h1 className="block-header">{t(i18n)`Invoice`}</h1>
        </aside>
        <aside className="header--flex-end-aside">
          {' '}
          <div className="block-entity-logo">
            {entityData?.logo ? (
              <span></span>
            ) : (
              <img src="https://monite-file-saver-sandbox-eu-central-1.s3.eu-central-1.amazonaws.com/sandbox/entity-logo/4d51474f-3f3d-4de0-a518-93f0a799f15a/5f1e169d-1328-4bb8-a5b7-06a84bc425f9.png" />
            )}
          </div>
        </aside>
        <aside>
          <div className="block-counterpart-info">
            <div>
              <b>{counterpartName}</b>
            </div>
            {address && (
              <div>
                <div>
                  {address.line1} {address.line2}
                </div>
                <div>
                  {address.postal_code} {address.city} {address.country}
                </div>
              </div>
            )}

            <hr style={{ height: '5pt', visibility: 'hidden' }} />
            <div>
              {
                //counterpartEmail
              }
            </div>
          </div>
        </aside>
        <aside className="header--flex-end-aside">
          <div className="block-receivable-date">
            <ul>
              <li>
                <span>{t(i18n)`Issued date`}: </span> <span>{dateTime}</span>
              </li>
              <li>
                <span>{t(i18n)`Fulfillment date`}: </span>{' '}
                <span>
                  {fulfillmentDate
                    ? i18n.date(fulfillmentDate, {
                        ...locale.dateFormat,
                        month: '2-digit',
                      })
                    : ''}
                </span>
                <p></p>
              </li>
              <li />
              <li>
                {selectedPaymentTerm && (
                  <p>
                    <b>{t(i18n)`Payment terms`}</b>
                  </p>
                )}

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
              <li />
            </ul>
          </div>
        </aside>
      </header>
      <section className="payment-description">
        <div className="block-memo">
          <h4 />
          <div />
        </div>
      </section>
      <article>
        {items?.length > 1 && (
          <div className="block-line-items">
            <table className="line-items-table" cellSpacing="0">
              <thead>
                <tr>
                  <th>{t(i18n)`Product`}</th>
                  <th>{t(i18n)`Qty`}</th>
                  <th>{t(i18n)`Units`}</th>
                  <th>
                    {t(i18n)`Price`} (
                    {
                      //currency
                    }
                    )
                  </th>
                  <th>{t(i18n)`Disc.`}</th>
                  <th>
                    {t(i18n)`Amount`} (
                    {
                      //currency
                    }
                    )
                  </th>
                  <th>{t(i18n)`Tax`} (%)</th>
                </tr>
                <tr className="spacer">
                  <td colSpan={7} />
                </tr>
              </thead>
              <tbody className="products">
                {items.map((item) => (
                  <tr className="product">
                    <td>
                      <div>{item?.name}</div>
                    </td>
                    <td>{item?.quantity}</td>
                    <td>
                      {item?.measure_unit_id && (
                        <MeasureUnit unitId={item.measure_unit_id} />
                      )}
                    </td>
                    <td>{item?.price.value}</td>
                    <td>{item?.discount}</td>
                    <td>{item?.amount}</td>
                    <td>{item?.tax_rate_value || item?.vat_rate_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table cellPadding={0} cellSpacing={0} className="totals-table">
              <tbody>
                <tr className="subtotal">
                  <td colSpan={4}>
                    <span>{t(i18n)`Subtotal`}</span>
                  </td>
                  <td>
                    {
                      //subtotal
                    }{' '}
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
                    {
                      // totalTax
                    }{' '}
                    {
                      //currency
                    }
                  </td>
                </tr>
                <tr className="total">
                  <td colSpan={4}>
                    <span>{t(i18n)`Total`}</span>
                  </td>
                  <td>
                    <span>
                      {
                        //total
                      }{' '}
                      {
                        //currency
                      }
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
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
              <div>{entityData?.phone}</div>
              <div>{entityData?.email}</div>
            </div>
          </aside>
          <aside className="footer-aside footer-aside__end">
            <aside>
              <div>
                <h3 />
                <div>
                  <span>{t(i18n)`Account number`}:</span> 12345678901234
                </div>
                <div>
                  <span>SWIFT:</span> BARBKENADIA
                </div>
                <div>
                  <span>{t(i18n)`Branch code`}:</span> 06015
                </div>
                <div>
                  <span>{t(i18n)`Bank`}:</span> BANK OF BARODA (KENYA) LTD
                </div>
              </div>
            </aside>
            <aside>
              <div className="qr-code-data" style={{ textAlign: 'center' }}>
                <img
                  style={{ width: 85, height: 85, border: 'none' }}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABOAQAAAACm0R2wAAABF0lEQVR42m2TQYptMQhEpTMVspWAU8GtC04FtxLIVLDzPzT9DO3oUkhRntSF+pmEj0+FIhFIwC/4ncgTOxXLP1VHK9mC+qhxiDVfVR2nPGqkZWpy91Xw/9MzVIUjzKhsvnBqozE0NQ6OIauEP9XtMs5Opuardvget98Mc59Q0LZ7zh5uYt03UuVeBqNfLGM5yZxtV91UfaB3tabIzUtNNWabruwtQxYv3uw972UT5Lq00xmOfpmdphZYDC/qeStWyEnoeePS2nEYOx0qnAusv0X4XuUqu3fnVidoAnU6sHZdvt23yjxApnU6cGT9K8TTyRAcGX33YliJBtg5oOciwsBnl+hUPHkzWTQ9nj6oU62lTyf/+Ie+AY2z9T1ccr/0AAAAAElFTkSuQmCC"
                  alt="qr-code"
                />
                <div style={{ marginTop: 3 }}>
                  <b>{t(i18n)`Scan to pay`}</b>
                </div>
              </div>
            </aside>
          </aside>
        </section>
      </footer>
    </div>
  );
};
