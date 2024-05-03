import React, { useMemo, useState } from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Tabs, Tab, Box } from '@mui/material';

import { CreditNotesTable } from '../CreditNotesTable';
import { InvoicesTable } from '../InvoicesTable';
import { QuotesTable } from '../QuotesTable';

interface IReceiveablesTableUncontrolledProps {
  tab?: undefined;
  onTabChange?: undefined;
}

interface IReceiveablesTableControlledProps {
  /** Active selected tab */
  tab: ReceivablesTableTabEnum;

  /** Event handler for tab change */
  onTabChange: (tab: ReceivablesTableTabEnum) => void;
}

type ReceivablesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
} & (IReceiveablesTableUncontrolledProps | IReceiveablesTableControlledProps);

export enum ReceivablesTableTabEnum {
  Quotes,
  Invoices,
  CreditNotes,
}

export const ReceivablesTable = (props: ReceivablesTableProps) => (
  <MoniteScopedProviders>
    <ReceivablesTableBase {...props} />
  </MoniteScopedProviders>
);

const ReceivablesTableBase = ({
  onRowClick,
  tab: externalActiveTab,
  onTabChange: setExternalActiveTab,
}: ReceivablesTableProps) => {
  const { i18n } = useLingui();
  const [internalActiveTab, setInternalActiveTab] =
    useState<ReceivablesTableTabEnum>(ReceivablesTableTabEnum.Invoices);

  const activeTab = externalActiveTab ?? internalActiveTab;
  const setActiveTab = setExternalActiveTab ?? setInternalActiveTab;

  const activeUITab = useMemo(() => {
    switch (activeTab) {
      case ReceivablesTableTabEnum.Quotes:
        return <QuotesTable onRowClick={onRowClick} />;
      case ReceivablesTableTabEnum.Invoices:
        return <InvoicesTable onRowClick={onRowClick} />;
      case ReceivablesTableTabEnum.CreditNotes:
        return <CreditNotesTable onRowClick={onRowClick} />;
    }
  }, [activeTab, onRowClick]);

  return (
    <>
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
        <Tabs
          value={activeTab}
          variant="standard"
          aria-label={t(i18n)`Receivables tabs`}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab
            id={`receivable-tab-${ReceivablesTableTabEnum.Invoices}`}
            aria-controls={`receivable-tabpanel-${ReceivablesTableTabEnum.Invoices}`}
            label={t(i18n)`Invoices`}
            value={ReceivablesTableTabEnum.Invoices}
          />
          <Tab
            id={`receivable-tab-${ReceivablesTableTabEnum.Quotes}`}
            aria-controls={`receivable-tabpanel-${ReceivablesTableTabEnum.Quotes}`}
            label={t(i18n)`Quotes`}
            value={ReceivablesTableTabEnum.Quotes}
          />
          <Tab
            id={`receivable-tab-${ReceivablesTableTabEnum.CreditNotes}`}
            aria-controls={`receivable-tabpanel-${ReceivablesTableTabEnum.CreditNotes}`}
            label={t(i18n)`Credit notes`}
            value={ReceivablesTableTabEnum.CreditNotes}
          />
        </Tabs>
      </Box>
      {activeUITab}
    </>
  );
};
