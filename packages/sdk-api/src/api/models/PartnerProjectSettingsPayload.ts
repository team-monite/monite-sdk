/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { PayableSettings } from './PayableSettings';
import type { PaymentsSettingsPayload } from './PaymentsSettingsPayload';
import type { ReceivableSettings } from './ReceivableSettings';
import type { RolesCreatePayload } from './RolesCreatePayload';
import type { Unit } from './Unit';

export type PartnerProjectSettingsPayload = {
    /**
     * Custom currency exchange rates.
     */
    currency?: CurrencySettings;
    /**
     * Settings for the payables module.
     */
    payable?: PayableSettings;
    /**
     * Settings for the receivables module.
     */
    receivable?: ReceivableSettings;
    /**
     * Commercial conditions for receivables.
     */
    commercial_conditions?: Array<string>;
    /**
     * Measurement units.
     */
    units?: Array<Unit>;
    website?: string;
    /**
     * A default role to provision upon new entity creation.
     */
    default_role?: RolesCreatePayload;
    /**
     * Settings for the payments module.
     */
    payments?: PaymentsSettingsPayload;
};

