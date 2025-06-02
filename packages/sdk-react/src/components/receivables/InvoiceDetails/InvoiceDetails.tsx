import { InvoiceDetailsProps } from '@/components/receivables/InvoiceDetails/InvoiceDetails.types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { CreateReceivables } from './CreateReceivable/CreateReceivables';
import { ExistingReceivableDetails } from './ExistingInvoiceDetails/ExistingReceivableDetails';

export const InvoiceDetails = ({
  customerTypes,
  ...rest
}: InvoiceDetailsProps) => (
  <MoniteScopedProviders>
    <InvoiceDetailsBase {...rest} customerTypes={customerTypes} />
  </MoniteScopedProviders>
);

const InvoiceDetailsBase = ({
  customerTypes,
  ...rest
}: InvoiceDetailsProps) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  if (rest.type) {
    if (rest.type !== 'invoice') {
      return (
        <AccessRestriction
          description={t(
            i18n
          )`You can not create receivable with a type other than “${'invoice'}”`}
        />
      );
    }

    return (
      <CreateReceivables
        {...rest}
        customerTypes={
          customerTypes || componentSettings?.counterparts?.customerTypes
        }
      />
    );
  }

  return <ExistingReceivableDetails {...rest} />;
};
