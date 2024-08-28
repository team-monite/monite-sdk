import { ReactNode, useState } from 'react';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (actionOptions.length > 0) {
      setAnchorEl(event.currentTarget);
    } else if (onAction) {
      onAction();
    }
  };

  const handleClose = (option?: string) => {
    setAnchorEl(null);
    if (option && onAction) {
      onAction(option);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        sx={{ mt: 2 }}
        startIcon={type === 'error' ? <RefreshIcon /> : undefined}
      >
        {actionButtonLabel}
      </Button>
      {actionOptions.length > 0 && (
        <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
          {actionOptions.map((option) => (
            <MenuItem key={option} onClick={() => handleClose(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};
