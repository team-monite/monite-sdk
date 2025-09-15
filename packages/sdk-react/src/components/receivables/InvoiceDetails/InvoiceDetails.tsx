import {
  CreateReceivables,
  InvoiceDetailsCreateProps,
} from './CreateReceivable/CreateReceivables';
import { InvoiceDetails as InvoiceDetailsComponent } from '@/components/receivables/components/InvoiceDetails';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';

// TODO: Remove this component in the next major version
// When we remove this component, we need to call CreateReceivables directly in Receivables
// And InvoiceDetails will be the one imported in this file.
// Also, we need to remove these created types ExistingReceivableDetailsProps and InvoiceDetailsCreateProps;
interface ExistingReceivableDetailsProps {
  /** Receivable ID */
  id: string;

  type?: never;

  /**
   * Function called to close the invoice details.
   */
  onClose: () => void;

  /**
   * Function called after invoice is duplicated.
   */
  onDuplicate?: (invoiceId: string) => void;
  onMarkAsUncollectible?: (invoiceId: string) => void;
  openInvoiceDetails?: (invoiceId: string) => void;
}

type InvoiceDetailsProps =
  | ExistingReceivableDetailsProps
  | InvoiceDetailsCreateProps;

export const InvoiceDetails = (props: InvoiceDetailsProps) => (
  <MoniteScopedProviders>
    <InvoiceDetailsBase {...props} />
  </MoniteScopedProviders>
);

const InvoiceDetailsBase = (props: InvoiceDetailsProps) => {
  const { componentSettings } = useMoniteContext();

  if (props.type) {
    return (
      <CreateReceivables
        {...props}
        customerTypes={
          props.customerTypes || componentSettings?.counterparts?.customerTypes
        }
      />
    );
  }

  return (
    <InvoiceDetailsComponent
      open={!!props.id}
      onCloseInvoiceDetails={props.onClose}
      invoiceId={props.id}
      onDuplicate={props.onDuplicate}
      onMarkAsUncollectible={props.onMarkAsUncollectible}
      openInvoiceDetails={props.openInvoiceDetails}
    />
  );
};
