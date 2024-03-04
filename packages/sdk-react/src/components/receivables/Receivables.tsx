import React, { useCallback, useEffect, useState } from 'react';

import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { InvoiceDetails } from '@/components/receivables/InvoiceDetails';
import { ReceivablesTable } from '@/components/receivables/ReceivablesTable';
import { ReceivablesTableTabEnum } from '@/components/receivables/ReceivablesTable/ReceivablesTable';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ActionEnum, InvoiceResponsePayload } from '@monite/sdk-api';
import { Box, Button } from '@mui/material';

export const Receivables = () => {
  const { i18n } = useLingui();

  const [invoiceId, setInvoiceId] = useState<string>('');
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ReceivablesTableTabEnum>(
    ReceivablesTableTabEnum.Invoices
  );

  useEffect(() => {
    if (!invoiceId) {
      setOpenDetails(false);

      return;
    }

    if (invoiceId) {
      setOpenDetails(true);
    }
  }, [invoiceId]);

  const onRowClick = (id: string) => {
    setInvoiceId(id);
  };

  const closeModal = () => {
    setOpenDetails(false);
  };

  const closedModal = useCallback(() => {
    setInvoiceId('');
  }, []);

  const { root } = useRootElements();
  const { data: isCreateAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: ActionEnum.CREATE,
    entityUserId: useEntityUserByAuthToken().data?.id,
  });

  return (
    <MoniteStyleProvider>
      <PageHeader
        title={t(i18n)`Sales`}
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
      <ReceivablesTable
        tab={activeTab}
        onTabChange={setActiveTab}
        onRowClick={onRowClick}
      />
      <Dialog
        open={openDetails}
        fullScreen
        container={root}
        onClose={closeModal}
        onClosed={closedModal}
      >
        <InvoiceDetails id={invoiceId} />
      </Dialog>
      <Dialog
        open={isCreateInvoiceDialogOpen}
        container={root}
        fullScreen
        onClose={() => {
          setIsCreateInvoiceDialogOpen(false);
        }}
      >
        <InvoiceDetails
          type={InvoiceResponsePayload.type.INVOICE}
          onCreate={() => {
            setIsCreateInvoiceDialogOpen(false);
            setActiveTab(ReceivablesTableTabEnum.Invoices);
          }}
        />
      </Dialog>
    </MoniteStyleProvider>
  );
};
