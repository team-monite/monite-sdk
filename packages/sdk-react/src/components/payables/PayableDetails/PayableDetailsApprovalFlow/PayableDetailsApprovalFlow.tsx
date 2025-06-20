import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Stack,
  CircularProgress,
} from '@mui/material';

interface PayableApprovalFlowProps {
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];
  payableId: string;
  currentStatus: string;
}

export const PayableApprovalFlow: React.FC<PayableApprovalFlowProps> = ({
  approvalPolicy: _approvalPolicy,
  payableId,
  currentStatus: _currentStatus,
}) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const { data: approvalRequests, isLoading } =
    api.approvalRequests.getApprovalRequests.useQuery({
      query: {
        object_id: payableId,
        object_type: 'payable',
        limit: 50,
      },
    });

  if (isLoading) {
    return <CircularProgress size={20} />;
  }

  const requests = approvalRequests?.data || [];

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {t(i18n)`Approval Flow`}
      </Typography>

      <List dense>
        {requests.map((request, index) => (
          <ListItem key={request.id} sx={{ pl: 0 }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24 }}>{index + 1}</Avatar>
                  <Typography variant="body2">
                    {t(i18n)`Approval Request`} #{request.id.substring(0, 8)}...
                  </Typography>
                  {request.status === 'approved' && (
                    <Chip
                      label={t(i18n)`Approved`}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {request.status === 'rejected' && (
                    <Chip
                      label={t(i18n)`Rejected`}
                      color="error"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {request.status === 'waiting' && (
                    <Chip
                      label={t(i18n)`Pending`}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>

      {requests.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t(i18n)`No approval requests found`}
        </Typography>
      )}
    </Box>
  );
};
