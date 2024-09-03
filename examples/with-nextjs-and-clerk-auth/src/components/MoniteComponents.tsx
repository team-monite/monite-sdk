'use client';

import React, { ReactNode, useCallback, useMemo } from 'react';

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
} from '@monite/sdk-react';

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
  const submitMutation = api.payables.postPayablesIdMarkAsPaid.useMutation(
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
      await submitMutation.mutateAsync(
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

  return (
    <PayablesBase
      onPay={(payableId: string) => {
        debugger;
        // noinspection JSIgnoredPromiseFromCall
        markInvoiceAsPaid(payableId);
      }}
    />
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
