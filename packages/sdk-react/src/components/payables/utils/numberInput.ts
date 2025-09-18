import { parseLocaleNumericString } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/utils';
import type { ChangeEvent } from 'react';

export type EmptyBehavior = 'undefined' | 'null';

export const createLocaleNumberChangeHandler =
  (
    locale: string,
    emptyAs: EmptyBehavior = 'undefined',
    onChange: (value: number | null | undefined) => void
  ) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === '') {
      onChange(emptyAs === 'null' ? null : undefined);
      return;
    }

    const parsed = parseLocaleNumericString(raw, locale);

    onChange(parsed);
  };
