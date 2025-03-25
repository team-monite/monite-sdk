import { useState, useCallback, useMemo } from 'react';

import { components } from '@/api';
import { CustomerTypes } from '@/components/counterparts/types';
import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { InvoiceDetails } from '@/components/receivables/InvoiceDetails';
import { ReceivablesTable } from '@/components/receivables/ReceivablesTable';
import { ReceivablesTableTabEnum } from '@/components/receivables/ReceivablesTable/ReceivablesTable';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, CircularProgress } from '@mui/material';

type ReceivablesProps = {
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
};

export const Receivables = (props: ReceivablesProps) => (
  <MoniteScopedProviders>
    <ReceivablesBase {...props} />
  </MoniteScopedProviders>
);

const ReceivablesBase = ({ customerTypes }: ReceivablesProps) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  const [invoiceId, setInvoiceId] = useState<string>('');
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ReceivablesTableTabEnum>(
    componentSettings.receivables.tab ?? ReceivablesTableTabEnum.Invoices
  );

  const receivableCallbacks = useMemo(
    () => ({
      onUpdate: componentSettings?.receivables?.onUpdate,
      onDelete: componentSettings?.receivables?.onDelete,
      onCreate: componentSettings?.receivables?.onCreate,
      onFirstInvoiceSent: componentSettings?.receivables?.onFirstInvoiceSent,
    }),
    [componentSettings?.receivables]
  );

  const openInvoiceModal = useCallback((id: string) => {
    setInvoiceId(id);
  }, []);

  const onRowClick = useCallback(
    (id: string) => {
      openInvoiceModal(id);
    },
    [openInvoiceModal]
  );

  const closeModal = useCallback(() => {
    setInvoiceId('');
  }, []);

  const handleUpdate = useCallback(
    (
      receivableId: string,
      invoice?: components['schemas']['InvoiceResponsePayload']
    ) => {
      receivableCallbacks.onUpdate?.(receivableId, invoice);
    },
    [receivableCallbacks]
  );

  const handleDelete = useCallback(
    (receivableId: string) => {
      receivableCallbacks.onDelete?.(receivableId);
    },
    [receivableCallbacks]
  );

  const handleCreate = useCallback(
    (receivableId: string) => {
      setIsCreateInvoiceDialogOpen(false);
      setActiveTab(ReceivablesTableTabEnum.Invoices);
      openInvoiceModal(receivableId);
      receivableCallbacks.onCreate?.(receivableId);
    },
    [receivableCallbacks, openInvoiceModal, setActiveTab]
  );

  const handleSendEmail = useCallback(
    (invoiceId: string, isFirstInvoice: boolean) => {
      if (isFirstInvoice) {
        receivableCallbacks.onFirstInvoiceSent?.(invoiceId);
      }
    },
    [receivableCallbacks]
  );

  const { root } = useRootElements();

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: 'create',
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: 'read',
      entityUserId: user?.id,
    });

  const className = 'Monite-Receivables';

  return (
    <>
      <PageHeader
        className={className + '-Header'}
        title={
          <>
            {t(i18n)`Sales`}
            {(isReadAllowedLoading || isCreateAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <Box>
            <Button
              id="actions"
              variant="contained"
              disabled={!isCreateAllowed}
              onClick={() => {
                setIsCreateInvoiceDialogOpen(true);
              }}
            >{t(i18n)`Create Invoice`}</Button>
          </Box>
        }
      />
      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && (
        <ReceivablesTable
          tab={activeTab}
          onTabChange={setActiveTab}
          onRowClick={onRowClick}
          setIsCreateInvoiceDialogOpen={setIsCreateInvoiceDialogOpen}
        />
      )}
      <Dialog
        className={className + '-Dialog-ReceivableDetails'}
        open={!!invoiceId}
        fullScreen
        container={root}
        onClose={closeModal}
      >
        <InvoiceDetails
          id={invoiceId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          customerTypes={
            customerTypes || componentSettings?.counterparts?.customerTypes
          }
          onSendEmail={handleSendEmail}
        />
      </Dialog>
      <Dialog
        className={className + '-Dialog-CreateReceivable'}
        open={isCreateInvoiceDialogOpen}
        container={root}
        fullScreen
        onClose={() => {
          setIsCreateInvoiceDialogOpen(false);
        }}
      >
        <InvoiceDetails
          type="invoice"
          onCreate={handleCreate}
          customerTypes={
            customerTypes || componentSettings?.counterparts?.customerTypes
          }
        />
      </Dialog>
    </>
  );
};
