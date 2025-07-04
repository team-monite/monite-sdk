import { components } from '@/api';
import { ProductDetails } from '@/components/products';
import { ProductsTableDataTestId } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/ProductsTable.types';
import { Dialog } from '@/ui/Dialog';

export interface CreateProductDialogProps {
  defaultCurrency?: CurrencyEnum;
  actualCurrency?: CurrencyEnum;
  open: boolean;
  handleClose: () => void;
}

export const CreateProductDialog = ({
  defaultCurrency,
  actualCurrency,
  open,
  handleClose,
}: CreateProductDialogProps) => {
  const currency = actualCurrency || defaultCurrency;

  return (
    <Dialog
      open={open}
      alignDialog="right"
      onClose={handleClose}
      data-testid={ProductsTableDataTestId.DialogTestId}
    >
      <ProductDetails
        onCreated={handleClose}
        defaultValues={{
          currency: currency,
        }}
      />
    </Dialog>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
