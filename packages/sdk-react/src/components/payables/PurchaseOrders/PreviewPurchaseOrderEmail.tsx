import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, Paper, Divider } from '@mui/material';

interface PreviewPurchaseOrderEmailProps {
  purchaseOrderId: string;
  subject: string;
  body: string;
}

export const PreviewPurchaseOrderEmail = ({
  purchaseOrderId,
  subject,
  body,
}: PreviewPurchaseOrderEmailProps) => {
  const { i18n } = useLingui();
  const { api, entityId } = useMoniteContext();

  const { data: purchaseOrder } =
    api.payablePurchaseOrders.getPayablePurchaseOrdersId.useQuery({
      path: { purchase_order_id: purchaseOrderId },
      header: { 'x-monite-entity-id': entityId },
    });

  const vendorName = (() => {
    const cp = purchaseOrder?.counterpart;
    if (!cp) return t(i18n)`Vendor`;
    if (cp.type === 'organization' && 'organization' in cp) {
      return cp.organization.legal_name;
    }
    if (cp.type === 'individual' && 'individual' in cp) {
      return `${cp.individual.first_name} ${cp.individual.last_name}`;
    }
    return t(i18n)`Vendor`;
  })();

  const vendorEmail = (() => {
    const cp = purchaseOrder?.counterpart;
    if (!cp) return '';
    if (cp.type === 'organization' && 'organization' in cp) {
      return cp.organization.email || '';
    }
    if (cp.type === 'individual' && 'individual' in cp) {
      return cp.individual.email || '';
    }
    return '';
  })();

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        bgcolor: 'grey.50',
        p: 4,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          maxWidth: 800,
          mx: 'auto',
          p: 4,
          bgcolor: 'background.paper',
        }}
      >
        {/* Email Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t(i18n)`Email Preview`}
          </Typography>
          <Divider />
        </Box>

        {/* Email Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>{t(i18n)`To:`}</strong> {vendorEmail || vendorName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>{t(i18n)`Subject:`}</strong> {subject}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Email Body */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {body}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Attachment Info */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
            border: 1,
            borderColor: 'grey.300',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>{t(i18n)`Attachment:`}</strong>{' '}
            {purchaseOrder?.document_id || t(i18n)`Purchase Order`}
            {t(i18n)`.pdf`}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
