/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { ReceivableSettings } from './ReceivableSettings';
import type { Unit } from './Unit';
import type { UserPicSettings } from './UserPicSettings';
import type { WebhookSettingsRequest } from './WebhookSettingsRequest';

export type CreateSettings = {
    entity_users: UserPicSettings;
    webhooks?: Array<WebhookSettingsRequest>;
    currencies?: CurrencySettings;
    receivables?: ReceivableSettings;
    units?: Array<Unit>;
    commercial_conditions?: Array<string>;
};
