import { useMemo } from 'react';

import { components } from '@/api';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import {
  getCounterpartName,
  getIndividualName,
} from '@/components/counterparts/helpers';
import {
  isFieldRequired,
  MonitePayableDetailsInfoProps,
  usePayableDetailsThemeProps,
} from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { UserAvatar } from '@/components/UserAvatar/UserAvatar';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { useOptionalFields } from '@/core/hooks/useOptionalFields';
import {
  useApprovalPolicyById,
  useCounterpartById,
  useEntityUserById,
} from '@/core/queries';
import { useCounterpartContactList } from '@/core/queries/useCounterpart';
import { CenteredContentBox } from '@/ui/box';
import { classNames } from '@/utils/css-utils';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CachedOutlined, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TableCellProps } from '@mui/material/TableCell/TableCell';

import { OptionalFields } from '../../types';
import { isPayableInOCRProcessing } from '../../utils/isPayableInOcr';
import { usePayableDetailsInfo } from './usePayableDetailsInfo';

export interface PayablesDetailsInfoProps
  extends MonitePayableDetailsInfoProps {
  payable: components['schemas']['PayableResponseSchema'];
}

const DetailsWrapper = styled(Box)(() => ({
  pb: 6,
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'auto',
  width: '100%',
  height: 0,
}));

interface StyledLabelTableCellProps extends TableCellProps {
  isRequired: boolean;
}

const StyledLabelTableCell = styled(TableCell)<StyledLabelTableCellProps>(
  ({ theme, isRequired }) => ({
    color: isRequired ? theme.palette.error.main : theme.palette.text.secondary,
    minWidth: 120,
    width: '35%',
  })
);

export const PayableDetailsInfo = (props: PayablesDetailsInfoProps) => (
  <MoniteScopedProviders>
    <PayableDetailsInfoBase {...props} />
  </MoniteScopedProviders>
);

