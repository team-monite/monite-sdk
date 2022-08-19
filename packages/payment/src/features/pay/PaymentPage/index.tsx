// import React, { useMemo } from 'react';
// import { Buffer } from 'buffer';
// import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Flex, Box } from '@monite/ui';

import Layout from 'features/pay/Layout';
import PaymentWidget from 'features/pay/PaymentWidget';

// import { URLData } from '../types';

const PaymentPage = () => {
  // const { search } = useLocation();

  // const paymentData = useMemo(() => {
  //   const rawPaymentData = new URLSearchParams(search).get('data');
  //   if (rawPaymentData) {
  //     return JSON.parse(
  //       Buffer.from(rawPaymentData, 'base64').toString('utf8')
  //     ) as URLData;
  //   }
  // }, [search]);

  const paymentData = {
    amount: 510000,
    payment_reference: 'string',
    currency: 'EUR',
    payment_methods: ['card', 'eps'] as any,
    stripe: {
      publishable:
        'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE',
      //secret: 'pi_3LKHgzCq0HpJYRYN0EOoxirg_secret_weXEYslETkqL1D8sQsJqUKHnS',
      secret: 'pi_3LY8gZCq0HpJYRYN0zJOqxLt_secret_hspZqT5mICLsrAkyzQ2l9wCNO',
      //secret: 'pi_3LYBR6Cq0HpJYRYN1D0HR79h_secret_EbxZJWAflew56HDe6UiGe4nH4',
    },
    success_url: 'http://google.com/good',
    cancel_url: 'http://google.com',
    payee: {
      name: 'string',
      account_identification: {
        type: 'iban',
        value: 'AD1400080001001234567890',
      },
    },
    object: {
      id: 'cc2fa0aa-2199-4f96-a0cd-9edb78ad74d1',
      type: 'receivable',
    },
    account_id: 'string',
    id: 'ba3ea1da-a130-48a5-be91-7e4bd4c09ff9',
  };

  return (
    <Layout>
      <Helmet title={`Pay invoice ${paymentData?.object?.id || ''}`} />
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
