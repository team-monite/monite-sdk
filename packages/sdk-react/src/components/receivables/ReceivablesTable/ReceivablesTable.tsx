import { useEffect, useId, useState } from 'react';

import { CreditNotesTable } from '@/components';
import { InvoicesTable } from '@/components';
import { QuotesTable } from '@/components';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/ReceivablesTable/types';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Tab, Tabs } from '@mui/material';
import { useThemeProps } from '@mui/material/styles';

interface ReceivablesTableControlledProps {
  /** Event handler for tab change */
  onTabChange: (tab: number) => void;

  /** Active-selected tab */
  tab: number;
}

interface ReceivablesTableUncontrolledProps {
  /** Active-selected tab */
  tab?: number;
  onTabChange?: never;
}

/**
 * Receivables Table props for MUI theming
 */
export interface MoniteReceivablesTableProps {
  /** Active-selected tab */
  tab?: number;

  /**
   * The tabs to display in the ReceivablesTable.
   * By default, the component will display tabs for Invoices, Quotes, and Credit Notes.
   */
  tabs?: Array<MoniteReceivablesTab>;
}

export enum ReceivablesTableTabEnum {
  Quotes,
  Invoices,
  CreditNotes,
}

interface ReceivablesTableBaseProps {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;

  /**
   * The event handler for the creation new invoice for no data state
   *
    @param {boolean} isOpen - A boolean value indicating whether the dialog should be open (true) or closed (false).
   */
  setIsCreateInvoiceDialogOpen?: (isOpen: boolean) => void;
}

export type ReceivablesTableProps =
  | (ReceivablesTableControlledProps & ReceivablesTableBaseProps)
  | (ReceivablesTableUncontrolledProps & ReceivablesTableBaseProps);

/**
 * ReceivablesTable component
 * Displays Invoices, Quotes, Credit Notes
 *
 * @example MUI theming
 * ```ts
 * // You can configure the component through MUI theming like this:
 * const theme = createTheme(myTheme, {
 *   components: {
 *     MoniteReceivablesTable: {
 *       defaultProps: {
 *         tab: 0,                      // The default tab index to display
 *         tabs: [
 *           {
 *             label: 'Draft Invoices', // The label of the Tab
 *             query: {                 // The query parameters for the Tab
 *               type: 'invoice',       // The type of the Receivables, *required*
 *               sort: 'created_at',
 *               order: 'desc',
 *               status__in: ['draft'],
 *             },
 *             filters: [               // The UI filters for the Tab
 *               'document_id__contains',
 *               'counterpart_id',
 *               'due_date__lte',
 *             ],
 *           },
 *           {
 *             label: 'Recurring invoices',
 *             query: {
 *               type: 'invoice',
 *               status__in: ['recurring'],
 *             },
 *             filters: ['document_id__contains', 'counterpart_id'],
 *           },
 *           {
 *             label: 'Other Invoices',
 *             query: {
 *               type: 'invoice',
 *               sort: 'created_at',
 *               order: 'desc',
 *               status__in: [             // The "status" filter for the Tab will
 *                 'issued',               // only contain the values specified in "status__in"
 *                 'overdue',
 *                 'partially_paid',
 *                 'paid',
 *                 'uncollectible',
 *                 'canceled',
 *               ],
 *               // If no "filters" are specified, default UI filters will be displayed
 *             },
 *           },
 *           {
 *             label: 'Credit notes',
 *             query: {
 *               type: 'credit_note',
 *             },
 *           },
 *         ],
 *       },
 *     },
 *   },
 * });
 * ```
 */
export const ReceivablesTable = (props: ReceivablesTableProps) => (
  <MoniteScopedProviders>
    <ReceivablesTableBase {...props} />
  </MoniteScopedProviders>
);

type MoniteReceivablesTab = {
  label: string;
  query?: ReceivablesTabFilter;
  filters?: Array<keyof ReceivableFilterType>;
};

