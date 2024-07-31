import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { PayableDetails } from '@/components/payables/PayableDetails';
import { UsePayableDetailsProps } from '@/components/payables/PayableDetails/usePayableDetails';
import { PayablesTable } from '@/components/payables/PayablesTable';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useFileInput, useMenuButton } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

export type PayablesProps = Pick<
  UsePayableDetailsProps,
  | 'onSaved'
  | 'onCanceled'
  | 'onSubmitted'
  | 'onRejected'
  | 'onApproved'
  | 'onPay'
>;

export const Payables = (props: PayablesProps) => {
  return (
    <MoniteScopedProviders>
      <PayablesBase {...props} />
    </MoniteScopedProviders>
  );
};

const PayablesBase = ({
  onSaved,
  onCanceled,
  onSubmitted,
  onRejected,
  onApproved,
  onPay,
}: PayablesProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  const [invoiceIdDialog, setInvoiceIdDialog] = useState<{
    invoiceId: string | undefined;
    open: boolean;
  }>({ invoiceId: undefined, open: false });

  const { buttonProps, menuProps, open } = useMenuButton();

  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState(false);

  const { FileInput, openFileInput } = useFileInput();
  const payableUploadFromFileMutation =
    api.payables.postPayablesUploadFromFile.useMutation(
      {},
      {
        onSuccess: () =>
          api.payables.getPayables.invalidateQueries(queryClient),
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: 'create',
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'payable',
      action: 'read',
      entityUserId: user?.id,
    });

  const { root } = useRootElements();

  const className = 'Monite-Payables-Header';

  return (
    <>
      <PageHeader
        className={className + '-Header'}
        title={
          <>
            {t(i18n)`Payables`}
            {(isReadAllowedLoading || isCreateAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <Box>
            <Button
              {...buttonProps}
              disabled={!isCreateAllowed}
              endIcon={
                open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
              }
            >
              {t(i18n)`Create New`}
            </Button>
            <Menu {...menuProps}>
              <MenuItem
                onClick={() => {
                  setIsCreateInvoiceDialogOpen(true);
                }}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText>{t(i18n)`New Invoice`}</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  openFileInput();
                }}
              >
                <ListItemIcon>
                  <DriveFolderUploadIcon />
                </ListItemIcon>
                <ListItemText>{t(i18n)`Upload File`}</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && (
        <PayablesTable
          onRowClick={(id) => setInvoiceIdDialog({ open: true, invoiceId: id })}
          onPay={onPay}
        />
      )}

      <FileInput
        accept="application/pdf"
        aria-label={t(i18n)`Upload payable file`}
        onChange={(event) => {
          const file = event.target.files?.item(0);

          if (!file) {
            return;
          }

          toast.promise(
            payableUploadFromFileMutation.mutateAsync({
              file,
              file_type: 'payables',
            }),
            {
              loading: t(i18n)`Uploading payable file`,
              success: t(i18n)`Payable uploaded successfully`,
              error: (error) => getAPIErrorMessage(i18n, error),
            }
          );
        }}
      />
      <Dialog
        className={className + '-Dialog-PayableDetails'}
        open={invoiceIdDialog.open}
        container={root}
        onClose={() => {
          setInvoiceIdDialog((prev) => ({ ...prev, open: false }));
        }}
        onClosed={() => {
          setInvoiceIdDialog((prev) =>
            prev.open ? prev : { open: false, invoiceId: undefined }
          );
        }}
        fullScreen
      >
        <PayableDetails
          id={invoiceIdDialog.invoiceId}
          onClose={() => {
            setInvoiceIdDialog((prev) => ({ ...prev, open: false }));
          }}
          onSaved={onSaved}
          onCanceled={onCanceled}
          onSubmitted={onSubmitted}
          onRejected={onRejected}
          onApproved={onApproved}
          onPay={onPay}
        />
      </Dialog>

      <Dialog
        className={className + '-Dialog-CreatePayable'}
        open={isCreateInvoiceDialogOpen}
        container={root}
        onClose={() => setIsCreateInvoiceDialogOpen(false)}
        fullScreen
      >
        <PayableDetails
          onClose={() => setIsCreateInvoiceDialogOpen(false)}
          onSaved={onSaved}
        />
      </Dialog>
    </>
  );
};
