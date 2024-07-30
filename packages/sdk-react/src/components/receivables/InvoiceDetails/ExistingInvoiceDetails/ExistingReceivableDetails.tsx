import React from 'react';

import { useDialog } from '@/components/Dialog';
import { InvoiceCounterpartName } from '@/components/receivables/InvoiceCounterpartName';
import { ExistingInvoiceDetails } from '@/components/receivables/InvoiceDetails/ExistingInvoiceDetails/ExistingInvoiceDetails';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { useInvoiceDetails } from '@/core/queries/useReceivables';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {
  Avatar,
  Box,
  Button,
  Card,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import { addDays } from 'date-fns';

import { ExistingReceivableDetailsProps } from '../InvoiceDetails.types';
import { InvoiceError } from '../InvoiceError';
import { InvoiceItems } from '../InvoiceItems';
import { InvoicePaymentDetails } from '../InvoicePaymentDetails';
import { InvoiceTo } from '../InvoiceTo';
import { InvoiceTotal } from '../InvoiceTotal';

/**
 * General component for all Receivables (Invoices, Credit Notes, Quotes)
 *
 * !!! Note !!!
 * This component is outdated. `InvoiceDetails` has the actual design, but the current
 *  one is a legacy one.
 * If you need to update design for `Invoice`, you should update `InvoiceDetails` component
 *
 * @deprecated
 */
export const ExistingReceivableDetails = (
  props: ExistingReceivableDetailsProps
) => (
  <MoniteScopedProviders>
    <ExistingReceivableDetailsBase {...props} />
  </MoniteScopedProviders>
);

const ExistingReceivableDetailsBase = (
  props: ExistingReceivableDetailsProps
) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const {
    receivable: invoice,
    error,
    isLoading,
    isButtonsLoading,
    permissions,
    actions: queryActions,
  } = useInvoiceDetails(props);

  const dialogContext = useDialog();

  const { data: isDeleteAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: 'delete',
    entityUserId: invoice?.entity_user_id,
  });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: 'read',
      entityUserId: invoice?.entity_user_id,
    });
  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: 'update',
    entityUserId: invoice?.entity_user_id,
  });

  const fulfillmentDate =
    invoice?.type === 'invoice' ? invoice?.fulfillment_date : undefined;
  const issueDate =
    invoice?.type === 'invoice' ? invoice?.issue_date : undefined;
  const numberOfDueDays =
    invoice?.type === 'invoice'
      ? invoice?.payment_terms?.term_final.number_of_days
      : undefined;

  const dueDate =
    invoice &&
    issueDate &&
    numberOfDueDays &&
    addDays(new Date(issueDate), numberOfDueDays);

  const avatarSymbol =
    invoice?.counterpart_name?.[0] ||
    invoice?.counterpart_contact?.first_name?.[0] ||
    '/';

  const { data: counterpartAddress } =
    api.counterparts.getCounterpartsIdAddressesId.useQuery(
      {
        path: {
          counterpart_id: invoice?.counterpart_id ?? '',
          address_id: invoice?.counterpart_billing_address?.id ?? '',
        },
      },
      {
        enabled: !!(
          invoice?.counterpart_billing_address?.id && invoice?.counterpart_id
        ),
      }
    );

  if (!props.id) return null;

  if (isLoading || isReadAllowedLoading) {
    return <LoadingPage />;
  }

  if (!isReadAllowed) {
    return <AccessRestriction />;
  }

  if (!invoice) {
    return (
      <NotFound
        title={t(i18n)`Invoice not found`}
        description={t(
          i18n
        )`There is no receivable by provided id: ${props.id}`}
      />
    );
  }

  if (error) {
    return (
      <InvoiceError
        onClose={dialogContext?.onClose}
        errorMessage={getAPIErrorMessage(i18n, error)}
      />
    );
  }

  if (invoice.type === 'invoice') {
    return <ExistingInvoiceDetails {...props} />;
  }

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 44, height: 44 }}>{avatarSymbol}</Avatar>
            <Typography variant="h3">
              {t(i18n)`Invoice ${invoice.document_id || ''}`}
            </Typography>
            <InvoiceStatusChip status={invoice.status} />
          </Box>
          {dialogContext?.isDialogContent && (
            <IconButton
              aria-label={t(i18n)`Close invoice details`}
              onClick={dialogContext.onClose}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={2}>
          <Card variant="outlined">
            <Table>
              <TableBody>
                <TableRow key="fulfillment-date">
                  <TableCell>
                    <Typography>{t(i18n)`Fulfillment date`}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {fulfillmentDate
                        ? i18n.date(
                            fulfillmentDate,
                            DateTimeFormatOptions.EightDigitDate
                          )
                        : '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="due-date">
                  <TableCell>
                    <Typography>{t(i18n)`Due Date`}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {dueDate
                        ? i18n.date(
                            dueDate,
                            DateTimeFormatOptions.EightDigitDate
                          )
                        : '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </Box>

        {counterpartAddress && (
          <InvoiceTo
            counterpartAddress={counterpartAddress}
            counterpartName={
              <InvoiceCounterpartName counterpartId={invoice.counterpart_id} />
            }
          />
        )}

        {invoice.entity_bank_account && (
          <InvoicePaymentDetails {...invoice.entity_bank_account} />
        )}

        {invoice?.line_items?.length === 0 ? (
          <Box
            mt={2}
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 6,
            }}
          >
            <TextSnippetIcon fontSize="large" color="secondary" />
            <Typography variant="h3" padding={2}>
              {t(i18n)`There are no items here`}
            </Typography>
          </Box>
        ) : (
          <>
            <InvoiceItems {...invoice} />
            <InvoiceTotal {...invoice} />
          </>
        )}
      </DialogContent>
      <Divider />
      <DialogActions data-testid="InvoiceDetailsFooter">
        {permissions.includes('cancel') && (
          <Button
            aria-label={t(i18n)`Cancel invoice`}
            variant="outlined"
            color="error"
            disabled={isButtonsLoading || !isUpdateAllowed}
            onClick={queryActions.cancelInvoice}
          >
            {t(i18n)`Cancel`}
          </Button>
        )}
        {permissions.includes('delete') && (
          <Button
            aria-label={t(i18n)`Delete invoice`}
            variant="outlined"
            color="error"
            disabled={isButtonsLoading || !isDeleteAllowed}
            onClick={queryActions.deleteInvoice}
          >
            {t(i18n)`Delete`}
          </Button>
        )}
        {permissions.includes('issue') && (
          <Button
            aria-label={t(i18n)`Issue`}
            onClick={queryActions.issueInvoice}
            variant="outlined"
            disabled={isButtonsLoading || !isUpdateAllowed}
          >
            {t(i18n)`Issue`}
          </Button>
        )}
        {permissions.includes('mark_as_uncollectible') && (
          <Button
            aria-label={t(i18n)`Mark as uncollectible invoice`}
            onClick={queryActions.markAsUncollectibleInvoice}
            variant="outlined"
            disabled={isButtonsLoading || !isUpdateAllowed}
          >
            {t(i18n)`Mark as uncollectible`}
          </Button>
        )}
      </DialogActions>
    </>
  );
};
