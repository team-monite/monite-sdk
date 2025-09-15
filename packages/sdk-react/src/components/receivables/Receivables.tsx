import { CustomerTypes } from '@/components/counterparts/types';
import { FinanceMenuButtons } from '@/components/financing/components';
import { FINANCING_LABEL } from '@/components/financing/consts';
import { useFinancing } from '@/components/financing/hooks';
import { InvoiceDetails } from '@/components/receivables/InvoiceDetails';
import {
  ReceivablesTable,
  ReceivablesTableTabEnum,
} from '@/components/receivables/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useComponentSettings } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { Dialog } from '@/ui/Dialog';
import { PageHeader } from '@/ui/PageHeader';
import { AccessRestriction } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, CircularProgress } from '@mui/material';
import { useState, useCallback } from 'react';

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
  const { componentSettings, receivablesCallbacks } = useComponentSettings();
  const { isEnabled, isServicing } = useFinancing();
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ReceivablesTableTabEnum>(
    componentSettings.receivables.tab ?? ReceivablesTableTabEnum.Invoices
  );
  const activeTabItem = componentSettings?.receivables?.tabs?.[activeTab];

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

  const handleCreate = useCallback(
    (receivableId: string) => {
      setIsCreateInvoiceDialogOpen(false);
      setActiveTab(ReceivablesTableTabEnum.Invoices);
      openInvoiceModal(receivableId);
      receivablesCallbacks.onCreate?.(receivableId);
    },
    [receivablesCallbacks, openInvoiceModal, setActiveTab]
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
      <InvoiceDetails
        id={invoiceId}
        onClose={closeModal}
        onDuplicate={openInvoiceModal}
        openInvoiceDetails={openInvoiceModal}
      />
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
