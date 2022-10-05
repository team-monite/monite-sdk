/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentsPaymentsAllowedCountriesCodes } from './PaymentsPaymentsAllowedCountriesCodes';
import type { PaymentsPaymentsMedia } from './PaymentsPaymentsMedia';

export type PaymentsPaymentsBank = {
  code: string;
  name: string;
  full_name: string;
  country: PaymentsPaymentsAllowedCountriesCodes;
  media: Array<PaymentsPaymentsMedia>;
  payer_required: boolean;
};
