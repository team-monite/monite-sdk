import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  const { root } = useRootElements();
  const { api } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

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

  return (
    <Dialog
      open={open}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Delete confirmation`}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle variant="h3" sx={{ padding: '32px' }}>
        {t(i18n)`Delete "${name}" unit and associated items?`}
      </DialogTitle>
      <DialogContent
        sx={{ paddingBottom: 0, display: 'flex', flexDirection: 'column' }}
      >
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        ></div>
      </DialogContent>
      <DialogActions sx={{ padding: '32px' }}>
        <Button
          color="primary"
          onClick={onClose}
          variant="text"
          sx={{ borderRadius: '8px' }}
        >
          {t(i18n)`Cancel`}
        </Button>
        <Button
          onClick={onDelete}
          disabled={isLoading}
          variant="contained"
          sx={{ borderRadius: '8px', backgroundColor: '#FF475D' }}
        >
          {t(i18n)`Delete`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
