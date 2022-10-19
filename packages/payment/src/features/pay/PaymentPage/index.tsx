import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box } from '@team-monite/ui-kit-react';
import {
  useComponentsContext,
  PaymentDetails,
} from '@team-monite/ui-widgets-react';
import { PaymentMethodsEnum } from '@team-monite/sdk-api';

import { ROUTES, fromBase64 } from 'features/app/consts';

import Layout from 'features/pay/Layout';
import PaymentWidget from 'features/pay/PaymentWidget';
import EmptyScreen from 'features/pay/EmptyScreen';

import { URLData } from '../types';

const PaymentPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const rawPaymentData = new URLSearchParams(search).get('data');

  const linkData = useMemo(() => {
    if (rawPaymentData) {
      return fromBase64(rawPaymentData) as URLData;
    }
  }, [rawPaymentData]);

  const [paymentData, setPaymentData] = useState<any>();

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      if (linkData?.id) {
        const data = await monite.api.payment.getPaymentLinkById(linkData.id);
        setPaymentData(data);
      }
    })();

    if (
      paymentData?.payment_methods?.length === 1 &&
      paymentData?.payment_methods?.[0] === PaymentMethodsEnum.CARD
    ) {
      navigate(`card${search}`, { replace: true });
    }
    //  else if (
    //   paymentData?.payment_methods?.length === 1 &&
    //   paymentData?.payment_methods?.[0] === 'bank'
    // ) {
    //   navigate(`bank${search}`, { replace: true });
    // }
    // eslint-disable-next-line
  }, [linkData]);

  useEffect(() => {
    if (
      paymentData?.status === 'succeeded' ||
      paymentData?.status === 'canceled'
    ) {
      navigate(
        `${ROUTES.payResult}?data=${rawPaymentData}&payment_reference=${paymentData.payment_reference}&amount=${paymentData.amount}&currency=${paymentData.currency}&recipient_type=${paymentData.recipient.type}&redirect_status=${paymentData.status}&return_url=${paymentData.return_url}`,
        {
          replace: true,
        }
      );
    }
  }, [paymentData, navigate, rawPaymentData]);

  return (
    <Layout>
      <Helmet title={`Pay invoice ${linkData?.id || ''}`} />

      {!paymentData && (
        <Box width={'100%'} padding={'80px'}>
          <EmptyScreen />
        </Box>
      )}

      <Flex p={32} sx={{ gap: 32 }} justifyContent="space-between">
        <Box width={'50%'}>
          {paymentData && <PaymentDetails payment={paymentData} />}
        </Box>
        <Box width={'50%'}>
          {paymentData && <PaymentWidget paymentData={paymentData} />}
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentPage;
