import { useId, useState } from 'react';

import { CreditNotesTable } from '@/components';
import { InvoicesTable } from '@/components';
import { QuotesTable } from '@/components';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Tab, Tabs } from '@mui/material';

interface ReceivablesTableUncontrolledProps {
  tab?: undefined;
  onTabChange?: undefined;
}

interface ReceivablesTableControlledProps {
  /** Active selected tab */
  tab: ReceivablesTableTabEnum;

  /** Event handler for tab change */
  onTabChange: (tab: ReceivablesTableTabEnum) => void;
}

export type ReceivablesTableProps = {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
} & (ReceivablesTableUncontrolledProps | ReceivablesTableControlledProps);

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
  tab,
  onTabChange,
  onRowClick,
}: ReceivablesTableProps) => {
  const { i18n } = useLingui();
  const [activeTab, setActiveTab] = useSetActiveTab({ tab, onTabChange });
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabIdPrefix = `ReceivablesTable-Tab-${useId()}-`;
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabPanelIdPrefix = `ReceivablesTable-TabPanel-${useId()}-`;
  const className = 'Monite-ReceivablesTable';

  return (
    <>
      <Box
        sx={{ pl: 2, pr: 2 }}
        className={classNames(ScopedCssBaselineContainerClassName, className)}
      >
        <Tabs
          value={activeTab}
          variant="standard"
          aria-label={t(i18n)`Receivables tabs`}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab
            id={`${tabIdPrefix}-${ReceivablesTableTabEnum.Invoices}`}
            aria-controls={`${tabPanelIdPrefix}-${ReceivablesTableTabEnum.Invoices}`}
            label={t(i18n)`Invoices`}
            value={ReceivablesTableTabEnum.Invoices}
          />

          <Tab
            id={`${tabIdPrefix}-${ReceivablesTableTabEnum.Quotes}`}
            aria-controls={`${tabPanelIdPrefix}-${ReceivablesTableTabEnum.Quotes}`}
            label={t(i18n)`Quotes`}
            value={ReceivablesTableTabEnum.Quotes}
          />

          <Tab
            id={`${tabIdPrefix}-${ReceivablesTableTabEnum.CreditNotes}`}
            aria-controls={`${tabPanelIdPrefix}-${ReceivablesTableTabEnum.CreditNotes}`}
            label={t(i18n)`Credit notes`}
            value={ReceivablesTableTabEnum.CreditNotes}
          />
        </Tabs>
      </Box>

      {activeTab === ReceivablesTableTabEnum.Quotes && (
        <Box
          role="tabpanel"
          id={`${tabPanelIdPrefix}-${ReceivablesTableTabEnum.Quotes}`}
          aria-labelledby={`${tabIdPrefix}-${ReceivablesTableTabEnum.Quotes}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <QuotesTable onRowClick={onRowClick} />
        </Box>
      )}

      {activeTab === ReceivablesTableTabEnum.Invoices && (
        <Box
          role="tabpanel"
          id={`${tabPanelIdPrefix}-${ReceivablesTableTabEnum.Invoices}`}
          aria-labelledby={`${tabIdPrefix}-${ReceivablesTableTabEnum.Invoices}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <InvoicesTable onRowClick={onRowClick} />
        </Box>
      )}

      {activeTab === ReceivablesTableTabEnum.CreditNotes && (
        <Box
          role="tabpanel"
          id={`${tabPanelIdPrefix}-${ReceivablesTableTabEnum.CreditNotes}`}
          aria-labelledby={`${tabIdPrefix}-${ReceivablesTableTabEnum.CreditNotes}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <CreditNotesTable onRowClick={onRowClick} />
        </Box>
      )}
    </>
  );
};

/**
 * Manages the active tab state.
 * If the `tab` prop is provided, the component is controlled.
 */
const useSetActiveTab = ({
  tab,
  onTabChange,
}: Pick<ReceivablesTableProps, 'tab' | 'onTabChange'>) => {
  const [tabControlled, onTabChangeControlled] =
    useState<ReceivablesTableTabEnum>(ReceivablesTableTabEnum.Invoices);

  return [tab ?? tabControlled, onTabChange ?? onTabChangeControlled] as const;
};
