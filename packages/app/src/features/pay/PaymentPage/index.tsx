import React, { useMemo } from 'react';
import { Buffer } from 'buffer';

import styled from '@emotion/styled';
import { Flex, Box, Text, PdfViewerWithAPI } from '@monite/react-kit';
import { PaymentWidget } from '../PaymentWidget';
import { Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Layout from 'features/pay/Layout';
import { URLData } from '../types';

const PaymentPDFViewerWrapper = styled.div`
  padding: 32px 72px;
`;
const PaymentWidgetWrapper = styled.div`
  padding: 32px;

  > * + * {
    margin-top: 32px;
  }
`;

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
      <Flex>
        <Box width={[1 / 2]}>
          <PaymentPDFViewerWrapper>
            <PdfViewerWithAPI id={id || ''} />
          </PaymentPDFViewerWrapper>
        </Box>
        <Box width={[1 / 2]}>
          <PaymentWidgetWrapper>
            <Text as="h2" textSize="h3">
              Pay invoice #FA-{id}
            </Text>
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
          </PaymentWidgetWrapper>
        </Box>
      </Flex>
    </Layout>
  );
};

export default PaymentPage;
