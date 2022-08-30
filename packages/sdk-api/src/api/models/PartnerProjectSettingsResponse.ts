/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { PayableSettings } from './PayableSettings';
import type { ReceivableSettings } from './ReceivableSettings';
import type { Unit } from './Unit';

export type PartnerProjectSettingsResponse = {
    currency?: CurrencySettings;
    payable?: PayableSettings;
    receivable?: ReceivableSettings;
    commercial_conditions?: Array<string>;
    units?: Array<Unit>;
    website?: string;
};

