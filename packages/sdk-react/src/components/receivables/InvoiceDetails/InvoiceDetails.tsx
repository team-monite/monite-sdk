import React from 'react';

import { InvoiceDetailsProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload } from '@monite/sdk-api';

import { CreateReceivables } from './CreateReceivable';
import { ExistingInvoiceDetails } from './ExistingInvoiceDetails';

export const InvoiceDetails = (props: InvoiceDetailsProps) => {
  const { i18n } = useLingui();

  if (props.type) {
    if (props.type !== InvoiceResponsePayload.type.INVOICE) {
      return (
        <MoniteStyleProvider>
          <AccessRestriction
            description={t(
              i18n
            )`You can not create receivable with a type other than "${InvoiceResponsePayload.type.INVOICE}"`}
          />
        </MoniteStyleProvider>
      );
    }

    return <CreateReceivables {...props} />;
  }

  return <ExistingInvoiceDetails {...props} />;
};
