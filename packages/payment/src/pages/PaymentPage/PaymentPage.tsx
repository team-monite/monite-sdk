import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box } from '@team-monite/ui-kit-react';
import {
  useComponentsContext,
  PaymentDetails,
  EmptyScreen,
} from '@team-monite/ui-widgets-react';
import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';

import { ROUTES } from 'consts';
import { fromBase64 } from 'helpers';

import Layout from 'pages/Layout';
import PaymentWidget from 'pages/PaymentWidget';

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

  const [paymentData, setPaymentData] = useState<PaymentsPaymentLinkResponse>();

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    //TODO add loader
    (async () => {
      if (linkData?.id) {
        const data = await monite.api.payment.getPaymentLinkById(linkData.id);
        setPaymentData(data);
      }
    })();
    // eslint-disable-next-line
  }, [linkData]);

  useEffect(() => {
    // TODO: backend will add enum for statuses
    if (paymentData?.status === 'succeeded') {
      navigate(
        `${ROUTES.payResult}?data=${rawPaymentData}&payment_reference=${paymentData.payment_reference}&amount=${paymentData.amount}&currency=${paymentData.currency}&recipient_type=${paymentData.recipient.type}&redirect_status=${paymentData.status}&return_url=${paymentData.return_url}`,
        {
          replace: true,
        }
      );
    }
    if (paymentData?.status === 'expired') {
      // navigate(ROUTES.expired);
    }
  }, [paymentData, navigate, rawPaymentData]);

  return (
    <Layout>
      <Helmet title={`Pay invoice ${paymentData?.payment_reference || ''}`} />

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
