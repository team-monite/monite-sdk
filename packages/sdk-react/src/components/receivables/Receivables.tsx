import { useState, useCallback, useMemo } from 'react';

import { components } from '@/api';
import { CustomerTypes } from '@/components/counterparts/types';
import { Dialog } from '@/components/Dialog';
import { FinanceMenuButtons } from '@/components/financing/components';
import { FINANCING_LABEL } from '@/components/financing/consts';
import { useFinancing } from '@/components/financing/hooks';
import {
  ReceivablesTable,
  ReceivablesTableTabEnum,
} from '@/components/receivables/components';
import { InvoiceDetails } from '@/components/receivables/InvoiceDetails';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import { PageHeader } from '@/ui/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, CircularProgress } from '@mui/material';

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
  const { isEnabled, isServicing } = useFinancing();
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ReceivablesTableTabEnum>(
    componentSettings.receivables.tab ?? ReceivablesTableTabEnum.Invoices
  );
  const activeTabItem = componentSettings?.receivables?.tabs?.[activeTab];

  const receivableCallbacks = useMemo(
    () => ({
      onUpdate: componentSettings?.receivables?.onUpdate,
      onDelete: componentSettings?.receivables?.onDelete,
      onCreate: componentSettings?.receivables?.onCreate,
      onInvoiceSent: componentSettings?.receivables?.onInvoiceSent,
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
    (invoiceId: string) => {
      receivableCallbacks.onInvoiceSent?.(invoiceId);
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
            {isEnabled &&
            isServicing &&
            !componentSettings?.financing?.enableFinanceWidgetButton &&
            activeTabItem?.label === FINANCING_LABEL ? (
              <FinanceMenuButtons />
            ) : (
              <Button
                id="actions"
                size="lg"
                disabled={!isCreateAllowed}
                onClick={() => {
                  setIsCreateInvoiceDialogOpen(true);
                }}
              >
                {t(i18n)`Create Invoice`}
              </Button>
            )}
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
