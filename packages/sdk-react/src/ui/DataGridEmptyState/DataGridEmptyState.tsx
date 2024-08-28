import { ReactNode } from 'react';

import { useMenuButton } from '@/core/hooks';
import { CenteredContentBox } from '@/ui/box';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';

export interface DataGridEmptyStateProps {
  icon?: ReactNode;
  title: string;
  descriptionLine1: string;
  descriptionLine2?: string;
  onAction?: (option?: string) => void;
  actionButtonLabel?: string;
  actionOptions?: string[];
  type: 'no-data' | 'error' | 'access-restricted' | 'unsupported-country';
  className?: string;
}

export const DataGridEmptyState = ({
  icon,
  title,
  descriptionLine1,
  descriptionLine2,
  onAction,
  actionButtonLabel,
  actionOptions = [],
  type,
  className = 'Monite-DataGridEmptyState',
}: DataGridEmptyStateProps) => (
  <CenteredContentBox className={`${className}-Content`}>
    <Stack alignItems="center" spacing={2}>
      {icon && <Box className={`${className}-Icon`}>{icon}</Box>}
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

interface ActionButtonProps {
  onAction?: (option?: string) => void;
  actionButtonLabel?: string;
  actionOptions?: string[];
  type: 'no-data' | 'error' | 'access-restricted' | 'unsupported-country';
  className?: string;
}

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
