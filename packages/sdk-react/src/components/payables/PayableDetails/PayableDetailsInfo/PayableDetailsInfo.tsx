import React, { useMemo } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import {
  getIndividualName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useOptionalFields } from '@/core/hooks/useOptionalFields';
import { useApprovalPolicyById, useEntityUserById } from '@/core/queries';
import { useCounterpartContactList } from '@/core/queries/useCounterpart';
import { CenteredContentBox } from '@/ui/box';
import { classNames } from '@/utils/css-utils';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { OptionalFields } from '../../types';
import { isPayableInOCRProcessing } from '../../utils/isPayableInOcr';
import { usePayableDetailsInfo } from './usePayableDetailsInfo';

export type PayablesDetailsInfoProps = {
  payable: components['schemas']['PayableResponseSchema'];
  optionalFields?: OptionalFields;
};

const DetailsWrapper = styled(Box)(() => ({
  pb: 6,
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'auto',
  width: '100%',
  height: 0,
}));

const StyledLabelTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.secondary,
  minWidth: 120,
  width: '35%',
}));

export const PayableDetailsInfo = (props: PayablesDetailsInfoProps) => (
  <MoniteScopedProviders>
    <PayableDetailsInfoBase {...props} />
  </MoniteScopedProviders>
);

const PayableDetailsInfoBase = ({
  payable,
  optionalFields,
}: PayablesDetailsInfoProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay, formatFromMinorUnits } = useCurrencies();
  const { showInvoiceDate, showTags } = useOptionalFields<OptionalFields>(
    optionalFields,
    {
      showInvoiceDate: true,
      showTags: true,
    }
  );
  const { counterpartQuery, counterpartBankAccountQuery, lineItemsQuery } =
    usePayableDetailsInfo({
      currentCounterpartId: payable.counterpart_id,
      payableId: payable.id,
    });

  const { data: counterpart } = counterpartQuery;
  const { data: lineItemsData } = lineItemsQuery;

  const lineItems = lineItemsData?.data;

  const { data: contacts } = useCounterpartContactList(payable.counterpart_id);
  const { data: addedByUser } = useEntityUserById(
    payable.was_created_by_user_id
  );
  const { data: approvalPolicy, isLoading: isApprovalPolicyLoading } =
    useApprovalPolicyById(payable.approval_policy_id);

  const counterpartName =
    counterpart &&
    (isIndividualCounterpart(counterpart)
      ? getIndividualName(
          counterpart.individual.first_name,
          counterpart.individual.last_name
        )
      : isOrganizationCounterpart(counterpart)
      ? counterpart.organization.legal_name
      : '—');
  const defaultContact = useMemo(
    () => contacts?.data.find((contact) => contact.is_default),
    [contacts]
  );
  const counterpartBankAccount = useMemo(
    () =>
      counterpartBankAccountQuery.data?.data.find(
        (bankAccount) => bankAccount.id === payable.counterpart_bank_account_id
      ),
    [counterpartBankAccountQuery, payable]
  );

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const className = 'Monite-PayableDetailsInfo';

  if (isPayableInOCRProcessing(payable)) {
    return (
      <DetailsWrapper
        className={classNames(
          ScopedCssBaselineContainerClassName,
          className,
          className + '--ocr-processing'
        )}
      >
        <CenteredContentBox>
          <Box textAlign="center">
            <CachedOutlinedIcon color="primary" fontSize="large" />
            <Typography variant="h3" mb={2}>
              {t(i18n)`File is being processed...`}
            </Typography>
            <Typography variant="body1">
              {t(i18n)`Hold on, we’re processing the file you’ve uploaded.`}
            </Typography>
            <Typography variant="body1">
              {t(i18n)`Usually it takes no more than 1–2 mins.`}
            </Typography>
          </Box>
        </CenteredContentBox>
      </DetailsWrapper>
    );
  }

  return (
    <DetailsWrapper
      className={classNames(ScopedCssBaselineContainerClassName, className)}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} className={className + '-Details'}>
          <Typography variant="subtitle2" mb={2}>
            {t(i18n)`Details`}
          </Typography>
          <Paper variant="outlined">
            <Table>
              <TableBody>
                <TableRow className={className + '-Details-InvoiceNumber'}>
                  <StyledLabelTableCell>
                    {t(i18n)`Invoice number`}:
                  </StyledLabelTableCell>
                  <TableCell>{payable.document_id ?? '—'}</TableCell>
                </TableRow>
                <TableRow className={className + '-Details-Supplier'}>
                  <StyledLabelTableCell>
                    {t(i18n)`Supplier`}:
                  </StyledLabelTableCell>
                  <TableCell>{counterpartName}</TableCell>
                </TableRow>
                {defaultContact && (
                  <TableRow className={className + '-Details-ContactPerson'}>
                    <StyledLabelTableCell>
                      {t(i18n)`Contact person`}:
                    </StyledLabelTableCell>
                    <TableCell>
                      {`${defaultContact.first_name} ${defaultContact.last_name}`}
                    </TableCell>
                  </TableRow>
                )}
                {counterpartBankAccount && (
                  <TableRow className={className + '-Details-BankAccount'}>
                    <StyledLabelTableCell>
                      {t(i18n)`Bank account`}:
                    </StyledLabelTableCell>
                    <TableCell>{counterpartBankAccount.name}</TableCell>
                  </TableRow>
                )}
                {showInvoiceDate && (
                  <TableRow className={className + '-Details-IssueDate'}>
                    <StyledLabelTableCell>
                      {t(i18n)`Issue date`}:
                    </StyledLabelTableCell>
                    <TableCell>
                      {payable.issued_at
                        ? i18n.date(
                            payable.issued_at,
                            DateTimeFormatOptions.EightDigitDate
                          )
                        : '—'}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className={className + '-Details-DueDate'}>
                  <StyledLabelTableCell>
                    {t(i18n)`Due date`}:
                  </StyledLabelTableCell>
                  <TableCell>
                    {payable.due_date
                      ? i18n.date(
                          payable.due_date,
                          DateTimeFormatOptions.EightDigitDate
                        )
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow className={className + '-Details-InvoiceAmount'}>
                  <StyledLabelTableCell>
                    {t(i18n)`Amount`}:
                  </StyledLabelTableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        {payable.amount_to_pay && payable.currency
                          ? formatCurrencyToDisplay(
                              payable.amount_to_pay,
                              payable.currency
                            )
                          : '—'}
                      </Box>
                      {payable.currency_exchange?.default_currency_code &&
                        payable.currency !==
                          payable.currency_exchange.default_currency_code && (
                          <Box sx={{ color: 'text.secondary' }}>
                            &asymp;{' '}
                            {formatCurrencyToDisplay(
                              payable.currency_exchange.total,
                              payable.currency_exchange.default_currency_code
                            )}
                          </Box>
                        )}
                    </Box>
                  </TableCell>
                </TableRow>
                {showTags && payable.tags && payable.tags.length > 0 && (
                  <TableRow className={className + '-Details-Tags'}>
                    <StyledLabelTableCell>
                      {t(i18n)`Tags`}:
                    </StyledLabelTableCell>
                    <TableCell>
                      <Stack
                        spacing={1}
                        direction="row"
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {payable.tags.map((tag) => (
                          <Chip
                            key={tag.id}
                            label={tag.name}
                            color="primary"
                            sx={{ maxWidth: 200 }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className={className + '-Details-AppliedPolicy'}>
                  <StyledLabelTableCell>
                    {t(i18n)`Applied policy`}:
                  </StyledLabelTableCell>
                  <TableCell>
                    {!isApprovalPolicyLoading &&
                      (approvalPolicy?.name || t(i18n)`no policy`)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} className={className + '-Items'}>
          <Typography variant="subtitle2" mb={2}>
            {t(i18n)`Items`}
          </Typography>
          <Paper variant="outlined">
            <Table>
              <TableHead className={className + '-Items-Header'}>
                <TableRow>
                  <TableCell>{t(i18n)`Name`}</TableCell>
                  <TableCell>{t(i18n)`Quantity`}</TableCell>
                  <TableCell>{t(i18n)`Price`}</TableCell>
                  <TableCell align="right">{t(i18n)`Total, tax`}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineItems?.map((item) => (
                  <TableRow className={className + '-Items-Row'} key={item.id}>
                    <TableCell className={className + '-Items-Row-Name'}>
                      {item.name}
                    </TableCell>
                    <TableCell className={className + '-Items-Row-Quantity'}>
                      {item.quantity}
                    </TableCell>
                    <TableCell className={className + '-Items-Row-Subtotal'}>
                      {item.subtotal &&
                        item.quantity &&
                        formatFromMinorUnits(
                          item.subtotal / item.quantity ?? 0,
                          payable.currency ?? 'EUR'
                        )?.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={className + '-Items-Row-Total'}
                      align="right"
                    >
                      {item.total && payable.currency ? (
                        <>
                          <Box>
                            {formatCurrencyToDisplay(
                              item.total,
                              payable.currency
                            )}
                          </Box>
                          <Box sx={{ color: 'secondary.main' }}>
                            {t(i18n)`excl. VAT`}{' '}
                            {`${
                              item.subtotal
                                ? (
                                    ((item.total - item.subtotal) /
                                      item.subtotal) *
                                    100
                                  ).toFixed(2)
                                : 0
                            }%`}
                          </Box>
                        </>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} className={className + '-Totals'}>
          <Paper variant="outlined">
            <Table>
              <TableBody>
                <TableRow className={className + '-Totals-Subtotal'}>
                  <TableCell>{t(i18n)`Subtotal`}</TableCell>
                  <TableCell align="right">
                    {payable.subtotal && payable.currency
                      ? formatCurrencyToDisplay(
                          payable.subtotal,
                          payable.currency
                        )
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow className={className + '-Totals-Taxes'}>
                  <TableCell>{t(i18n)`Taxes`}</TableCell>
                  <TableCell align="right">
                    {payable.tax_amount && payable.currency
                      ? formatCurrencyToDisplay(
                          payable.tax_amount,
                          payable.currency
                        )
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow
                  className={className + '-Totals-Total'}
                  sx={{ '& td': { fontWeight: 500 } }}
                >
                  <TableCell>{t(i18n)`Total`}</TableCell>
                  <TableCell align="right">
                    {payable.amount_to_pay && payable.currency
                      ? formatCurrencyToDisplay(
                          payable.amount_to_pay,
                          payable.currency
                        )
                      : '—'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} className={className + '-History'}>
          <Typography variant="subtitle2" mb={2}>
            {t(i18n)`History`}
          </Typography>
          <Paper variant="outlined">
            <Table>
              <TableBody>
                {addedByUser && (
                  <TableRow className={className + '-History-AddedBy'}>
                    <StyledLabelTableCell>
                      {t(i18n)`Added by`}:
                    </StyledLabelTableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <UserAvatar
                          sx={{ width: 24, height: 24 }}
                          alt={getIndividualName(
                            addedByUser.first_name || '',
                            addedByUser.last_name || ''
                          )}
                          fileId={addedByUser.userpic_file_id}
                        />
                        <Box>
                          {getIndividualName(
                            addedByUser.first_name || '',
                            addedByUser.last_name || ''
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className={className + '-History-AddedOn'}>
                  <StyledLabelTableCell>
                    {t(i18n)`Added on`}:
                  </StyledLabelTableCell>
                  <TableCell>
                    {payable.created_at
                      ? i18n.date(payable.created_at, {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow className={className + '-History-UpdatedOn'}>
                  <StyledLabelTableCell>
                    {t(i18n)`Updated on`}:
                  </StyledLabelTableCell>
                  <TableCell>
                    {payable.updated_at
                      ? i18n.date(payable.updated_at, {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </DetailsWrapper>
  );
};
