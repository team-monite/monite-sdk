/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { RemindersSettings } from './RemindersSettings';

export type CreateSettingsRequest = {
    currencies?: CurrencySettings;
    reminders?: RemindersSettings;
};
