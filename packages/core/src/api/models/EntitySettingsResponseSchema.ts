/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettingsResponse } from './CurrencySettingsResponse';
import type { RemindersSettings } from './RemindersSettings';

/**
 * A schema contains entity internal settings for getting settings
 */
export type EntitySettingsResponseSchema = {
    currencies?: CurrencySettingsResponse;
    reminders?: RemindersSettings;
};
