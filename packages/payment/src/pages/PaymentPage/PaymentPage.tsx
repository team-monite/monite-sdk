import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box, Loading } from '@team-monite/ui-kit-react';
import {
  useComponentsContext,
  PaymentDetails,
  EmptyScreen,
} from '@team-monite/ui-widgets-react';

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

  const [paymentData, setPaymentData] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      if (linkData?.id) {
        const data = await monite.api.payment.getPaymentLinkById(linkData.id);
        setPaymentData(data);

        // TODO: backend will add enum for statuses
        if (data?.status === 'succeeded') {
          navigate(ROUTES.payResult);
        }
        // if (data?.status === 'expired') {
        //   navigate(ROUTES.expired);
        // }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    })();
  }, [linkData, navigate, monite.api.payment]);

  return (
    <Layout>
      <Helmet title={`Pay invoice ${linkData?.id || ''}`} />

      {isLoading && <Loading />}

      {!paymentData && !isLoading && (
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
