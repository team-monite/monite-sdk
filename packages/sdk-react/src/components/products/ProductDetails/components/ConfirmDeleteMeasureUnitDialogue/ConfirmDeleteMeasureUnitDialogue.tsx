import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DialogContentText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

type ConfirmDeleteMeasureUnitDialogueProps = {
  open: boolean;
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
  id?: string;
};

export const ConfirmDeleteMeasureUnitDialogue = ({
  onClose,
  onDelete,
  name,
  isLoading,
  open,
  id,
}: ConfirmDeleteMeasureUnitDialogueProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();
  const root = useRootElements();

  const { data: products, isLoading: isLoadingProducts } =
    api.products.getProducts.useQuery(
      {
        query: {
          measure_unit_id: id,
        },
      },
      {
        enabled: !!id,
      }
    );

  const isEmpty = products?.data.length === 0;

  const renderContent = () => {
    if (isEmpty) {
      return (
        <>
          <DialogContentText>
            {t(i18n)`There are no items created with this measure unit.`}
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 400, mb: 2 }}>
            {t(i18n)`Deleting it won't affect your items.`}
          </DialogContentText>
        </>
      );
    }

    return (
      <>
        <DialogContentText>
          {t(i18n)`All items with this measure unit will get deleted, too.`}
        </DialogContentText>
        <DialogContentText sx={{ fontWeight: 400, mb: 2 }}>
          {t(
            i18n
          )`Please, check the list of products and services that will get deleted:`}
        </DialogContentText>
        {isLoadingProducts && <CircularProgress sx={{ margin: 'auto' }} />}
        {!isLoadingProducts && (
          <Table>
            <TableBody>
              {products?.data.map((p) => {
                return (
                  <TableRow key={p.id}>
                    <TableCell sx={{ p: 1, pl: 0 }}>
                      <Typography variant="body1">{p.name}</Typography>
                    </TableCell>
                    <TableCell sx={{ p: 1, pr: 0 }} align="right">
                      <Typography variant="body1">
                        {p.price &&
                          formatCurrencyToDisplay(
                            p.price?.value,
                            p.price?.currency
                          )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </>
    );
  };

  return (
    <ConfirmationModal
      open={open}
      container={root?.root}
      title={
        isEmpty
          ? t(i18n)`Delete "${name}" unit?`
          : t(i18n)`Delete "${name}" unit and associated items?`
      }
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={onClose}
      onConfirm={onDelete}
      isLoading={isLoading || isLoadingProducts}
    >
      {renderContent()}
    </ConfirmationModal>
  );
};
