'use client';

import React, { ReactNode, useCallback, useMemo, useState } from 'react';

import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import {
  ApprovalPolicies as ApprovalPoliciesBase,
  Counterparts as CounterpartsBase,
  MoniteProvider as MoniteProviderBase,
  Payables as PayablesBase,
  Products as ProductsBase,
  Receivables as ReceivablesBase,
  Tags as TagsBase,
  UserRoles as UserRolesBase,
  RolesAndApprovalPolicies as RolesAndApprovalPoliciesBase,
  useMoniteContext,
  toast,
  useRootElements,
  Dialog,
} from '@monite/sdk-react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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

export const Payables = () => {
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
  const { root } = useRootElements();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentPayableId, setCurrentPayableId] = useState<string | null>(null);

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

  const onCloseDialogClick = () => {
    setModalOpen(false);
  };
  const onPayInvoiceClick = () => {
    // noinspection JSIgnoredPromiseFromCall
    if (currentPayableId) markInvoiceAsPaid(currentPayableId);
    setModalOpen(false);
  };

  return (
    <>
      <PayablesBase
        onPay={(payableId: string) => {
          setCurrentPayableId(payableId);
          setModalOpen(true);
          // debugger;
          // noinspection JSIgnoredPromiseFromCall
          // markInvoiceAsPaid(payableId);
        }}
      />
      <Dialog
        open={modalOpen}
        container={root}
        aria-label={t(i18n)`Pay invoice`}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle variant="h3">{t(i18n)`Pay Invoice`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(i18n)`This action can't be undone.`}
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="outlined" onClick={onCloseDialogClick}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onPayInvoiceClick}
          >
            {t(i18n)`Pay`}
          </Button>
        </DialogActions>
      </Dialog>
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
