import NoDataIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import CountryUnsupportedIcon from '@mui/icons-material/HourglassEmpty';
import AccessRestrictedIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Typography, Link } from '@mui/material';

interface DataGridEmptyStateProps {
  type: 'no-data' | 'error' | 'access-restricted' | 'unsupported-country';
  table: 'Payables' | 'ApprovalRequest' | 'Sales' | 'Counterparts' | 'Products';
  onAction?: () => void;
}

export const DataGridEmptyState: React.FC<DataGridEmptyStateProps> = ({
  type,
  table,
  onAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'no-data':
        return (
          <NoDataIcon sx={{ fontSize: '4rem', color: 'primary.main', mb: 2 }} />
        );
      case 'error':
        return (
          <ErrorIcon sx={{ fontSize: '4rem', color: 'error.main', mb: 2 }} />
        );
      case 'access-restricted':
        return (
          <AccessRestrictedIcon
            sx={{ fontSize: '4rem', color: 'grey.500', mb: 2 }}
          />
        );
      case 'unsupported-country':
        return (
          <CountryUnsupportedIcon
            sx={{ fontSize: '4rem', color: 'grey.500', mb: 2 }}
          />
        );
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'no-data':
        switch (table) {
          case 'Sales':
            return 'No sales yet. You can create your first quote or invoice.';
          // Add specific messages for other tables here if needed
        }
        break;
      case 'error':
        switch (table) {
          case 'Sales':
            return 'Failed to load sales documents. Please try to reload. If the error recurs, contact support.';
          // Add specific messages for other tables here if needed
        }
        break;
      case 'access-restricted':
        return 'Access Restricted. You don’t have permissions to view this page. Contact your system administrator for details.';
      case 'unsupported-country':
        return 'We don’t support invoicing in your country yet. Tax rates and regulations are currently not supported for your country. Unfortunately, you can’t issue documents.';
      default:
        return '';
    }
  };

  const getActionButtonLabel = () => {
    switch (type) {
      case 'no-data':
        return 'Create Document';
      case 'error':
        return 'Reload page';
      default:
        return '';
    }
  };

  const renderActionButton = () => {
    if (type === 'no-data' || type === 'error') {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          sx={{ mt: 2 }}
          startIcon={type === 'error' ? <RefreshIcon /> : undefined}
        >
          {getActionButtonLabel()}
        </Button>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        padding: 3,
        color: 'text.secondary',
      }}
    >
      {getIcon()}
      <Typography
        sx={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          mb: 1,
        }}
      >
        {getMessage()}
      </Typography>
      {renderActionButton()}
      {type === 'error' && (
        <Link
          href="#"
          onClick={onAction}
          sx={{
            mt: 1,
            textDecoration: 'none',
            color: 'primary.main',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <RefreshIcon fontSize="small" sx={{ mr: 0.5 }} />
          Reload page
        </Link>
      )}
    </Box>
  );
};
