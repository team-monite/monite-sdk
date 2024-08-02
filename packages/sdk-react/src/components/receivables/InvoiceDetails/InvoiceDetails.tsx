import { InvoiceDetailsProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { CreateReceivables } from './CreateReceivable';
import { ExistingReceivableDetails } from './ExistingInvoiceDetails/ExistingReceivableDetails';

export const InvoiceDetails = (props: InvoiceDetailsProps) => (
  <MoniteScopedProviders>
    <InvoiceDetailsBase {...props} />
  </MoniteScopedProviders>
);

const InvoiceDetailsBase = (props: InvoiceDetailsProps) => {
  const { i18n } = useLingui();

  if (props.type) {
    if (props.type !== 'invoice') {
      return (
        <AccessRestriction
          description={t(
            i18n
          )`You can not create receivable with a type other than "${'invoice'}"`}
        />
      );
    }

    return <CreateReceivables {...props} />;
  }

  return <ExistingReceivableDetails {...props} />;
};
