/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { PaymentPriorityEnum } from './PaymentPriorityEnum';
import type { ReceivableEditFlow } from './ReceivableEditFlow';
import type { RemindersSettings } from './RemindersSettings';
import type { TemplateSettings } from './TemplateSettings';

export type PatchSettingsPayload = {
    currency?: CurrencySettings;
    reminder?: RemindersSettings;
    template?: TemplateSettings;
    /**
     * Payment preferences for entity to automate calculating suggested payment date basing on payment terms and entity preferences
     */
    payment_priority?: PaymentPriorityEnum;
    receivable_edit_flow?: ReceivableEditFlow;
};

