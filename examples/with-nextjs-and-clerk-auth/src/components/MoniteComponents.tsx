'use client';

import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import {
  ApprovalPolicies as ApprovalPoliciesBase,
  Counterparts as CounterpartsBase,
  Dialog,
  getCounterpartName,
  MoniteProvider as MoniteProviderBase,
  Payables as PayablesBase,
  Products as ProductsBase,
  Receivables as ReceivablesBase,
  RolesAndApprovalPolicies as RolesAndApprovalPoliciesBase,
  Tags as TagsBase,
  toast,
  useCounterpartById,
  useCurrencies,
  useDateFormat,
  useMoniteContext,
  useRootElements,
  UserRoles as UserRolesBase,
} from '@monite/sdk-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import { useAppTheme } from '@/components/ThemeRegistry/AppThemeProvider';

export const MoniteProvider = ({
  apiUrl,
  entityId,
  entityUserId,
  children,
}: {
  apiUrl: string;
  entityId: string;
  entityUserId: string;
  children: ReactNode;
}) => {
  const { theme } = useAppTheme();
  const { i18n } = useLingui();

  const fetchToken = useCallback(async () => {
    /**
     * We must add `entityUserId` as a dependency to create a new `fetchToken`
     * function and call create a new `MoniteSDK` instance.
     * Whenever `monite` is updated, all the components that depend on it will
     * be re-rendered, and data will be fetched again.
     */
    if (!entityUserId) throw new Error('entityUserId is not defined');

    return (
      await fetch('/api/auth/token', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
      })
    ).json();
  }, [entityUserId]);

  const monite = useMemo(
    () =>
      new MoniteSDK({
        apiUrl,
        entityId,
        fetchToken,
      }),
    [apiUrl, entityId, fetchToken]
  );

  return (
    <MoniteProviderBase
      monite={monite}
      theme={theme}
      locale={{
        code: i18n.locale,
        messages: {
          Payables: 'Purchases',
          Counterpart: 'Customer',
        },
      }}
    >
      {children}
    </MoniteProviderBase>
  );
};

enum USPayDialogPage {
  ChooseBankAccount,
  TransferType,
  Review,
}

const ChooseBankAccountPage = () => {
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <DialogTitle variant="h3">Choose bank account</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="options"
            name="options"
            value={selectedValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value="option1"
              control={<Radio />}
              label="JPMorgan Chase 00000178992"
            />
            <FormControlLabel
              value="option2"
              control={<Radio />}
              label="JPMorgan Chase 101900777456"
            />
            <FormControlLabel
              value="option3"
              control={<Radio />}
              label="JPMorgan Chase 222113080321"
            />
            <FormControlLabel
              value="option3"
              control={<Radio />}
              label="JPMorgan Chase 678000999333"
            />
            <FormControlLabel
              value="option3"
              control={<Radio />}
              label="JPMorgan Chase 000789000221"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </>
  );
};

