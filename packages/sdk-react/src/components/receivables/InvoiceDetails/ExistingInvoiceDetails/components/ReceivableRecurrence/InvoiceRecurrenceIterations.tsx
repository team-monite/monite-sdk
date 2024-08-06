import { components } from '@/api';
import { InvoiceRecurrenceIterationStatusChip } from '@/components/receivables/InvoiceRecurrenceIterationStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export const InvoiceRecurrenceIterations = ({
  recurrence: { id, iterations },
}: {
  recurrence: Pick<components['schemas']['Recurrence'], 'id' | 'iterations'>;
}) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const receivableIds = iterations
    .map(({ issued_invoice_id }) => issued_invoice_id)
    .filter((invoice) => typeof invoice === 'string');

  const { data: receivables } = api.receivables.getReceivables.useQuery(
    { query: { id__in: receivableIds } },
    { enabled: Boolean(id && receivableIds.length) }
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t(i18n)`Invoice number`}</TableCell>
          <TableCell>{t(i18n)`Date`}</TableCell>
          <TableCell>{t(i18n)`Status`}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {iterations.map(
          ({ status, iteration, issue_at, issued_invoice_id }) => {
            const documentId = receivables?.data.find(
              (receivable) => receivable.id === issued_invoice_id
              // eslint-disable-next-line lingui/no-unlocalized-strings
            )?.document_id;

            return (
              <TableRow key={iteration}>
                <TableCell>
                  {documentId ?? (
                    // eslint-disable-next-line lingui/no-unlocalized-strings
                    <Typography color="text.secondary">INV-auto</Typography>
                  )}
                </TableCell>
                <TableCell>{i18n.date(new Date(issue_at))}</TableCell>
                <TableCell>
                  <InvoiceRecurrenceIterationStatusChip status={status} />
                </TableCell>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
};
