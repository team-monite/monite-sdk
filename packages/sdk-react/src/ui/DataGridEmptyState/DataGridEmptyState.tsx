import { CenteredContentBox } from '@/ui/box';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NoDataIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import CountryUnsupportedIcon from '@mui/icons-material/HourglassEmpty';
import AccessRestrictedIcon from '@mui/icons-material/Lock';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface BaseProps {
  onAction?: (option?: string) => void;
  actionButtonLabel?: string;
  actionOptions?: string[];
  type?:
    | 'no-data'
    | 'no-data=payables'
    | 'no-data=receipts'
    | 'error'
    | 'access-restricted'
    | 'unsupported-country'
    | 'no-filter'
    | 'custom';
  className?: string;
}

export interface DataGridEmptyStateProps extends BaseProps {
  icon?: ReactNode;
  title: string;
  descriptionLine1: string;
  descriptionLine2?: string;
}

interface ActionButtonProps extends BaseProps {
  onAction?: (option?: string) => void;
}

export const DataGridEmptyState = ({
  title,
  icon,
  descriptionLine1,
  descriptionLine2,
  onAction,
  actionButtonLabel,
  actionOptions = [],
  type,
  className = 'Monite-DataGridEmptyState',
}: DataGridEmptyStateProps) => {
  let defaultIcon;
  switch (type) {
    case 'error':
      defaultIcon = (
        <ErrorIcon sx={{ fontSize: '4rem', color: 'error.main' }} />
      );
      break;
    case 'no-data':
      defaultIcon = (
        <NoDataIcon sx={{ fontSize: '4rem', color: 'primary.main' }} />
      );
      break;
    case 'no-data=payables':
      defaultIcon = (
        <ReceiptLong sx={{ fontSize: '4rem', color: 'primary.main' }} />
      );
      break;
    case 'no-data=receipts':
      defaultIcon = (
        <ReceiptIcon sx={{ fontSize: '4rem', color: 'primary.main' }} />
      );
      break;
    case 'no-filter':
      defaultIcon = (
        <SearchOffIcon sx={{ fontSize: '4rem', color: 'primary.main' }} />
      );
      break;
    case 'access-restricted':
      defaultIcon = (
        <AccessRestrictedIcon
          sx={{ fontSize: '4rem', color: 'warning.main' }}
        />
      );
      break;
    case 'unsupported-country':
      defaultIcon = (
        <CountryUnsupportedIcon sx={{ fontSize: '4rem', color: 'grey.500' }} />
      );
      break;
    case 'custom':
      defaultIcon = icon;
      break;
    default:
      defaultIcon = null;
  }

  return (
    <CenteredContentBox className={`${className}-Content`}>
      <Stack alignItems="center" spacing={3}>
        {defaultIcon && (
          <Box className={`${className}-Icon`}>{defaultIcon}</Box>
        )}
        <Stack alignItems="center" spacing={1}>
          <Typography variant="h3" className={`${className}-Title`}>
            {title}
          </Typography>
          <Box>
            <Typography
              variant="body1"
              align="center"
              className={`${className}-Description`}
            >
              {descriptionLine1}
            </Typography>
            {descriptionLine2 && (
              <Typography
                variant="body1"
                align="center"
                className={`${className}-Description`}
              >
                {descriptionLine2}
              </Typography>
            )}
          </Box>
        </Stack>
        <ActionButton
          onAction={onAction}
          actionButtonLabel={actionButtonLabel}
          actionOptions={actionOptions}
          type={type}
          className={className}
        />
      </Stack>
    </CenteredContentBox>
  );
};

const ActionButton = ({
  onAction,
  actionButtonLabel,
  actionOptions = [],
  type,
  className = 'Monite-DataGridEmptyState',
}: ActionButtonProps) => {
  if (!actionButtonLabel) return null;

  const handleMenuItemClick = (option?: string) => {
    if (onAction) {
      onAction(option);
    }
  };

  return actionOptions.length > 1 ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          startIcon={type === 'error' ? <RefreshIcon /> : undefined}
          endIcon={<ArrowDropDownIcon />}
          className={`${className}-Button`}
        >
          {actionButtonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actionOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => handleMenuItemClick(option)}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      variant="contained"
      color="primary"
      sx={{ mt: 2 }}
      onClick={(event) => {
        event.preventDefault();
        handleMenuItemClick(actionOptions?.[0]);
      }}
      startIcon={type === 'error' ? <RefreshIcon /> : undefined}
      className={`${className}-Button`}
    >
      {actionButtonLabel}
    </Button>
  );
};
