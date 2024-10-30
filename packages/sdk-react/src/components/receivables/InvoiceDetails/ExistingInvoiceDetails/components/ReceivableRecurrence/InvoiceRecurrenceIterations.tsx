import { INVOICE_DOCUMENT_AUTO_ID } from '@/components/receivables/consts';
import { InvoiceRecurrenceIterationStatusChip } from '@/components/receivables/InvoiceRecurrenceIterationStatusChip';
import { MoniteInvoiceRecurrenceIterationStatusChipProps } from '@/components/receivables/InvoiceRecurrenceIterationStatusChip/InvoiceRecurrenceIterationStatusChip';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useReceivableById } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useThemeProps } from '@mui/material/styles';

export const InvoiceRecurrenceIterations = ({
  recurrence: { id, iterations, invoice_id },
}: {
  recurrence: Pick<
    components['schemas']['Recurrence'],
    'id' | 'iterations' | 'invoice_id'
  >;
}) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const receivableIds = iterations
    .map(({ issued_invoice_id }) => issued_invoice_id)
    .filter((invoice) => typeof invoice === 'string');

  const { data: receivables, isLoading: isReceivablesLoading } =
    api.receivables.getReceivables.useQuery(
      { query: { id__in: receivableIds } },
      { enabled: Boolean(id && receivableIds.length) }
    );

  const { size: unifiedChipSize = 'small' } = useThemeProps({
    props: {} as Pick<MoniteInvoiceRecurrenceIterationStatusChipProps, 'size'>,
    name: 'MoniteInvoiceRecurrenceIterationStatusChip',
  });

  const { data: baseReceivable } = useReceivableById(invoice_id);

  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t(i18n)`Invoice number`}</TableCell>
          <TableCell>{t(i18n)`Status`}</TableCell>
          <TableCell>{t(i18n)`Date`}</TableCell>
          <TableCell>{t(i18n)`Total Amount`}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {iterations.map(
          ({ status, iteration, issue_at, issued_invoice_id }) => {
            const receivable = receivables?.data.find(
              (receivable) => receivable.id === issued_invoice_id
            );

            return (
              <TableRow key={iteration}>
                <TableCell width="100%">
                  <Typography
                    noWrap
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    maxWidth={220}
                    color={
                      status === 'pending' ? 'text.secondary' : 'text.primary'
                    }
                  >
                    {issued_invoice_id ? (
                      isReceivablesLoading ? (
                        <Skeleton width="100px" />
                      ) : (
                        receivable?.document_id || INVOICE_DOCUMENT_AUTO_ID
                      )
                    ) : (
                      INVOICE_DOCUMENT_AUTO_ID
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  {status === 'completed' ? (
                    isReceivablesLoading ? (
                      <Skeleton width="100px" />
                    ) : (
                      receivable?.status && (
                        <InvoiceStatusChip
                          status={receivable?.status}
                          size={unifiedChipSize}
                        />
                      )
                    )
                  ) : (
                    <InvoiceRecurrenceIterationStatusChip
                      status={status}
                      size={unifiedChipSize}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography
                    color={
                      status === 'pending' ? 'text.secondary' : 'text.primary'
                    }
                  >
                    {i18n.date(new Date(issue_at))}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    color={
                      status === 'pending' ? 'text.secondary' : 'text.primary'
                    }
                  >
                    {status === 'completed' ? (
                      isReceivablesLoading ? (
                        <Skeleton width="100px" />
                      ) : (
                        receivable &&
                        receivable.type === 'invoice' &&
                        formatCurrencyToDisplay(
                          receivable.total_amount_with_credit_notes,
                          receivable.currency
                        )
                      )
                    ) : (
                      baseReceivable &&
                      baseReceivable.type === 'invoice' &&
                      formatCurrencyToDisplay(
                        baseReceivable.total_amount_with_credit_notes,
                        baseReceivable.currency
                      )
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
};
