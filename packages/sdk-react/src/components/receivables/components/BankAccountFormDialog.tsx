import { useId, useState } from 'react';

import { components } from '@/api';
import { Dialog } from '@/components/Dialog';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Alert,
  Typography,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

import {
  useCreateEntityBankAccount,
  useDeleteEntityBankAccount,
  useGetEntityBankAccountById,
  useUpdateEntityBankAccount,
} from '../hooks';
import { BankAccountDeleteModal } from './BankAccountDeleteModal';
import { BankAccountFormContent } from './BankAccountFormContent';

type BankAccountFormProps = {
  /**
   * Selected entity bank account id
   */
  entityBankAccountId: string;
  /**
   * Boolean flag to determine if dialog is open or not
   */
  isOpen: boolean;
  /**
   * List of entity bank accounts
   */
  bankAccounts: components['schemas']['EntityBankAccountResponse'][];
  /**
   * Callback function for cancelling
   */
  onCancel?: () => void;
  /**
   * Callback function for creating
   */
  onCreate?: (id: string) => void;
  /**
   * Callback function for updating
   */
  onUpdate?: () => void;
  /**
   * Callback function for deleting
   */
  onDelete?: () => void;
  /**
   * Callback function for closing
   */
  handleClose?: () => void;
  /**
   * Callback function for selecting another bank account after deleting selected bank account
   */
  handleSelectBankAfterDeletion?: (bankId: string) => void;
};

export const BankAccountFormDialog = (props: BankAccountFormProps) => (
  <MoniteScopedProviders>
    <BankAccountFormDialogBase {...props} />
  </MoniteScopedProviders>
);

const BankAccountFormDialogBase = ({
  entityBankAccountId,
  bankAccounts,
  isOpen,
  onCancel,
  onCreate,
  onUpdate,
  onDelete,
  handleClose,
  handleSelectBankAfterDeletion,
}: BankAccountFormProps) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shouldDisplayWarning, setShouldDisplayWarning] = useState(false);
  const formId = `Monite-EntityBankForm-${useId()}`;

  const { data: bankAccount, isLoading: isBankLoading } =
    useGetEntityBankAccountById(entityBankAccountId);

  const {
    mutate: createBankAccountMutation,
    isPending: isCreatingBankAccount,
  } = useCreateEntityBankAccount(onCreate);
  const {
    mutate: updateBankAccountMutation,
    isPending: isUpdatingBankAccount,
  } = useUpdateEntityBankAccount(onUpdate);
  const { mutate: deleteBankAccount, isPending: isDeletingBankAccount } =
    useDeleteEntityBankAccount(onDelete);

  const isMutating =
    isCreatingBankAccount || isUpdatingBankAccount || isDeletingBankAccount;

  const shouldEnableDelete = !!bankAccount;

  const createBankAccount = (
    payload: components['schemas']['CreateEntityBankAccountRequest']
  ) => {
    createBankAccountMutation({
      body: payload,
    });
  };

  const updateBankAccount = (
    payload: components['schemas']['UpdateEntityBankAccountRequest']
  ) => {
    updateBankAccountMutation({
      path: { bank_account_id: bankAccount?.id ?? '' },
      body: payload,
    });
  };

  if (isBankLoading) {
    return <LoadingPage />;
  }

  if (!componentSettings?.receivables?.enableEntityBankAccount) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} alignDialog="right">
        <Box sx={{ px: 4, py: 2 }}>
          <Typography variant="h3">
            {bankAccount
              ? t(i18n)`Edit bank account`
              : t(i18n)`Add new bank account`}
          </Typography>
        </Box>

        <Divider />

        <DialogContent>
          {bankAccount?.is_default_for_currency && shouldDisplayWarning && (
            <Alert
              icon={<WarningAmberRoundedIcon />}
              severity="error"
              onClose={() => setShouldDisplayWarning(false)}
              sx={{
                mb: 2,
              }}
            >
              {t(
                i18n
              )`You can’t delete a default account. To delete a default bank account, you must first assign a new default account for the same currency.`}
            </Alert>
          )}

          <BankAccountFormContent
            createBankAccount={createBankAccount}
            updateBankAccount={updateBankAccount}
            formId={formId}
            bankAccounts={bankAccounts}
            bankAccount={bankAccount}
          />
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: shouldEnableDelete ? 'space-between' : 'flex-end',
          }}
        >
          {shouldEnableDelete && (
            <Button
              type="button"
              variant="text"
              color="error"
              onClick={() => {
                if (bankAccount?.is_default_for_currency) {
                  setShouldDisplayWarning(true);
                } else {
                  setIsDeleteModalOpen(true);
                }
              }}
              disabled={isMutating}
            >
              {t(i18n)`Delete`}
            </Button>
          )}

          <Box display="flex" gap={2}>
            <Button
              type="button"
              variant="text"
              color="primary"
              onClick={onCancel}
              disabled={isMutating}
            >
              {t(i18n)`Cancel`}
            </Button>

            <Button
              type="submit"
              form={formId}
              variant="contained"
              color="primary"
              disabled={isMutating}
            >
              {bankAccount ? t(i18n)`Save` : t(i18n)`Add`}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {isDeleteModalOpen && shouldEnableDelete && (
        <BankAccountDeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          isDeleting={isMutating}
          handleDelete={() => {
            deleteBankAccount({
              path: { bank_account_id: bankAccount?.id },
            });

            const foundDefaultBank = bankAccounts?.find((bank) => {
              bank?.currency === bankAccount?.currency &&
                bank?.is_default_for_currency;
            });

            handleSelectBankAfterDeletion?.(
              foundDefaultBank ? foundDefaultBank?.id : ''
            );
          }}
        />
      )}
    </>
  );
};
