import { AllowedCountries } from '@/enums/AllowedCountries';
import type { I18n } from '@lingui/core';
import { getCurrencyEnum } from '@/components/receivables/validation';
import { z } from 'zod';

export const getBankValidationSchema = () =>
  z.object({
    iban: z.string().optional(),
    bic: z.string().optional(),
    name: z.string().optional(),
    account_number: z.string().optional(),
    account_holder_name: z.string().optional(),
    sort_code: z.string().optional(),
    routing_number: z.string().optional(),
    country: z.enum(AllowedCountries as [string, ...string[]]),
    currency: getCurrencyEnum({} as I18n),
    partner_metadata: z.any().optional(),
    is_default_for_currency: z.boolean().optional(),
  });

export type CounterpartBankFormFields = z.infer<
  ReturnType<typeof getBankValidationSchema>
>;
