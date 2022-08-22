import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box } from '@monite/ui';

import { ROUTES, fromBase64 } from 'features/app/consts';

import Layout from 'features/pay/Layout';
import PaymentWidget from 'features/pay/PaymentWidget';

import { URLData } from '../types';

const PaymentPage = () => {
  const { search } = useLocation();

  const rawPaymentData = new URLSearchParams(search).get('data');

  const paymentData = useMemo(() => {
    if (rawPaymentData) {
      return fromBase64(rawPaymentData) as URLData;
    }
  }, [rawPaymentData]);

  const navigate = useNavigate();
  return (
    <Layout>
      <Helmet title={`Pay invoice ${paymentData?.object?.id || ''}`} />
      <Flex justifyContent="center">
        <Box width={600} p={4} pt={80}>
          <PaymentWidget
            paymentData={paymentData}
            onFinish={(res) => {
              if (
                res.status !== 'requires_payment_method' &&
                res.status !== 'requires_action' &&
                res.status !== 'requires_confirmation'
              ) {
                navigate(
                  `${ROUTES.payResult}?data=${rawPaymentData}&status=${res.status}`,
                  {
                    replace: true,
                  }
                );
              }
            }}
          />
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentPage;
