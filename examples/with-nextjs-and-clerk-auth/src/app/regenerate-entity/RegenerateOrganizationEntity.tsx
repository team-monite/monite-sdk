'use client';

import { useState } from 'react';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import { useOrganization } from '@clerk/nextjs';
import { Check, Group, Link, Star, Warning } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Snackbar,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

export const RegenerateOrganizationEntity = ({
  entity_user_id,
  entity_id,
}: Record<'entity_user_id' | 'entity_id', string | null | undefined>) => {
  const { refresh } = useRouter();
  const { organization, isLoaded } = useOrganization();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
  });
  const {
    isPending: isRegenerationEntityLoading,
    mutateAsync: regenerateEntityAsync,
  } = useRegenerateEntityMutation();

  const {
    mutateAsync: generateDemoDataAsync,
    isPending: isGenerateDemoDataLoading,
    isSuccess: isGenerateDemoDataSuccess,
  } = useRunDemoDataGenerationMutation();

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ p: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Regenerate Organization Entity
          </Typography>

          <List
            sx={{
              '& > li': {
                paddingLeft: 0,
              },
            }}
          >
            <ListItem>
              <ListItemText
                primary="Organization Name"
                secondary={
                  isLoaded ? (
                    organization?.name
                  ) : (
                    <Skeleton variant="text" width={250} />
                  )
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Entity ID"
                secondary={entity_id}
                secondaryTypographyProps={{ fontFamily: 'monospace' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Entity User ID"
                secondary={entity_user_id}
                secondaryTypographyProps={{ fontFamily: 'monospace' }}
              />
            </ListItem>
          </List>
          <Box sx={{ mt: 2 }} alignContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                event.preventDefault();
                setIsConfirmDialogOpen(true);
              }}
            >
              Regenerate
            </Button>
            {(isGenerateDemoDataLoading || isGenerateDemoDataSuccess) && (
              <Button
                color="secondary"
                variant="text"
                disabled={isRegenerationEntityLoading}
                startIcon={
                  isGenerateDemoDataLoading ? (
                    <CircularProgress size={20} color="secondary" />
                  ) : isGenerateDemoDataSuccess ? (
                    <Check />
                  ) : (
                    <Warning color="warning" />
                  )
                }
                endIcon={<Link />}
                sx={{ ml: 2 }}
                // make demo data generation progress to be displayed
                href="/counterparts/?display_demo_data_generation_progress"
                component={NextLink}
              >
                {isGenerateDemoDataSuccess
                  ? "Go to Organization's Dashboard"
                  : 'Generating Demo Data'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isConfirmDialogOpen}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClose={() => setIsConfirmDialogOpen(false)}
      >
        <DialogTitle id="dialog-title">Confirm Regeneration</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Are you sure you want to regenerate the Entity for this
            Organization?
          </DialogContentText>
          <DialogContentText>This action cannot be undone.</DialogContentText>

          <List>
            <ListItem>
              <ListItemIcon>
                <Star />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    The new <strong>Entity</strong> will be set up for the{' '}
                    <strong>Organization</strong>
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <strong>Organization Members</strong> will be assigned to
                    the new <strong>Entity Users</strong>
                  </>
                }
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            autoFocus
            onClick={(event) => {
              event.preventDefault();
              setIsConfirmDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            variant="outlined"
            disabled={isRegenerationEntityLoading}
            startIcon={
              isRegenerationEntityLoading ? (
                <CircularProgress size={20} color="warning" />
              ) : (
                <Warning />
              )
            }
            onClick={(event) => {
              event.preventDefault();
              if (isRegenerationEntityLoading) return;
              regenerateEntityAsync()
                .then(() => {
                  setIsConfirmDialogOpen(false);
                  setSnackbar({
                    open: true,
                    message: 'Entity has been regenerated',
                    severity: 'success',
                  });
                  refresh();
                  generateDemoDataAsync().catch(console.error);
                })
                .catch(
                  (error) =>
                    void setSnackbar({
                      open: true,
                      message:
                        error instanceof Error
                          ? error.message
                          : JSON.stringify(error),
                      severity: 'error',
                    })
                );
            }}
          >
            Regenerate
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.open ? snackbar.severity : undefined}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.open && snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

/**
 * Runs the demo data generation process
 */
const useRunDemoDataGenerationMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/demo-data-generation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData && 'error' in errorData
            ? errorData.error
            : 'Failed to generate demo data'
        );
      }
    },
  });
};

/**
 * Regenerates the Entity with the Entity Users for the Organization
 */
const useRegenerateEntityMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/regenerate-entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData && 'error' in errorData
            ? errorData.error
            : 'Failed to regenerate entity'
        );
      }
    },
  });
};

interface SnackbarState {
  /**
   * Represents is the snackbar open or not
   *  (it will not close automatically until
   *  `open: false` will be provided)
   */
  open: boolean;

  /**
   * The message for the Snackbar
   * If no message is provided the default value
   * will be `Something went wrong`
   */
  message?: string;

  /**
   * Type of Snackbar.
   * `success` - will be printed with `theme.colors.success` background color
   * `error` - will be printed with `theme.colors.danger` background color
   * By default is: `success`
   */
  severity?: 'success' | 'error';
}
