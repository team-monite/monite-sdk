import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { FinanceTab } from '@/components/financing/components/FinanceTab';
import { FINANCING_LABEL } from '@/components/financing/consts';
import { useGetFinanceOffers } from '@/components/financing/hooks';
import { CreditNotesTable } from '@/components/receivables/components/CreditNotesTable';
import { InvoicesTable } from '@/components/receivables/components/InvoicesTable';
import { QuotesTable } from '@/components/receivables/components/QuotesTable';
import {
  ReceivableFilterType,
  ReceivablesTabFilter,
} from '@/components/receivables/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useMyEntity } from '@/core/queries';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import { useEffect, useId, useState } from 'react';

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
 * Receivables Table props for customisation via Monite Provider
 */
export interface MoniteReceivablesTableProps {
  /** Active-selected tab */
  tab?: number;

  /**
   * The tabs to display in the ReceivablesTable.
   * By default, the component will display tabs for Invoices, Quotes, and Credit Notes.
   */
  tabs?: Array<MoniteReceivablesTab>;

  /**
   * The event handler for the creation of a new invoice
   *
    @param {string} receivableId - The ID of the receivable that was created.
   */
  onCreate?: (receivableId: string) => void;
}

export enum ReceivablesTableTabEnum {
  Invoices,
  Quotes,
  CreditNotes,
  Financing,
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
 * @example Monite Provider customisation
 * ```ts
 * // You can configure the component through Monite Provider property `componentSettings` like this:
 * const componentSettings = {
 *   receivables: {
 *    tab: 0,                      // The default tab index to display
 *    tabs: [
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
 *     ],
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
  query?: ReceivablesTabFilter | { type: 'financing' };
  filters?: Array<keyof ReceivableFilterType>;
};

const ReceivablesTableBase = ({
  onRowClick,
  onTabChange,
  setIsCreateInvoiceDialogOpen,
  ...inProps
}: ReceivablesTableProps) => {
  const { tab, tabs } = useReceivablesTableProps(inProps);
  const { data: finance } = useGetFinanceOffers();
  const { i18n } = useLingui();
  const theme = useTheme();
  const { isUSEntity } = useMyEntity();
  const [activeTabIndex, setActiveTabIndex] = useState(tab ?? 0);
  const tabsIdBase = `Monite-ReceivablesTable-Tabs-${useId()}-`;
  const className = 'Monite-ReceivablesTable';
  const activeTabItem = tabs?.[activeTabIndex];
  const isFinanceTabNew =
    window.localStorage.getItem('isFinanceTabNew') === 'true';
  const isServicing =
    finance?.business_status === 'ONBOARDED' &&
    finance?.offers?.[0]?.status === 'CURRENT';

  const handleTabChange = (tab: number) => {
    setActiveTabIndex(tab);
    onTabChange?.(tab);
  };

  useEffect(() => {
    if (activeTabItem?.label === FINANCING_LABEL && isFinanceTabNew) {
      window.localStorage.setItem('isFinanceTabNew', 'false');
    }
  }, [isFinanceTabNew, activeTabItem]);

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
          onChange={(_, value) => handleTabChange(Number(value))}
        >
          {tabs?.map(({ label }, index) => {
            if ((label == FINANCING_LABEL && !isUSEntity) || !isServicing) {
              return null;
            }

            return (
              <Tab
                key={`${label}-${tabsIdBase}-${index}`}
                id={`${tabsIdBase}-${index}-tab`}
                aria-controls={`${tabsIdBase}-${index}-tabpanel`}
                label={label}
                value={index}
                {...(isFinanceTabNew &&
                  label == FINANCING_LABEL && {
                    iconPosition: 'end',
                    icon: (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          px: 0.5,
                          borderRadius: '100%',
                          bgcolor: theme.palette.primary.main,
                          color: '#FFF',
                          alignContent: 'center',
                          fontSize: 10,
                        }}
                      >
                        1
                      </Box>
                    ),
                    sx: {
                      flexDirection: 'row',
                      gap: 1,
                      '.MuiTab-iconWrapper': {
                        mb: 0,
                      },
                    },
                  })}
              />
            );
          })}
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
      {activeTabItem?.label == FINANCING_LABEL && (
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
          <FinanceTab onRowClick={onRowClick} />
        </Box>
      )}
    </>
  );
};

export const useReceivablesTableProps = (
  inProps?: Partial<MoniteReceivablesTableProps>
) => {
  const { componentSettings } = useMoniteContext();

  return {
    tab: inProps?.tab ?? componentSettings?.receivables?.tab,
    tabs: inProps?.tabs ?? componentSettings?.receivables?.tabs,
  };
};
