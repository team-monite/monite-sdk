import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { FileViewer } from '@/ui/FileViewer';
import { CenteredContentBox } from '@/ui/box';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  CircularProgress,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material';

export const PurchaseOrderPDFViewer = ({
  purchaseOrderId,
}: {
  purchaseOrderId: string;
}) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();

  const {
    data: purchaseOrder,
    isLoading,
    error,
  } = api.payablePurchaseOrders.getPayablePurchaseOrdersId.useQuery({
    path: {
      purchase_order_id: purchaseOrderId,
    },
    header: { 'x-monite-entity-id': entityId },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <FormHelperText>{getAPIErrorMessage(i18n, error)}</FormHelperText>;
  }

  if (!purchaseOrder) {
    return (
      <Box
        sx={{
          padding: 4,
        }}
      >
        <Stack alignItems="center" gap={2}>
          <ErrorOutlineIcon color="error" />
          <Stack gap={0.5} alignItems="center">
            <Typography variant="body1" fontWeight="bold">{t(
              i18n
            )`Purchase order not found`}</Typography>
            <Stack alignItems="center">
              <Typography variant="body2">{t(
                i18n
              )`The purchase order could not be loaded.`}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    );
  }

  if (!purchaseOrder.file_url) {
    return (
      <CenteredContentBox>
        <Stack alignItems="center" gap={2}>
          <CircularProgress />
          <Box textAlign="center">
            <Typography variant="body2" fontWeight="500">{t(
              i18n
            )`Updating the purchase order`}</Typography>
            <Typography variant="body2" fontWeight="500">{t(
              i18n
            )`information...`}</Typography>
          </Box>
        </Stack>
      </CenteredContentBox>
    );
  }

  return <FileViewer mimetype="application/pdf" url={purchaseOrder.file_url} />;
};
