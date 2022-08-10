import React, { useMemo } from 'react';
import { Buffer } from 'buffer';
import { Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box } from '@monite/ui';

import Layout from 'features/pay/Layout';
import PaymentWidget from 'features/pay/PaymentWidget';

import { URLData } from '../types';

const PaymentPage = () => {
  const { search } = useLocation();

  const paymentData = useMemo(() => {
    const rawPaymentData = new URLSearchParams(search).get('data');
    return (
      rawPaymentData &&
      (JSON.parse(
        Buffer.from(rawPaymentData, 'base64').toString('utf8')
      ) as URLData)
    );
  }, [search]);

  if (!paymentData) {
    return <Navigate to="/" replace />;
  }

  const {
    object: { id },
  } = paymentData;

  return (
    <Layout>
      <Helmet title={`Pay invoice ${id}`} />
      <Flex justifyContent="center">
        <Box width={600} p={4} pt={80}>
          <PaymentWidget
            paymentData={paymentData}
            onFinish={(res) => {
              if (res.status === 'succeeded' || res.status === 'processing') {
                // navigate(
                //   `${ROUTES.payResult.replace(':id', id)}?status=${
                //     res.status
                //   }`
                // );
              }
            }}
          />
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentPage;
