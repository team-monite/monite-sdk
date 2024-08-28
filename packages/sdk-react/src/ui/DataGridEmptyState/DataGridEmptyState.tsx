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

export const DataGridEmptyState = ({
  type,
  table,
  onAction,
}: DataGridEmptyStateProps) => {
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

  const getTitle = () => {
    switch (type) {
      case 'no-data':
        switch (table) {
          case 'Sales':
            return 'No sales yet.';
          case 'Payables':
            return 'No payables yet.';
          case 'ApprovalRequest':
            return 'No approval requests yet.';
          case 'Counterparts':
            return 'No counterparts yet.';
          case 'Products':
            return 'No products yet.';
        }
        break;
      case 'error':
        switch (table) {
          case 'Sales':
            return 'Failed to load sales documents';
          case 'Payables':
            return 'Failed to load payables';
          case 'ApprovalRequest':
            return 'Failed to load approval requests';
          case 'Counterparts':
            return 'Failed to load counterparts';
          case 'Products':
            return 'Failed to load products';
        }
        break;
      case 'access-restricted':
        return 'Access Restricted';
      case 'unsupported-country':
        switch (table) {
          case 'Sales':
            return 'We don’t support invoicing in your country yet';
          case 'Payables':
            return 'We don’t support payables in your country yet';
          case 'ApprovalRequest':
            return 'Approval requests are not supported in your country yet';
          case 'Counterparts':
            return 'Counterparts are not supported in your country yet';
          case 'Products':
            return 'Products are not supported in your country yet';
        }
        break;
      default:
        return '';
    }
  };

  const getDescriptionLine1 = () => {
    switch (type) {
      case 'no-data':
        switch (table) {
          case 'Sales':
            return 'You don’t have any sales documents added yet.';
          case 'Payables':
            return 'You don’t have any payables added yet.';
          case 'ApprovalRequest':
            return 'You don’t have any approval requests added yet.';
          case 'Counterparts':
            return 'You don’t have any counterparts added yet.';
          case 'Products':
            return 'You don’t have any products added yet.';
        }
        break;
      case 'error':
        return 'Please try to reload.';
      case 'access-restricted':
        return 'You don’t have permissions to view this page.';
      case 'unsupported-country':
        return 'Tax rates and regulations are currently not supported for your country.';
      default:
        return '';
    }
  };

  const getDescriptionLine2 = () => {
    switch (type) {
      case 'no-data':
        switch (table) {
          case 'Sales':
            return 'You can create your first quote or invoice.';
          case 'Payables':
            return 'You can add a new payable.';
          case 'ApprovalRequest':
            return 'You can create a new approval request.';
          case 'Counterparts':
            return 'You can add a new counterpart.';
          case 'Products':
            return 'You can add a new product.';
        }
        break;
      case 'error':
        return 'If the error recurs, contact support.';
      case 'access-restricted':
        return 'Contact your system administrator for details.';
      case 'unsupported-country':
        return 'Unfortunately, you can’t issue documents.';
      default:
        return '';
    }
  };

  const getActionButtonLabel = () => {
    switch (type) {
      case 'no-data':
        switch (table) {
          case 'Sales':
          case 'Payables':
          case 'ApprovalRequest':
          case 'Counterparts':
          case 'Products':
            return 'Create New';
        }
        break;
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
          fontSize: '1.5rem',
          fontWeight: 'bold',
          mb: 1,
        }}
      >
        {getTitle()}
      </Typography>
      <Typography
        sx={{
          fontSize: '1rem',
          mb: 1,
        }}
      >
        {getDescriptionLine1()}
      </Typography>
      <Typography
        sx={{
          fontSize: '1rem',
          mb: 2,
        }}
      >
        {getDescriptionLine2()}
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
