import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

import { CreateReceivablesFormProps } from '../../validation';
import { CustomerSection } from '../CustomerSection';
import { SectionGeneralProps } from '../Section.types';
import './InvoicePreview.css';

const sample = {
  currency: 'EUR',
  issuedDate: '',
  fulfillmentDate: '',
};

export const InvoicePreview = (
  data: components['schemas']['ReceivableFacadeCreateInvoicePayload'] | null
) => {
  const { i18n } = useLingui();
  console.log({ data });

  return (
    <div className="invoice-preview">
      <header className="header">
        <aside>
          <h1 className="block-header">{t(i18n)`Invoice`}</h1>
        </aside>
        <aside className="header--flex-end-aside">
          {' '}
          <div className="block-entity-logo">
            {true ? (
              <span></span>
            ) : (
              <img src="https://monite-file-saver-sandbox-eu-central-1.s3.eu-central-1.amazonaws.com/sandbox/entity-logo/4d51474f-3f3d-4de0-a518-93f0a799f15a/5f1e169d-1328-4bb8-a5b7-06a84bc425f9.png" />
            )}
          </div>
        </aside>
        <aside>
          <div className="block-counterpart-info">
            <div>
              <b>Some Organization</b>
            </div>
            <div>
              <div>Nobaro Street 146</div>
              <div>1012 ABS, Amsterdam</div>
              <div>The Netherlands</div>
            </div>
            <hr style={{ height: '5pt', visibility: 'hidden' }} />
            <div>qa-team@monite.com</div>
          </div>
        </aside>
        <aside className="header--flex-end-aside">
          <div className="block-receivable-date">
            <ul>
              <li>
                <span>{t(i18n)`Issued date`}: </span> <span>17.10.2024</span>
              </li>
              <li>
                <span>{t(i18n)`Fulfillment date`}: </span>{' '}
                <span>17.10.2024</span>
              </li>
              <li />
              <li />
              <li />
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
        <div className="block-line-items">
          <table className="line-items-table" cellSpacing="0">
            <thead>
              <tr>
                <th>{t(i18n)`Product`}</th>
                <th>{t(i18n)`Qty`}</th>
                <th>{t(i18n)`Units`}</th>
                <th>{t(i18n)`Price`} (EUR)</th>
                <th>{t(i18n)`Disc.`}</th>
                <th>{t(i18n)`Amount`} (EUR)</th>
                <th>{t(i18n)`Tax`} (%)</th>
              </tr>
              <tr className="spacer">
                <td colSpan={7} />
              </tr>
            </thead>
            <tbody className="products">
              <tr className="product">
                <td>
                  <div>test</div>
                </td>
                <td>1</td>
                <td>kg</td>
                <td>100,00</td>
                <td> </td>
                <td>100,00</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
          <table cellPadding={0} cellSpacing={0} className="totals-table">
            <tbody>
              <tr className="subtotal">
                <td colSpan={4}>
                  <span>{t(i18n)`Subtotal`}</span>
                </td>
                <td>100,00 EUR</td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <span>{t(i18n)`Total Tax`} (0%)</span>
                </td>
                <td>0,00 EUR</td>
              </tr>
              <tr className="total">
                <td colSpan={4}>
                  <span>{t(i18n)`Total`}</span>
                </td>
                <td>
                  <span>100,00 EUR</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
      <footer>
        <section>
          <aside className="footer-aside footer-aside__start">
            <div className="block-entity-info">
              <div>
                <div></div>
                <div>
                  <b>Party Collective</b>
                </div>
                <div>
                  <div>
                    Keizergracht 126 1015 CW, Amsterdam, The Netherlands
                  </div>
                </div>
              </div>
            </div>{' '}
            <div>
              <hr style={{ height: '5pt', visibility: 'hidden' }} />
              <div>+31 6 1234568</div>
              <div>night@life.nl</div>
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