const TransferTypePage = () => {
  const dateTimeFormat = useDateFormat();
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <DialogTitle variant="h3">
        How would your vendors prefer to receive the funds?
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="options"
            name="options"
            value={selectedValue}
            onChange={handleChange}
          >
            <Stack direction="row">
              <FormControlLabel
                value="option1"
                control={<Radio />}
                label={
                  <Box sx={{ p: 0 }}>
                    <Typography variant="body1">Via bank transfer</Typography>
                    <Typography variant="body2">
                      $1 fee, take 2-3 business days, estimated arrival{' '}
                      {i18n.date(
                        new Date(Date.now() + 86400000 * 3),
                        dateTimeFormat
                      )}
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="option2"
                control={<Radio />}
                label={
                  <Box sx={{ p: 0 }}>
                    <Typography variant="body1">Via paper check</Typography>
                    <Typography variant="body2">
                      $5 fee, take 5-7 business days, estimated arrival{' '}
                      {i18n.date(
                        new Date(Date.now() + 86400000 * 7),
                        dateTimeFormat
                      )}
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </>
  );
};

const ReviewPage = ({ payableId }: { payableId: string }) => {
  const className = 'USPayment-ReviewPage';

  const { api } = useMoniteContext();
  const { data: payable } = api.payables.getPayablesId.useQuery(
    { path: { payable_id: payableId ?? '' } },
    {
      enabled: !!payableId,
      refetchInterval: 15_000,
    }
  );

  const { formatCurrencyToDisplay } = useCurrencies();
  const { data: counterpart } = useCounterpartById(payable?.counterpart_id);
  const subtotal = payable
    ? formatCurrencyToDisplay(
        payable?.amount_to_pay ?? 0,
        payable.currency ?? 'USD'
      )
    : '—';
  const documentId = payable?.document_id ?? 'INV-auto';

  const counterpartName = counterpart
    ? getCounterpartName(counterpart)
    : payable?.counterpart_raw_data?.name ?? '';

  return (
    <>
      <DialogTitle variant="h3">Review and pay</DialogTitle>
      <DialogContent>
        <Card sx={{ p: 0, mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="body1">
              {counterpartName} &bull; {subtotal}
            </Typography>
            <Typography variant="body2">{t(
              i18n
            )`Invoice ${documentId}`}</Typography>
          </CardContent>
        </Card>

        <Table>
          <TableBody>
            <TableRow className={className + '-Subtotal'}>
              <TableCell sx={{ p: 1 }}>
                <Typography variant="body1">{t(i18n)`Subtotal`}</Typography>
              </TableCell>
              <TableCell sx={{ p: 1 }} align="right">
                <Typography variant="body1">{subtotal}</Typography>
              </TableCell>
            </TableRow>
            <TableRow className={className + '-Fee'}>
              <TableCell sx={{ p: 1 }}>
                <Typography variant="body1">{t(i18n)`Total fee`}</Typography>
              </TableCell>
              <TableCell sx={{ p: 1 }} align="right">
                <Typography variant="body1">$1</Typography>
              </TableCell>
            </TableRow>
            <TableRow className={className + '-Totals-Total'}>
              <TableCell sx={{ p: 1 }}>
                <Typography variant="subtitle2">{t(i18n)`Total`}</Typography>
              </TableCell>
              <TableCell sx={{ p: 1 }} align="right">
                <Typography variant="subtitle2">
                  {payable
                    ? formatCurrencyToDisplay(
                        (payable?.amount_to_pay ?? 0) + 100,
                        payable.currency ?? 'USD'
                      )
                    : '—'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </>
  );
};

const USPayDialog = ({
  payableId,
  onCloseDialogClick,
}: {
  payableId: string;
  onCloseDialogClick: () => void;
}) => {
  const { api, queryClient } = useMoniteContext();
  const payMutation = api.payables.postPayablesIdMarkAsPaid.useMutation(
    undefined,
    {
      onSuccess: (payable) =>
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
        ]),
      onError: (error) => {
        toast.error(error.toString());
      },
    }
  );

  const markInvoiceAsPaid = async (payableId: string) => {
    if (payableId) {
      await payMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable "${payable.document_id}" has been paid`
            );
          },
        }
      );
    }
  };

  const { data: payable } = api.payables.getPayablesId.useQuery(
    { path: { payable_id: payableId ?? '' } },
    {
      enabled: !!payableId,
      refetchInterval: 15_000,
    }
  );

  const [page, setPage] = useState<USPayDialogPage>(
    USPayDialogPage.ChooseBankAccount
  );

  const { formatCurrencyToDisplay } = useCurrencies();

  const payableTotal = payable
    ? formatCurrencyToDisplay(
        (payable.amount_to_pay ?? 0) + 100,
        payable.currency ?? 'USD'
      )
    : '';

  const nextButtonText = useMemo(() => {
    switch (page) {
      case USPayDialogPage.ChooseBankAccount:
      case USPayDialogPage.TransferType:
        return t(i18n)`Continue`;
      case USPayDialogPage.Review:
        return t(i18n)`Pay` + ' ' + payableTotal;
    }
  }, [page, payableTotal]);

  const onNextButtonClicked = async () => {
    switch (page) {
      case USPayDialogPage.ChooseBankAccount:
        setPage(USPayDialogPage.TransferType);
        break;
      case USPayDialogPage.TransferType:
        setPage(USPayDialogPage.Review);
        break;
      case USPayDialogPage.Review:
        await markInvoiceAsPaid(payableId);
        onCloseDialogClick();
        break;
    }
  };

  return (
    <>
      {page == USPayDialogPage.ChooseBankAccount && <ChooseBankAccountPage />}
      {page == USPayDialogPage.TransferType && <TransferTypePage />}
      {page == USPayDialogPage.Review && <ReviewPage payableId={payableId} />}
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={onCloseDialogClick}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onNextButtonClicked}
        >
          {nextButtonText}
        </Button>
      </DialogActions>
    </>
  );
};

export const Payables = () => {
  const { root } = useRootElements();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentPayableId, setCurrentPayableId] = useState<string | null>(null);

  const onCloseDialogClick = () => {
    setModalOpen(false);
  };

  return (
    <>
      <PayablesBase
        onPay={(payableId: string) => {
          setCurrentPayableId(payableId);
          setModalOpen(true);
        }}
      />
      {currentPayableId && (
        <Dialog
          open={modalOpen}
          container={root}
          aria-label={t(i18n)`Pay invoice`}
          fullWidth={true}
          maxWidth="sm"
        >
          <USPayDialog
            payableId={currentPayableId}
            onCloseDialogClick={onCloseDialogClick}
          />
        </Dialog>
      )}
    </>
  );
};

export const Receivables = () => {
  return <ReceivablesBase />;
};

export const Counterparts = () => {
  return <CounterpartsBase />;
};

export const Products = () => {
  return <ProductsBase />;
};

export const ApprovalPolicies = () => {
  return <ApprovalPoliciesBase />;
};

export const Tags = () => {
  return <TagsBase />;
};

export const UserRoles = () => {
  return <UserRolesBase />;
};

export const RolesAndPolicies = () => {
  return <RolesAndApprovalPoliciesBase />;
};
