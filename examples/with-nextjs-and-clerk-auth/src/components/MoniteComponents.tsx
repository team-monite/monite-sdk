'use client';

import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

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
import { Theme } from '@monite/sdk-react/mui-styles';
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
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import { useAppTheme } from '@/components/ThemeRegistry/AppThemeProvider';

/* eslint-disable */

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
          Payables: 'Bill Pay',
          Counterpart: 'Customer',
          Sales: 'Invoicing',
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

  const itemProps: SxProps<Theme> = {
    borderRadius: '3px',
    borderWidth: '1px',
    m: '1px',
    borderStyle: 'solid',
    borderColor: 'divider',
    p: 2,
  };
  const selectedProps: SxProps<Theme> = {
    borderRadius: '3px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'primary.main',
    p: 2,
  };

  return (
    <>
      <DialogTitle variant="h3">Choose bank account</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack direction="column" alignItems="stretch" gap={2}>
          <Stack
            direction="row"
            alignItems="center"
            sx={selectedValue == 'option1' ? selectedProps : itemProps}
            onClick={() => setSelectedValue('option1')}
          >
            <img
              style={{
                width: '40px',
                height: 'auto',
                marginRight: '16px',
              }}
              src={jpmIcon}
              alt="JPMorgan"
            />
            <Stack direction="column" sx={{ flexGrow: 2 }}>
              <Typography variant="body1">JPMorgan Chase</Typography>
              <Typography variant="body2">
                Checking account • 7004 8841 7002 1630 0
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            sx={selectedValue == 'option2' ? selectedProps : itemProps}
            onClick={() => setSelectedValue('option2')}
          >
            <img
              style={{
                width: '40px',
                height: 'auto',
                marginRight: '16px',
              }}
              src={amexIcon}
              alt="Amex"
            />
            <Stack direction="column" sx={{ flexGrow: 2 }}>
              <Typography variant="body1">American Express</Typography>
              <Typography variant="body2">
                Checking account • 8744 3360 8539 9580
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            sx={selectedValue == 'option3' ? selectedProps : itemProps}
            onClick={() => setSelectedValue('option3')}
          >
            <img
              style={{
                width: '40px',
                height: 'auto',
                marginRight: '16px',
              }}
              src={mercuryIcon}
              alt="Mercury"
            />
            <Stack direction="column" sx={{ flexGrow: 2 }}>
              <Typography variant="body1">Mercury</Typography>
              <Typography variant="body2">
                Checking account • 3690 8597 4129 4280
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </>
  );
};

const TransferTypePage = () => {
  const { i18n } = useLingui();
  const dateTimeFormat = useDateFormat();
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const itemProps: SxProps<Theme> = {
    borderRadius: '6px',
    borderWidth: '1px',
    ml: '1px',
    mr: '1px',
    mt: '1px',
    mb: '1px',
    borderStyle: 'solid',
    borderColor: 'divider',
    p: '2px 12px 6px 2px',
  };
  const selectedProps: SxProps<Theme> = {
    borderRadius: '6px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'primary.main',
    ml: '0',
    mr: '0',
    mt: '0',
    mb: '0',
    p: '2px 12px 6px 2px',
  };

  return (
    <>
      <DialogTitle variant="h3">
        How would your vendors prefer to receive the funds?
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="options"
            name="options"
            value={selectedValue}
            onChange={handleChange}
          >
            <Stack direction="row" gap={2}>
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
                sx={selectedValue == 'option1' ? selectedProps : itemProps}
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
                sx={selectedValue == 'option2' ? selectedProps : itemProps}
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
      <DialogContent sx={{ p: 3 }}>
        <Card sx={{ p: 0, mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="body1">
              {counterpartName} &bull; {subtotal}
            </Typography>
            <Typography variant="body2">{`Invoice ${documentId}`}</Typography>
          </CardContent>
        </Card>

        <Table>
          <TableBody>
            <TableRow className={className + '-Subtotal'}>
              <TableCell sx={{ p: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
              </TableCell>
              <TableCell sx={{ p: 1 }} align="right">
                <Typography variant="body1">{subtotal}</Typography>
              </TableCell>
            </TableRow>
            <TableRow className={className + '-Fee'}>
              <TableCell sx={{ p: 1 }}>
                <Typography variant="body1">Total fee</Typography>
              </TableCell>
              <TableCell sx={{ p: 1 }} align="right">
                <Typography variant="body1">$1</Typography>
              </TableCell>
            </TableRow>
            <TableRow className={className + '-Totals-Total'}>
              <TableCell sx={{ p: 1 }}>
                <Typography variant="subtitle2">Total</Typography>
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
            toast.success(`Payable "${payable.document_id}" has been paid`);
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
        return `Continue`;
      case USPayDialogPage.Review:
        return `Pay` + ' ' + payableTotal;
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
          Cancel
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
          aria-label={`Pay invoice`}
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

const amexIcon =
  'data:image/png;base64,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';
const jpmIcon =
  'data:image/png;base64,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';
const mercuryIcon =
  'data:image/png;base64,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';
