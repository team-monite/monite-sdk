import { ReactNode } from 'react';

import { useMenuButton } from '@/core/hooks';
import { CenteredContentBox } from '@/ui/box';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import NoDataIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import CountryUnsupportedIcon from '@mui/icons-material/HourglassEmpty';
import AccessRestrictedIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';

interface BaseProps {
  onAction?: (option?: string) => void;
  actionButtonLabel?: string;
  actionOptions?: string[];
  type:
    | 'no-data'
    | 'error'
    | 'access-restricted'
    | 'unsupported-country'
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
        <ErrorIcon sx={{ fontSize: '4rem', color: 'error.main', mb: 2 }} />
      );
      break;
    case 'no-data':
      defaultIcon = (
        <NoDataIcon sx={{ fontSize: '4rem', color: 'primary.main', mb: 2 }} />
      );
      break;
    case 'access-restricted':
      defaultIcon = (
        <AccessRestrictedIcon
          sx={{ fontSize: '4rem', color: 'warning.main', mb: 2 }}
        />
      );
      break;
    case 'unsupported-country':
      defaultIcon = (
        <CountryUnsupportedIcon
          sx={{ fontSize: '4rem', color: 'grey.500', mb: 2 }}
        />
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
      <Stack alignItems="center" spacing={2}>
        {defaultIcon && (
          <Box className={`${className}-Icon`}>{defaultIcon}</Box>
        )}
        <Stack alignItems="center" spacing={1}>
          <Typography variant="h5" className={`${className}-Title`}>
            {title}
          </Typography>
          <Typography className={`${className}-Description`}>
            {descriptionLine1}
          </Typography>
          {descriptionLine2 && (
            <Typography className={`${className}-Description`}>
              {descriptionLine2}
            </Typography>
          )}
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
  const { buttonProps, menuProps } = useMenuButton();

  if (!actionButtonLabel) return null;

  const handleMenuItemClick = (option?: string) => {
    if (option && onAction) {
      onAction(option);
    }
  };

  return (
    <>
      <Button
        {...buttonProps}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        startIcon={type === 'error' ? <RefreshIcon /> : undefined}
        endIcon={
          actionOptions.length > 0 ? (
            menuProps.open ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )
          ) : undefined
        }
        className={`${className}-Button`}
      >
        {actionButtonLabel}
      </Button>
      {actionOptions.length > 0 && (
        <Menu {...menuProps} className={`${className}-Menu`}>
          {actionOptions.map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleMenuItemClick(option)}
              className={`${className}-MenuItem`}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};
