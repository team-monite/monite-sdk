import { useState } from 'react';

import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { InvoiceDetails } from '@/components/receivables/InvoiceDetails';
import { ReceivablesTable } from '@/components/receivables/ReceivablesTable';
import { ReceivablesTableTabEnum } from '@/components/receivables/ReceivablesTable/ReceivablesTable';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, CircularProgress } from '@mui/material';

export const Receivables = () => (
  <MoniteScopedProviders>
    <ReceivablesBase />
  </MoniteScopedProviders>
);

const ReceivablesBase = () => {
  const { i18n } = useLingui();

  const [invoiceId, setInvoiceId] = useState<string>('');
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<ReceivablesTableTabEnum>(
    ReceivablesTableTabEnum.Invoices
  );

  const openInvoiceModal = (id: string) => {
    setInvoiceId(id);
  };

  const onRowClick = (id: string) => {
    openInvoiceModal(id);
  };

  const closeModal = () => {
    setInvoiceId('');
  };

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
        <InvoiceDetails id={invoiceId} />
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
          type={'invoice'}
          onCreate={(receivableId: string) => {
            setIsCreateInvoiceDialogOpen(false);
            setActiveTab(ReceivablesTableTabEnum.Invoices);
            openInvoiceModal(receivableId);
          }}
        />
      </Dialog>
    </>
  );
};
