import { ReactNode } from 'react';

import { useMenuButton } from '@/core/hooks';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';

interface DataGridEmptyStateProps {
  icon?: ReactNode;
  title: string;
  descriptionLine1: string;
  descriptionLine2?: string;
  onAction?: (option?: string) => void;
  actionButtonLabel: string;
  actionOptions?: string[];
  type: 'no-data' | 'error' | 'access-restricted' | 'unsupported-country';
}

interface ActionButtonProps {
  onAction?: (option?: string) => void;
  actionButtonLabel: string;
  actionOptions?: string[];
  type: 'no-data' | 'error' | 'access-restricted' | 'unsupported-country';
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
}: DataGridEmptyStateProps) => {
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
      {icon}
      <Typography
        sx={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: '1rem',
          mb: 1,
        }}
      >
        {descriptionLine1}
      </Typography>
      {descriptionLine2 && (
        <Typography
          sx={{
            fontSize: '1rem',
            mb: 2,
          }}
        >
          {descriptionLine2}
        </Typography>
      )}
      <ActionButton
        onAction={onAction}
        actionButtonLabel={actionButtonLabel}
        actionOptions={actionOptions}
        type={type}
      />
    </Box>
  );
};

const ActionButton = ({
  onAction,
  actionButtonLabel,
  actionOptions = [],
  type,
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
      >
        {actionButtonLabel}
      </Button>
      {actionOptions.length > 0 && (
        <Menu {...menuProps}>
          {actionOptions.map((option) => (
            <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};
