/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { RemindersSettings } from './RemindersSettings';

/**
 * A schema contains entity internal settings
 */
export type EntitySettingsSchema = {
    currencies?: CurrencySettings;
    reminders?: RemindersSettings;
};
