/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { PayableSettings } from './PayableSettings';
import type { ReceivableSettings } from './ReceivableSettings';
import type { Unit } from './Unit';
import type { UserPicSettings } from './UserPicSettings';
import type { WebhookSettingsResponse } from './WebhookSettingsResponse';

export type ResponseSettings = {
    entity_users?: UserPicSettings;
    webhooks?: Array<WebhookSettingsResponse>;
    currencies?: CurrencySettings;
    payables?: PayableSettings;
    receivables?: ReceivableSettings;
    units?: Array<Unit>;
    commercial_conditions?: Array<string>;
};