const PayableDetailsInfoBase = ({
  payable,
  ...inProps
}: PayablesDetailsInfoProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay, formatFromMinorUnits } = useCurrencies();
  const { ocrRequiredFields, optionalFields } =
    usePayableDetailsThemeProps(inProps);
  const { showInvoiceDate, showTags } = useOptionalFields<OptionalFields>(
    optionalFields,
    {
      showInvoiceDate: true,
      showTags: true,
    }
  );
  const { counterpartBankAccountQuery, lineItemsQuery } = usePayableDetailsInfo(
    {
      currentCounterpartId: payable.counterpart_id,
      payableId: payable.id,
    }
  );

  const { data: lineItemsData } = lineItemsQuery;

  const lineItems = lineItemsData?.data;

  const { data: contacts } = useCounterpartContactList(payable.counterpart_id);
  const { data: addedByUser } = useEntityUserById(
    payable.was_created_by_user_id
  );
  const { data: approvalPolicy, isLoading: isApprovalPolicyLoading } =
    useApprovalPolicyById(payable.approval_policy_id);

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
            <CachedOutlined color="primary" fontSize="large" />
            <Typography variant="h3" mb={2}>
              {t(i18n)`File is being processed...`}
            </Typography>
            <Typography variant="body1">
              {t(i18n)`Hold on, we’re processing the file you’ve uploaded.`}
            </Typography>
            <Typography variant="body1">
              {t(i18n)`Usually it takes no more than 1–2 minutes.`}
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
                <TableRow>
                  <StyledLabelTableCell
                    isRequired={
                      isFieldRequired(
                        'invoiceNumber',
                        ocrRequiredFields,
                        payable?.document_id
                      ) && payable?.ocr_status === null
                    }
                  >
                    {t(i18n)`Invoice number`}:
                  </StyledLabelTableCell>
                  <TableCell>{payable.document_id ?? '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <StyledLabelTableCell
                    isRequired={
                      isFieldRequired('counterpartName', ocrRequiredFields) &&
                      payable?.ocr_status === null
                    }
                  >
                    {t(i18n)`Supplier`}:
                  </StyledLabelTableCell>
                  <TableCell>
                    <PayableCounterpartName payable={payable} />
                  </TableCell>
                </TableRow>
                {defaultContact && (
                  <TableRow>
                    <StyledLabelTableCell
                      isRequired={
                        isFieldRequired('contactPerson', ocrRequiredFields) &&
                        payable?.ocr_status === null
                      }
                    >
                      {t(i18n)`Contact person`}:
                    </StyledLabelTableCell>
                    <TableCell>
                      {`${defaultContact.first_name} ${defaultContact.last_name}`}
                    </TableCell>
                  </TableRow>
                )}
                {counterpartBankAccount && (
                  <TableRow>
                    <StyledLabelTableCell
                      isRequired={
                        isFieldRequired(
                          'counterpartBankAccount',
                          ocrRequiredFields,
                          counterpartBankAccount?.name
                        ) && payable?.ocr_status === null
                      }
                    />
                    <TableCell>{counterpartBankAccount.name}</TableCell>
                  </TableRow>
                )}
                {showInvoiceDate && (
                  <TableRow>
                    <StyledLabelTableCell
                      isRequired={
                        isFieldRequired('issueDate', ocrRequiredFields) &&
                        payable?.ocr_status === null
                      }
                    >
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
                <TableRow>
                  <StyledLabelTableCell
                    isRequired={
                      isFieldRequired(
                        'dueDate',
                        ocrRequiredFields,
                        payable.due_date
                      ) && payable?.ocr_status === null
                    }
                  >
                    {t(i18n)`Due date`}
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
                <TableRow>
                  <StyledLabelTableCell
                    isRequired={
                      isFieldRequired('amount', ocrRequiredFields) &&
                      payable?.ocr_status === null
                    }
                  >
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
                        {payable.total_amount && payable.currency
                          ? formatCurrencyToDisplay(
                              payable.total_amount,
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
                  <TableRow>
                    <StyledLabelTableCell
                      isRequired={
                        isFieldRequired(
                          'tags',
                          ocrRequiredFields,
                          payable.tags?.[0].id
                        ) && payable?.ocr_status === null
                      }
                    />
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
                <TableRow>
                  <StyledLabelTableCell
                    isRequired={
                      isFieldRequired('appliedPolicy', ocrRequiredFields) &&
                      payable?.ocr_status === null
                    }
                  >
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
              <TableHead>
                <TableRow>
                  <TableCell>{t(i18n)`Name`}</TableCell>
                  <TableCell>{t(i18n)`Quantity`}</TableCell>
                  <TableCell>{t(i18n)`Price`}</TableCell>
                  <TableCell align="right">{t(i18n)`Total, tax`}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lineItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.subtotal &&
                        item.quantity &&
                        formatFromMinorUnits(
                          item.subtotal / item.quantity ?? 0,
                          payable.currency ?? 'EUR'
                        )?.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {item.subtotal && payable.currency ? (
                        <>
                          <Box>
                            {formatCurrencyToDisplay(
                              item.subtotal ?? 0,
                              payable.currency
                            )}
                          </Box>
                          <Box sx={{ color: 'secondary.main' }}>
                            {t(i18n)`excl. VAT`}{' '}
                            {`${item.tax ? (item.tax / 100).toFixed(0) : 0}%`}
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
                <TableRow>
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
                <TableRow>
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
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1">{t(
                      i18n
                    )`Total`}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1">
                      {payable.total_amount && payable.currency
                        ? formatCurrencyToDisplay(
                            payable.total_amount,
                            payable.currency
                          )
                        : '—'}
                    </Typography>
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
                  <TableRow>
                    <StyledLabelTableCell
                      isRequired={
                        isFieldRequired('addedByUser', ocrRequiredFields) &&
                        payable?.ocr_status === null
                      }
                    >
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
                <TableRow>
                  <StyledLabelTableCell
                    isRequired={
                      isFieldRequired('addedOn', ocrRequiredFields) &&
                      payable?.ocr_status === null
                    }
                  >
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
                <TableRow>
                  <StyledLabelTableCell
                    isRequired={
                      isFieldRequired('updatedOn', ocrRequiredFields) &&
                      payable?.ocr_status === null
                    }
                  >
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

const PayableCounterpartName = ({
  payable,
}: {
  payable: components['schemas']['PayableResponseSchema'];
}) => {
  const { i18n } = useLingui();
  const { data: counterpart } = useCounterpartById(payable.counterpart_id);

  const { api } = useMoniteContext();
  const {
    data: isCounterpartMatchingToOCRFound,
    isLoading: isCounterpartMatchingToOCRLoading,
  } = api.counterparts.getCounterparts.useQuery(
    {
      query: {
        counterpart_name__icontains: payable.counterpart_raw_data?.name,
        limit: 1,
      },
    },
    {
      enabled: Boolean(
        !payable.counterpart_id && payable.counterpart_raw_data?.name
      ),
      select: (data) => Boolean(data.data.at(0)),
    }
  );

  const counterpartName = getCounterpartName(counterpart);

  if (counterpartName) {
    return <>{counterpartName}</>;
  }

  if (!payable.counterpart_raw_data?.name) {
    return <>—</>;
  }

  return (
    <Stack component="span" gap={2} direction="row">
      {payable.counterpart_raw_data.name}
      {isCounterpartMatchingToOCRLoading && (
        <CircularProgress
          size={14}
          color="secondary"
          sx={{ alignSelf: 'center' }}
        />
      )}
      {!isCounterpartMatchingToOCRLoading && (
        <Tooltip
          title={
            isCounterpartMatchingToOCRFound
              ? t(
                  i18n
                )`A counterpart with this name exists but has not been specified in the document.`
              : t(
                  i18n
                )`There is no such counterpart yet, you can create it in respective section.`
          }
        >
          <InfoOutlined
            color={isCounterpartMatchingToOCRFound ? 'disabled' : 'info'}
            fontSize="small"
            sx={{ alignSelf: 'center' }}
          />
        </Tooltip>
      )}
    </Stack>
  );
};
