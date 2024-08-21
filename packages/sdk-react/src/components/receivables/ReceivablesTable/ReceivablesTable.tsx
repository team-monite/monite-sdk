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

interface ReceivablesTableBaseProps {
  /**
   * The event handler for a row click.
   *
   * @param id - The identifier of the clicked row, a string.
   */
  onRowClick?: (id: string) => void;
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
            query={activeTabItem?.query}
          />
        </Box>
      )}
    </>
  );
};

/**
 * Manages the active tab state for controlled mode and uncontrolled modes.
 * If the `tab` or `onTabChange` prop is provided (not `undefined`), the hook is not controlled.
 */
const useControlledTab = ({
  tab,
  onTabChange,
}: Pick<ReceivablesTableProps, 'tab' | 'onTabChange'>) => {
  const [tabControlled, onTabChangeControlled] = useState(0);

  return [tab ?? tabControlled, onTabChange ?? onTabChangeControlled] as const;
};

export const useReceivablesTableProps = (
  inProps: Partial<ReceivablesTableProps>
) => {
  return useThemeProps({
    props: inProps,
    name: 'MoniteReceivablesTable',
  });
};