const ReceivablesTableBase = ({
  onRowClick,
  onTabChange,
  setIsCreateInvoiceDialogOpen,
  ...inProps
}: ReceivablesTableProps) => {
  const { tab, tabs } = useReceivablesTableProps(inProps);

  const { i18n } = useLingui();
  const [activeTabIndex, setActiveTabIndex] = useControlledTab({
    tab,
    onTabChange,
  });
  const tabsIdBase = `Monite-ReceivablesTable-Tabs-${useId()}-`;
  const className = 'Monite-ReceivablesTable';

  const activeTabItem = tabs?.[activeTabIndex];

  return (
    <>
      <Box
        className={classNames(
          ScopedCssBaselineContainerClassName,
          className + '-Tabs'
        )}
      >
        <Tabs
          value={activeTabIndex}
          variant="standard"
          aria-label={t(i18n)`Receivables tabs`}
          onChange={(_, value) => setActiveTabIndex(Number(value))}
        >
          {tabs?.map(({ label }, index) => (
            <Tab
              key={index}
              id={`${tabsIdBase}-${index}-tab`}
              aria-controls={`${tabsIdBase}-${index}-tabpanel`}
              label={label}
              value={index}
            />
          ))}
        </Tabs>
      </Box>

      {activeTabItem?.query?.type === 'quote' && (
        <Box
          role="tabpanel"
          id={`${tabsIdBase}-${activeTabIndex}-tabpanel`}
          aria-labelledby={`${tabsIdBase}-${activeTabIndex}-tab`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <QuotesTable
            key={activeTabIndex}
            onRowClick={onRowClick}
            setIsCreateInvoiceDialogOpen={setIsCreateInvoiceDialogOpen}
            query={activeTabItem?.query}
          />
        </Box>
      )}

      {activeTabItem?.query?.type === 'invoice' && (
        <Box
          role="tabpanel"
          id={`${tabsIdBase}-${activeTabIndex}-tabpanel`}
          aria-labelledby={`${tabsIdBase}-${activeTabIndex}-tab`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <InvoicesTable
            key={activeTabIndex}
            onRowClick={onRowClick}
            setIsCreateInvoiceDialogOpen={setIsCreateInvoiceDialogOpen}
            query={activeTabItem?.query}
            filters={activeTabItem?.filters}
          />
        </Box>
      )}

      {activeTabItem?.query?.type === 'credit_note' && (
        <Box
          role="tabpanel"
          id={`${tabsIdBase}-${activeTabIndex}-tabpanel`}
          aria-labelledby={`${tabsIdBase}-${activeTabIndex}-tab`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <CreditNotesTable
            key={activeTabIndex}
            onRowClick={onRowClick}
            setIsCreateInvoiceDialogOpen={setIsCreateInvoiceDialogOpen}
            query={activeTabItem?.query}
          />
        </Box>
      )}
    </>
  );
};

/**
 * Manages the active tab state for controlled mode and uncontrolled modes.
 *
 * - If the `tab === undefined || onTabChange === undefined`, the hook behaves uncontrolled hook;
 *   that means it handles the internal state.
 *   - Whenever `tab` is updated, the hook updates the internal state.
 * - If the `tab !== undefined` and `onTabChange !== undefined`, the hook behaves controlled hook;
 *   that means it just returns the original state.
 */
export const useControlledTab = ({
  tab: controlledTab,
  onTabChange: setControlledTab,
}: Pick<ReceivablesTableProps, 'tab' | 'onTabChange'>) => {
  const [uncontrolledTab, setUncontrolledTab] = useState(controlledTab ?? 0);

  useEffect(() => {
    if (controlledTab === undefined) return;
    if (setControlledTab === undefined) setUncontrolledTab(controlledTab);
  }, [setControlledTab, controlledTab]);

  if (controlledTab !== undefined && setControlledTab !== undefined) {
    return [controlledTab, setControlledTab] as const;
  }

  return [uncontrolledTab, setUncontrolledTab] as const;
};

export const useReceivablesTableProps = (
  inProps?: Partial<MoniteReceivablesTableProps>
) => {
  return useThemeProps({
    props: inProps,
    name: 'MoniteReceivablesTable',
  });
};
